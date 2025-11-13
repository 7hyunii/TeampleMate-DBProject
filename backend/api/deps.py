from typing import Generator
from sqlalchemy.orm import Session
from db.session import get_db as _get_db

def get_db() -> Generator[Session, None, None]:
	"""
    프로젝트의 DB 세션 의존성을 재노출
	"""
	yield from _get_db()
