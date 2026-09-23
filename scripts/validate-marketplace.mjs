import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

function mustExist(rel, label) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    errors.push(`缺少 ${label}: ${rel}`);
  }
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

mustExist(".cursor-plugin/plugin.json", "插件清单");
mustExist("assets/logo.svg", "Logo (SVG)");
mustExist("README.md", "README");
mustExist("LICENSE", "LICENSE");
mustExist("CHANGELOG.md", "CHANGELOG");
mustExist("rules/coding-rules.mdc", "Rules");
mustExist("skills/code-reviewer/SKILL.md", "Skills");
mustExist("commands/insert-chinese-comment.md", "Commands");
mustExist("mcp.json", "MCP 配置");
mustExist("mcp/weather-server.mjs", "MCP 脚本");
mustExist("package.json", "package.json (MCP 依赖)");
mustExist("package-lock.json", "package-lock.json");

const manifest = readJson(".cursor-plugin/plugin.json");
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name)) {
  errors.push("plugin.json name 须为小写 kebab-case");
}
if (!manifest.description?.trim()) {
  errors.push("plugin.json 缺少 description");
}
if (manifest.author?.name === "YourName") {
  warnings.push("author.name 仍为占位符，上架前请改为真实姓名");
}
if (manifest.author?.email === "your@email.com") {
  warnings.push("author.email 仍为占位符，上架前请改为真实邮箱");
}
if (!manifest.repository) {
  warnings.push("未设置 repository（可在提交表单时用仓库 URL，建议在 manifest 中补充）");
}

if (fs.existsSync(path.join(root, "commands/insert-chinese-comment.command"))) {
  errors.push("commands 含 .command 扩展名，Cursor 仅识别 .md/.txt 等，请删除 .command 文件");
}

console.log("=== Cursor Marketplace 自检 ===\n");
if (errors.length) {
  console.log("阻塞项:");
  errors.forEach((e) => console.log("  [FAIL]", e));
} else {
  console.log("阻塞项: 无");
}
if (warnings.length) {
  console.log("\n待你填写:");
  warnings.forEach((w) => console.log("  [WARN]", w));
}
console.log(
  errors.length
    ? "\n结果: 不可上架，请先修复阻塞项"
    : "\n结果: 仓库结构符合上架要求（仍需公开 Git + 表单信息）"
);
process.exit(errors.length ? 1 : 0);
