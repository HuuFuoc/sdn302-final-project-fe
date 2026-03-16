import { useEffect, useMemo, useState } from "react";
import { Input, Form, Button, message, Select } from "antd";
import { useCreateLesson } from "../../../../hooks/useLesson";
import { BaseService } from "../../../../app/api/base.service";
import { SessionService } from "../../../../services/session/session.service";
import { CourseService } from "../../../../services/course/course.service";
import type { CreateLessonRequest } from "../../../../types/lesson/Lesson.req.type";
import type { Course } from "../../../../types/course/Course.res.type";
import type { Session } from "../../../../types/session/Session.res.type";
import Editor from "../../../common/Editor.com";
import { useAuth } from "../../../../contexts/Auth.context";
const { Option } = Select;

interface CreateLessonFormProps {
  courses: Course[];
  onSuccess: () => void;
}

const CreateLessonForm = ({ courses, onSuccess }: CreateLessonFormProps) => {
  const [form] = Form.useForm();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  const [fileImage, setFileImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [fileVideo, setFileVideo] = useState<File | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createLesson = useCreateLesson();

  const { userInfo } = useAuth();

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

  // danh sách khóa học cho giảng viên (ưu tiên fetch từ API, fallback prop)
  const [courseOptions, setCourseOptions] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!userId) return;
      try {
        const res = await CourseService.getAllCourses({
          pageNumber: 1,
          pageSize: 100,
          userId,
        });
        const payload = res.data as any;
        const list: Course[] = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        if (list.length) {
          setCourseOptions(list);
        }
      } catch {
        // nếu lỗi, giữ nguyên courses từ props
      }
    };
    loadCourses();
  }, [userId]);

  const effectiveCourses: Course[] =
    courseOptions.length > 0 ? courseOptions : courses;

  const resolveCourseId = (
    course: Course | (Course & { _id?: string; course_id?: string }),
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCourse = course as any;
    return course.id || anyCourse._id || anyCourse.course_id || "";
  };

  const resolveSessionId = (
    session: Session | (Session & { _id?: string; session_id?: string }),
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anySession = session as any;
    return session.id || anySession._id || anySession.session_id || "";
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchSessions(selectedCourseId);
    } else {
      setFilteredSessions([]);
      setSelectedSessionId(null);
    }
  }, [selectedCourseId]);

  const fetchSessions = async (courseId: string) => {
    try {
      const res = await SessionService.getSessionByCourseId({
        CourseId: courseId,
      });
      const payload = res.data as any;
      const data: Session[] = Array.isArray(payload?.data?.items)
        ? payload.data.items
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
      setFilteredSessions(data);
      setSelectedSessionId(null);
    } catch {
      message.error("Lỗi khi tải phiên học");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFileImage(selected);
      setPreviewImageUrl(URL.createObjectURL(selected));
    } else {
      setFileImage(null);
      setPreviewImageUrl("");
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFileVideo(selected);
      setPreviewVideoUrl(URL.createObjectURL(selected));
    } else {
      setFileVideo(null);
      setPreviewVideoUrl("");
    }
  };

  const handleSubmit = async (values: any) => {
    if (!userId) {
      message.error("Không xác định được user hiện tại.");
      return;
    }
    if (!selectedCourseId) {
      message.error("Vui lòng chọn khóa học");
      return;
    }
    if (!selectedSessionId) {
      message.error("Vui lòng chọn phiên học");
      return;
    }

    // Nội dung luôn bắt buộc
    if (!values.content || values.content.trim() === "") {
      message.error("Vui lòng nhập nội dung bài học");
      return;
    }

    setIsSubmitting(true);

    let uploadedImageUrl = "";
    let uploadedVideoUrl = "";

    if (fileImage) {
      try {
        const url = await BaseService.uploadFile(fileImage);
        if (!url) throw new Error("Upload ảnh thất bại");
        uploadedImageUrl = url;
      } catch {
        message.error("Upload ảnh thất bại.");
        setIsSubmitting(false);
        return;
      }
    }

    if (fileVideo) {
      try {
        const url = await BaseService.uploadFile(fileVideo);
        if (!url) throw new Error("Upload video thất bại");
        uploadedVideoUrl = url;
      } catch {
        message.error("Upload video thất bại.");
        setIsSubmitting(false);
        return;
      }
    }

    let lessonType: string = "text";
    if (uploadedVideoUrl || fileVideo) {
      lessonType = "video";
    } else if (uploadedImageUrl || fileImage) {
      lessonType = "image";
    }

    const payload: CreateLessonRequest = {
      name: values.name,
      content: values.content || "",
      positionOrder: Number(values.positionOrder) || 0,
      fullTime: Number(values.fullTime) || 0,
      courseId: selectedCourseId,
      sessionId: selectedSessionId,
      lessonType,
      imageUrl: uploadedImageUrl,
      videoUrl: uploadedVideoUrl,
      userId,
    };

    createLesson.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setFileImage(null);
        setPreviewImageUrl("");
        setFileVideo(null);
        setPreviewVideoUrl("");
        setSelectedCourseId(null);
        setSelectedSessionId(null);
        setIsSubmitting(false);
        onSuccess();
      },
      onError: () => {
        message.error("Tạo bài học thất bại.");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <h2 className="text-2xl font-bold text-[#20558A] mb-2 text-center">
        Tạo Bài Học Mới
      </h2>

      <Form.Item label="Khóa học" required>
        <Select
          placeholder="Chọn khóa học"
          allowClear
          value={selectedCourseId || undefined}
          onChange={setSelectedCourseId}
        >
          {effectiveCourses.map((c) => {
            const id = resolveCourseId(c);
            if (!id) return null;
            return (
              <Option key={id} value={id}>
                {c.name || id}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="Phiên học" required>
        <Select
          placeholder="Chọn phiên học"
          allowClear
          value={selectedSessionId || undefined}
          onChange={setSelectedSessionId}
          disabled={!selectedCourseId}
        >
          {filteredSessions.map((s) => {
            const id = resolveSessionId(s);
            if (!id) return null;
            return (
              <Option key={id} value={id}>
                {s.name || id}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label="Tên bài học"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên bài học" }]}
      >
        <Input />
      </Form.Item>

      {/* Nội dung bài học – luôn hiển thị cho mọi loại bài học */}
      <Form.Item
        label="Nội dung"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập nội dung bài học" }]}
      >
        <Editor />
      </Form.Item>

      {/* Upload ảnh (tùy chọn) */}
      <Form.Item label="Upload ảnh (tùy chọn)">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {previewImageUrl && (
          <img
            src={previewImageUrl}
            alt="preview"
            className="mt-2 w-32 h-20 object-cover rounded border"
          />
        )}
      </Form.Item>

      {/* Upload video (tùy chọn) */}
      <Form.Item label="Upload video (tùy chọn)">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="block file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {previewVideoUrl && (
          <video
            controls
            src={previewVideoUrl}
            className="mt-2 w-64 h-36 rounded border"
          />
        )}
      </Form.Item>

      <Form.Item
        label="Thứ tự hiển thị"
        name="positionOrder"
        rules={[
          { required: true, message: "Vui lòng nhập thứ tự hiển thị" },
          {
            type: "number",
            min: 0,
            transform: (value) => (value ? Number(value) : 0),
            message: "Thứ tự phải là số >= 0",
          },
        ]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item
        label="Thời lượng (phút)"
        name="fullTime"
        rules={[
          {
            type: "number",
            min: 0,
            transform: (value) => (value ? Number(value) : 0),
            message: "Thời lượng phải là số >= 0",
          },
        ]}
      >
        <Input type="number" min={0} />
      </Form.Item>

      <Form.Item label="User ID (tự động)">
        <Input value={userId} disabled />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          block
          className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:from-blue-800 hover:to-blue-600 transition disabled:opacity-60"
        >
          Tạo bài học
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateLessonForm;
