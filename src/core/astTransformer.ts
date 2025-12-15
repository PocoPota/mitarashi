import type { Token } from "./modules/token";

const inline_rules = [
  {
    rule_type: "inline",
    pattern: /::(.+?)::/,
    toNode: {
      type: "custom_inline",
    },
  },
];

const block_rules = [
  {
    rule_type: "block",
    start: ":::",
    end: ":::",
    toNode: {
      type: "custom_block",
    },
  },
  {
    rule_type: "block",
    start: "<<<",
    end: ">>>",
    toNode: {
      type: "custom_meta_block",
    },
  },
];

const transformer = (ast: Array<Token>) => {
  const transformInlineRules = (node: Token): Array<Token> => {
    if (node.type !== "text" || !node.value) return [node];

    for (const rule of inline_rules) {
      const isMatch = node.value.match(rule.pattern);
      if (isMatch) {
        const before = node.value.slice(0, isMatch.index);
        const content = isMatch[1];
        const after = node.value.slice(
          (isMatch.index || 0) + isMatch[0].length
        );

        const tokens: Array<Token> = [];
        if (before)
          tokens.push(...transformInlineRules({ type: "text", value: before }));
        tokens.push({
          type: rule.toNode.type,
          children: [{ type: "text", value: content }],
        });
        if (after) tokens.push(...transformInlineRules({ type: "text", value: after }));
        return tokens;
      }
    }
    return [node];
  };

  const transformBlockRules = (node: Token): { matched: boolean; nodes: Array<Token> } => {
    if (node.type !== "paragraph" || !node.children || node.children.length === 0) {
      return { matched: false, nodes: [] };
    }

    for (const rule of block_rules) {
      const children = node.children;
      let startIndex = -1;
      let endIndex = -1;
      let metaValue: string | undefined = undefined;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.type === "text" && child.value && startIndex === -1) {
          // メタ情報が含まれていない場合
          if (child.value === rule.start) {
            startIndex = i;
          }
          // メタ情報が含まれている場合
          else if (child.value.startsWith(rule.start + " ")) {
            startIndex = i;
            metaValue = child.value.slice(rule.start.length).trim();
          }
        }
        // それ以降でvalue=rule.endの要素を見つける
        else if (child.type === "text" && child.value === rule.end && startIndex !== -1) {
          endIndex = i;
          break;
        }
      }

      if (startIndex !== -1 && endIndex !== -1) {
        const result: Array<Token> = [];

        const contentStartIndex = startIndex + 1;

        let beforeBlock = children.slice(0, startIndex);
        let blockContent = children.slice(contentStartIndex, endIndex);
        let afterBlock = children.slice(endIndex + 1);

        // beforeBlockの末尾のsoftbreakを削除
        while (beforeBlock.length > 0 && beforeBlock[beforeBlock.length - 1].type === "softbreak") {
          beforeBlock = beforeBlock.slice(0, -1);
        }

        // blockContentの先頭と末尾のsoftbreakを削除
        while (blockContent.length > 0 && blockContent[0].type === "softbreak") {
          blockContent = blockContent.slice(1);
        }
        while (blockContent.length > 0 && blockContent[blockContent.length - 1].type === "softbreak") {
          blockContent = blockContent.slice(0, -1);
        }

        // afterBlockの先頭のsoftbreakを削除
        while (afterBlock.length > 0 && afterBlock[0].type === "softbreak") {
          afterBlock = afterBlock.slice(1);
        }

        // beforeBlock部分をparagraphとして追加
        if (beforeBlock.length > 0) {
          result.push({
            type: "paragraph",
            children: transformer(beforeBlock)
          });
        }

        const blockNode: Token = {
          type: rule.toNode.type,
          children: transformer(blockContent)
        };
        if (metaValue !== undefined) {
          blockNode.meta = metaValue;
        }
        result.push(blockNode);

        // afterBlock部分を再帰的に処理
        if (afterBlock.length > 0) {
          const remainingNode: Token = {
            type: "paragraph",
            children: afterBlock
          };
          result.push(...transformer([remainingNode]));
        }

        return { matched: true, nodes: result };
      }
    }

    return { matched: false, nodes: [] };
  };

  const transformedAst: Array<Token> = [];

  // ノードごとに処理
  for (const node of ast) {
    // block_rulesの処理
    const blockResult = transformBlockRules(node);
    if (blockResult.matched) {
      transformedAst.push(...blockResult.nodes);
      continue;
    }

    // block_rulesにマッチしなかった場合は通常の処理
    const children = node.children;
    if (children) {
      const transformedChildren = transformer(children);
      transformedAst.push({ ...node, children: transformedChildren });
    } else if (node.type === "text" && node.value) {
      const transformedNodes = transformInlineRules(node);
      if (transformedNodes.length > 0) {
        transformedAst.push(...transformedNodes);
      } else {
        // マッチしなかった時
        transformedAst.push(node);
      }
    } else {
      transformedAst.push(node);
    }
  }

  return transformedAst;
};

export default transformer;
