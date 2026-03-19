import { useMutation } from "@tanstack/react-query";
import { BlogService } from "../services/blog/blog.service";
import type {
  CreateBlogRequest,
  UpdateBlogRequest,
} from "../types/blog/Blog.req.type";
import { helpers } from "../utils";

/**
 * Hook for creating a blog post
 */
export const useCreateBlog = () => {
  return useMutation({
    mutationFn: (data: CreateBlogRequest) => BlogService.createBlog(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo bài đăng thành công", "success");
    },
    onError: (error: any) => {
      helpers.notificationMessage(
        error?.response?.data?.message || error?.message || "Tạo bài đăng thất bại",
        "error",
      );
    },
  });
};

/**
 * Hook for updating a blog post
 */
export const useUpdateBlog = () => {
  return useMutation({
    mutationFn: (data: UpdateBlogRequest) => BlogService.updateBlog(data),
    onSuccess: () => {
      helpers.notificationMessage("Cập nhật bài đăng thành công", "success");
    },
    onError: (error: any) => {
      helpers.notificationMessage(
        error?.response?.data?.message || error?.message || "Cập nhật bài đăng thất bại",
        "error",
      );
    },
  });
};