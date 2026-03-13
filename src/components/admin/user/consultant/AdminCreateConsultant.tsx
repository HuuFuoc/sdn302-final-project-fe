import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { ConsultantService } from "../../../../services/consultant/consultant.service";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";
import type { BecomeInstructorRequest } from "../../../../types/consultant/consultant.req.type";

const { Option } = Select;

const AdminCreateConsultantForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await UserService.getAllUsers({
          pageNumber: 1,
          pageSize: 50,
        });

        const data = res.data as any;
        if (!Array.isArray(data?.data)) {
          throw new Error("Invalid data format from API");
        }

        const filteredUsers = data.data.filter(
          (user: UserResponse) => user.role?.toLowerCase() !== "instructor",
        );

        setUsers(filteredUsers);
      } catch {
        message.error("Không thể tải danh sách người dùng!");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const payload: BecomeInstructorRequest = {
        userId: values.userId,
        qualifications: values.qualifications
          ?.split(",")
          .map((q: string) => q.trim())
          .filter(Boolean),
        jobTitle: values.jobTitle,
        note: values.note,
      };

      await ConsultantService.becomeInstructor(payload);
      message.success("Đã gửi yêu cầu trở thành giảng viên");
      form.resetFields();
      onSuccess?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Gửi yêu cầu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Gửi yêu cầu trở thành giảng viên
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item
          name="userId"
          label="Chọn người dùng"
          rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
        >
          {loadingUsers ? (
            <Spin />
          ) : (
            <Select
              placeholder="Chọn người dùng"
              showSearch
              optionFilterProp="children"
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.fullName}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item name="qualifications" label="Bằng cấp / Chứng chỉ">
          <Input.TextArea
            placeholder="Nhập bằng cấp, cách nhau bằng dấu phẩy"
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item name="jobTitle" label="Chức danh">
          <Input />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-11 bg-[#20558A] hover:bg-blue-700 text-white font-semibold rounded"
            loading={submitting}
          >
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminCreateConsultantForm;
