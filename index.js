#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { cpSync, existsSync, mkdirSync, readdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = new Server(
  { name: "harness-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "harness_install",
      description:
        "Install harness template files (.claude/ folder) into a project directory. " +
        "Run this first, then ask Claude to '초기화해줘' or 'initialize harness'.",
      inputSchema: {
        type: "object",
        properties: {
          target_dir: {
            type: "string",
            description: "Absolute path to the project root directory to install the harness into",
          },
        },
        required: ["target_dir"],
      },
    },
    {
      name: "harness_status",
      description:
        "Check whether harness is already installed in a project directory.",
      inputSchema: {
        type: "object",
        properties: {
          target_dir: {
            type: "string",
            description: "Absolute path to the project root directory to check",
          },
        },
        required: ["target_dir"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "harness_install") {
    const targetDir = resolve(args.target_dir);
    const srcClaudeDir = join(__dirname, ".claude");
    const destClaudeDir = join(targetDir, ".claude");

    if (!existsSync(srcClaudeDir)) {
      return {
        content: [{ type: "text", text: "오류: 패키지 내 .claude/ 폴더를 찾을 수 없습니다." }],
        isError: true,
      };
    }

    mkdirSync(destClaudeDir, { recursive: true });
    cpSync(srcClaudeDir, destClaudeDir, { recursive: true });

    const installed = readdirSync(srcClaudeDir, { withFileTypes: true })
      .map((e) => `  .claude/${e.name}/`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text:
            `✅ harness-mcp 설치 완료\n` +
            `경로: ${destClaudeDir}\n\n` +
            `설치된 폴더:\n${installed}\n\n` +
            `다음 단계: Claude Code에서 "harness 초기화해줘" 를 입력하세요.`,
        },
      ],
    };
  }

  if (name === "harness_status") {
    const targetDir = resolve(args.target_dir);
    const claudeDir = join(targetDir, ".claude");
    const skillsDir = join(claudeDir, "skills");
    const harnessInit = join(skillsDir, "harness-init.md");
    const traceSkill = join(skillsDir, "trace.md");

    const installed = existsSync(harnessInit);
    const initialized = existsSync(traceSkill);

    let status;
    if (!installed) {
      status = "❌ 미설치 — harness_install 도구를 실행하세요.";
    } else if (!initialized) {
      status = "⚠️  템플릿 설치됨, 미초기화 — \"harness 초기화해줘\" 를 입력하세요.";
    } else {
      status = "✅ 설치 및 초기화 완료";
    }

    return {
      content: [{ type: "text", text: `${targetDir}\n${status}` }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
