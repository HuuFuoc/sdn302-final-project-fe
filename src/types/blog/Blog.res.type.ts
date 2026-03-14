export interface Blog {
  _id?: string;
  id: string;
  user_id?: string;
  userId: string;
  content: string;
  blogImgUrl: string;
  created_at?: string;
  createdAt: string; // ISO datetime string
  updated_at?: string;
  updatedAt: string; // ISO datetime string
  isDeleted: boolean;
  fullName: string;
  userAvatar: string;
  title: string;
}

export interface BlogPageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface BlogListResponse {
  pageData: Blog[];
  pageInfo: BlogPageInfo;
}
