from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date, datetime

def create_project_with_skills(db: Session, leader_id: str, topic: str, description1: str, description2: str,
                               capacity: int, deadline: date | datetime, skills: list[str]) -> None:
    """
    프로젝트 생성

    아래 두 작업은 하나의 Transaction으로 처리된다.	
    - 주제, 목표/설명, 모집 인원, 모집 마감일, 상태를 Projects 테이블에 INSERT
    - 프로젝트에 필요한 스킬들을 Project_Required_Skills 테이블에 INSERT
    """
    engine = db.get_bind()
    conn = engine.connect()
    try:
        conn.execute(text("BEGIN"))

        result = conn.execute(text(
            """
            INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline)
            VALUES (:leader_id, :topic, :description1, :description2, :capacity, :deadline)
            RETURNING project_id
            """
            ),
            {
                "leader_id": leader_id,
                "topic": topic,
                "description1": description1,
                "description2": description2,
                "capacity": capacity,
                "deadline": deadline,
            },
        )
        project_id = result.scalar_one_or_none()
        if project_id is None:
            raise RuntimeError("프로젝트 생성에 실패했습니다")
        
        for skill in skills:
            skill_lower = skill.lower()
            conn.execute(text(
                "INSERT INTO Skills (skill_name) VALUES (:skill_name) ON CONFLICT (skill_name) DO NOTHING"),
                {"skill_name": skill_lower},
            )
            conn.execute(text(
                "INSERT INTO Project_Required_Skills (project_id, skill_id) SELECT :project_id, skill_id FROM Skills WHERE skill_name=:skill_name"
                ),
                {"project_id": project_id, "skill_name": skill_lower},
            )

        conn.execute(text("COMMIT"))

    except Exception:
        conn.execute(text("ROLLBACK"))
        raise

    finally:
        conn.close()


def get_all_projects(db: Session, orderBy: str = "deadline", groupBy: str = "All", search: str = "") -> list[dict]:
    """
    전체 프로젝트 목록 조회
    """
    # 정렬 기준 결정
    if orderBy == "capacity":
        order_sql = "ORDER BY capacity DESC, deadline ASC"
    else:
        order_sql = "ORDER BY deadline ASC"

    like_pattern = f"%{search.strip()}%" if search and search.strip() else None

    # groupBy 조건별로 쿼리 실행
    if groupBy == "Recruiting":
        if like_pattern:
            query = text(f"SELECT * FROM RecruitingProjectsView WHERE topic ILIKE :like OR description1 ILIKE :like {order_sql}")
            res = db.execute(query, {"like": like_pattern})
        else:
            query = text(f"SELECT * FROM RecruitingProjectsView {order_sql}")
            res = db.execute(query)
    elif groupBy == "In_Progress":
        if like_pattern:
            query = text(f"SELECT * FROM InProgressProjectsView WHERE topic ILIKE :like OR description1 ILIKE :like {order_sql}")
            res = db.execute(query, {"like": like_pattern})
        else:
            query = text(f"SELECT * FROM InProgressProjectsView {order_sql}")
            res = db.execute(query)
    elif groupBy == "Completed":
        if like_pattern:
            query = text(f"SELECT * FROM CompletedProjectsView WHERE topic ILIKE :like OR description1 ILIKE :like {order_sql}")
            res = db.execute(query, {"like": like_pattern})
        else:
            query = text(f"SELECT * FROM CompletedProjectsView {order_sql}")
            res = db.execute(query)
    else:
        base_query = f"""
            SELECT p.project_id, p.leader_id, p.topic, p.description1, p.capacity, p.deadline, p.status, s.name as leader_name
            FROM Projects p
            JOIN Students s ON p.leader_id = s.uid
            WHERE NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE)
            {order_sql}
        """
        if like_pattern:
            base_query = base_query.replace(
                "WHERE NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE)",
                "WHERE NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE) AND (p.topic ILIKE :like OR p.description1 ILIKE :like)",
            )
            res = db.execute(text(base_query), {"like": like_pattern})
        else:
            res = db.execute(text(base_query))

    projects: list[dict] = []
    rows = res.fetchall()
    for row in rows:
        mapping = row._mapping
        project_id = mapping.get("project_id")
        project = {
            "project_id": project_id,
            "leader_id": mapping.get("leader_id"),
            "topic": mapping.get("topic"),
            "description1": mapping.get("description1"),
            "capacity": mapping.get("capacity"),
            "deadline": mapping.get("deadline"),
            "status": mapping.get("status"),
            "leader_name": mapping.get("leader_name"),
        }

        # 프로젝트별 요구 스킬 목록 조회
        skills_res = db.execute(text(
            "SELECT s.skill_name FROM Skills s JOIN Project_Required_Skills prs ON s.skill_id = prs.skill_id WHERE prs.project_id = :project_id"),
            {"project_id": project_id},
        )
        project["skills"] = [r[0] for r in skills_res.fetchall()]
        projects.append(project)

    if projects:
        ids = [p["project_id"] for p in projects]
        params = {f"id{i}": ids[i] for i in range(len(ids))}
        in_clause = ",".join(f":id{i}" for i in range(len(ids)))
        count_query = f"""
            SELECT m.project_id, COUNT(DISTINCT m.member_uid) AS cnt
            FROM (
                SELECT project_id, applicant_id AS member_uid FROM Applications WHERE project_id IN ({in_clause}) AND status = 'Accepted'
                UNION
                SELECT project_id, leader_id AS member_uid FROM Projects WHERE project_id IN ({in_clause})
            ) m
            GROUP BY m.project_id
            """
        count_sql = text(count_query)
        res_counts = db.execute(count_sql, params)
        rows_counts = res_counts.fetchall()
        counts_map = {r[0]: int(r[1]) for r in rows_counts}
        for p in projects:
            p["members_count"] = counts_map.get(p["project_id"], 0)

    return projects


