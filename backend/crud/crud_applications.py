from sqlalchemy.orm import Session
from sqlalchemy import text

def apply_to_project(db: Session, project_id: int, applicant_id: str, applicant_date: str, motivation: str) -> None:
    """
    프로젝트 지원
    """
    db.execute(text(
        """
        INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation)
        VALUES (:project_id, :applicant_id, :applicant_date, :motivation)
        """
        ),
        {
            "project_id": project_id,
            "applicant_id": applicant_id,
            "applicant_date": applicant_date,
            "motivation": motivation,
        },
    )
    db.commit()


def get_applications_by_applicant(db: Session, current_user_id: str) -> list[dict] | None:
    """
    내 지원 현황 조회
    """
    result = db.execute(text(
        """
        SELECT 
            a.application_id    AS application_id,
            a.project_id        AS project_id,
            p.topic             AS project_topic,
            s.uid               AS project_leader_id,
            s.name              AS project_leader_name,
            a.applicant_date    AS applicant_date,
            a.motivation        AS motivation,
            a.status            AS status
        FROM Applications a
            JOIN Projects p ON a.project_id = p.project_id
            JOIN Students s ON p.leader_id = s.uid
        WHERE a.applicant_id = :current_user_id
        ORDER BY a.applicant_date DESC
        """
    ), 
    {"current_user_id": current_user_id}
    )

    rows = result.mappings().all()
    applications = [dict(r) for r in rows]
    return applications


def get_applications_by_project(db: Session, project_id: int, current_user_id: str) -> list[dict]:
    """
    프로젝트에 대한 지원자 목록 조회 (리더 전용)
    - 호출자의 uid가 프로젝트의 leader_id와 다르면 PermissionError 발생
    """
    # 1) 프로젝트 존재 및 리더 확인
    leader_res = db.execute(text("SELECT leader_id FROM Projects WHERE project_id = :project_id"), {"project_id": project_id})
    leader_row = leader_res.fetchone()
    if not leader_row:
        return None
    leader_id = leader_row[0]

    # 2) 권한 검증: 호출자가 리더가 아니면 권한 오류 발생
    if current_user_id != leader_id:
        raise PermissionError("권한이 없습니다. 프로젝트 리더만 접근할 수 있습니다.")

    # 3) 리더이면 뷰에서 지원자 목록 조회
    # 리더 권한으로 실제 쿼리를 실행: 동일한 물리적 연결에서 SET ROLE leader 후 조회
    engine = db.get_bind()
    conn = engine.connect()
    try:
        try:
            conn.execute(text("BEGIN"))
            conn.execute(text("SET ROLE leader"))
            result = conn.execute(text(
                "SELECT * FROM ProjectApplicantsView WHERE project_id = :project_id ORDER BY applicant_date DESC"
            ), {"project_id": project_id})
            conn.execute(text("RESET ROLE"))
            conn.execute(text("COMMIT"))
        except Exception as e:
            # SET ROLE 실패나 SELECT 권한 문제 등은 권한 문제로 간주
            conn.execute(text("ROLLBACK"))
            raise PermissionError("리더 권한 획득 또는 조회 실패: " + str(e))

        rows = result.mappings().all()
    finally:
        conn.close()
    if not rows:
        return []

    applications = [dict(r) for r in rows]
    return applications

def update_application_status(db: Session, project_id: int, applicant_id: str, new_status: str, leader_id: str) -> None:
    """
    지원 상태 업데이트 (리더 전용)
    """
    # 1) 지원 정보 조회 (프로젝트 리더인지도 함께 확인)
    result = db.execute(text(
        """
        SELECT p.leader_id
        FROM Applications a JOIN Projects p ON a.project_id = p.project_id
        WHERE a.applicant_id = :applicant_id AND a.project_id = :project_id
        """
    ), {"applicant_id": applicant_id, "project_id": project_id})
    # bind project_id as well
    row = result.fetchone()
    if not row:
        raise ValueError("해당 지원자를 찾을 수 없습니다.")
    project_leader_id = row[0]

    # 2) 권한 검증: 호출자가 리더가 아니면 권한 오류 발생
    if leader_id != project_leader_id:
        raise PermissionError("권한이 없습니다. 프로젝트 리더만 지원 상태를 변경할 수 있습니다.")

    # 3) 지원 상태 업데이트
    # 리더 권한으로 실제 쿼리를 실행: 동일한 물리적 연결에서 SET ROLE leader 후 UPDATE
    engine = db.get_bind()
    conn = engine.connect()
    try:
        try:
            conn.execute(text("BEGIN"))
            conn.execute(text("SET ROLE leader"))
            update_result = conn.execute(text(
                """
                UPDATE Applications
                SET status = :new_status
                WHERE applicant_id = :applicant_id AND project_id = :project_id
                """
            ), {
                "new_status": new_status,
                "applicant_id": applicant_id,
                "project_id": project_id,
            })
            conn.execute(text("RESET ROLE"))
            conn.execute(text("COMMIT"))
        except Exception as e:
            # SET ROLE 실패나 UPDATE 권한 문제 등은 권한 문제로 간주
            conn.execute(text("ROLLBACK"))
            raise PermissionError("리더 권한 획득 또는 업데이트 실패: " + str(e))

        if update_result.rowcount == 0:
            raise ValueError("지원 상태 업데이트에 실패했습니다.")
    finally:
        conn.close()