# harness-mcp

Claude Code harness 자동 생성 템플릿.

프로젝트 코드베이스를 분석해 **프로젝트 전용** CLAUDE.md, skills, agents, patterns를 자동 생성합니다.  
Java EE / Spring Boot / Node.js / Python / Go 등 스택을 자동 탐지하며, 커스텀 프레임워크(Coperframe 등)도 실제 코드에서 패턴을 추출합니다.

## 빠른 시작

```
1. 이 저장소를 GitHub 템플릿으로 새 저장소 생성 (Use this template 버튼)
2. 생성된 저장소의 .claude/ 폴더를 대상 프로젝트에 복사
3. 대상 프로젝트 루트에서 Claude Code 실행 후: "harness 초기화해줘"
```

5분 이내에 프로젝트 전용 harness가 생성됩니다.

## 생성 결과물

```
프로젝트/
├── CLAUDE.md                        ← 프로젝트 개요 + 스킬 포인터 (경량)
└── .claude/
    ├── skills/
    │   ├── trace.md                 ← 요청 흐름 추적
    │   ├── scaffolder.md            ← 신규 기능 파일 체크리스트
    │   └── find-logic.md            ← 로직 위치 탐색
    ├── agents/
    │   └── domain-expert.md         ← 도메인 전문가 에이전트
    └── patterns/
        └── [스택별 패턴 파일들]      ← 실제 코드 기반 패턴
```

## 지원 스택 (자동 탐지)

| 탐지 신호 | 스택 |
|---------|------|
| `pom.xml` + Struts config | Java EE (Struts + Spring) |
| `pom.xml` + Spring Boot | Spring Boot |
| `package.json` + Express/Nest/Fastify | Node.js |
| `package.json` + Next | Next.js |
| `requirements.txt` / `uv.lock` / `pyproject.toml` | Python |
| `build.gradle` | Gradle Java |
| `go.mod` | Go |

미지원 스택도 구조 분석은 동작합니다. validator가 보완 필요 항목을 리포트합니다.

## 아키텍처

```
harness-init 스킬 (오케스트레이터)
  └─► analyzer 에이전트  → 코드베이스 탐색 + 분석 리포트
  └─► writer 에이전트   → harness 파일 생성
  └─► validator 에이전트 → 생성 결과 검증 + 보완 리포트
```

| 파일 | 역할 |
|------|------|
| `.claude/skills/harness-init.md` | 분석→생성→검증 오케스트레이션 |
| `.claude/agents/analyzer.md` | 스택 탐지 + 패턴 추출 |
| `.claude/agents/writer.md` | harness 파일 생성 |
| `.claude/agents/validator.md` | 생성 결과 검증 |

## 팀 배포

[SETUP.md](SETUP.md) 참고

## 재초기화

프로젝트 구조가 크게 바뀌었을 때:

```
harness 다시 초기화해줘
```

기존 파일은 `.claude/backup/YYYYMMDD-HHMMSS/`에 자동 백업됩니다.

## 라이선스

Apache 2.0
