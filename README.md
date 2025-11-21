# Teample Mate
 

## 프로젝트 목적
대학생들이 팀 프로젝트를 진행하며 겪는 팀원 매칭의 어려움과 협업 과정에서의 갈등을 해결하기 위해 기획되었습니다.

단순한 팀원 모집을 넘어, 신뢰할 수 있는 동료를 찾고 성공적인 프로젝트 경험을 쌓을 수 있도록 돕는 것을 목표로 합니다.

## 프로젝트 개요
**Teample Mate**는 대학생을 위한 팀 프로젝트 매칭 및 관리 플랫폼입니다.

사용자는 자신의 기술 스택과 프로필을 등록하여 프로젝트를 개설하거나 원하는 팀에 지원할 수 있습니다.
특히, 프로젝트 완료 후 진행되는 **상호 평가(Peer Review)** 시스템을 통해 팀원들의 협업 태도와 기여도를 데이터화합니다.

이를 통해 리더는 지원자의 과거 평가를 참고하여 보다 신뢰할 수 있는 팀원을 선별할 수 있으며, 건강한 팀 프로젝트 문화를 조성하는 데 기여합니다.

## 기술 스택

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **ORM**: SQLAlchemy (Core & ORM)
- **Data Validation**: Pydantic
- **Server**: Uvicorn
- **API Documentation**: Swagger UI (Auto-generated)

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui 기반), Lucide React (Icons)
- **State Management**: React Hooks (useState, useEffect, useContext)

### Database
- **RDBMS**: PostgreSQL

## 프로젝트 구조

```
DB_Termproject/
├── backend/                         # FastAPI 백엔드 서버
│   ├── api/
│   │   ├── deps.py                  # 의존성 주입 (DB 세션 등)
│   │   └── v1/endpoints/            # API 라우터
│   │       ├── auth.py              # 로그인/회원가입
│   │       ├── projects.py          # 프로젝트 생성/조회/수정/삭제/리뷰
│   │       ├── applications.py      # 프로젝트 지원/관리
│   │       └── profile.py           # 사용자 프로필 관리
│   ├── crud/                        # 데이터베이스 쿼리 로직 (ORM/Raw SQL)
│   │   ├── crud_auth.py
│   │   ├── crud_projects.py
│   │   ├── crud_applications.py
│   │   └── crud_profile.py
│   ├── db/                          # 데이터베이스 설정
│   │   ├── session.py               # DB 연결 세션
│   │   ├── utils.py
│   │   └── sql/                     # SQL 스크립트
│   │       ├── CreateTable.sql      # 테이블/뷰 생성 스크립트
│   │       └── App_roles_and_privileges.sql # 권한/역할 설정 스크립트
│   ├── schemas/                     # Pydantic 데이터 스키마 (Request/Response)
│   │   └── schemas.py
│   ├── main.py                      # 앱 진입점 (CORS 설정, 라우터 등록)
│   └── requirements.txt             # Python 패키지 목록
│
├── frontend/                        # Next.js 프론트엔드 클라이언트
│   ├── app/                         # App Router (페이지 라우팅)
│   │   ├── layout.tsx
│   │   └── page.tsx                 # 메인 페이지
│   ├── components/                  # UI 컴포넌트
│   │   ├── auth/                    # 인증 관련
│   │   │   ├── AuthModal.tsx        # 로그인/회원가입 모달
│   │   │   └── AuthProvider.tsx     
│   │   ├── layout/                  # 레이아웃 관련
│   │   │   ├── Navigation.tsx       
│   │   │   └── Footer.tsx           
│   │   ├── projects/                # 프로젝트 관련
│   │   │   ├── ProjectList.tsx   
│   │   │   ├── ProjectCard.tsx    
│   │   │   ├── ProjectDetail.tsx    
│   │   │   ├── CreateProject.tsx    
│   │   │   ├── MyProjects.tsx     
│   │   │   ├── ApplicantManagement.tsx 
│   │   │   └── PeerReview.tsx 
│   │   ├── applications/            # 지원 관련
│   │   │   └── MyApplications.tsx   
│   │   ├── profile/                 # 프로필 관련
│   │   │   └── ProfileManagement.tsx
│   │   └── ui/                      # UI Primitives (shadcn/ui)
│   ├── constants/                   # 상수 (스킬 목록 등)
│   ├── styles/                      
│   └── package.json                 # Node.js 패키지 목록
│
└── README.md                        # 프로젝트 설명서
```

## 개발 환경 설정

### 사전 요구 사항 (Prerequisites)
- **Python** : 3.10 이상
- **Node.js** : 18.0 이상
- **PostgreSQL** : 14.0 이상

### Backend 설정
1. **디렉토리 이동**
   ```bash
   cd backend
   ```

2. **가상환경 생성 및 활성화 (선택 사항)**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **의존성 설치**
   ```bash
   pip install -r requirements.txt
   ```

4. **데이터베이스 설정**
   - PostgreSQL 데이터베이스를 생성합니다. (예: `teample_mate_db`)
   - **생성한 데이터베이스에 접속하여** 다음 스크립트들을 순서대로 실행합니다. (반드시 `postgres`와 같은 **슈퍼유저 계정**으로 실행해야 합니다.)
     1. `backend/db/sql/CreateTable.sql`: 테이블 및 뷰 생성
     2. `backend/db/sql/App_roles_and_privileges.sql`: 역할(Role) 생성 및 권한 부여
        - *이 스크립트는 `teample_dev` 계정(비밀번호: `teample_password`)을 생성합니다.*
   - `backend/db/session.py` (또는 `.env`) 파일에서 DB 연결 정보를 수정합니다.
     - 위에서 생성된 `teample_dev` 계정 정보를 사용하는 것을 권장합니다.

5. **서버 실행**
   ```bash
   uvicorn main:app --reload
   ```
   - 서버는 `http://localhost:8000`에서 실행됩니다.
   - API 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

### Frontend 설정
1. **디렉토리 이동**
   ```bash
   cd frontend
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   - 웹 애플리케이션은 `http://localhost:3000`에서 실행됩니다.

## 데이터베이스 스키마

주요 테이블 구조는 다음과 같습니다.

| | | 
|---|---|
| **Students** | 사용자(학생) 정보 |
| **Skills** | 보유 가능한 기술 스택 목록 |
| **Student_Skills** | 학생과 스킬의 N:M 관계 | 
| **Projects** | 프로젝트 정보 | 
| **Project_Required_Skills** | 프로젝트 요구 스킬 | 
| **Applications** | 프로젝트 지원 현황 | 
| **Peer_Reviews** | 팀원 상호 평가 | 

자세한 스키마는 backend\db\sql\CreateTable.sql 참조

