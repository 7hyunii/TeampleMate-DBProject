/* ============================================================
   Teample Mate - 테스트 데이터 (프로젝트 7개, 리뷰 18개)
   ============================================================ */

-- 3. 기술 스택 (Skills) 데이터
INSERT INTO Skills (skill_name) VALUES 
('javascript'), ('typescript'), ('react'), ('nextjs'), ('vue'), 
('java'), ('spring boot'), ('python'), ('django'), ('fastapi'), ('nodejs'),
('c'), ('c++'), ('kotlin'), ('swift'), ('flutter'),             
('mysql'), ('postgresql'), ('redis'), ('docker'), ('aws'),      
('pytorch'), ('tensorflow'), ('pandas'),                        
('figma'), ('git'), ('github'), ('notion'), ('jira');           


-- 4. 학생 (Students) 데이터 
-- 비밀번호: pw1234
INSERT INTO Students (uid, name, hashed_password, email, profile_text, website_link) VALUES
('student_kim', '김민준', 
 '$2b$12$4odQoeVEfPIqD.eKTQtGqe/qVnhoFtbXu2S4IQZ1CSJSH.YxQrNMW', 
 'minjun@univ.ac.kr', 
 '컴퓨터공학과 4학년. 백엔드 시스템 설계와 AWS 인프라 구축에 자신 있습니다. 코드 퀄리티를 중요하게 생각합니다.', 
 'https://github.com/kim-dev'),

('student_lee', '이지원', 
 '$2b$12$4odQoeVEfPIqD.eKTQtGqe/qVnhoFtbXu2S4IQZ1CSJSH.YxQrNMW', 
 'jiwon@univ.ac.kr', 
 '시각디자인/컴공 복수전공. Figma를 이용한 프로토타이핑부터 React 개발까지 가능한 하이브리드 인재입니다.', 
 'https://behance.net/lee-design'),

('student_park', '박서연', 
 '$2b$12$4odQoeVEfPIqD.eKTQtGqe/qVnhoFtbXu2S4IQZ1CSJSH.YxQrNMW', 
 'seoyeon@univ.ac.kr', 
 '데이터 분석 및 AI 모델링 연구. Kaggle 대회 참여 경험 다수. 논문 구현 스터디 환영합니다.', 
 'https://blog.naver.com/park-algo'),

('student_choi', '최현우', 
 '$2b$12$4odQoeVEfPIqD.eKTQtGqe/qVnhoFtbXu2S4IQZ1CSJSH.YxQrNMW', 
 'hyunwoo@univ.ac.kr', 
 '경영정보학과. 서비스 기획, PM, 일정 관리 전문입니다. 개발자분들이 개발에만 집중할 수 있게 서포트합니다.', 
 ''),

('student_jung', '정도윤', 
 '$2b$12$4odQoeVEfPIqD.eKTQtGqe/qVnhoFtbXu2S4IQZ1CSJSH.YxQrNMW', 
 'doyoon@univ.ac.kr', 
 '소프트웨어학부 2학년. 열정 가득한 주니어 개발자입니다. C/Java 기초 탄탄합니다. 무엇이든 배우겠습니다!', 
 '');


-- 5. 학생 보유 기술 매핑
INSERT INTO Student_Skills (uid, skill_id) VALUES 
('student_kim', (SELECT skill_id FROM Skills WHERE skill_name = 'spring boot')),
('student_kim', (SELECT skill_id FROM Skills WHERE skill_name = 'java')),
('student_kim', (SELECT skill_id FROM Skills WHERE skill_name = 'aws')),
('student_kim', (SELECT skill_id FROM Skills WHERE skill_name = 'docker')),
('student_lee', (SELECT skill_id FROM Skills WHERE skill_name = 'react')),
('student_lee', (SELECT skill_id FROM Skills WHERE skill_name = 'figma')),
('student_lee', (SELECT skill_id FROM Skills WHERE skill_name = 'typescript')),
('student_park', (SELECT skill_id FROM Skills WHERE skill_name = 'python')),
('student_park', (SELECT skill_id FROM Skills WHERE skill_name = 'pytorch')),
('student_park', (SELECT skill_id FROM Skills WHERE skill_name = 'pandas')),
('student_choi', (SELECT skill_id FROM Skills WHERE skill_name = 'notion')),
('student_choi', (SELECT skill_id FROM Skills WHERE skill_name = 'jira')),
('student_choi', (SELECT skill_id FROM Skills WHERE skill_name = 'python')),
('student_jung', (SELECT skill_id FROM Skills WHERE skill_name = 'java')),
('student_jung', (SELECT skill_id FROM Skills WHERE skill_name = 'c'));


