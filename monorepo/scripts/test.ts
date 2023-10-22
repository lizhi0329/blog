import { spawnSync } from 'child_process';

const result = spawnSync('vue-tsc', ['--noEmit', 'false', '--emitDeclarationOnly', '--declaration', '--outDir', 'packages/utils/dist', 'packages/utils/src/index.ts']);

console.log(result.status); // 输出命令执行的状态码
console.log(result.stderr); // 输出命令执行的错误信息
console.log(result.stdout); // 输出命令执行的输出信息
