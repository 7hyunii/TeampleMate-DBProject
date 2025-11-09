# 요청 파라미터 검증, 응답 반환
from tkinter.tix import STATUS
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.utils import hash_password, verify_password
from db.crud_read import student_exists, login_student, get_student_profile_with_skills, get_all_projects, get_project_details
from db.crud_write import create_student, update_student_profile, create_project_with_skills, apply_to_project
router = APIRouter()

class SignupRequest(BaseModel):
    uid: str
    password: str
    name: str

class LoginRequest(BaseModel):
    uid: str
    password: str

# 프로필 수정 요청 모델
class ProfileUpdateRequest(BaseModel):
    uid: str
    name: str
    email: str = ""
    profile_text: str = ""
    website_link: str = ""
    skills: list[str] = []

# 프로젝트 생성 요청 모델
class ProjectCreateRequest(BaseModel):
    leader_id: str
    topic: str
    description1: str
    description2: str
    capacity: int
    deadline: str
    skills: list[str]

class ApplicationRequest(BaseModel):
    project_id: int
    applicant_id: str
    applicant_date: str
    motivation: str


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
            {
                "path": "/profile",
                "method": "GET",
                "desc": "프로필 조회",
                "params": {
                    "uid": "학생 고유 아이디 (string, 필수)"
                },
                "example": "/profile?uid=your_id",
                "response": "{ uid, name, email, profile_text, website_link, skills: [...] }"
            },
            {"path": "/profile/update", "method": "PATCH", "desc": "프로필 수정"},
            {"path": "/project", "method": "POST", "desc": "프로젝트 생성"},
            {
                "path": "/projects",
                "method": "GET",
                "desc": "프로젝트 탐색 화면 (View 기반 필터링)",
                "params": {
                    "orderBy": "정렬 기준 (string, default: deadline, values: deadline, capacity)",
                    "groupBy": "상태별 필터링 (string, default: All, values: All, Recruiting, In_Progress, Completed)",
                    "search": "검색어 (string, optional)"
                },
                "example": "/projects?orderBy=capacity&groupBy=Recruiting&search=AI",
                "response": "{ projects: [...] }"
            },
            {"path": "/projects/{project_id}", "method": "GET", "desc": "프로젝트 상세 정보 조회"},
            {"path": "/apply", "method": "POST", "desc": "프로젝트 지원"}
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
    result = login_student(req.uid, req.password, verify_password)
    if not result:
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다.")
    uid, name, email, profile_text, website_link = result
    return {
        "msg": f"{name} 님 환영합니다",
        "uid": uid,
        "name": name,
        "email": email,
        "profile_text": profile_text,
        "website_link": website_link,
    }

@router.get("/health")
def health_check():
    """
    서버 헬스 체크용 엔드포인트
    """
    return {"status": "ok"}


# 프로필 정보 조회
@router.get("/profile")
def get_profile(uid: str):
    result = get_student_profile_with_skills(uid)
    if not result:
        raise HTTPException(status_code=404, detail="해당 학생을 찾을 수 없습니다.")
    return result

# 프로필 정보 수정
@router.patch("/profile/update")
def update_profile(req: ProfileUpdateRequest):
    try:
        update_student_profile(req.uid, req.name, req.email, req.profile_text, req.website_link, req.skills)
        return {"msg": "프로필이 성공적으로 수정되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# 프로젝트 생성
@router.post("/project")
def create_project(req: ProjectCreateRequest):
    try:
        create_project_with_skills(
            req.leader_id, req.topic, req.description1, req.description2, req.capacity, req.deadline, req.skills
        )
        return {"msg": "프로젝트가 성공적으로 생성되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 프로젝트 탐색 화면
@router.get("/projects")
def get_projects(orderBy: str = "deadline", groupBy: str = "All", search: str = ""):
    """
    프로젝트 목록 조회 (View 기반 상태별 필터링)
    
    - orderBy: 정렬 기준 (deadline/capacity)
    - groupBy: 상태별 필터링 (All/Recruiting/In_Progress/Completed)
    - search: 검색어 (string, optional)
    """
    try:
        projects = get_all_projects(orderBy, groupBy, search)
        return {"projects": projects}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/projects/{project_id}")
def get_details(project_id: int, applicant_id: str = None):
    """
    프로젝트 상세 정보 조회
    """
    result = get_project_details(project_id, applicant_id)
    if not result:
        raise HTTPException(status_code=404, detail="해당 프로젝트를 찾을 수 없습니다.")
    return result

@router.post("/apply")
def apply_project(req: ApplicationRequest):
    """
    프로젝트 지원
    """
    try:
        apply_to_project(req.project_id, req.applicant_id, req.applicant_date, req.motivation)
        return {"msg": "지원이 완료되었습니다."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="서버 오류: " + str(e))
