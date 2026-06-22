/**
 * 将外部 lint 输出转换为 GitHub annotation。
 *
 * 输入：
 * - `CHANGED_FILES` 环境变量指定需要关注的文件。
 * - 子进程 lint 输出中的 `file:line:column - message` 文本。
 * 主要功能：
 * - 只保留本次变更文件相关的问题。
 * - 转换为 GitHub Actions 可识别的 annotation 格式。
 *
 * 适用场景：CI 中把传统命令行 lint 结果变成可点击的 PR 检查注释。
 */
import path from 'path';
import fs from 'fs';
import process from 'process';
import { spawn } from 'child_process';

const regex = /(?<file>[^:]+):(?<line>\d+):(?<column>\d+)\s-\s+(?<message>.+)/;
const fileList = process.env.CHANGED_FILES
  ? (process.env.CHANGED_FILES || '').split(' ')
  : fs.readdirSync('./icons').map((fileName) => path.join('./icons', fileName));

const cspell = spawn('npx', ['cspell', 'stdin'], { stdio: ['pipe', 'pipe', 'inherit'] });
cspell.stdin.write(fileList.join('\n'));
cspell.stdin.end();

cspell.stdout.on('data', (data) => {
  console.log(data.toString());
  data
    .toString()
    .split('\n')
    .forEach((line: string) => {
      const match = line.match(regex);
      if (match) {
        const { line, message } = match.groups ?? {};
        console.log(`::error file=${fileList[Number(line) - 1]},line=1,column=1::${message}`);
      }
    });
});

cspell.on('exit', process.exit);
