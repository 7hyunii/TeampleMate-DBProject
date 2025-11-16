from fastapi import APIRouter, status, HTTPException, Depends
from schemas.schemas import (
    ProjectCreateRequest,
    MessageResponse,
    ProjectListRequest,
    ProjectListResponse,
    ProjectListItem,
    ProjectDetailsResponse,
    MyProjectListItem,
    MyProjectListResponse,
    ProjectStatusUpdateRequest,
    ProjectDeleteRequest
)
from sqlalchemy.orm import Session
from api.deps import get_db
from crud.crud_projects import (
    create_project_with_skills,
    get_all_projects,
    get_project_details,
    get_my_projects,
    update_project_status,
    delete_project,
)

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/new", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_project(req: ProjectCreateRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    프로젝트 생성
    """
    try:
        create_project_with_skills(
            db, req.leader_id, req.topic, req.description1, req.description2, req.capacity, req.deadline, req.skills
        )
        return MessageResponse(msg="프로젝트가 성공적으로 생성되었습니다.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/list", response_model=ProjectListResponse, status_code=status.HTTP_200_OK)
def get_projects(req: ProjectListRequest = Depends(), db: Session = Depends(get_db)) -> ProjectListResponse:
    """
    프로젝트 목록 조회 (View 기반 상태별 필터링)
    
    - orderBy: 정렬 기준 (deadline/capacity)
    - groupBy: 상태별 필터링 (All/Recruiting/In_Progress/Completed)
    - search: 검색어 (string, optional)
    """
    try:
        projects = get_all_projects(db, req.orderBy.value, req.groupBy.value, req.search)
        items = [ProjectListItem(**p) for p in projects]
        return ProjectListResponse(projects=items)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/me", response_model=MyProjectListResponse, status_code=status.HTTP_200_OK)
def get_mine(current_user_id: str, db: Session = Depends(get_db)) -> MyProjectListResponse:
    """
    내 프로젝트 목록 조회

    자신이 리더, 멤버인 프로젝트들 모두 반환
    """
    try:
        results = get_my_projects(db, current_user_id)
        items = [MyProjectListItem(**p) for p in results]
        return MyProjectListResponse(projects=items)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{project_id}", response_model=ProjectDetailsResponse, status_code=status.HTTP_200_OK)
def get_details(project_id: int, applicant_id: str = None, db: Session = Depends(get_db)) -> ProjectDetailsResponse:
    """
    프로젝트 상세 정보 조회
    """
    result = get_project_details(db, project_id, applicant_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 프로젝트를 찾을 수 없습니다.")
    return ProjectDetailsResponse(**result)


@router.put("/{project_id}/status", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def put_project_status(project_id: int, req: ProjectStatusUpdateRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    프로젝트 상태를 리더가 변경합니다.
    """
    try:
        updated = update_project_status(db, project_id, req.leader_id, req.new_status)
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 프로젝트를 찾을 수 없습니다.")
        return MessageResponse(msg="프로젝트 상태가 업데이트되었습니다.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{project_id}", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def delete_project_endpoint(project_id: int, req: ProjectDeleteRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    프로젝트 삭제 (지원자를 아무도 승인하지 않았을 때, 리더만 가능).
    """
    try:
        deleted = delete_project(db, project_id, req.leader_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 프로젝트를 찾을 수 없습니다.")
        return MessageResponse(msg="프로젝트가 삭제되었습니다.")
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
