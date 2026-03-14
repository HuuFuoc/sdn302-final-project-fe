import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  BlogRequest,
  CreateBlogRequest,
  DeleteBlogRequest,
  UpdateBlogRequest,
  GetBlogByIdRequest,
  GetBlogByUserIdRequest,
} from "../../types/blog/Blog.req.type";
import type { Blog } from "../../types/blog/Blog.res.type";
import { API_PATH } from "../../consts/api.path.const";

type RawBlog = {
  _id?: string;
  id?: string;
  user_id?: string;
  userId?: string;
  title?: string;
  content?: string;
  blogImgUrl?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  fullName?: string;
  full_name?: string;
  userAvatar?: string;
  user_avatar?: string;
};

const normalizeBlog = (raw: RawBlog): Blog => ({
  _id: raw._id || raw.id || "",
  id: raw.id || raw._id || "",
  user_id: raw.user_id || raw.userId || "",
  userId: raw.userId || raw.user_id || "",
  title: raw.title || "",
  content: raw.content || "",
  blogImgUrl: raw.blogImgUrl || "",
  created_at: raw.created_at || raw.createdAt || "",
  createdAt: raw.createdAt || raw.created_at || "",
  updated_at: raw.updated_at || raw.updatedAt || "",
  updatedAt: raw.updatedAt || raw.updated_at || "",
  isDeleted: Boolean(raw.isDeleted),
  fullName: raw.fullName || raw.full_name || "",
  userAvatar: raw.userAvatar || raw.user_avatar || "",
});

const normalizeBlogListResponse = (response: any) => {
  const raw = response?.data || {};
  const mappedData = Array.isArray(raw.data)
    ? raw.data.map((item: RawBlog) => normalizeBlog(item))
    : [];

  return {
    ...response,
    data: {
      ...raw,
      data: mappedData,
      totalCount: raw.totalCount ?? mappedData.length,
    },
  };
};

const normalizeSingleBlogResponse = (response: any) => {
  const raw = response?.data || {};
  return {
    ...response,
    data: {
      ...raw,
      data: raw.data ? normalizeBlog(raw.data as RawBlog) : null,
    },
  };
};

export const BlogService = {
  getAllBlogs(params: BlogRequest) {
    return BaseService.get<ResponseSuccess<Blog[]>>({
      url: API_PATH.BLOG.GET_ALL_BLOGS,
      payload: params,
    }).then(normalizeBlogListResponse as any);
  },
  createBlog(params: CreateBlogRequest) {
    return BaseService.post<ResponseSuccess<Blog>>({
      url: API_PATH.BLOG.CREATE_BLOG,
      payload: params,
    }).then(normalizeSingleBlogResponse as any);
  },
  deleteBlog(params: DeleteBlogRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.BLOG.DELETE_BLOG(params.id),
      payload: params,
    });
  },
  updateBlog(params: UpdateBlogRequest) {
    return BaseService.put<ResponseSuccess<Blog>>({
      url: API_PATH.BLOG.UPDATE_BLOG(params.id), // Assuming the same endpoint for update
      payload: params,
    }).then(normalizeSingleBlogResponse as any);
  },
  getBlogById(params: GetBlogByIdRequest) {
    return BaseService.get<ResponseSuccess<Blog>>({
      url: API_PATH.BLOG.GET_BLOG_BY_ID(params.id),
      payload: params,
    }).then(normalizeSingleBlogResponse as any);
  },
  getBlogsByUserId(params: GetBlogByUserIdRequest) {
    const userId = params.user_id || params.userId || "";
    return BaseService.get<ResponseSuccess<Blog[]>>({
      url: API_PATH.BLOG.GET_BLOG_BY_USER_ID(userId),
      payload: params,
    }).then(normalizeBlogListResponse as any);
  },
};
