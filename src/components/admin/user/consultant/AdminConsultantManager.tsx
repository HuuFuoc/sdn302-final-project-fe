import { useEffect, useState } from "react";
import {
  Table,
  Image,
  message,
  Button,
  Space,
  Tag,
  Select,
  Modal,
  Form,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { Consultant } from "../../../../types/consultant/consultant.res.type";
import CustomPagination from "../../../common/Pagiation.com";
import CustomSearch from "../../../common/CustomSearch.com";
import AdminDeleteConsultant from "./AdminDeleteConsultant";
import AdminViewConsultant from "./AdminViewConsultant";
import AdminCreateConsultantForm from "./AdminCreateConsultant";
import { ConsultantService } from "../../../../services/consultant/consultant.service";

const { Option } = Select;

const AdminConsultantManager = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [consultantToDelete, setConsultantToDelete] = useState<Consultant | null>(
    null,
  );
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [viewConsultantId, setViewConsultantId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingUser, setEditingUser] = useState<Consultant | null>(null);
  const [editingInstructorId, setEditingInstructorId] = useState("");
  const [editForm] = Form.useForm();

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const res = await ConsultantService.getAllConsultants({
        PageNumber: current,
        PageSize: pageSize,
        FilterByName: searchKeyword || undefined,
      });
      const data = res.data as any;
      const rawList = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.pageData)
          ? data.pageData
          : Array.isArray(data)
            ? data
            : [];

      const filteredList =
        isVerified === undefined
          ? rawList
          : rawList.filter((item: any) => Boolean(item?.isVerified) === isVerified);

      setConsultants(filteredList);
      setTotal(
        data?.totalCount ??
          data?.total ??
          data?.pageInfo?.totalItems ??
          filteredList.length,
      );
    } catch {
      message.error("Lỗi khi lấy danh sách giảng viên!");
      setConsultants([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, searchKeyword, isVerified]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleView = (record: Consultant) => {
    setViewConsultantId(record.id);
    setViewModalOpen(true);
  };

  const handleDelete = (record: Consultant) => {
    setConsultantToDelete(record);
  };

  const handleOpenEdit = async (record: Consultant) => {
    setEditingUser(record);
    setEditModalOpen(true);

    try {
      const res = await ConsultantService.getAllConsultants({
        PageNumber: 1,
        PageSize: 1000,
      });
      const list = Array.isArray((res.data as any)?.data)
        ? (res.data as any).data
        : [];
      const matched = list.find((item: Consultant) => item.userId === record.id);

      if (!matched?.id) {
        message.error("Không tìm thấy instructorId để cập nhật.");
        setEditModalOpen(false);
        return;
      }

      setEditingInstructorId(matched.id);
      editForm.setFieldsValue({
        fullName: matched.fullName || record.fullName || "",
        email: matched.email || record.email || "",
        phoneNumber: matched.phoneNumber || record.phoneNumber || "",
        jobTitle: matched.jobTitle || "",
        qualifications: Array.isArray(matched.qualifications)
          ? matched.qualifications.join(", ")
          : "",
        status: matched.status || "Active",
      });
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Không thể tải dữ liệu giảng viên.",
      );
      setEditModalOpen(false);
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingInstructorId) {
      message.error("Thiếu instructorId để cập nhật.");
      return;
    }

    try {
      setUpdating(true);
      await ConsultantService.updateConsultant({
        id: editingInstructorId,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        jobTitle: values.jobTitle,
        qualifications: values.qualifications
          ? values.qualifications
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [],
        status: values.status,
      });

      message.success("Cập nhật giảng viên thành công");
      setEditModalOpen(false);
      setEditingInstructorId("");
      setEditingUser(null);
      editForm.resetFields();
      fetchConsultants();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Cập nhật giảng viên thất bại",
      );
    } finally {
      setUpdating(false);
    }
  };

  const columns: ColumnsType<Consultant> = [
    {
      title: "Ảnh đại diện",
      dataIndex: "profilePicUrl",
      key: "profilePicUrl",
      width: 80,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="avatar"
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">No img</span>
          </div>
        ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        const g = (gender || "").toLowerCase();
        if (g === "male" || g === "nam") return <Tag color="blue">Nam</Tag>;
        if (g === "female" || g === "nữ") return <Tag color="pink">Nữ</Tag>;
        return <Tag color="default">Khác</Tag>;
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: () => <Tag color="cyan">Giảng viên</Tag>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 220,
      render: (_, record: Consultant) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEdit(record)}
            title="Cập nhật"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý giảng viên</h2>
          <p className="text-gray-600 mt-1">Quản lý đội ngũ giảng viên hệ thống</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-primary"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm yêu cầu giảng viên
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <CustomSearch
          onSearch={(keyword) => {
            setCurrent(1);
            setSearchKeyword(keyword);
          }}
          placeholder="Tìm kiếm giảng viên theo tên, email, số điện thoại"
          inputWidth="w-96"
        />
        <Select
          allowClear
          placeholder="Lọc trạng thái xác thực"
          style={{ width: 200 }}
          value={isVerified}
          onChange={(value) => {
            setCurrent(1);
            setIsVerified(value);
          }}
        >
          <Option value={true}>Đã xác thực</Option>
          <Option value={false}>Chưa xác thực</Option>
        </Select>
      </div>

      <div className="mb-4">
        <Tag color="cyan">Tổng cộng: {total} giảng viên</Tag>
      </div>

      <Table
        columns={columns}
        dataSource={consultants}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        className="mb-4"
      />

      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />

      <AdminDeleteConsultant
        open={!!consultantToDelete}
        onClose={() => setConsultantToDelete(null)}
        consultant={consultantToDelete}
        onDeleted={() => {
          setConsultantToDelete(null);
          fetchConsultants();
        }}
      />

      {viewConsultantId && (
        <AdminViewConsultant
          userId={viewConsultantId}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setViewConsultantId(null);
          }}
        />
      )}

      <Modal
        open={createModalOpen}
        footer={null}
        onCancel={() => setCreateModalOpen(false)}
        destroyOnClose
        width={900}
        title="Tạo yêu cầu trở thành giảng viên"
      >
        <AdminCreateConsultantForm
          onSuccess={() => {
            setCreateModalOpen(false);
            fetchConsultants();
          }}
        />
      </Modal>

      <Modal
        open={editModalOpen}
        title={`Cập nhật giảng viên${
          editingUser?.fullName ? `: ${editingUser.fullName}` : ""
        }`}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingInstructorId("");
          setEditingUser(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        confirmLoading={updating}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item name="jobTitle" label="Chức danh">
            <Input />
          </Form.Item>

          <Form.Item
            name="qualifications"
            label="Bằng cấp / Chứng chỉ"
            extra="Nhập nhiều giá trị, phân tách bằng dấu phẩy"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminConsultantManager;
