# CHANGELOG

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
- 모든 에이전트 `model: claude-opus-4-7` 지정