-- 6. 프로젝트 (Projects) 데이터 - 총 7개

-- [1: Recruiting] 캡스톤 디자인
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_kim', 'AI 기반 개인 맞춤형 학습 큐레이션 플랫폼', 
 '2025학년도 1학기 캡스톤 디자인 프로젝트 팀원을 모집합니다. (백엔드 리드)', 
 '1. 프로젝트 상세 개요
   - 사용자의 학습 이력(수강 강의, 성적, 관심 분야)을 분석하여 최적의 커리큘럼을 추천하는 웹 서비스입니다.
   - 단순 강의 추천을 넘어, 학습 진도율 시각화 및 스터디 그룹 매칭 기능까지 구현 목표입니다.

2. 기술 스택 (Tech Stack)
   - Backend: Spring Boot 3.2, Spring Security, JPA, QueryDSL, MySQL
   - Frontend: React(Next.js), TypeScript, TailwindCSS, Recoil
   - AI Server: Python FastAPI, Scikit-learn (협업 필터링 알고리즘)
   - Infra: AWS EC2, Docker, Github Actions

3. 모집 포지션 및 역할
   - Frontend Developer (1명): UI/UX 구현 및 REST API 연동, 반응형 웹 디자인
   - AI Engineer (1명): 추천 알고리즘 모델링 및 API 서빙

4. 협업 방식
   - 매주 화요일 오후 7시 대면 회의 (공학관 스터디룸)
   - Notion으로 회의록 관리, Jira로 이슈 및 일정 관리', 
 4, '2025-12-30', 'Recruiting');

-- [2: In_Progress] 알고리즘 스터디
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_park', '2025 상반기 공채 대비 알고리즘 및 CS 스터디', 
 '매일 1문제 풀이 및 주 1회 모의 면접. 보증금 있습니다.', 
 '1. 스터디 목표
   - 대기업 IT 직군 코딩테스트 통과 (삼성, 카카오, 네이버 기출 중심)
   - 기술 면접 필수 질문(운영체제, 네트워크, DB) 완벽 대비

2. 운영 규칙
   - 1일 1문제: 매일 자정까지 백준 골드/실버 문제 풀이 후 Github PR 제출
   - 코드 리뷰: 서로의 코드에 대해 반드시 1개 이상의 코멘트 남기기
   - 모의 면접: 매주 토요일 오후 2시 Zoom, 한 명씩 돌아가며 면접관 역할 수행

3. 벌금 제도
   - 문제 미제출: 1회당 3,000원
   - 지각/결석: 1회당 5,000원
   - (모인 벌금은 스터디 종료 후 회식비로 사용)', 
 6, '2026-01-31', 'In_Progress');

-- [3: Completed] 해커톤 (기존)
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_choi', '캠퍼스 셔틀버스 실시간 위치 추적 서비스', 
 '교내 해커톤 은상 수상작. 셔틀버스 위치 알림 앱.', 
 '1. 개발 배경 및 목적
   - 교내 셔틀버스 배차 간격이 불규칙하여 학생들이 겪는 불편함을 해소하고자 기획했습니다.
   - GPS 모듈을 활용하여 버스의 실시간 위치를 지도상에 표시하고 도착 시간을 예측합니다.

2. 시스템 아키텍처
   - Client: React Native (Expo) 기반의 크로스 플랫폼 앱
   - Server: Node.js (Express) + Socket.io (실시간 위치 데이터 전송)
   - Database: MongoDB (운행 로그 저장)
   - H/W: Arduino + GPS Module (버스 부착용)

3. 개인 주요 성과
   - 교내 소프트웨어 해커톤 은상 수상
   - 실제 베타 테스트 기간 동안 일일 활성 사용자(DAU) 300명 달성
   - 학생처와 협의하여 정식 서비스 도입 논의 중', 
 4, '2025-11-10', 'Completed');

-- [4: Recruiting] 핀테크 대시보드 프로젝트
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_kim', '가상화폐/주식 포트폴리오 관리 대시보드', 
 '사이드 프로젝트로 금융 데이터 시각화 웹을 만들어보실 분 구합니다.', 
 '1. 프로젝트 개요
   - 흩어져 있는 나의 투자 자산(주식, 코인)을 한눈에 모아보고 수익률을 시각화하는 대시보드입니다.
   - Upbit, Binance, 한국투자증권 Open API를 활용하여 실시간 자산 가치를 계산합니다.

2. 모집 분야
   - Frontend (React): Recharts 또는 Chart.js 등을 활용한 데이터 시각화 경험자 우대
   - Data Engineer (Python): 다양한 거래소의 API 데이터를 수집하고 정규화해주실 분

