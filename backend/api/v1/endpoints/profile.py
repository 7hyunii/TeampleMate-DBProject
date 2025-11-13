from fastapi import APIRouter, status, HTTPException, Depends
from schemas.schemas import ProfileInfoResponse, ProfileUpdateRequest, MessageResponse
from sqlalchemy.orm import Session
from api.deps import get_db
from crud.crud_profile import get_student_profile_with_skills, update_student_profile

router = APIRouter(prefix="/profile", tags=["profile"])

# 프로필 정보 조회
@router.get("/info/{uid}", response_model=ProfileInfoResponse, status_code=status.HTTP_200_OK)
def get_profile(uid: str, db: Session = Depends(get_db)) -> ProfileInfoResponse:
    """
    프로필 조회
    """
    result = get_student_profile_with_skills(db, uid)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 학생을 찾을 수 없습니다.")
    return ProfileInfoResponse(**result)

# 프로필 정보 수정
@router.put("/update/{uid}", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def update_profile(uid: str, req: ProfileUpdateRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    프로필 수정
    """
    try:
        update_student_profile(db, uid, req.name, req.email, req.profile_text, req.website_link, req.skills)
        return MessageResponse(msg="프로필이 성공적으로 수정되었습니다.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))