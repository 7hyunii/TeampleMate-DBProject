# 비밀번호 해싱 
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # bcrypt는 72자(문자)까지만 지원하므로 초과 시 잘라서 해시
    return pwd_context.hash(password[:72])

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