3. 이런 분을 찾습니다
   - 금융 데이터 처리에 관심이 많으신 분
   - WebSocket을 이용한 실시간 데이터 처리를 경험해보고 싶으신 분
   - 포트폴리오용으로 완성도 있는 프로젝트를 하나 남기고 싶으신 분', 
 3, '2025-12-30', 'Recruiting');

-- [5: In_Progress] 모바일 헬스케어 앱 (Flutter)
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_lee', '하루 물 마시기 알림 & 기록 앱 (Flutter)', 
 '디자인은 완료되었고, 개발 함께하실 분 찾습니다. (Flutter 입문자 환영)', 
 '1. 앱 소개
   - 사용자의 체중과 활동량을 기반으로 하루 권장 물 섭취량을 계산하고 알림을 보내주는 앱입니다.
   - 귀여운 캐릭터(물방울)를 키우는 게이미피케이션 요소를 도입했습니다.

2. 현재 진행 상황
   - 기획 및 UI/UX 디자인 100% 완료 (Figma 산출물 보유)
   - 핵심 기능(알림, 기록 CRUD) 구현 중
   - MVP 출시 후 스토어 등록까지 목표로 합니다.

3. 기술 스택
   - Framework: Flutter
   - State Management: Riverpod
   - Backend: Firebase (Auth, Firestore, Cloud Functions)

4. 담당 역할
   - UI 퍼블리싱 및 애니메이션 구현
   - Firebase 연동 및 데이터 처리', 
 2, '2026-01-10', 'In_Progress');

-- [6: Completed] 빅데이터 분석 공모전
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_park', '서울시 공공데이터 활용 분석 공모전', 
 '교통 데이터를 활용한 상권 분석 보고서 작성 및 시각화.', 
 '1. 공모전 주제
   - 서울시 지하철/버스 승하차 인원 데이터와 골목상권 매출 데이터를 융합하여 상관관계를 분석했습니다.
   - "대중교통 접근성이 상권 매출에 미치는 영향"을 주제로 인사이트를 도출했습니다.

2. 분석 프로세스
   - 데이터 수집: 서울 열린데이터 광장 API 활용
   - 전처리: Python Pandas를 이용한 결측치 처리 및 이상치 제거
   - 시각화: Matplotlib, Seaborn, Tableau를 이용한 지도 시각화
   - 모델링: Random Forest 회귀 모델을 통해 유동인구에 따른 예상 매출액 예측

3. 목표
	- 대용량 데이터(약 100만 건) 처리 경험을 쌓을 수 있기를 바랍니다.
	- 입상을 통해 개인 포트폴리오를 채울 수 있기를 바랍니다.', 
 3, '2025-10-15', 'Completed');

-- [7: Completed] 동아리 홈페이지 리뉴얼
INSERT INTO Projects (leader_id, topic, description1, description2, capacity, deadline, status) VALUES
('student_lee', '멋쟁이 사자처럼 교내 동아리 메인 페이지 리뉴얼', 
 '기존 PHP 사이트를 Next.js로 마이그레이션 하는 작업입니다.', 
 '1. 리뉴얼 목적
   - 노후화된 PHP 기반의 레거시 코드를 청산하고, 유지보수가 용이한 모던 웹 스택으로 전환
   - 모바일 사용성을 고려한 반응형 UI/UX 전면 개편
   - 검색 엔진 최적화(SEO)를 통한 동아리 홍보 효과 증대

2. 주요 작업 내용
   - Next.js 14 (App Router) 도입 및 SSR 적용
   - Framer Motion을 활용한 스크롤 인터랙션 구현
   - 동아리 부원 소개 및 프로젝트 아카이빙 페이지 제작

3. 최소 목표
   - Vercel을 통한 CI/CD 파이프라인 구축 경험
   - 디자이너와 개발자 간의 핸드오프 과정(Zeplin 활용) 경험', 
 4, '2025-09-30', 'Completed');