def get_project_details(db: Session, project_id: int, applicant_id: str = None) -> dict | None:
    """
    프로젝트 상세 정보 조회
    """
    res = db.execute(text(
        """
        SELECT 
            p.project_id    AS project_id,
            p.leader_id     AS leader_id,
            s.name          AS leader_name,
            p.topic         AS topic,
            p.description1  AS description1,
            p.description2  AS description2,
            p.capacity      AS capacity,
            p.deadline      AS deadline,
            p.status        AS status
        FROM Projects p
        JOIN Students s ON p.leader_id = s.uid
        WHERE p.project_id = :project_id
        """
        ),
        {"project_id": project_id}
    )

    row_mapping = res.mappings().first()
    if not row_mapping:
        return None
    
    project = dict(row_mapping)
    
    # 요구 스킬 목록 조회
    skills_res = db.execute(text(
        "SELECT s.skill_name FROM Skills s JOIN Project_Required_Skills prs ON s.skill_id = prs.skill_id WHERE prs.project_id = :project_id"),
        {"project_id": project_id},
    )
    project["skills"] = [r[0] for r in skills_res.fetchall()]

    # 지원 가능 여부 검사
    if applicant_id:
        if applicant_id == project["leader_id"]:
            project["can_apply"] = False
        else:
            app_res = db.execute(text("SELECT 1 FROM Applications WHERE project_id=:project_id AND applicant_id=:applicant_id"), {"project_id": project_id, "applicant_id": applicant_id})
            project["can_apply"] = not bool(app_res.fetchone())
    else:
        project["can_apply"] = True

    # 프로젝트 멤버 목록 조회
    members_res = db.execute(text(
        """
        SELECT s.uid, s.name,
            COALESCE(array_agg(sk.skill_name) FILTER (WHERE sk.skill_name IS NOT NULL), ARRAY[]::text[]) AS skills
        FROM Students s
        LEFT JOIN Student_Skills ss ON ss.uid = s.uid
        LEFT JOIN Skills sk ON sk.skill_id = ss.skill_id
        WHERE s.uid IN (
            SELECT applicant_id FROM Applications WHERE project_id = :project_id AND status = 'Accepted'
            UNION
            SELECT leader_id FROM Projects WHERE project_id = :project_id
        )
        GROUP BY s.uid, s.name
        ORDER BY s.name
        """
    ), {"project_id": project_id})

    members_rows = members_res.fetchall()
    members_list: list[dict] = []
    for row in members_rows:
        mapping = row._mapping
        uid = mapping.get("uid")
        name = mapping.get("name")
        skills = mapping.get("skills") or []
        members_list.append({
            "uid": uid,
            "name": name,
            "skills": list(skills),
        })

    project["members"] = members_list

    # 멤버 수 조회 
    count_res = db.execute(text(
        "SELECT COUNT(DISTINCT a.applicant_id) AS cnt FROM Applications a WHERE a.project_id = :project_id AND a.status = 'Accepted'"
    ), {"project_id": project_id})
    count_row = count_res.fetchone()
    member_count = int(count_row[0]) if count_row and count_row[0] is not None else 0
    project["members_count"] = member_count + 1

    return project

def get_my_projects(db: Session, current_user_id: str) -> list:
    """
    현재 사용자가 리더이거나 멤버(수락된 지원자)인 프로젝트 목록 조회

    반환: 프로젝트 항목들의 리스트 (각 항목은 dict)
    """
    res = db.execute(text(
        """
        SELECT
            p.project_id,
            p.leader_id,
            p.topic AS title,
            p.status,
            p.capacity,
            p.deadline,
            (
                SELECT COUNT(DISTINCT member_uid) FROM (
                    SELECT applicant_id AS member_uid FROM Applications WHERE project_id = p.project_id AND status = 'Accepted'
                    UNION
                    SELECT leader_id AS member_uid FROM Projects WHERE project_id = p.project_id
                ) AS members
            ) AS members_count
        FROM Projects p
           WHERE (p.leader_id = :uid
             OR p.project_id IN (
                 SELECT project_id FROM Applications WHERE applicant_id = :uid AND status = 'Accepted'
             ))
            AND NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE)
        ORDER BY p.deadline ASC
        """
    ), {"uid": current_user_id})
    rows = res.fetchall()

    projects: list[dict] = []
    for row in rows:
        mapping = row._mapping
        projects.append({
            "project_id": int(mapping.get("project_id")),
            "leader_id": mapping.get("leader_id"),
            "title": mapping.get("title"),
            "status": mapping.get("status"),
            "members_count": int(mapping.get("members_count") or 0),
            "capacity": mapping.get("capacity"),
            "deadline": mapping.get("deadline"),
        })

    return projects


