import { useEffect, useState } from "react";
import { Table, Button, Modal, Tooltip, message, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

import type { Session } from "../../../../types/session/Session.res.type";
import type { Course } from "../../../../types/course/Course.res.type";

import { SessionService } from "../../../../services/session/session.service";
import { CourseService } from "../../../../services/course/course.service";

import CreateSessionForm from "./CreateSessionForm.com";
import UpdateSessionForm from "./UpdateSessionForm.com";
import DeleteSession from "./DeleteSession.com";
import CustomSearch from "../../../common/CustomSearch.com";
import ViewSession from "./ViewSession.com";
import { useAuth } from "../../../../contexts/Auth.context";
import { UserRole } from "../../../../app/enums";
const { Option } = Select;

const SessionManager = () => {
  const [sessions, setSessions] = useState<
    (Session & { courseName?: string; courseId: string })[]
  >([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [viewSessionId, setViewSessionId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { userInfo } = useAuth();
  const isInstructorView =
    userInfo?.role === UserRole.INSTRUCTOR || userInfo?.role === UserRole.CONSULTANT;
  const currentUserId =
    (userInfo?.id as string | undefined) ||
    ((userInfo as unknown as { _id?: string } | null)?._id ?? "");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const courseRes = await CourseService.getAllCourses({
          pageNumber: 1,
          pageSize: 100,
          userId: isInstructorView && currentUserId ? currentUserId : undefined,
        });
        const courseList = courseRes.data?.data || [];
        setCourses(courseList);
        await fetchSessions(courseList);
      } catch {
        message.error("Lỗi khi tải danh sách khóa học hoặc buổi học");
      }
    };

    loadAll();
    // eslint-disable-next-line
  }, [searchKeyword]);

  const fetchSessions = async (courseList: Course[] = courses) => {
    setLoading(true);
    try {
      const res = await SessionService.getAllSessions({
        pageNumber: 1,
        pageSize: 1000,
        name: searchKeyword,
        userId: isInstructorView && currentUserId ? currentUserId : undefined,
      });
      const rawSessions: Session[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const sessionsWithCourseNames = rawSessions.map((session) => {
        const course = courseList.find((c) => c.id === session.courseId);
        return {
          ...session,
          courseName: course?.name || "-",
          courseId: course?.id || "",
        };
      });

      setSessions(sessionsWithCourseNames);
    } catch {
      message.error("Lỗi khi tải danh sách phiên học");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCreated = () => {
    setShowCreateModal(false);
    fetchSessions();
  };

  const handleUpdated = () => {
    setShowUpdateModal(false);
    setEditingSession(null); // Reset editingSession để modal luôn nhận session mới
    fetchSessions();
  };

  const openUpdateModal = (session: Session) => {
    setEditingSession(null); // Reset trước để đảm bảo form luôn nhận session mới
    setTimeout(() => {
      setEditingSession(session);
      setShowUpdateModal(true);
    }, 0);
  };

  const openViewModal = (id: string) => {
    setViewSessionId(id);
    setShowViewModal(true);
  };

  // Filter FE theo courseId
  const filteredSessions = courseFilter
    ? sessions.filter((s) => s.courseId === courseFilter)
    : sessions;

  const columns: ColumnsType<(typeof sessions)[0]> = [
    {
      title: "Tên buổi học",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-semibold text-slate-800">{text || "--"}</span>
      ),
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
      key: "courseName",
      render: (_, record) =>
        record.courseId ? (
          <Link
            to={`/courses/${record.courseId}`}
            className="text-primary hover:underline"
          >
            {record.courseName || "--"}
          </Link>
        ) : (
          <span className="text-slate-400 text-xs">--</span>
        ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Tooltip title={text}>
          <span
            dangerouslySetInnerHTML={{
              __html:
                text && text.length > 50
                  ? text.slice(0, 50) + "..."
                  : text || "--",
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              className="dash-icon-button !w-8 !h-8"
              onClick={() => openViewModal(record.id)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật">
            <Button
              icon={<EditOutlined />}
              size="small"
              className="dash-icon-button !w-8 !h-8"
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteSession
              sessionId={record.id}
              onDeleted={() => fetchSessions()}
              buttonProps={{
                icon: <DeleteOutlined />,
                size: "small",
                className: "dash-icon-button-danger !w-8 !h-8",
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="dash-card p-6">
      <div className="dash-toolbar">
        <div className="dash-toolbar-left">
          <CustomSearch
            onSearch={handleSearch}
            placeholder="Tìm kiếm theo tên buổi học"
            inputWidth="w-80"
          />

          {/* Filter khóa học FE */}
          <Select
            allowClear
            showSearch
            placeholder="Lọc theo khóa học"
            className="w-60"
            value={courseFilter ?? undefined}
            onChange={(value) => setCourseFilter(value ?? null)}
            optionFilterProp="children"
          >
            {courses.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          className="bg-primary px-4 h-10 rounded-full shadow-sm hover:shadow transition-shadow duration-200 text-white"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setShowCreateModal(true)}
        >
          Thêm buổi học
        </Button>
      </div>

      <div className="dash-table-wrapper">
        <Table
          columns={columns}
          dataSource={filteredSessions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="middle"
        />
      </div>

      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <CreateSessionForm courses={courses} onSuccess={handleCreated} />
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => {
          setShowUpdateModal(false);
          setEditingSession(null);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        {editingSession && (
          <UpdateSessionForm
            session={editingSession}
            onSuccess={handleUpdated}
            courses={courses}
          />
        )}
      </Modal>
      <ViewSession
        sessionId={viewSessionId}
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        courses={courses}
      />
    </div>
  );
};

export default SessionManager;
