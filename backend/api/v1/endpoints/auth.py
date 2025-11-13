from fastapi import APIRouter, status, HTTPException, Depends
from schemas.schemas import SignupRequest, MessageResponse, LoginRequest, LoginResponse
from sqlalchemy.orm import Session
from api.deps import get_db
from crud.crud_auth import student_exists, create_student, login_student
from db.utils import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    회원가입
    """
    if student_exists(db, req.uid):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 존재하는 아이디입니다.")
    hashed = hash_password(req.password)
    create_student(db, req.uid, req.name, hashed)
    return MessageResponse(msg="회원가입 성공")

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(req: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    """
    로그인
    """
    result = login_student(db, req.uid, req.password, verify_password)
    if not result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="아이디 또는 비밀번호가 올바르지 않습니다.")
    uid, name, email, profile_text, website_link = result
    return LoginResponse(
        msg=f"{name} 님 환영합니다",
        uid=uid,
        name=name,
        email=email,
        profile_text=profile_text,
        website_link=website_link
    )