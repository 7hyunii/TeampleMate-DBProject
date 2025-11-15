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