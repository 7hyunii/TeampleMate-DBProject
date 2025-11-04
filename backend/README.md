# Backend 구조 

이 프로젝트는 FastAPI + PostgreSQL 기반의 프론트엔드입니다.

## 폴더 구조
```
backend/
├── api/
│   └── routes.py           # FastAPI 라우터(엔드포인트) 코드
├── db/
│   ├── SQL_Check.sql       # DB check
│   ├── ...
├── main.py                 # FastAPI 앱 진입점
├── venv/                   # Python 가상환경 폴더
└── README.md               # 백엔드 설명 파일
```

## 주요 설명
- `api/` : FastAPI 라우터(엔드포인트) 코드 분리
- `db/` : DB 연결, 쿼리, 데이터 구조 등 DB 관련 코드 분리
- `main.py` : FastAPI 앱 실행 및 라우터 등록
- `create_tables.sql` : PostgreSQL 테이블 생성 SQL
- `venv/` : 프로젝트별 가상환경(공유/커밋 X)

## 실행 예시
1. 가상환경 활성화
   ```cmd
   venv\Scripts\activate
   ```
2. 패키지 설치
   ```cmd
   pip install fastapi uvicorn psycopg2
   ```
3. 서버 실행
   ```cmd
   uvicorn main:app --reload
   ```
