import parser from "../src/core/parser";
import astTransformer from "../src/core/astTransformer";

const markdown = `
**This is bold.**わーい**Hello**

// ::inline custom syntax::あああ

:: warning
This is a warning box.
::
`;

const ast = parser(markdown);
const transformedAst = astTransformer(ast);
console.log(JSON.stringify(transformedAst, null, 2));