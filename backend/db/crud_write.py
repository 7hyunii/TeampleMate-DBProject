# Transaction O (with commit/rollback)
from db.database import get_conn, put_conn
from db.crud_read import get_project_details

# 회원 정보 생성 (회원가입)
def create_student(uid: str, name: str, hashed_password: str):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO Students (uid, name, hashed_password) VALUES (%s, %s, %s)",
                    (uid, name, hashed_password)
                )
    finally:
        put_conn(conn)


# 프로필 정보 수정
def update_student_profile(uid: str, name: str, email: str, profile_text: str, website_link: str, skills=None):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                # 프로필 정보 수정
                cur.execute(
                    """
                    UPDATE Students
                    SET name=%s, email=%s, profile_text=%s, website_link=%s
                    WHERE uid=%s
                    """,
                    (name, email, profile_text, website_link, uid)
                )
                if cur.rowcount == 0:
                    raise Exception("해당 학생을 찾을 수 없습니다.")

                # 스킬 수정 (skills 파라미터가 있을 때만)
                if skills is not None:
                    for skill in skills:
                        cur.execute(    # Skills 테이블의 skill_id 가 연속적이지 않을 수 있는 이유
                            "INSERT INTO Skills (skill_name) VALUES (%s) ON CONFLICT (skill_name) DO NOTHING",
                            (skill.lower(),)
                        )
                    # Student_Skills -> 전체 삭제 후 다시 추가
                    cur.execute("DELETE FROM Student_Skills WHERE uid=%s", (uid,))
                    for skill in skills:
                        cur.execute(
                            "INSERT INTO Student_Skills (uid, skill_id) SELECT %s, skill_id FROM Skills WHERE skill_name=%s",
                            (uid, skill.lower())
                        )
    finally:
        put_conn(conn)


# 프로젝트 생성
def create_project_with_skills(leader_id, topic, description1, description2, capacity, deadline, skills):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                # 프로젝트 정보 INSERT (생성된 project_id 반환)
                cur.execute(
                    """
                    INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING project_id
                    """,
                    (leader_id, topic, description1, description2, capacity, deadline)
                )
                project_id = cur.fetchone()[0]  # 생성된 프로젝트 ID 
                # 스킬 등록, 프로젝트-스킬 매핑
                for skill in skills:
                    # Skills 테이블에 없으면 추가
                    cur.execute(
                        "INSERT INTO Skills (skill_name) VALUES (%s) ON CONFLICT (skill_name) DO NOTHING",
                        (skill.lower(),)
                    )
                    # Project_Required_Skills에 (project_id, skill_id) 매핑
                    cur.execute(
                        "INSERT INTO Project_Required_Skills (project_id, skill_id) SELECT %s, skill_id FROM Skills WHERE skill_name=%s",
                        (project_id, skill.lower())
                    )
    finally:
        put_conn(conn)

# 프로젝트 지원
def apply_to_project(project_id: int, applicant_id: str, applicant_date: str, motivation: str):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation) VALUES (%s, %s, %s, %s)",
                    (project_id, applicant_id, applicant_date, motivation)
                )
    finally:
        put_conn(conn)