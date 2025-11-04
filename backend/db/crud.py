# DB 관련 CRUD 함수 모음
from db.database import get_conn, put_conn


# uid 중복 여부 확인 (회원가입)
def student_exists(uid: str) -> bool:
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM Students WHERE uid=%s", (uid,))
            return cur.fetchone() is not None
    finally:
        put_conn(conn)


# 회원 정보 생성 (회원가입)
def create_student(uid: str, name: str, hashed_password: str):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO Students (uid, name, hashed_password) VALUES (%s, %s, %s)",
                (uid, name, hashed_password)
            )
            conn.commit()
    finally:
        put_conn(conn)

# 로그인 (성공 시 (name, email, profile_text, website_link) 반환, 실패 시 None)
def login_student(uid: str, password: str, verify_password_func):
    conn = get_conn()
    try:
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

# 프로필 정보 수정
def update_student_profile(uid: str, name: str, email: str, profile_text: str, website_link: str, skills=None):
    conn = get_conn()
    try:
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
            conn.commit()
    finally:
        put_conn(conn)