def update_project_status(db: Session, project_id: int, leader_id: str, new_status: str) -> bool:
    """
    프로젝트 상태 변경
    """
    # 1) 프로젝트 존재 및 리더 확인
    res = db.execute(text(
        "SELECT leader_id FROM Projects WHERE project_id = :project_id"), {"project_id": project_id})
    row = res.fetchone()
    if not row:
        return False
    project_leader = row[0]

    # 2) 권한 검증
    if project_leader != leader_id:
        raise PermissionError("권한이 없습니다. 프로젝트 리더만 상태를 변경할 수 있습니다.")

    # 3) 리더 권한으로 실제 쿼리를 실행
    engine = db.get_bind()
    conn = engine.connect()
    try:
        try:
            conn.execute(text("BEGIN"))
            conn.execute(text("SET ROLE leader"))
            update_result = conn.execute(text(
                """
                UPDATE Projects
                SET status = :new_status
                WHERE project_id = :project_id
                """
            ), 
            {
                "new_status": new_status,
                "project_id": project_id,
            })
            conn.execute(text("RESET ROLE"))
            conn.execute(text("COMMIT"))
        except Exception as e:
            conn.execute(text("ROLLBACK"))
            raise PermissionError("리더 권한 획득 또는 업데이트 실패: " + str(e))

        if update_result.rowcount == 0:
            raise ValueError("프로젝트 상태 업데이트에 실패했습니다.")
    finally:
        conn.close()

    return True


def delete_project(db: Session, project_id: int, leader_id: str) -> bool:
    """
    프로젝트 삭제
    """
    # 1) 프로젝트 존재 및 리더 확인
    res = db.execute(text("SELECT leader_id FROM Projects WHERE project_id = :project_id"), {"project_id": project_id})
    row = res.fetchone()
    if not row:
        return False
    project_leader = row[0]

    # 2) 권한 검증
    if project_leader != leader_id:
        raise PermissionError("권한이 없습니다. 프로젝트 리더만 삭제할 수 있습니다.")

    # 3) 리더 권한으로 삭제 실행
    engine = db.get_bind()
    conn = engine.connect()
    try:
        try:
            conn.execute(text("BEGIN"))
            conn.execute(text("SET ROLE leader"))

            # 트랜잭션
            # 관련된 애플리케이션 삭제
            conn.execute(text("DELETE FROM Applications WHERE project_id = :project_id"), {"project_id": project_id})
            # 관련된 요구 스킬 매핑 삭제
            conn.execute(text("DELETE FROM Project_Required_Skills WHERE project_id = :project_id"), {"project_id": project_id})
            # 프로젝트 삭제
            delete_result = conn.execute(text("DELETE FROM Projects WHERE project_id = :project_id"), {"project_id": project_id})

            conn.execute(text("RESET ROLE"))
            conn.execute(text("COMMIT"))
        except Exception as e:
            conn.execute(text("ROLLBACK"))
            raise PermissionError("리더 권한 획득 또는 삭제 실패: " + str(e))

        if delete_result.rowcount == 0:
            raise ValueError("프로젝트 삭제에 실패했습니다.")
    finally:
        conn.close()

    return True

def create_peer_review(db: Session, project_id: int, reviewer_id: str, reviewee_id: str, score: int, comment: str) -> None:
    """
    동료 리뷰 생성
    """
    # 검증: 프로젝트 존재 및 상태 확인 (완료된 프로젝트에서만 리뷰 가능)
    proj_res = db.execute(text("SELECT status FROM Projects WHERE project_id = :project_id"), {"project_id": project_id})
    proj_row = proj_res.fetchone()
    if not proj_row:
        raise ValueError("해당 프로젝트를 찾을 수 없습니다.")
    proj_status = proj_row[0]
    if proj_status != 'Completed':
        raise ValueError("프로젝트가 완료된 후에만 리뷰를 작성할 수 있습니다.")

    # 리뷰 추가
    db.execute(text(
        """
        INSERT INTO Peer_Reviews (project_id, reviewer_id, reviewee_id, score, comment)
        VALUES (:project_id, :reviewer_id, :reviewee_id, :score, :comment)
        """
    ),
    {
        "project_id": project_id,
        "reviewer_id": reviewer_id,
        "reviewee_id": reviewee_id,
        "score": score,
        "comment": comment,
    })

    db.execute(text("COMMIT"))