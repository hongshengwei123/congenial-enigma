# chinese-ai-helper

AI 中文编程增强助手（Cursor 插件 + 可选 VS Code WebView 扩展）。

更新记录见仓库根目录 `CHANGELOG.md`。

仓库：https://github.com/hongshengwei123/congenial-enigma

## 功能

- **Rules**：中文编程规范（`rules/coding-rules.md`）
- **Skills**：代码审查（`skills/code-reviewer/`）
- **Commands**：插入中文注释（`commands/insert-chinese-comment.md`）
- **MCP**：示例天气服务 `weather`（`mcp/weather-server.mjs`）
- **WebView 侧边栏**：授权激活 + 插入中文注释（`extension/`）

## 本地安装

```bash
npm install
npm run install:local
```

或在 Cursor 中打开 **Plugins**，将本目录链接/复制到 `%USERPROFILE%\.cursor\plugins\local\chinese-ai-helper`。

## 打包

**Cursor 插件 zip（推荐用于 `.cursor-plugin` 本地分发）：**

```bash
npm install
npm run package:zip
```

生成 `chinese-ai-helper-1.0.2.zip`。

**VS Code / Cursor 扩展 .vsix：**

```bash
npm install
npm run package:vsix
```

或 `npm run package`（默认打 .vsix）。输出：`chinese-ai-helper-1.0.2.vsix`，可在 Cursor 中「从 VSIX 安装扩展」。

## 发布到 Cursor Marketplace

1. 将本仓库推送到**公开** Git 仓库（审核会拉取该仓库）
2. 在 [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) 提交仓库链接
3. **标志类型网址**（表单若必填）：  
   `https://raw.githubusercontent.com/hongshengwei123/congenial-enigma/main/assets/logo.svg`

提交后由 Cursor 团队审核，通过后会在市场中展示。审核期间请保持仓库公开，且 `main` 分支内容与本地插件一致。

## 上架前自检

- [x] 公开 Git 仓库：https://github.com/hongshengwei123/congenial-enigma
- [x] `author` / `repository` / `homepage` 已配置
- [x] `rules/`、`skills/`、`commands/`、`mcp.json` 路径有效且含 frontmatter
- [ ] **你需完成**：在 [marketplace/publish](https://cursor.com/marketplace/publish) 提交仓库并等待审核

> 说明：`vsce package` 打出的是 VS Code 扩展（.vsix）；Cursor 插件市场以上传含 `.cursor-plugin/` 的公开 Git 仓库为准。
