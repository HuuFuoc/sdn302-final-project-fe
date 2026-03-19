import React, { useState } from "react";
import { Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useCreateBlog } from "../../../hooks/useBlog";
import { BaseService } from "../../../app/api/base.service";

interface CreateBlogFormProps {
  onSuccess?: () => void;
}

type CreateBlogFormValues = {
  title: string;
  content: string;
  blogImgUrl?: string;
};

const CreateBlogForm: React.FC<CreateBlogFormProps> = ({ onSuccess }) => {
  const { mutate: createBlog, isPending } = useCreateBlog();
  const [form] = Form.useForm<CreateBlogFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: CreateBlogFormValues) => {
    let imageUrl = values.blogImgUrl?.trim() || "";

    if (fileList[0]?.originFileObj) {
      const uploadedUrl = await BaseService.uploadFile(fileList[0].originFileObj as File);
      if (!uploadedUrl) {
        message.error("Upload ảnh thất bại");
        return;
      }
      imageUrl = uploadedUrl;
    }

    createBlog(
      {
        title: values.title.trim(),
        content: values.content.trim(),
        blogImgUrl: imageUrl,
      },
      {
        onSuccess: () => {
          form.resetFields();
          setFileList([]);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold text-[#20558A] mb-4">Tạo bài đăng mới</h2>
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
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Hoặc URL ảnh" name="blogImgUrl">
          <Input placeholder="https://..." />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={() => form.resetFields()} disabled={isPending}>
            Làm mới
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending} className="bg-[#20558A]">
            Tạo bài đăng
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateBlogForm;