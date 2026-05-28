# SETUP.md — 팀원 온보딩 가이드

예상 소요 시간: **5분**

---

## 1단계: 템플릿으로 저장소 생성

1. https://github.com/Malburi/harness-mcp 접속
2. **"Use this template"** → **"Create a new repository"**
3. 저장소 이름 예: `myproject-harness`

---

## 2단계: 대상 프로젝트에 .claude/ 복사

```bash
# harness 저장소 clone
git clone https://github.com/[조직]/[프로젝트명]-harness temp-harness

# 대상 프로젝트로 .claude/ 복사
cp -r temp-harness/.claude/ [대상-프로젝트]/
rm -rf temp-harness
```

**Windows PowerShell:**
```powershell
git clone https://github.com/[조직]/[프로젝트명]-harness temp-harness
Copy-Item -Recurse temp-harness\.claude\ [대상-프로젝트]\
Remove-Item -Recurse -Force temp-harness
```

---

## 3단계: harness 초기화

대상 프로젝트 루트에서 Claude Code 실행 후:

```
harness 초기화해줘
```

또는

```
이 프로젝트 분석해서 harness 만들어줘
```

analyzer → writer → validator 순서로 자동 진행됩니다.

---

## 4단계: 생성된 파일 커밋

```bash
git add CLAUDE.md .claude/
git commit -m "docs: add project harness"
git push
```

---

## 재초기화 (프로젝트 구조 변경 후)

```
harness 다시 초기화해줘
```

기존 생성 파일들은 `.claude/backup/YYYYMMDD-HHMMSS/`에 자동 백업됩니다.

---

## 보완이 필요할 때

validator 리포트에서 보완 항목이 나왔을 때:

```
패턴 파일에 [레이어명] 추가해줘
```

```
[특정 파일 경로]를 기반으로 trace 스킬을 다시 작성해줘
```

직접 수정도 가능합니다 — `.claude/skills/`, `.claude/patterns/` 파일은 일반 마크다운입니다.

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| 스킬이 트리거되지 않음 | `.claude/skills/` 폴더가 프로젝트 루트에 있는지 확인 |
| 스택이 잘못 탐지됨 | "이 프로젝트는 [스택]을 사용해" 라고 명시 후 재시도 |
| 경로가 실제와 다름 | "서비스 클래스는 실제로 [경로]에 있어" 라고 보정 |
| 패턴이 불완전함 | "pattern 보완해줘" + 누락된 내용 직접 알려주기 |
