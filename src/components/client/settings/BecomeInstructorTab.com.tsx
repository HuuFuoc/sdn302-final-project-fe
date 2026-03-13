import React from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { ReadOutlined, SendOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/Auth.context";
import { UserRole } from "../../../app/enums/userRole.enum";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { helpers } from "../../../utils";

interface BecomeInstructorTabProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface BecomeInstructorForm {
  jobTitle: string;
  qualifications: string;
  note?: string;
}

const BecomeInstructorTab: React.FC<BecomeInstructorTabProps> = ({
  loading,
  setLoading,
}) => {
  const [form] = Form.useForm<BecomeInstructorForm>();
  const { userInfo, role } = useAuth();

  const isAlreadyInstructor =
    role === UserRole.INSTRUCTOR || role === UserRole.CONSULTANT;

  const handleSubmit = async (values: BecomeInstructorForm) => {
    if (!userInfo?.id) {
      helpers.notificationMessage("Không xác định được người dùng", "error");
      return;
    }

    setLoading(true);
    try {
      await ConsultantService.becomeInstructor({
        userId: userInfo.id,
        jobTitle: values.jobTitle,
        qualifications: values.qualifications
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        note: values.note,
      });

      helpers.notificationMessage(
        "Gửi yêu cầu trở thành giảng viên thành công",
        "success"
      );
      form.resetFields();
    } catch (error: any) {
      helpers.notificationMessage(
        error?.response?.data?.message || "Gửi yêu cầu thất bại",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Trở thành giảng viên</h3>
          <p className="text-gray-600 mt-1">
            Gửi thông tin chuyên môn để đội ngũ Staff hoặc Admin xét duyệt vai trò giảng viên.
          </p>
        </div>

        {isAlreadyInstructor ? (
          <Alert
            type="success"
            showIcon
            message="Bạn đã có vai trò giảng viên"
            description="Tài khoản của bạn đang có quyền giảng viên, không cần gửi thêm yêu cầu."
          />
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Chức danh"
              name="jobTitle"
              rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
            >
              <Input placeholder="Ví dụ: Giảng viên tư vấn tâm lý" />
            </Form.Item>

            <Form.Item
              label="Bằng cấp / Chứng chỉ"
              name="qualifications"
              extra="Nhập nhiều giá trị, phân tách bằng dấu phẩy"
              rules={[{ required: true, message: "Vui lòng nhập bằng cấp/chứng chỉ" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Ví dụ: Thạc sĩ Tâm lý học, Chứng chỉ CBT, Chứng chỉ Coaching"
              />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea
                rows={3}
                placeholder="Mô tả ngắn kinh nghiệm giảng dạy hoặc tư vấn của bạn"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<SendOutlined />}
                className="bg-primary hover:bg-secondary"
              >
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-700 text-sm">
          <div className="flex items-start gap-2">
            <ReadOutlined className="mt-0.5" />
            <span>
              Sau khi gửi, yêu cầu của bạn sẽ xuất hiện trong mục quản lý yêu cầu giảng viên để Staff/Admin duyệt.
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BecomeInstructorTab;
