from fastapi import APIRouter, status, HTTPException, Depends
from schemas.schemas import ApplicationRequest, MessageResponse, MyApplicationsResponse, ApplicationsManagementResponse, ApplicationStatusUpdateRequest
from sqlalchemy.orm import Session
from api.deps import get_db
from crud.crud_applications import apply_to_project, get_applications_by_applicant, get_applications_by_project, update_application_status

router = APIRouter(tags=["applications"])


@router.post("/projects/{project_id}/apply", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def apply_project(project_id: int, req: ApplicationRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    프로젝트 지원
    """
    try:
        apply_to_project(db, project_id, req.applicant_id, req.applicant_date, req.motivation)
        return MessageResponse(msg="지원이 완료되었습니다.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="서버 오류: " + str(e))

@router.get("/applications/me", response_model=MyApplicationsResponse, status_code=status.HTTP_200_OK)
def get_my_applications(current_user_id: str, db: Session = Depends(get_db)) -> MyApplicationsResponse:
    """
    내 지원 현황 조회
    """
    try:
        applications = get_applications_by_applicant(db, current_user_id)
        return MyApplicationsResponse(applications=applications)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="서버 오류: " + str(e))

@router.get("/projects/{project_id}/applications", response_model=ApplicationsManagementResponse, status_code=status.HTTP_200_OK)
def get_project_applications(project_id: int, current_user_id: str, db: Session = Depends(get_db)) -> ApplicationsManagementResponse:
    """
    프로젝트에 대한 지원자 목록 조회 (리더 전용)
    """
    try:
        try:
            applications = get_applications_by_project(db, project_id, current_user_id)
        except PermissionError as e:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

        if not applications:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="해당 프로젝트에 대한 지원 내역이 없습니다.")
        return ApplicationsManagementResponse(applications=applications)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="서버 오류: " + str(e))
    
@router.put("/projects/{project_id}/applications/{applicant_id}/status", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def update_application_status_endpoint(project_id: int, applicant_id: str, req: ApplicationStatusUpdateRequest, db: Session = Depends(get_db)) -> MessageResponse:
    """
    지원 상태 업데이트 (리더 전용)
    """
    try:
        update_application_status(db, project_id, applicant_id, req.new_status, req.leader_id)
        return MessageResponse(msg="지원 상태가 성공적으로 업데이트되었습니다.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="서버 오류: " + str(e))
    