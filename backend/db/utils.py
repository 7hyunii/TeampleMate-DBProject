# 비밀번호 해싱 
import bcrypt

def hash_password(password: str) -> str:
    # bcrypt는 72자(문자)까지만 지원하므로 초과 시 잘라서 해시
    # 문자열을 바이트로 인코딩
    pwd_bytes = password[:72].encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    # DB 저장을 위해 문자열로 디코딩하여 반환
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    # 검증을 위해 바이트로 변환
    pwd_bytes = plain.encode('utf-8')
    hashed_bytes = hashed.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)
