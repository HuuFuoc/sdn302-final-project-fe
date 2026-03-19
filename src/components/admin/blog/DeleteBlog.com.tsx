import React from "react";
import { Button, Popconfirm, message } from "antd";
import { BlogService } from "../../../services/blog/blog.service";
import type { DeleteBlogRequest } from "../../../types/blog/Blog.req.type";

interface DeleteBlogProps {
  blogId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteBlog: React.FC<DeleteBlogProps> = ({
  blogId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const params: DeleteBlogRequest = { id: blogId };
      await BlogService.deleteBlog(params);
      message.success("Đã xóa bài đăng");
      onDeleted?.();
    } catch {
      message.error("Xóa bài đăng thất bại");
    }
  };

  return (
    <Popconfirm
      title="Bạn có chắc muốn xóa bài đăng này?"
      okText="Xóa"
      cancelText="Hủy"
      onConfirm={handleDelete}
    >
      <Button {...buttonProps} />
    </Popconfirm>
  );
};

export default DeleteBlog;