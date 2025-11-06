# Transaction X)
from db.database import get_conn, put_conn


# uid 중복 여부 확인 (회원가입)
def student_exists(uid: str) -> bool:
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM Students WHERE uid=%s", (uid,))
                return cur.fetchone() is not None
    finally:
        put_conn(conn)


# 로그인
def login_student(uid: str, password: str, verify_password_func):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:  
                cur.execute("SELECT hashed_password, name, email, profile_text, website_link FROM Students WHERE uid=%s", (uid,))
                row = cur.fetchone()
                if not row or not verify_password_func(password, row[0]):
                    return None
                return (row[1], row[2], row[3] or "", row[4] or "")
    finally:
        put_conn(conn)


# 학생 프로필 정보 조회
def get_student_profile_with_skills(uid: str):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT name, email, profile_text, website_link FROM Students WHERE uid=%s", (uid,))
                row = cur.fetchone()
                if not row:
                    return None
                name, email, profile_text, website_link = row
                cur.execute("""
                    SELECT s.skill_name FROM Skills s
                    JOIN Student_Skills ss ON s.skill_id = ss.skill_id
                    WHERE ss.uid = %s
                """, (uid,))
                skills = [r[0] for r in cur.fetchall()]
                return {
                    "uid": uid,
                    "name": name,
                    "email": email,
                    "profile_text": profile_text,
                    "website_link": website_link,
                    "skills": skills
                }
    finally:
        put_conn(conn)


# 전체 프로젝트 목록 조회
def get_all_projects(orderBy: str = "deadline", groupBy: str = "All", search: str = ""):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                # 정렬 기준 결정
                if orderBy == "capacity":
                    order_sql = "ORDER BY capacity DESC, deadline ASC"
                else:
                    order_sql = "ORDER BY deadline ASC"

                # 검색어가 있을 경우 like_pattern 생성
                like_pattern = f"%{search.strip()}%" if search and search.strip() else None

                # groupBy 조건별로 쿼리 실행
                if groupBy == "Recruiting":  # 모집중 프로젝트만 조회 (view 사용)
                    if like_pattern:  # 검색어가 있을 때: topic 또는 description1에 대해 검색
                        query = f"SELECT * FROM RecruitingProjectsView WHERE topic ILIKE %s OR description1 ILIKE %s {order_sql}"
                        cur.execute(query, (like_pattern, like_pattern))
                    else:   # 검색어 없이 전체 모집중 프로젝트 조회
                        query = f"SELECT * FROM RecruitingProjectsView {order_sql}"
                        cur.execute(query)
                elif groupBy == "In_Progress":  # 진행중 프로젝트만 조회 (view 사용)
                    if like_pattern:    # 검색어가 있을 때: topic 또는 description1에 대해 검색
                        query = f"SELECT * FROM InProgressProjectsView WHERE topic ILIKE %s OR description1 ILIKE %s {order_sql}"
                        cur.execute(query, (like_pattern, like_pattern))
                    else:   # 검색어 없이 전체 진행중 프로젝트 조회
                        query = f"SELECT * FROM InProgressProjectsView {order_sql}"
                        cur.execute(query)
                elif groupBy == "Completed":  # 완료된 프로젝트만 조회 (view 사용)
                    if like_pattern:    # 검색어가 있을 때: topic 또는 description1에 대해 검색
                        query = f"SELECT * FROM CompletedProjectsView WHERE topic ILIKE %s OR description1 ILIKE %s {order_sql}"
                        cur.execute(query, (like_pattern, like_pattern))
                    else:   # 검색어 없이 전체 완료 프로젝트 조회
                        query = f"SELECT * FROM CompletedProjectsView {order_sql}"
                        cur.execute(query)
                else:   # 전체 프로젝트(상태 제한 없음) 조회
                    query = f"""
                        SELECT p.project_id, p.leader_id, p.topic, p.description1, p.capacity, p.deadline, p.status, s.name as leader_name
                        FROM Projects p
                        JOIN Students s ON p.leader_id = s.uid
                        WHERE NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE)
                        {order_sql}
                    """
                    if like_pattern:
                        # 검색어가 있을 때: topic 또는 description1에 대해 검색
                        query = query.replace("WHERE NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE)",
                            "WHERE NOT (p.status = 'Recruiting' AND p.deadline < CURRENT_DATE) AND (p.topic ILIKE %s OR p.description1 ILIKE %s)")
                        cur.execute(query, (like_pattern, like_pattern))
                    else:
                        # 검색어 없이 전체 프로젝트 조회
                        cur.execute(query)
                
                projects = []
                for row in cur.fetchall():
                    project = {
                        "project_id": row[0],
                        "leader_id": row[1],
                        "topic": row[2],
                        "description1": row[3],
                        "capacity": row[4],
                        "deadline": row[5],
                        "status": row[6],
                        "leader_name": row[7]
                    }

                    # 프로젝트별 요구 스킬 목록 조회
                    cur2 = conn.cursor()
                    cur2.execute(
                        """
                        SELECT s.skill_name FROM Skills s
                        JOIN Project_Required_Skills prs ON s.skill_id = prs.skill_id
                        WHERE prs.project_id = %s
                        """, (row[0],)
                    )
                    project["skills"] = [r[0] for r in cur2.fetchall()]
                    cur2.close()
                    projects.append(project)
                return projects
    finally:
        put_conn(conn)

