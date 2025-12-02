-- DROP VIEW IF EXISTS ProjectApplicantsView;
-- DROP VIEW IF EXISTS RecruitingProjectsView;
-- DROP VIEW IF EXISTS InProgressProjectsView;
-- DROP VIEW IF EXISTS CompletedProjectsView;

-- DROP TABLE IF EXISTS Peer_Reviews CASCADE;
-- DROP TABLE IF EXISTS Applications CASCADE;
-- DROP TABLE IF EXISTS Project_Required_Skills CASCADE;
-- DROP TABLE IF EXISTS Projects CASCADE;
-- DROP TABLE IF EXISTS Student_Skills CASCADE;
-- DROP TABLE IF EXISTS Skills CASCADE;
-- DROP TABLE IF EXISTS Students CASCADE;
-- -- 삭제 

CREATE TABLE IF NOT EXISTS Students (
  uid VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  email TEXT DEFAULT '' NOT NULL,
  profile_text TEXT DEFAULT '' NOT NULL,
  website_link TEXT DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS Skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL CHECK (skill_name = LOWER(skill_name))
);


CREATE TABLE IF NOT EXISTS Student_Skills (
    uid VARCHAR(50) NOT NULL,
    skill_id INTEGER NOT NULL,
    PRIMARY KEY (uid, skill_id),
    FOREIGN KEY (uid) REFERENCES Students(uid),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);


CREATE TABLE IF NOT EXISTS Projects (
    project_id SERIAL PRIMARY KEY,
    leader_id VARCHAR(50) NOT NULL REFERENCES Students(uid),
    topic VARCHAR(200) NOT NULL,
    description1 TEXT NOT NULL,
    description2 TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Recruiting' CHECK (status IN ('Recruiting', 'In_Progress', 'Completed'))
);

CREATE TABLE IF NOT EXISTS Project_Required_Skills (
    project_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);


CREATE TABLE IF NOT EXISTS Applications (
    application_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES Projects(project_id),
    applicant_id VARCHAR(50) NOT NULL REFERENCES Students(uid),
    applicant_date DATE NOT NULL,
    motivation TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
    UNIQUE (project_id, applicant_id)
);


CREATE TABLE IF NOT EXISTS Peer_Reviews (
    review_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES Projects(project_id),
    reviewer_id VARCHAR(50) NOT NULL REFERENCES Students(uid),
    reviewee_id VARCHAR(50) NOT NULL REFERENCES Students(uid),
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT NOT NULL,
    UNIQUE (project_id, reviewer_id, reviewee_id),
    CHECK (reviewer_id != reviewee_id)
);

-- 리더 아이디(leader_id) 기준 프로젝트 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_projects_leader ON Projects(leader_id);

-- 모집 중(Recruiting) 상태인 프로젝트의 마감일 기준 부분 인덱스
CREATE INDEX IF NOT EXISTS idx_projects_recruiting_deadline
ON Projects(deadline) WHERE status = 'Recruiting';

-- 승인된(Accepted) 상태의 지원 내역 조회를 위한 부분 인덱스
CREATE INDEX IF NOT EXISTS idx_applications_project_accepted
ON Applications(project_id) WHERE status = 'Accepted';


-- 모집 중인 프로젝트만 보여주는 View
CREATE OR REPLACE VIEW RecruitingProjectsView AS
SELECT p.project_id, p.leader_id, p.topic, p.description1, p.capacity, p.deadline, p.status, s.name as leader_name
FROM Projects p
JOIN Students s ON p.leader_id = s.uid
WHERE p.status = 'Recruiting' 
  AND p.deadline >= CURRENT_DATE;

-- 진행 중인 프로젝트만 보여주는 View
CREATE OR REPLACE VIEW InProgressProjectsView AS
SELECT p.project_id, p.leader_id, p.topic, p.description1, p.capacity, p.deadline, p.status, s.name as leader_name
FROM Projects p
JOIN Students s ON p.leader_id = s.uid
WHERE p.status = 'In_Progress';

-- 완료된 프로젝트만 보여주는 View
CREATE OR REPLACE VIEW CompletedProjectsView AS
SELECT p.project_id, p.leader_id, p.topic, p.description1, p.capacity, p.deadline, p.status, s.name as leader_name
FROM Projects p
JOIN Students s ON p.leader_id = s.uid
WHERE p.status = 'Completed';


-- 지원자 관리를 위한 지원자 정보 View
CREATE OR REPLACE VIEW ProjectApplicantsView AS
SELECT
    p.leader_id         AS leader_id,
    a.project_id        AS project_id,
    a.application_id    AS application_id,
    a.applicant_id      AS applicant_id,
    a.applicant_date    AS applicant_date,
    s.name              AS applicant_name,
    s.email             AS applicant_email,
    s.profile_text      AS applicant_profile_text,
    s.website_link      AS applicant_website_link,
    a.motivation        AS applicant_motivation,
    a.status            AS status,
    COALESCE(
        (SELECT array_agg(DISTINCT sk.skill_name)
         FROM Student_Skills ss
         JOIN Skills sk ON ss.skill_id = sk.skill_id
         WHERE ss.uid = a.applicant_id),
        ARRAY[]::text[]
    ) AS applicant_skills,
    COALESCE(
        (SELECT json_agg(json_build_object('score', pr.score, 'comment', pr.comment))
         FROM Peer_Reviews pr
         WHERE pr.reviewee_id = a.applicant_id),
        '[]'::json
    ) AS applicant_reviews
FROM Applications a
JOIN Projects p ON a.project_id = p.project_id
JOIN Students s ON a.applicant_id = s.uid;
