const acorn = require('acorn');
const { log } = require('console');
const fs = require('fs');
const path = require('path');
const Generator = require('./generator');

const buffer = fs.readFileSync(path.resolve(process.cwd(), 'test.js')).toString();


// 得到ast
const Node = acorn.parse(buffer, {
    ecmaVersion: 'latest',
});

// 创建 Generator 实例
const gen = new Generator();

// 定义变量decls  存储所有的函数或变量类型节点 Map类型
const decls = new Map();
// 定义变量calledDecls 存储被用到过的函数或变量类型节点 数组类型
// const calledDecls = [];

// gen.run(Node.body)
Node.body.forEach(node => {
  if (node.type === 'VariableDeclaration') {
    for (const decl of node.declarations) {
        decls.set(gen.visitNode(decl.id), gen.visitVariableDeclarator(decl, node.kind));
        console.log(decls);
    }
    return;
  }
  if (node.type === 'FunctionDeclaration') {
    const code = gen.run([node]);
    decls.set(gen.visitNode(node.id), code);
    return;
  }
})
