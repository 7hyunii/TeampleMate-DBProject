from pydantic import BaseModel
from enum import Enum
from datetime import date

class SignupRequest(BaseModel):
    uid: str
    password: str
    name: str

class MessageResponse(BaseModel):
    msg: str

class LoginRequest(BaseModel):
    uid: str
    password: str

class LoginResponse(BaseModel):
    msg: str
    uid: str
    name: str
    email: str = ""
    profile_text: str = ""
    website_link: str = ""

class ProfileInfoResponse(BaseModel):
    uid: str
    name: str
    email: str = ""
    profile_text: str = ""
    website_link: str = ""
    skills: list[str] = []

class ProfileUpdateRequest(BaseModel):
    uid: str
    name: str
    email: str = ""
    profile_text: str = ""
    website_link: str = ""
    skills: list[str] = []

class ProjectCreateRequest(BaseModel):
    leader_id: str
    topic: str
    description1: str
    description2: str
    capacity: int
    deadline: date
    skills: list[str]

class OrderBy(str, Enum):
    deadline = "deadline"
    capacity = "capacity"

class GroupBy(str, Enum):
    All = "All"
    Recruiting = "Recruiting"
    In_Progress = "In_Progress"
    Completed = "Completed"

class ProjectListRequest(BaseModel):
    orderBy: OrderBy = OrderBy.deadline
    groupBy: GroupBy = GroupBy.All
    search: str = ""

class ProjectListItem(BaseModel):
    project_id: int
    leader_id: str
    topic: str
    description1: str
    capacity: int
    deadline: date
    status: str
    leader_name: str
    skills: list[str] = []

class ProjectListResponse(BaseModel):
    projects: list[ProjectListItem]

class ProjectDetailsResponse(BaseModel):
    project_id: int
    leader_id: str
    leader_name: str
    topic: str
    description1: str
    description2: str
    capacity: int
    deadline: date
    status: str
    skills: list[str] = []
    can_apply: bool
    members: list[dict] = []
    members_count: int


class ApplicationRequest(BaseModel):
    applicant_id: str
    applicant_date: str
    motivation: str

class MyApplicationsItem(BaseModel):
    application_id: int
    project_id: int
    project_topic: str
    project_leader_id: str
    project_leader_name: str
    applicant_date: date
    motivation: str
    status: str

class MyApplicationsResponse(BaseModel):
    applications: list[MyApplicationsItem]

class ApplicationsManagementItem(BaseModel):
    leader_id: str
    project_id: int
    application_id: int
    applicant_id: str
    applicant_date: date
    applicant_name: str
    applicant_email: str
    applicant_profile_text: str
    applicant_website_link: str
    applicant_motivation: str
    status: str
    applicant_skills: list[str] = []
    applicant_reviews: list[dict] = []

class ApplicationsManagementResponse(BaseModel):
    applications: list[ApplicationsManagementItem]

class newStatus(str, Enum):
    Pending = "Pending"
    Accepted = "Accepted"
    Rejected = "Rejected"

class ApplicationStatusUpdateRequest(BaseModel):
    new_status: newStatus = newStatus.Pending
    leader_id: str

class MyProjectListItem(BaseModel):
    project_id: int
    leader_id: str
    title: str
    status: str
    members_count: int
    capacity: int
    deadline: date

class MyProjectListResponse(BaseModel):
    projects: list[MyProjectListItem]

class newProjectStatus(str, Enum):
    Recruiting = "Recruiting"
    In_Progress = "In_Progress"
    Completed = "Completed"

class ProjectStatusUpdateRequest(BaseModel):
    new_status: newProjectStatus
    leader_id: str