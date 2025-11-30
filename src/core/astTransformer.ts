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

const transformer = (ast: Array<Token>) => {
  const _transformer = (node: Token): Array<Token> => {
    // Only transform text nodes with a value
    if (node.type !== "text" || !node.value) return [node];

    for (const rule of inline_rules) {
      const isMatch = node.value.match(rule.pattern);
      if (isMatch) {
        const before = node.value.slice(0, isMatch.index);
        const content = isMatch[1];
        const after = node.value.slice((isMatch.index || 0) + isMatch[0].length);

        const tokens: Array<Token> = [];
        if (before) tokens.push(..._transformer({ type: "text", value: before }));
        tokens.push({
          type: rule.toNode.type,
          children: [{ type: "text", value: content }],
        });
        if (after) tokens.push(..._transformer({ type: "text", value: after }));
        return tokens;
      }
    }
    return [node];
  };

  const transformedAst: Array<Token> = [];

  // ノードごとに処理
  ast.forEach((node: Token) => {
    if (node.children) {
      const transformedChildren = transformer(node.children);
      transformedAst.push({ ...node, children: transformedChildren });
    } else if (node.type === "text" && node.value) {
      const transformedNodes = _transformer(node);
      if (transformedNodes.length > 0) {
        transformedAst.push(...transformedNodes);
      } else {
        // マッチしなかった時
        transformedAst.push(node);
      }
    } else {
      transformedAst.push(node);
    }
  });

  return transformedAst;
};

export default transformer;
