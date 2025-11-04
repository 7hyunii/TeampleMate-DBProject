
# 요청 파라미터 검증, 응답 반환
import email
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from db.utils import hash_password, verify_password
from db.crud import student_exists, create_student, get_student_password_and_name
# 로그인 시 모든 프로필 정보 반환 (이름, 이메일, 자기소개, 사이트)
from db.database import get_conn, put_conn

router = APIRouter()

class SignupRequest(BaseModel):
    uid: str
    password: str
    name: str

class LoginRequest(BaseModel):
    uid: str
    password: str

# 프로필 수정 요청 모델 및 엔드포인트
class ProfileUpdateRequest(BaseModel):
    uid: str
    name: str
    email: str = ""
    profile_text: str = ""
    website_link: str = ""


@router.get("/")
def root():
    """
    API 서버 루트: 안내 메시지와 주요 엔드포인트 목록 반환
    """
    return {
        "message": "TeampleMate API 서버입니다.",
        "endpoints": [
            {"path": "/signup", "method": "POST", "desc": "회원가입"},
            {"path": "/login", "method": "POST", "desc": "로그인"},
            {"path": "/health", "method": "GET", "desc": "서버 헬스체크"},
            {"path": "/profile/update", "method": "PATCH", "desc": "프로필 수정"}
        ]
    }

@router.post("/signup")
def signup(req: SignupRequest):
    if student_exists(req.uid):
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")
    hashed = hash_password(req.password)
    create_student(req.uid, req.name, hashed)
    return {"msg": "회원가입 성공"}

@router.post("/login")
def login(req: LoginRequest):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT hashed_password, name, email, profile_text, website_link FROM Students WHERE uid=%s", (req.uid,))
            row = cur.fetchone()
            if not row or not verify_password(req.password, row[0]):
                raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다.")
            # row: (hashed_password, name, uid, profile_text, website_link)
            return {
                "msg": f"{row[1]} 님 환영합니다",
                "name": row[1],
                "email": row[2],
                "profile_text": row[3] or "",
                "website_link": row[4] or ""
            }
    finally:
        put_conn(conn)

@router.get("/health")
def health_check():
    """
    서버 헬스 체크용 엔드포인트
    """
    return {"status": "ok"}


@router.patch("/profile/update")
def update_profile(req: ProfileUpdateRequest):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE Students
                SET name=%s, email=%s, profile_text=%s, website_link=%s
                WHERE uid=%s
                """,
                (req.name, req.email, req.profile_text, req.website_link, req.uid)
            )
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="해당 학생을 찾을 수 없습니다.")
            conn.commit()
            return {"msg": "프로필이 성공적으로 수정되었습니다."}
    finally:
        put_conn(conn)