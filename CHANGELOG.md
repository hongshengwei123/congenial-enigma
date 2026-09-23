# 更新日志

本项目的版本说明遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.3] - 2026-09-23

### 修复（上架自检）

- Rules 改为 `rules/coding-rules.mdc`（与 Cursor 官方插件规范一致）
- 删除 `commands/*.command`，仅保留 `.md` 命令文件

## [1.0.2] - 2026-09-23

### 新增

- **WebView 侧边栏**：活动栏「AI编程助手」+ `type: webview` 视图
- **双向通信**：`postMessage` / `onDidReceiveMessage`
- **授权验证**：本地 `globalState` 存储，未激活不可插入注释
- **插入中文注释**：在光标处插入 `// 注释`
- **本地资源**：`media/sidebar.css` 通过 `asWebviewUri` 加载
- **命令**：`chineseAI.openSidebar` 打开侧边栏
- **Cursor 插件清单**：`.cursor-plugin/plugin.json`（rules / skills / commands / MCP）
- **资源**：插件 Logo（`assets/logo.svg` / `assets/logo.png`）

## [1.0.1] - 2026-09-23

### 变更

- 新增 `CHANGELOG.md`（市场「更新日志」）
- 新增 `LICENSE`（MIT）

## [1.0.0] - 2026-09-23

### 新增

- 初始 Cursor 插件：Rules、Skills、Commands、示例 MCP

[1.0.3]: https://github.com/hongshengwei123/congenial-enigma/releases/tag/v1.0.3
[1.0.2]: https://github.com/hongshengwei123/congenial-enigma/releases/tag/v1.0.2
[1.0.1]: https://github.com/hongshengwei123/congenial-enigma/releases/tag/v1.0.1
[1.0.0]: https://github.com/hongshengwei123/congenial-enigma/releases/tag/v1.0.0
