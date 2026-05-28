# CLAUDE.md

**harness-mcp** — Claude Code harness 자동 생성 템플릿 저장소입니다.

## 이 저장소의 역할

`.claude/` 폴더에 harness를 **생성하는** 에이전트 팀이 포함되어 있습니다.  
대상 프로젝트의 코드베이스를 분석해 맞춤형 CLAUDE.md, skills, agents, patterns를 생성합니다.

## 파일 구조

| 경로 | 역할 |
|------|------|
| `.claude/skills/harness-init.md` | 메인 오케스트레이터 스킬 |
| `.claude/agents/analyzer.md` | 코드베이스 분석 에이전트 |
| `.claude/agents/writer.md` | harness 파일 생성 에이전트 |
| `.claude/agents/validator.md` | 생성 결과 검증 에이전트 |

## 자동 워크플로우

| 상황 | 읽을 파일 |
|------|---------|
| harness 초기화 / 재초기화 요청 | `.claude/skills/harness-init.md` |

## 에이전트 수정

에이전트 개선은 `.claude/agents/` 파일을 직접 수정합니다.  
변경사항은 `CHANGELOG.md`에 기록합니다.
