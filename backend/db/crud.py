# DB 쿼리 및 데이터 처리

# DB 연결 함수 import
from db.database import get_conn, put_conn


# 회원가입 시 아이디 중복 확인 함수
def student_exists(uid: str) -> bool:
    conn = get_conn()  # DB 커넥션 가져오기
    try:
        with conn.cursor() as cur:  # 커서 생성
            # uid가 이미 존재하는지 확인
            cur.execute("SELECT 1 FROM Students WHERE uid=%s", (uid,))
            return cur.fetchone() is not None  # 결과가 있으면 True, 없으면 False
    finally:
        put_conn(conn)  # 커넥션 반환


# 회원 정보 생성 함수 (회원가입 시 호출)
def create_student(uid: str, name: str, hashed_password: str):
    conn = get_conn()  # DB 커넥션 가져오기
    try:
        with conn.cursor() as cur:
            # Students 테이블에 새 회원 정보 INSERT
            cur.execute(
                "INSERT INTO Students (uid, name, hashed_password) VALUES (%s, %s, %s)",
                (uid, name, hashed_password)
            )
            conn.commit()  # 변경사항 저장
    finally:
        put_conn(conn)  # 커넥션 반환


# 로그인 시 비밀번호 해시와 이름을 조회하는 함수
def get_student_password_and_name(uid: str):
    conn = get_conn()  # DB 커넥션 가져오기
    try:
        with conn.cursor() as cur:  # 커서 생성
            # uid로 비밀번호 해시와 이름 조회
            cur.execute("SELECT hashed_password, name FROM Students WHERE uid=%s", (uid,))
            return cur.fetchone()  # (hashed_password, name) 튜플 반환
    finally:
        put_conn(conn)  # 커넥션 반환
