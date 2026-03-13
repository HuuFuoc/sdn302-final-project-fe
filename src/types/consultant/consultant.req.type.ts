export interface ConsultantRequest {
  PageNumber: number;
  PageSize: number;
  FilterByName?: string;
}
export interface CreateConsultantRequest {
  userId: string;
  qualifications: string[];
  jobTitle: string;
  hireDate: string;
  salary: number;
  status: string;
}

export interface BecomeInstructorRequest {
  userId?: string;
  qualifications?: string[];
  jobTitle?: string;
  note?: string;
  [key: string]: unknown;
}

export interface UpdateConsultantRequest {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  qualifications?: string[];
  jobTitle?: string;
  status?: string;
  note?: string;
  [key: string]: unknown;
}
export interface DeleteConsultantRequest {
  id: string;
}

export interface ConsultantDetailRequest {
  id: string;
}

export interface InstructorRequestQuery {
  PageNumber: number;
  PageSize: number;
  searchCondition?: string;
}

export interface ReviewInstructorRequest {
  requestId: string;
  isApproved: boolean;
  note?: string;
  [key: string]: unknown;
}
