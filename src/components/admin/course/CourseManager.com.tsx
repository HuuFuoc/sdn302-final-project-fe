import { useEffect, useState } from "react";
import { CourseService } from "../../../services/course/course.service";
import type { CourseRequest } from "../../../types/course/Course.req.type";
import type { Course } from "../../../types/course/Course.res.type";
import { Table, Button, message, Image, Modal, Tooltip, Select } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import CreateCourseForm from "./CreateCourseForm.com";
import UpdateCourseForm from "./UpdateCourseForm.com";
import DeleteCourse from "./DeleteCourse.com";
import CustomPagination from "../../common/Pagiation.com";
import CustomSearch from "../../common/CustomSearch.com";
import ViewCourse from "./ViewCourse.com";
import { useAuth } from "../../../contexts/Auth.context";
import { UserRole } from "../../../app/enums";

const { Option } = Select;

const AdminCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const { userInfo } = useAuth();

  const isInstructorView =
    userInfo?.role === UserRole.INSTRUCTOR || userInfo?.role === UserRole.CONSULTANT;

  const currentUserId =
    (userInfo?.id as string | undefined) ||
    ((userInfo as unknown as { _id?: string } | null)?._id ?? "");
  const fetchCourses = async () => {
    setLoading(true);
    const params: CourseRequest = {
      pageNumber: current,
      pageSize: pageSize,
      filterByName: searchKeyword,
      userId: isInstructorView && currentUserId ? currentUserId : undefined,
    };
    try {
      const res = await CourseService.getAllCourses(params);
      const data = res.data as any;
      setCourses(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setCourses([]);
      message.error("Lỗi khi lấy danh sách khóa học!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [current, pageSize, searchKeyword]);

  const handleCourseCreated = () => {
    setShowCreateModal(false);
    fetchCourses();
  };

  const handleCourseUpdated = () => {
    setShowUpdateModal(false);
    fetchCourses();
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const openUpdateModal = (course: Course) => {
    setEditingCourse(course);
    setShowUpdateModal(true);
  };

  // Filter bằng frontend theo status
  const filteredCourses = statusFilter
    ? courses.filter((course) => course.status === statusFilter)
    : courses;

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrls",
      key: "imageUrl",
      render: (url: string) => {
        const src =
          typeof url === "string" && url.length > 0
            ? url
            : "https://via.placeholder.com/120x80.png?text=Course";

        return (
          <Image
            src={src}
            alt="course thumbnail"
            width={96}
            height={72}
            className="thumb-course"
            fallback="https://via.placeholder.com/120x80.png?text=Course"
            preview={false}
          />
        );
      },
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="max-w-xs font-semibold text-slate-800 leading-snug">
          {text || "--"}
        </div>
      ),
    },

    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) =>
        discount > 0 ? (
          <span className="badge-soft-danger">
            -{discount?.toLocaleString("vi-VN")}% học phí
          </span>
        ) : (
          <span className="text-slate-400 text-xs">Không</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <>
          {status === "published" && (
            <span className="badge-soft-success">Đã xuất bản</span>
          )}
          {status === "archived" && (
            <span className="badge-soft-primary">Đã lưu trữ</span>
          )}
          {status !== "published" && status !== "archived" && (
            <span className="badge-soft-primary">Nháp</span>
          )}
        </>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <div className="text-right font-semibold text-slate-900">
          {typeof price === "number"
            ? `${price.toLocaleString("vi-VN")}₫`
            : "--"}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Course) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              className="dash-icon-button !w-8 !h-8"
              size="small"
              onClick={() => {
                setViewingCourseId(record.id);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Cập nhật">
            <Button
              icon={<EditOutlined />}
              className="dash-icon-button !w-8 !h-8"
              size="small"
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteCourse
              courseId={record.id}
              onDeleted={fetchCourses}
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
    <div className="dash-card p-6 relative">
      <div className="dash-toolbar">
        {/* Bên trái: Search + Filter */}
        <div className="dash-toolbar-left">
          <CustomSearch
            onSearch={(keyword) => {
              setCurrent(1);
              setSearchKeyword(keyword);
            }}
            placeholder="Tìm kiếm theo tên khóa học"
            inputWidth="w-80"
          />

          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            className="w-60"
            value={statusFilter ?? undefined}
            onChange={(value) => setStatusFilter(value ?? null)}
          >
            <Option value="draft">Nháp (draft)</Option>
            <Option value="published">Đã xuất bản (published)</Option>
            <Option value="archived">Lưu trữ (archived)</Option>
          </Select>
        </div>

        {/* Bên phải: Nút tạo mới */}
        <Button
          type="primary"
          className="bg-primary px-4 h-10 rounded-full shadow-sm hover:shadow transition-shadow duration-200"
          onClick={() => setShowCreateModal(true)}
        >
          Tạo khóa học mới
        </Button>
      </div>

      {/* Bảng danh sách khóa học */}
      <div className="dash-table-wrapper">
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          loading={loading}
          pagination={false}
          bordered={false}
          size="middle"
        />
      </div>

      {/* Phân trang */}
      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />

      {/* Modal tạo khóa học */}
      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
      >
        <CreateCourseForm onSuccess={handleCourseCreated} />
      </Modal>

      {/* Modal cập nhật khóa học */}
      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        width={600}
      >
        {editingCourse && (
          <UpdateCourseForm
            course={editingCourse}
            onSuccess={handleCourseUpdated}
          />
        )}
      </Modal>
      {viewingCourseId && (
        <ViewCourse
          courseId={viewingCourseId}
          open={viewModalOpen}
          onClose={() => {
            setViewingCourseId(null);
            setViewModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminCourseManager;
