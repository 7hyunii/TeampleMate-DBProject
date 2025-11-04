# Teample mate

## 기술 스택
- Frontend : Next.js (Typescript)
- Backend : Fast API (Python)
- Database : PostgreSQL

## 프로젝트 폴더 구조

```
DB_Termproject/
├── backend/
│   ├── api/
│   │   └── routes.py           # FastAPI 엔드포인트 정의
│   ├── db/
│   │   ├── crud.py             # DB CRUD 함수
│   │   ├── CreateTable.sql     # DB 테이블 생성 SQL
│   │   ├── SQL_Check.sql       # SQL 테스트/검증 스크립트
│   │   └── database.py         # DB 연결 관리
│   ├── venv/                   # Python 가상환경
│   └── ...
├── frontend/
│   ├── components/
│   │   ├── Navigation.tsx      # 네비게이션 바 컴포넌트
│   │   ├── ProjectList.tsx     # 프로젝트 목록 컴포넌트
│   │   ├── ProjectCard.tsx     # 프로젝트 카드 컴포넌트
│   │   └── ...
│   ├── app/
│   │   ├── layout.tsx          # 전체 페이지 공통 레이아웃
│   │   └── page.tsx            # 메인 페이지
│   └── ...
└── README.md                   # 폴더 구조 및 프로젝트 설명
```

## 주요 설명
- **backend/**: FastAPI 기반 백엔드, DB 연동 및 API 제공
- **frontend/**: Next.js 기반 프론트엔드, UI/UX 구현
- **db/**: DB 테이블 생성, CRUD, SQL 테스트 등 DB 관련 코드
- **components/**: 프론트엔드 주요 UI 컴포넌트

