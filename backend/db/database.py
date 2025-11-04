# DB 접속 정보를 한 곳에서 관리

import os
from dotenv import load_dotenv
from psycopg2 import pool

# .env 파일에서 환경변수 로드
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# DB 접속 정보 (환경변수에서 불러옴)
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = int(os.getenv("POSTGRES_PORT", 5432))

# 커넥션 풀 생성
connection_pool = pool.SimpleConnectionPool(
    1, 10,                                 # 최소/최대 커넥션 개수
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
    database=POSTGRES_DB
)

# DB 커넥션을 하나 가져오는 함수
def get_conn():
    """
    커넥션 풀에서 DB 연결 객체(conn)를 하나 반환
    사용 후 반드시 put_conn(conn)으로 반환해야 함
    """
    return connection_pool.getconn()

# 사용한 커넥션을 커넥션 풀에 반환하는 함수
def put_conn(conn):
    """
    사용이 끝난 DB 연결 객체(conn)를 커넥션 풀에 반환
    """
    connection_pool.putconn(conn)
