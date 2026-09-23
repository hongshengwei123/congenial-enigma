#!/usr/bin/env node
/**
 * 示例 MCP 服务：返回模拟天气（可替换为真实 API）
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "weather",
  version: "1.0.0",
});

server.registerTool(
  "get_weather",
  {
    description: "查询指定城市的天气（示例数据）",
    inputSchema: {
      city: z.string().describe("城市名称，如：北京、上海"),
    },
  },
  async ({ city }) => ({
    content: [
      {
        type: "text",
        text: `${city}：晴，26°C，湿度 45%（插件示例数据，非实时）`,
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
