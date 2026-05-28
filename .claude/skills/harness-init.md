---
name: harness-init
description: Use when asked to initialize, create, generate, or set up a harness or Claude Code configuration for this project. Also triggers on "harness 초기화", "harness 만들어줘", "harness 다시 초기화", "프로젝트 분석해서 설정해줘", "이 프로젝트 Claude 설정해줘", "create harness", "set up Claude Code", "initialize harness", "generate project harness". Also triggers automatically when .claude/skills/trace.md does not exist in the current project.
---

# Harness Initializer

프로젝트 코드베이스를 분석해 맞춤형 harness를 자동 생성합니다.  
**analyzer → writer → validator** 순서로 세 에이전트를 순차 실행합니다.

## 실행 전 확인: 재초기화 여부

재초기화 요청("다시 초기화", "re-initialize")인 경우:
- 현재 날짜시각을 `YYYYMMDD-HHMMSS` 형식으로 확인합니다 (PowerShell: `Get-Date -Format "yyyyMMdd-HHmmss"`)
- 다음 파일/폴더를 `.claude/backup/[YYYYMMDD-HHMMSS]/`로 복사합니다:
  - `CLAUDE.md` (프로젝트 루트)
  - `.claude/skills/trace.md`
  - `.claude/skills/scaffolder.md`
  - `.claude/skills/find-logic.md`
  - `.claude/agents/domain-expert.md`
  - `.claude/patterns/` (폴더 전체)
- 백업 완료 후 계속 진행합니다.

초기화(최초)라면 바로 진행합니다.

---

## Phase 1: 분석

**analyzer** 에이전트를 실행합니다.

에이전트 프롬프트:
```
현재 프로젝트 루트: [현재 작업 디렉토리 절대 경로]

이 프로젝트의 코드베이스를 전체 분석하고 구조화된 분석 리포트를 반환해주세요.
analyzer 에이전트 지침에 따라 스택 탐지, 아키텍처 분석, 코드 컨벤션 추출,
요청 흐름 재구성, 클라이언트 자원 탐지, 빌드 명령 파악을 수행합니다.
```

분석 리포트가 반환될 때까지 대기합니다.

---

## Phase 2: 생성

Phase 1의 **분석 리포트 전문**을 **writer** 에이전트에 전달합니다.

에이전트 프롬프트:
```
현재 프로젝트 루트: [현재 작업 디렉토리 절대 경로]

아래 분석 리포트를 바탕으로 이 프로젝트 전용 harness 파일들을 생성해주세요.
writer 에이전트 지침에 따라 CLAUDE.md, skills, agents, patterns 파일을 작성합니다.

=== 분석 리포트 ===
[analyzer 출력 전문]
===================
```

생성 완료 보고(파일 목록)가 반환될 때까지 대기합니다.

---

## Phase 3: 검증

Phase 1의 분석 리포트 요약과 Phase 2의 생성 파일 목록을 **validator** 에이전트에 전달합니다.

에이전트 프롬프트:
```
현재 프로젝트 루트: [현재 작업 디렉토리 절대 경로]

아래 정보를 바탕으로 생성된 harness 파일들을 검증하고 보완 리포트를 작성해주세요.
validator 에이전트 지침에 따라 파일 완성도, 트리거 품질, 경로 정합성, 보안 위험을 검사합니다.

=== 생성된 파일 목록 ===
[writer 출력]
========================

=== 분석 리포트 요약 ===
스택: [탐지된 스택]
아키텍처 레이어: [레이어 목록]
신뢰도: [탐지 신뢰도]
========================
```

---

## 완료 리포트

사용자에게 다음 형식으로 보고합니다:

```
harness 초기화 완료

생성된 파일:
- CLAUDE.md
- .claude/skills/trace.md
- .claude/skills/scaffolder.md
- .claude/skills/find-logic.md
- .claude/agents/domain-expert.md
- .claude/patterns/[파일들]

[validator 검증 리포트 — 보완 권장 항목 포함]

다음 단계:
  git add CLAUDE.md .claude/ && git commit -m "docs: add project harness"
```
