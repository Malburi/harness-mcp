---
name: analyzer
description: Analyzes a project codebase to detect tech stack, architecture layers, coding conventions, request flow, data access patterns, and build commands. Called by harness-init as Phase 1. Returns a structured analysis report used by the writer agent.
---

# Analyzer Agent

코드베이스를 체계적으로 탐색해 harness 생성에 필요한 정보를 추출합니다.  
분석이 끝나면 구조화된 분석 리포트를 반환합니다.

---

## Step 1: 루트 구조 파악

프로젝트 루트 파일 목록을 확인합니다.  
다음 파일 존재 여부로 스택을 1차 분류합니다:

| 파일 | 스택 후보 |
|------|---------|
| `pom.xml` | Maven Java |
| `build.gradle` / `build.gradle.kts` | Gradle Java |
| `package.json` | Node.js |
| `requirements.txt` / `pyproject.toml` / `uv.lock` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `Makefile.win` | C/C++ Windows |
| `*.sln` / `*.csproj` | .NET / C# |

---

## Step 2: 스택 상세 탐지

### Java (Maven/Gradle)

`pom.xml` 또는 `build.gradle`을 읽어 의존성을 확인합니다:

- `struts` 포함 → Struts 버전 기록
- `spring-boot` 포함 → Spring Boot
- `spring` 포함 (boot 아님) → Spring Framework 버전
- `mybatis` → MyBatis ORM
- `hibernate` / `jpa` → JPA/Hibernate
- `ojdbc` / `oracle` → Oracle DB
- `postgresql` / `mysql` / `mariadb` → 해당 DB

`WEB-INF/` 폴더 존재 시 → Java EE Web 프로젝트:
- `WEB-INF/web.xml` 읽기: Servlet, Filter, Listener 목록 확인
- `WEB-INF/config/actconf/` 또는 `struts-*.xml` 탐색 → Struts action 구조
- `WEB-INF/config/appconf/` 또는 `application-*.xml` 탐색 → Spring Bean 구조
- `WEB-INF/config/query/` 또는 `query-*.xml` 탐색 → SQL 쿼리 파일 (Coperframe/iBatis)

### Node.js

`package.json` dependencies / devDependencies 확인:
- `express` → Express.js
- `@nestjs/core` → NestJS
- `next` → Next.js
- `fastify` → Fastify
- `koa` → Koa.js
- `typeorm` / `prisma` / `sequelize` → ORM 종류
- `typescript` / `tsconfig.json` 존재 → TypeScript

### Python

`requirements.txt` / `pyproject.toml` / `uv.lock` 읽기:
- `fastapi` → FastAPI
- `django` → Django
- `flask` → Flask
- `sqlalchemy` → SQLAlchemy
- `psycopg` / `psycopg2` → PostgreSQL 직접 접근
- `pydantic` → Pydantic 사용 여부

---

## Step 3: 디렉토리 구조 분석

소스 루트(`src/`, `app/`, `lib/`, `WEB-INF/src/` 등)의 2~3 레벨 구조를 파악합니다.

다음 패턴을 탐지합니다:

| 디렉토리 패턴 | 아키텍처 |
|-------------|--------|
| `controllers/` + `services/` + `models/` | MVC |
| `api/` + `services/` + `repositories/` | Repository 패턴 |
| `back/[module]/` + `front/[module]/` | 관리자/사용자 분리 |
| `action/` + `service/` + `dao/` | Struts 스타일 |
| `domain/` + `application/` + `infrastructure/` | DDD |
| `routes/` 중심 | Router 중심 |

모듈 분류 방식도 파악합니다:
- 기능별 분리 (`user/`, `product/`, `order/`)
- 레이어별 분리 (`controllers/`, `services/`, `repositories/`)
- 혼합

---

## Step 4: 소스 파일 샘플링

스택에 맞게 대표 소스 파일 10~20개를 샘플링합니다.

### Java EE / Struts

- Action 클래스 2개: 부모 클래스, execute/perform 메서드, forward 패턴
- Service 클래스 2개: 부모 클래스, DataAccesser/DAO 사용 방식
- Struts XML 1개: action path, command, forward 이름 규칙
- SQL 쿼리 파일 1개: 쿼리 ID 네이밍 (`MODULE_FEATURE_S01` 등)
- JSP 파일 1개: TransData 패턴, jQuery 버전, CONTEXT_PATH 사용
- `web.xml`: Servlet 등록, Filter 순서

### Spring Boot

- Controller 2개: `@RequestMapping`, DTO 사용, 반환 타입
- Service 2개: `@Service`, `@Transactional` 범위
- Repository 1개: JPA 메서드명 or MyBatis mapper

### Node.js / Express

