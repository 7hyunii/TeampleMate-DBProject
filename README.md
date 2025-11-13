# Teample mate

## 기술 스택
- Frontend : Next.js (TypeScript)
- Backend  : FastAPI (Python)
- Database : PostgreSQL

## 프로젝트 폴더 구조 (현 상태 기준)

```
DB_Termproject/
├── backend/
│   ├── main.py                      # FastAPI 앱 진입점
│   ├── README.md
│   ├── api/
│   │   └── deps.py                  # FastAPI 의존성 래퍼
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── applications.py  # 지원 관련 엔드포인트
│   │           ├── projects.py      # 프로젝트 관련 엔드포인트
│   │           ├── profile.py       # 프로필 관련 엔드포인트
│   │           └── auth.py          # 인증 관련 엔드포인트
│   ├── crud/
│   │   ├── crud_applications.py     # Applications 관련 DB 로직
│   │   ├── crud_projects.py         # Projects 관련 DB 로직
│   │   ├── crud_profile.py          # Profile 관련 DB 로직
|   |   └── crud_auth.py             # Auth 관련 DB 로직
│   ├── db/
│   │   ├── utils.py                 # DB 관련 유틸리티
│   │   ├── session.py               # SQLAlchemy 세션(get_db 등)
│   │   └── sql/
│   │       └── App_roles_and_privileges.sql  # 권한/역할 스크립트
│   └── api/
│       
├── frontend/
│   ├── README.md
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ApplicantManagement.tsx  # 지원자 관리 컴포넌트
│   │   ├── ProfileManagement.tsx    # 프로필 관리
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   └── ui/                       # UI primitives (button, card, badge...)
│   ├── constants/
│   │   └── skills.ts                 # SKILL_DISPLAY_MAP 등
│   └── styles/
│       └── globals.css
└── .
```

## 주요 설명
- `backend/`: FastAPI 기반 백엔드
	- `api/v1/endpoints/`에 엔드포인트 구현이 있고, `crud/`에 DB 접근 로직이 있습니다.
	- `db/`에는 테이블/뷰 생성 SQL과 DB 세션 관련 코드가 있습니다.
- `frontend/`: Next.js 기반 프론트엔드
	- `app/`와 `components/`에 페이지와 UI 컴포넌트가 위치합니다.
	- `constants/skills.ts`에서 스킬 표시용 맵과 목록을 관리합니다.

## 빠른 시작(개발 환경 요약)
- 백엔드: Python 가상환경을 활성화한 뒤 dependencies 설치 및 `uvicorn main:app --reload`로 실행
- 프론트엔드: `npm install` 후 `npm run dev` (Next.js 개발 서버)

