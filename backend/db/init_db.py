import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def init_db():
    """
    서버 시작 시 DB 초기화 로직
    1. postgres DB 접속 -> Role 생성, Target DB 생성
    2. Target DB 접속 -> Table 생성, 권한 부여
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sql_dir = os.path.join(base_dir, "sql")

    # 관리자 계정 (기본값: postgres)
    admin_user = os.getenv("ADMIN_USER", "postgres")
    admin_password = os.getenv("ADMIN_PASSWORD")
    
    # 타겟 DB 정보
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    target_db_name = os.getenv("POSTGRES_DB", "teamplemate_db")

    # 관리자 DB(postgres) 접속 URL
    if not admin_password:
        print("!!! 경고: ADMIN_PASSWORD 또는 POSTGRES_PASSWORD가 설정되지 않았습니다.")
        return

    encoded_password = quote_plus(admin_password)
    admin_db_url = f"postgresql://{admin_user}:{encoded_password}@{host}:{port}/postgres"

    print(f"[{admin_user}] 계정으로 초기화 시작...")

    # 1. Role 생성 및 DB 생성
    try:
        engine = create_engine(admin_db_url, isolation_level="AUTOCOMMIT")
        with engine.connect() as conn:
            print("1. CreateRoles.sql 실행 중...")
            _run_sql_file(conn, os.path.join(sql_dir, "CreateRoles.sql"))
            
            print(f"2. 데이터베이스 '{target_db_name}' 확인 중...")

            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{target_db_name}'"))
            if not result.fetchone():
                print(f"데이터베이스가 없어서 생성합니다: {target_db_name}")
                conn.execute(text(f"CREATE DATABASE {target_db_name}"))
            else:
                print("데이터베이스가 이미 존재합니다.")
                
    except Exception as e:
        print(f"!!! 초기화 1단계 실패 (접속 정보나 권한을 확인하세요): {e}")
        return 

    # 2. 타겟 DB 접속 및 테이블/권한 설정
    target_db_url = f"postgresql://{admin_user}:{encoded_password}@{host}:{port}/{target_db_name}"
    
    try:
        print(f"[{target_db_name}] 데이터베이스에 접속 중...")
        target_engine = create_engine(target_db_url)
        with target_engine.connect() as conn:
            with conn.begin():
                print("3. CreateTable.sql 실행 중...")
                _run_sql_file(conn, os.path.join(sql_dir, "CreateTable.sql"))

                # 테스트 데이터 삽입
                test_data_path = os.path.join(sql_dir, "TestData.sql")
                if os.path.exists(test_data_path):
                    print("3-1. TestData.sql 실행 중...")
                    _run_sql_file(conn, test_data_path)
                
                print("4. App_roles_and_privileges.sql 실행 중...")
                _run_sql_file(conn, os.path.join(sql_dir, "App_roles_and_privileges.sql"))
                
        print("=== 데이터베이스 초기화 완료 ===")
        
    except Exception as e:
        print(f"!!! 초기화 2단계 실패: {e}")

def _run_sql_file(conn, file_path):
    if not os.path.exists(file_path):
        print(f"[경고] 파일 없음: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        sql_script = f.read()
    
    if sql_script.strip():
        conn.execute(text(sql_script))
