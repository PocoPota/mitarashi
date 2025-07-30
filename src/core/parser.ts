import type { Token } from "./modules/token";

const parser = (markdown: string) => {
  const ast: Array<Token> = [];

  const _parser = (node: string) => {
    // 空白が渡された場合
    if (!node) {
      return [];
    }

    let part_ast: Array<Token> = [
      {
        type: "text",
        value: node,
      },
    ];

    // 囲み文字の処理
    const regex = /(\*\*|\*|`)(.*?)\1/;
    const isEnclosed = node.match(regex);

    // 画像の処理
    const isImage = node.match(/!\[(.*?)\]\((.*?)\)/);

    // リンクの処理
    const isLink = node.match(/\[(.*?)\]\((.*?)\)/);

    if (isEnclosed) {
      let type = "";
      switch (isEnclosed[1]) {
        case "**":
          type = "strong";
          break;
        case "*":
          type = "italic";
          break;
        case "`":
          type = "code_inline";
          break;
      }
      part_ast = [
        ..._parser(node.slice(0, isEnclosed.index)),
        {
          type: type,
          children: _parser(isEnclosed[2]),
        },
        ..._parser(node.slice((isEnclosed.index || 0) + isEnclosed[0].length)),
      ];
    } else if (isImage) {
      part_ast = [
        {
          type: "image",
          url: isImage[2],
          alt: isImage[1],
        },
      ];
    } else if (isLink) {
      part_ast = [
        ..._parser(node.slice(0, isLink.index)),
        {
          type: "link",
          url: isLink[2],
          children: _parser(isLink[1]),
        },
        ..._parser(node.slice((isLink.index || 0) + isLink[0].length)),
      ];
    }
    return part_ast;
  };

  // １行ごとに処理
  const lines = markdown.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    let part_ast: Array<Token> = [];
    if (line.startsWith("#")) {
      // heading 処理
      const part_string = line.split(" ");
      for (let j = 0; j < part_string[0].length; j++) {
        if (part_string[0][j] != "#") return _parser(line);
      }
      part_ast = [
        {
          type: "heading",
          level: part_string[0].length,
          children: _parser(line.slice(part_string[0].length + 1)),
        },
      ];
    } else if (line.startsWith("- ")) {
      // list 処理
      // 以降のlineもチェック
      const list_items: string[] = [];
      const parsed_list_items: Array<Token> = [];
      let k = 0;
      for (k; i + k < lines.length; k++) {
        if (lines[i + k].startsWith("- ")) {
          list_items.push(lines[i + k]);
        } else {
          break;
        }
      }
      list_items.map((list_item) => {
        parsed_list_items.push({
          type: "list_item",
          children: _parser(list_item.slice(2)),
        });
      });
      part_ast = [
        {
          type: "list",
          children: parsed_list_items,
        },
      ];
      i += k;
    } else if (line.startsWith("> ")) {
      // quote 処理
      // 以降のlineもチェック
      const quote_items: string[] = [];
      let k = 0;
      for (k; i + k < lines.length; k++) {
        if (lines[i + k].startsWith("> ")) {
          quote_items.push(lines[i + k]);
        } else {
          break;
        }
      }
      if (quote_items.length === 1) {
        part_ast = [
          {
            type: "inlinequote",
            children: _parser(quote_items[0].slice(2)),
          },
        ];
      } else {
        let inner_markdown = "";
        quote_items.map((quote_items) => {
          inner_markdown += quote_items.slice(2) + "\n";
        });
        part_ast = [
          {
            type: "blockquote",
            children: parser(inner_markdown),
          },
        ];
      }
      i += k;
    } else if (line.match(/^\|([^|]*\|)+$/)) {
      // table処理
      // 以降のlineもチェック
      const table_lines: string[] = [];
      let separator_num = -1;
      let k = 0;
      for (k; i + k < lines.length; k++) {
        if (lines[i + k].match(/^\|([^|]*\|)+$/)) {
          table_lines.push(lines[i + k]);
          if (lines[i + k].match(/^\|(:?-+:?\|)+$/)) {
            separator_num = i + k;
          }
        } else {
          break;
        }
      }
      let table_rows: Token[] = [];
      for (let j = 0; j < table_lines.length; j++) {
        const cell_contents = table_lines[j].match(/\|([^|\n]+)/g);
        let table_cells: Array<Token> = [];
        const isHeader = j < separator_num ? true : false;
        cell_contents?.map((cell) => {
          table_cells.push({
            type: "table_cell",
            isHeader,
            children: _parser(cell.slice(1).trim()),
          });
        });
        if (j != separator_num) {
          table_rows.push({
            type: "table_row",
            isHeader,
            children: table_cells,
          });
        }
      }
      part_ast = [
        {
          type: "table",
          children: table_rows,
        },
      ];
      i += k;
    } else if (!line) {
      part_ast = [];
    } else {
      part_ast = [
        {
          type: "paragraph",
          children: _parser(line),
        },
      ];
    }

    ast.push(...part_ast);
    i++;
  }

  // return ast;
  return ast;
};

export default parser;