-- 7. 프로젝트 필요 기술 매핑
-- P1 (Capstone)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(1, (SELECT skill_id FROM Skills WHERE skill_name = 'spring boot')),
(1, (SELECT skill_id FROM Skills WHERE skill_name = 'react')),
(1, (SELECT skill_id FROM Skills WHERE skill_name = 'python'));
-- P2 (Algo Study)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(2, (SELECT skill_id FROM Skills WHERE skill_name = 'python')),
(2, (SELECT skill_id FROM Skills WHERE skill_name = 'c++'));
-- P3 (Hackathon)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(3, (SELECT skill_id FROM Skills WHERE skill_name = 'nodejs')),
(3, (SELECT skill_id FROM Skills WHERE skill_name = 'react'));
-- P4 (Fintech - New)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(4, (SELECT skill_id FROM Skills WHERE skill_name = 'react')),
(4, (SELECT skill_id FROM Skills WHERE skill_name = 'python'));
-- P5 (Healthcare - New)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(5, (SELECT skill_id FROM Skills WHERE skill_name = 'flutter')),
(5, (SELECT skill_id FROM Skills WHERE skill_name = 'figma'));
-- P6 (BigData - New)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(6, (SELECT skill_id FROM Skills WHERE skill_name = 'python')),
(6, (SELECT skill_id FROM Skills WHERE skill_name = 'pandas'));
-- P7 (Web Renewal - New)
INSERT INTO Project_Required_Skills (project_id, skill_id) VALUES
(7, (SELECT skill_id FROM Skills WHERE skill_name = 'nextjs')),
(7, (SELECT skill_id FROM Skills WHERE skill_name = 'typescript'));


-- 8. 지원서 (Applications) 데이터 (구체적이고 진지한 지원동기)

-- P1 (Capstone) - Frontend 지원자 (이지원)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(1, 'student_lee', '2025-11-21', 
 '프론트엔드 리드 개발자로 지원합니다. Next.js와 Recoil을 사용한 프로젝트 경험이 있으며, Figma를 활용한 프로토타이핑부터 반응형 웹 구현까지 전담할 수 있습니다. 캡스톤 A+를 목표로 최선을 다하겠습니다.', 
 'Accepted');

-- P1 (Capstone) - AI 지원자 (박서연)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(1, 'student_park', '2025-11-22', 
 '추천 시스템 알고리즘에 깊은 관심이 있습니다. 협업 필터링과 콘텐츠 기반 필터링을 결합한 하이브리드 모델을 구현해보고 싶어 지원했습니다. 관련 논문 구현 경험이 있어 빠르게 적용 가능합니다.', 
 'Pending');

-- P1 (Capstone) - Backend 지원자 (정도윤 - 거절됨)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(1, 'student_jung', '2025-11-23', 
 '백엔드 아키텍처를 배우고 싶습니다. 아직 대규모 트래픽 처리 경험은 없지만, API 명세서 작성과 테스트 코드 작성 등 팀에 기여할 수 있는 부분부터 차근차근 맡아서 수행하겠습니다.', 
 'Rejected');

-- P2 (Study) - 김민준
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(2, 'student_kim', '2025-11-05', 
 '삼성전자 SW 역량테스트를 준비하고 있습니다. 혼자서 공부하다 보니 시간 관리가 잘 되지 않아 지원했습니다. 매일 1문제 풀이 인증과 주말 모의 면접에 성실히 참여하겠습니다.', 
 'Accepted');

-- P2 (Study) - 정도윤
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(2, 'student_jung', '2025-11-06', 
 '자료구조 수업에서 그래프 탐색 부분이 약하다고 느껴 지원했습니다. 이번 방학 동안 골드 티어 달성을 목표로 선배님들의 코드를 보며 배우고 싶습니다.', 
 'Pending');

-- P3 (Hackathon - Completed)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(3, 'student_lee', '2025-10-25', '디자인 전담 가능합니다. 제한 시간 내에 와이어프레임과 UI 에셋을 빠르게 제작하여 개발 속도를 높여드리겠습니다.', 'Accepted'),
(3, 'student_kim', '2025-10-26', '백엔드 소켓 통신 구현 경험이 있습니다. 실시간 위치 데이터를 지연 없이 클라이언트로 전송하는 서버 구축을 담당하겠습니다.', 'Accepted');

-- P4 (Fintech - Recruiting)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(4, 'student_choi', '2025-12-01', 
 '경영학 복수전공으로 재무제표와 투자 지표에 대한 이해도가 높습니다. 서비스 기획 단계에서 데이터 구조를 정의하고, 일정 관리를 맡아 프로젝트가 기한 내 완성되도록 돕겠습니다.', 
 'Pending');

INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(4, 'student_lee', '2025-12-02', 
 'Recharts와 D3.js 라이브러리를 활용하여 인터랙티브한 금융 차트를 구현해보고 싶습니다. 포트폴리오에 넣을 수 있는 완성도 높은 UI를 만들 자신이 있습니다.', 
 'Accepted');

-- P5 (Healthcare - In_Progress)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(5, 'student_jung', '2025-11-15', 
 'Flutter 기초 강의를 완강하고 실제 앱 출시 프로세스를 경험해보고 싶어 지원했습니다. Firebase 연동과 UI 퍼블리싱 업무를 주시면 밤을 새워서라도 해오겠습니다.', 
 'Accepted');

