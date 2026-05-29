# CHANGELOG

## 2026-05-29

**MCP 플러그인 지원 (v1.1.0)**

**추가 파일**
- `index.js` — MCP 서버 구현 (`harness_install`, `harness_status` 도구 제공)
- `package.json` — npm 패키지 설정 (`@modelcontextprotocol/sdk` 의존성)
- `.gitignore` — `node_modules/` 제외

**변경 파일**
- `README.md` — MCP 플러그인 설치 방법(방법 1) 상단 추가, 기존 수동 설치는 방법 2로
- `SETUP.md` — MCP 기반 4단계 온보딩 가이드 추가, 문제 해결 표 보완

**MCP 도구**
- `harness_install(target_dir)` — 대상 프로젝트에 `.claude/` 템플릿 복사
- `harness_status(target_dir)` — 설치/초기화 상태 확인

**설치 방법**
```bash
claude mcp add harness -s user -- npx github:Malburi/harness-mcp
```

---

## 2026-05-28

**초기 구축 (v1.0.0)**

**추가 파일**
- `.claude/skills/harness-init.md` — 분석→생성→검증 오케스트레이터 스킬
- `.claude/agents/analyzer.md` — 코드베이스 스택 탐지 + 패턴 추출 에이전트
- `.claude/agents/writer.md` — harness 파일 생성 에이전트 (CLAUDE.md, skills, agents, patterns)
- `.claude/agents/validator.md` — 생성 결과 검증 + 보완 리포트 에이전트
- `README.md`, `CLAUDE.md`, `SETUP.md`, `CHANGELOG.md`

**설계 원칙**
- revfactory/harness의 구조적 패턴(skills/, agents/, 경량 CLAUDE.md, 피드백 루프) 적용
- xu43 harness의 도메인 특화 깊이를 analyzer가 자동 추출하는 방식으로 일반화
- static stacks/ 프리셋 대신 코드베이스 분석 기반 동적 생성 채택
