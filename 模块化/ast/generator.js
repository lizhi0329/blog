// generator.js
class Generator {
  constructor() {}
  run(body) {
    let str = "";
    str += this.visitNodes(body);
    return str;
  }
  visitNodes(nodes) {
    let str = "";
    for (const node of nodes) {
      // console.log(node, 'node');
      str += this.visitNode(node);
    }
    return str;
  }
  visitNode(node) {
    let str = "";
    switch (node.type) {
      case "VariableDeclaration":
        str += this.visitVariableDeclaration(node);
        // console.log(str, 'str');
        break;
      case "VariableDeclarator":
        str += this.visitVariableDeclarator(node);
        break;
      case "Literal":
        str += this.visitLiteral(node);
        break;
      case "Identifier":
        str += this.visitIdentifier(node);
        break;
      // case "BinaryExpression":
      //   str += this.visitBinaryExpression(node);
      //   break;
      // case "FunctionDeclaration":
      //   str += this.visitFunctionDeclaration(node);
      //   break;
      // case "BlockStatement":
      //   str += this.visitBlockStatement(node);
      //   break;
      // case "CallExpression":
      //   str += this.visitCallExpression(node);
      //   break;
      // case "ReturnStatement":
      //   str += this.visitReturnStatement(node);
      //   break;
      // case "ExpressionStatement":
      //   str += this.visitExpressionStatement(node);
      //   break;
    }
    return str;
  }

  visitVariableDeclaration(node) {
    let str = "";
    str += node.kind + " ";
    str += this.visitNodes(node.declarations);
    return str + "\n";
  }
  visitVariableDeclarator(node, kind) {
    // console.log('visitVariableDeclarator', node);
    let str = kind ? (kind + ' ') : '';
    str += this.visitNode(node.id);
    str += '=';
    str += this.visitNode(node.init);
    return str + ';' + '\n';
  }
  visitLiteral(node) {
    return node.raw;
  }
  visitIdentifier(node) {
    return node.name;
  }
  visitBinaryExpression(node) {
    let str = '';
    str += this.visitNode(node.left);
    str += node.operator;
    str += this.visitNode(node.right);
    return str + '\n';
  }
}

module.exports = Generator
