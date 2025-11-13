from sqlalchemy.orm import Session
from sqlalchemy import text

# uid 중복 여부 확인 (회원가입)
def student_exists(db: Session, uid: str) -> bool:
    row = db.execute(text(
        "SELECT 1 FROM Students WHERE uid = :uid"), 
        {"uid": uid}
    ).first()
    return row is not None


def create_student(db: Session, uid: str, name: str, hashed_password: str) -> None:
    db.execute(text(
        "INSERT INTO Students (uid, name, hashed_password) VALUES (:uid, :name, :hpw)"),
        {"uid": uid, "name": name, "hpw": hashed_password}
    )
    db.execute(text("COMMIT"))


def login_student(db: Session, uid: str, password: str, verify_password_func) -> tuple | None:
    row = db.execute(text(
        "SELECT hashed_password, uid, name, email, profile_text, website_link FROM Students WHERE uid = :uid"),
        {"uid": uid}
    ).first()
    if not row:
        return None
    hashed_pw = row[0]
    if not verify_password_func(password, hashed_pw):
        return None
    # row: (hashed_password, uid, name, email, profile_text, website_link)
    return (row[1], row[2], row[3], row[4] or "", row[5] or "")