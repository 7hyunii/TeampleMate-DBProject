# frontend 폴더 구조

이 프로젝트는 Next.js(Typescript) 기반의 프론트엔드입니다.

## 주요 폴더 및 파일 구조

```
frontend/
├── app/                  # Next.js app directory (라우트, 레이아웃)
│   ├── layout.tsx
│   └── page.tsx
├── components/           # 재사용 가능한 컴포넌트
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── ...
│   ├── figma/            # 피그마 관련 컴포넌트
│   │   └── ImageWithFallback.tsx
│   └── ui/               # UI 단위 컴포넌트(버튼, 입력 등)
│       ├── button.tsx
│       ├── input.tsx
│       ├── ...
├── public/               # 정적 파일(이미지 등)
├── styles/               # 글로벌 스타일(CSS)
│   └── globals.css
├── package.json          # 프로젝트 의존성 및 스크립트
├── tsconfig.json         # 타입스크립트 설정
├── next.config.ts        # Next.js 설정
└── README.md             # 프로젝트 설명 파일
```

## 개발 및 실행 방법

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 기타
- 컴포넌트는 목적별로 파일이 분리되어 있습니다.
- UI 컴포넌트는 `components/ui/`에, 페이지/기능별 컴포넌트는 `components/`에 위치합니다.
- 정적 파일은 `public/`에, 글로벌 스타일은 `styles/`에 위치합니다.
