from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.profile import router as profile_router
from api.v1.endpoints.projects import router as projects_router
from api.v1.endpoints.applications import router as applications_router

app = FastAPI()

# CORS 미들웨어 추가: 프론트엔드(다른 포트)에서 API 호출 허용
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # 또는 ["http://localhost:3000"] 등 프론트 주소만 허용 가능
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(projects_router)
app.include_router(applications_router)
