import parser from "../src/core/parser";
import astTransformer from "../src/core/astTransformer";

const markdown = `
:::
文章1
文章2
:::
別の段落

<<< info
これは情報ボックス
>>>
やっほー
`;

const ast = parser(markdown);
const transformedAst = astTransformer(ast);
console.log(JSON.stringify(transformedAst, null, 2));