import { Form, Input, Button, message, Select } from "antd";
import { useCreateSession } from "../../../../hooks/useSession";
import type { CreateSessionRequest } from "../../../../types/session/Session.req.type";
import type { Course } from "../../../../types/course/Course.res.type";
import { useMemo } from "react";
import { useAuth } from "../../../../contexts/Auth.context";

interface CreateSessionFormProps {
  courses: Course[];
  onSuccess: () => void;
}

const CreateSessionForm = ({ courses, onSuccess }: CreateSessionFormProps) => {
  const [form] = Form.useForm();
  const createSessionMutation = useCreateSession();

  const { userInfo } = useAuth();

  const resolveCourseId = (course: Course | (Course & { _id?: string; course_id?: string })) => {
    // Ưu tiên field id theo type, fallback _id / course_id nếu backend trả khác
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCourse = course as any;
    return (
      course.id ||
      anyCourse._id ||
      anyCourse.course_id ||
      ""
    );
  };

  const userId = useMemo(() => {
    const typed = userInfo?.id || "";
    const anyUser = userInfo as unknown as { _id?: string } | null;
    const fromContext = typed || anyUser?._id || "";
    if (fromContext) return fromContext;

    try {
      const raw = localStorage.getItem("userInfo");
      if (!raw) return "";
      const parsed = JSON.parse(raw) as { id?: string; _id?: string };
      return parsed.id || parsed._id || "";
    } catch {
      return "";
    }
  }, [userInfo]);

  const toVietnameseSlug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  type SessionFormValues = {
    courseId: string;
    name: string;
    positionOrder: string;
  };

  const onFinish = (values: SessionFormValues) => {
    if (!userId) {
      message.error("Không xác định được người dùng hiện tại.");
      return;
    }

    if (!values.courseId) {
      message.error("Vui lòng chọn khóa học.");
      return;
    }

    const slug = toVietnameseSlug(values.name || "");

    const payload: CreateSessionRequest = {
      courseId: values.courseId,
      name: values.name,
      userId,
      slug,
      content: "",
      positionOrder: values.positionOrder,
    };

    createSessionMutation.mutate(payload, {
      onSuccess: () => {
        message.success("Tạo phiên học thành công");
        form.resetFields();
        onSuccess();
      },
      onError: (error) => {
        message.error("Tạo phiên học thất bại: " + (error as Error).message);
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo Phiên Học Mới
      </h2>
      <Form.Item
        label="Khóa học"
        name="courseId"
        rules={[{ required: true, message: "Vui lòng chọn khóa học" }]}
      >
        <Select placeholder="Chọn khóa học">
          {courses.map((course) => {
            const id = resolveCourseId(course);
            if (!id) return null;
            return (
              <Select.Option key={id} value={id}>
                {course.name || id}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên Phiên Học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên phiên học" }]}
      >
        <Input placeholder="Nhập tên phiên học" />
      </Form.Item>

      <Form.Item
        label="Thứ tự"
        name="positionOrder"
        rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
      >
        <Input type="number" min={0} placeholder="Nhập thứ tự" />
      </Form.Item>

      <Form.Item label="User ID (tự động)" tooltip="Lấy từ tài khoản đang đăng nhập">
        <Input value={userId} disabled />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={createSessionMutation.isPending}
          block
          className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
        >
          Tạo phiên học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateSessionForm;
