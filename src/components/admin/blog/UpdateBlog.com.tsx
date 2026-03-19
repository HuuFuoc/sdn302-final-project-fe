import React, { useEffect, useState } from "react";
import { Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useUpdateBlog } from "../../../hooks/useBlog";
import { BaseService } from "../../../app/api/base.service";
import type { Blog } from "../../../types/blog/Blog.res.type";

interface UpdateBlogFormProps {
  blog: Blog;
  onSuccess?: () => void;
}

type UpdateBlogFormValues = {
  title: string;
  content: string;
  blogImgUrl?: string;
};

const UpdateBlogForm: React.FC<UpdateBlogFormProps> = ({ blog, onSuccess }) => {
  const { mutate: updateBlog, isPending } = useUpdateBlog();
  const [form] = Form.useForm<UpdateBlogFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    form.setFieldsValue({
      title: blog.title || "",
      content: blog.content || "",
      blogImgUrl: blog.blogImgUrl || "",
    });
    setFileList([]);
  }, [blog, form]);

  const handleSubmit = async (values: UpdateBlogFormValues) => {
    let imageUrl = values.blogImgUrl?.trim() || "";

    if (fileList[0]?.originFileObj) {
      const uploadedUrl = await BaseService.uploadFile(fileList[0].originFileObj as File);
      if (!uploadedUrl) {
        message.error("Upload ảnh thất bại");
        return;
      }
      imageUrl = uploadedUrl;
    }

    updateBlog(
      {
        id: blog.id,
        title: values.title.trim(),
        content: values.content.trim(),
        blogImgUrl: imageUrl,
      },
      {
        onSuccess: () => {
          setFileList([]);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-[#20558A] mb-4">Cập nhật bài đăng</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề bài đăng" maxLength={150} />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea
            rows={8}
            placeholder="Nhập nội dung bài đăng"
            showCount
            maxLength={5000}
          />
        </Form.Item>

        <Form.Item label="Ảnh từ máy">
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="URL ảnh" name="blogImgUrl">
          <Input placeholder="https://..." />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={() => form.resetFields()} disabled={isPending}>
            Hoàn tác
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending} className="bg-[#20558A]">
            Lưu cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateBlogForm;