from sqlalchemy.orm import Session
from sqlalchemy import text

# 학생 프로필 정보 조회
def get_student_profile_with_skills(db: Session, uid: str) -> dict | None:
    row = db.execute(text(
        "SELECT name, email, profile_text, website_link FROM Students WHERE uid = :uid"),
        {"uid": uid}
    ).first()
    if not row:
        return None
    name, email, profile_text, website_link = row[0], row[1], row[2], row[3]

    skills_result = db.execute(text(
        """
        SELECT s.skill_name FROM Skills s
        JOIN Student_Skills ss ON s.skill_id = ss.skill_id
        WHERE ss.uid = :uid
        """),
        {"uid": uid}
    )
    skills = [r[0] for r in skills_result.fetchall()]

    return {
        "uid": uid,
        "name": name,
        "email": email,
        "profile_text": profile_text,
        "website_link": website_link,
        "skills": skills
    }


# 프로필 정보 수정
def update_student_profile(db: Session, uid: str, name: str, email: str, profile_text: str, website_link: str, skills=None):
    """
    다음 작업들을 하나의 트랜잭션으로 실행
      1) Students 테이블 업데이트
      2) Skills 테이블에 없는 스킬은 삽입(ON CONFLICT DO NOTHING)
      3) Student_Skills를 갱신(DELETE 후 INSERT)
    """
    # 커넥션 레벨 트랜잭션
    engine = db.get_bind()
    conn = engine.connect()
    try:
        conn.execute(text("BEGIN"))

        # 1) 프로필 정보 업데이트
        result = conn.execute(text(
            """
            UPDATE Students
            SET name = :name, email = :email, profile_text = :profile_text, website_link = :website_link
            WHERE uid = :uid
            """
        ),
        {
            "name": name,
            "email": email,
            "profile_text": profile_text,
            "website_link": website_link,
            "uid": uid,
        },)
        
        if result.rowcount == 0:
            raise Exception("해당 학생을 찾을 수 없습니다.")

        # 2) Skills 테이블에 필요한 스킬 삽입 (중복 무시)
        if skills is not None:
            for skill in skills:
                conn.execute(text(
                    "INSERT INTO Skills (skill_name) VALUES (:skill) ON CONFLICT (skill_name) DO NOTHING"
                ), {"skill": skill.lower()})

            # 3) Student_Skills -> 전체 삭제 후 다시 추가
            conn.execute(text("DELETE FROM Student_Skills WHERE uid = :uid"), {"uid": uid})
            for skill in skills:
                conn.execute(text(
                    "INSERT INTO Student_Skills (uid, skill_id) SELECT :uid, skill_id FROM Skills WHERE skill_name = :skill"
                ), {"uid": uid, "skill": skill.lower()})

        conn.execute(text("COMMIT"))

    except Exception:
        conn.execute(text("ROLLBACK"))
        raise

    finally:
        conn.close()