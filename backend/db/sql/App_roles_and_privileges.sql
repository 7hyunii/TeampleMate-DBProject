----- postgres에서 -----
-- roles 만들기
ROLLBACK;
CREATE ROLE other NOLOGIN;
CREATE ROLE leader NOLOGIN;
CREATE ROLE teample_dev LOGIN PASSWORD 'teample_password';

-- 생성 확인
SELECT rolname FROM pg_roles
WHERE rolname IN ('leader','other','teample_dev')
ORDER BY 1;

-- 상속 관계 설정
GRANT other TO leader;
GRANT leader TO teample_dev;
GRANT other  TO teample_dev;


-- 기존 권한 초기화 --
-- 모든 테이블/뷰 권한을 PUBLIC, other, leader로부터 제거
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM PUBLIC, other, leader;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, other, leader;

-- 스키마 접근 초기화
REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC, other, leader;

-- other가 public 스키마 이름 해석 가능
GRANT USAGE ON SCHEMA public TO other;

-- other 조회 권한
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.students,
   public.skills,
   public.student_skills,
   public.projects,
   public.project_required_skills,
   public.peer_reviews
TO other, leader;

GRANT SELECT
ON public.recruitingprojectsview,
   public.inprogressprojectsview,
   public.completedprojectsview
TO other, leader;

GRANT USAGE, SELECT ON SEQUENCE
  public.skills_skill_id_seq,
  public.projects_project_id_seq,
  public.applications_application_id_seq,
  public.peer_reviews_review_id_seq
TO other, leader;


-- Applications: 리더만 status 업데이트
GRANT SELECT, INSERT, DELETE ON public.applications TO other, leader;
GRANT UPDATE (status) ON public.applications TO leader;

-- ProjectApplicantsView: 리더만 조회
GRANT SELECT ON public.projectapplicantsview TO leader;

