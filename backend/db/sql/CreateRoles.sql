----- postgres에서 -----
-- Roles 생성 (없을 경우에만 생성, 있으면 설정 업데이트)
DO $$
BEGIN
    -- other Role 생성
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'other') THEN
        CREATE ROLE other NOLOGIN;
    ELSE
        ALTER ROLE other NOLOGIN;
    END IF;

    -- leader Role 생성
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'leader') THEN
        CREATE ROLE leader NOLOGIN;
    ELSE
        ALTER ROLE leader NOLOGIN;
    END IF;

    -- teample_dev Role 생성
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'teample_dev') THEN
        CREATE ROLE teample_dev LOGIN PASSWORD 'teample_password';
    ELSE
        ALTER ROLE teample_dev LOGIN PASSWORD 'teample_password';
    END IF;
END
$$;

-- 생성 확인
SELECT rolname FROM pg_roles
WHERE rolname IN ('leader','other','teample_dev')
ORDER BY 1;

-- 상속 관계 설정
GRANT other TO leader;
GRANT leader TO teample_dev;
GRANT other  TO teample_dev;