import type { Token } from "./modules/token";

const generator = (ast: Array<Token>) => {
  const _generator = (tokens: Array<Token>) => {
    const type_text = (token: Token) => {
      return token && token.value;
    };

    const type_heading = (token: Token) => {
      const children = token.children && _generator(token.children);

      const level = token.level ? token.level : 1;
      const html = `<h${level}>${children}</h${level}>`;
      return html;
    };

    const type_strong = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<strong>${children}</strong>`;
      return html;
    };

    const type_italic = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<i>${children}</i>`;
      return html;
    };

    const type_paragrah = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<p>${children}</p>`;
      return html;
    };

    const type_list = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<ul>${children}</ul>`;
      return html;
    };

    const type_list_item = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<li>${children}</li>`;
      return html;
    };

    const type_link = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<a href="${token.url}">${children}</a>`;
      return html;
    };

    const type_image = (token: Token) => {
      const html = `<img src="${token.url}" alt="${token.alt}">`;
      return html;
    };

    const type_code_inline = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<code>${children}</code>`;
      return html;
    };

    const type_inlinequote = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<q>${children}</q>`;
      return html;
    };

    const type_blockquote = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<blockquote>${children}</blockquote>`;
      return html;
    };

    const type_table = (token: Token) => {
      const children = token.children && _generator(token.children);

      const html = `<table>${children}</table>`;
      return html;
    };

    const type_table_row = (token: Token) => {
      const isHeader = token.isHeader ? token.isHeader : false;
      const children = token.children && _generator(token.children);
      let html = `<tbody><tr>${children}</tr></tbody>`;
      if (isHeader) {
        html = `<thead><tr>${children}</tr></thead>`;
      }
      return html;
    };

    const type_table_cell = (token: Token) => {
      const isHeader = token.isHeader ? token.isHeader : false;
      const children = token.children && _generator(token.children);
      let html = `<td>${children}</td>`;
      if (isHeader) {
        html = `<th>${children}</th>`;
      }
      return html;
    };

    let html = "";

    for (let i = 0; i < tokens.length; i++) {
      let partly_html = "";

      // 各関数を関数マップで管理
      const handlers: Record<string, (token: Token) => string | undefined> = {
        text: type_text,
        heading: type_heading,
        strong: type_strong,
        italic: type_italic,
        paragraph: type_paragrah,
        list: type_list,
        list_item: type_list_item,
        link: type_link,
        image: type_image,
        code_inline: type_code_inline,
        inlinequote: type_inlinequote,
        blockquote: type_blockquote,
        table: type_table,
        table_row: type_table_row,
        table_cell: type_table_cell,
      };

      const token_type = tokens[i].type;
      if (handlers[token_type]) {
        partly_html += handlers[token_type](tokens[i]);
      }
      html += partly_html;
    }
    return html;
  };

  return _generator(ast);
};

export default generator;