-- P6 (BigData - Completed)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(6, 'student_kim', '2025-09-20', 
 'Pandas를 활용한 대용량 데이터 전처리 및 파이프라인 구축이 가능합니다. 분석가분들이 모델링에만 집중할 수 있도록 깨끗한 데이터셋을 제공하겠습니다.', 
 'Accepted'),
(6, 'student_jung', '2025-09-21', '데이터 사이언스 분야에 관심이 많습니다. 데이터 라벨링이나 시각화 자료 정리 등 보조 업무를 수행하며 분석 과정을 어깨너머로 배우고 싶습니다.', 'Accepted');

-- P7 (Web Renewal - Completed)
INSERT INTO Applications (project_id, applicant_id, applicant_date, motivation, status) VALUES
(7, 'student_choi', '2025-08-15', 
 '동아리 회장 경험을 살려 기존 부원들의 요구사항을 정리하고, 문서화를 담당하겠습니다. 개발자분들이 개발에 집중할 수 있는 환경을 만들겠습니다.', 
 'Accepted'),
(7, 'student_park', '2025-08-16', 
 'Next.js로 전환하신다고 들었습니다. 혹시 데이터 분석용 백엔드 서버가 별도로 필요하다면 FastAPI로 구축해드릴 수 있어 지원합니다.', 
 'Rejected');


-- 9. 동료 평가 (Peer_Reviews) 데이터

-- [Project 3: Hackathon] (Leader: Choi, Members: Lee, Kim)
INSERT INTO Peer_Reviews (project_id, reviewer_id, reviewee_id, score, comment) VALUES
(3, 'student_choi', 'student_lee', 5, '디자인 퀄리티가 전문가 수준입니다. 협업 태도도 훌륭해요.'),
(3, 'student_lee', 'student_kim', 5, 'API 명세가 완벽해서 프론트 개발이 빨랐습니다. 소켓 통신도 안정적이었습니다.'),
(3, 'student_kim', 'student_choi', 4, '일정 관리는 좋았으나 기획이 중간에 조금 흔들렸습니다. 그래도 리딩하느라 고생하셨습니다.'),
(3, 'student_kim', 'student_lee', 5, '최고의 디자이너! 개발자의 니즈를 정확히 파악해주십니다.'),
(3, 'student_lee', 'student_choi', 5, '팀원 멘탈 케어를 잘 해주십니다. 덕분에 끝까지 완주했어요.');
INSERT INTO Peer_Reviews (project_id, reviewer_id, reviewee_id, score, comment) VALUES
(3, 'student_choi', 'student_kim', 4, '기술적 난이도가 높은 부분을 잘 해결해주셨습니다. 소통만 조금 더 자주 해주세요.');

-- [Project 6: BigData] (Leader: Park, Members: Kim, Jung)
INSERT INTO Peer_Reviews (project_id, reviewer_id, reviewee_id, score, comment) VALUES
(6, 'student_park', 'student_kim', 5, '데이터 전처리 로직을 깔끔하게 짜주셔서 분석이 쉬웠습니다. 역시 믿고 맡기는 김민준 학우님.'),
(6, 'student_kim', 'student_park', 5, '모델링 지식이 해박하시고 리딩을 잘 하십니다. 발표 자료 준비도 완벽했어요.'),
(6, 'student_park', 'student_jung', 3, '열정은 좋으나 Python 기초가 조금 부족해 보입니다. 더 공부가 필요해요.'),
(6, 'student_jung', 'student_park', 5, '많이 배웠습니다! 모르는 거 물어볼 때마다 친절하게 알려주셔서 감사합니다.'),
(6, 'student_kim', 'student_jung', 4, '시키는 일은 성실하게 잘 수행합니다. 성장 가능성이 보입니다.'),
(6, 'student_jung', 'student_kim', 5, '코드 리뷰 꼼꼼하게 해주셔서 감사합니다. 판다스 꿀팁 많이 얻어갑니다.');

-- [Project 7: Web Renewal] (Leader: Lee, Members: Choi)
INSERT INTO Peer_Reviews (project_id, reviewer_id, reviewee_id, score, comment) VALUES
(7, 'student_lee', 'student_choi', 4, '문서화를 잘 해주셔서 인수인계가 편했습니다. 꼼꼼하십니다.'),
(7, 'student_choi', 'student_lee', 5, 'Next.js 도입 결정이 신의 한 수였습니다. 사이트 속도가 체감될 정도로 빨라졌어요.');