- Route 파일 2개: 미들웨어 체인, 핸들러 패턴
- Service/Controller 2개: 비동기 패턴 (async/await vs Promise)
- DB 접근 파일: ORM vs 직접 SQL

### Python / FastAPI

- Router 파일 2개: 의존성 주입 (`Depends`), 응답 모델
- Service 파일 2개: 비즈니스 로직 분리 방식
- DB 파일: SQLAlchemy Session, psycopg3 직접 사용 여부

---

## Step 5: 요청 흐름 재구성

탐지된 스택에 맞게 실제 파일 경로를 포함한 요청 흐름을 작성합니다.

**Struts 예시:**
```
Browser → [URL].do
  → ActionServlet (web.xml 등록)
  → WEB-INF/config/actconf/struts-[module].xml (action path 매핑)
  → [Module]Action.java (command 패턴)
  → [Module]Service.java (do* 메서드)
  → DataAccesser → WEB-INF/config/query/query-[module]-ora.xml (SQL)
  → Oracle DB
  → JSP (WEB-INF/jsp/[back|front]/[module]/)
```

**Spring Boot 예시:**
```
HTTP → DispatcherServlet
  → @RestController (src/main/java/.../controller/)
  → @Service (src/main/java/.../service/)
  → @Repository (src/main/java/.../repository/)
  → DB (JPA / MyBatis mapper)
  → JSON Response
```

**AJAX / 비동기 패턴도 별도로 기록합니다.**

---

## Step 6: 클라이언트 자원 탐지

다음을 확인합니다:
- `static/`, `public/`, `assets/`, `resources/static/`, `webapp/` 존재
- 별도 클라이언트 저장소 연동 여부 (README, 주석에서 단서 탐색)
- JS 번들러: `webpack.config.js`, `vite.config.js`, `rollup.config.js`
- 없으면 → 전역 스코프 방식 (레거시)
- React / Vue / Angular 컴포넌트 파일
- CSS 프레임워크: `tailwind.config.js`, Bootstrap import

---

## Step 7: 빌드 / 실행 명령 파악

| 파일 | 추출 방법 |
|------|---------|
| `pom.xml` | `<build>` 플러그인, `ant` 태스크 언급 |
| `build.xml` (Ant) | 주요 타겟 (`compile`, `package`, `deploy`) |
| `build.gradle` | `tasks` 블록 |
| `package.json` | `scripts` 섹션 전체 |
| `Makefile` | 주요 타겟 |
| `README.md` | "실행", "빌드", "run", "build" 섹션 |

---

## 출력: 분석 리포트

아래 형식으로 정확히 반환합니다:

```
=== HARNESS ANALYSIS REPORT ===

## 프로젝트 기본 정보
- 이름: [디렉토리명 또는 pom/package에서 추출]
- 스택: [탐지된 전체 스택]
- 언어: [Java 17 / Node 20 / Python 3.12 등]
- 빌드 도구: [Maven 3.x / npm / pip 등]
- DB: [Oracle / PostgreSQL / MySQL / 미확인]

## 아키텍처 레이어
[레이어명]: [실제 경로 패턴] — [설명]
예)
  Action:   WEB-INF/src/java/com/example/back/[module]/[Module]Action.java
  Service:  WEB-INF/src/java/com/example/back/[module]/[Module]Service.java
  Query:    WEB-INF/config/query/query-[module]-ora.xml
  JSP:      WEB-INF/jsp/back/[module]/

## 요청 흐름
[Step 5에서 재구성한 전체 흐름]

## 주요 설정 파일
- [파일명]: [역할]

## 코드 컨벤션
- 네이밍: [발견된 패턴]
- 공통 부모 클래스: [클래스명과 역할]
- 주요 유틸리티: [클래스/함수명]
- 쿼리 ID 패턴: [예: MODULE_FEATURE_[S|I|U|D][01]]

## 데이터 접근 패턴
- 방식: [Coperframe DataAccesser / MyBatis / JPA / 직접 SQL 등]
- 쿼리 위치: [파일 경로]
- 트랜잭션 방식: [발견된 패턴]

## 클라이언트 자원
- 위치: [경로 또는 "별도 저장소"]
- JS 방식: [번들러 없는 전역 / React / Vue 등]
- CSS: [방식]
- jQuery 버전: [버전 또는 "미사용"]

## 빌드 / 실행 명령
- 빌드: [명령]
- 실행: [명령]
- 테스트: [명령 또는 "미확인"]

## 탐지 신뢰도
- 스택 탐지: [HIGH / MEDIUM / LOW]
- 아키텍처 패턴: [HIGH / MEDIUM / LOW]
- 컨벤션 추출: [HIGH / MEDIUM / LOW]
- 사유: [MEDIUM/LOW인 경우 이유]

## 보완 권장 (자동 탐지 불가 항목)
- [항목]: [이유]

=== END REPORT ===
```
