"""
SQLAlchemy 기반 DB 세션 관리

이 파일은 ORM(=SQLAlchemy)을 사용할 때 앱 전반에서 재사용할 Engine과 SessionLocal을 제공하고,
FastAPI 의존성으로 사용할 `get_db()` 제너레이터를 노출합니다.
"""
import os
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# .env 파일에서 환경변수 로드
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# DB 접속 정보 (환경변수에서 불러옴)
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = int(os.getenv("POSTGRES_PORT"))

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"


engine = create_engine(DATABASE_URL, echo=False, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False, future=True)

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI 의존성으로 사용할 세션 생성/반환 제너레이터.
    - 엔드포인트 호출 시 SessionLocal()로 세션을 만들고 yield
    - 엔드포인트가 끝나면 finally에서 세션을 close() 해 리소스 해제
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# def init_db(base_metadata) -> None:
#     """
#     현재는 CreateTable.sql을 사용하므로 필요시 구현할 예정
#     """
#     return
