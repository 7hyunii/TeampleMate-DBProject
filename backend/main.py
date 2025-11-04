from fastapi import FastAPI
from api.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 미들웨어 추가: 프론트엔드(다른 포트)에서 API 호출 허용
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # 또는 ["http://localhost:3000"] 등 프론트 주소만 허용 가능
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(router)
