import { useEffect, useMemo, useState } from "react";
import { Table, Image, message, Button, Space, Tag, Modal, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserService } from "../../../services/user/user.service";
import CustomPagination from "../../common/Pagiation.com";
import CustomSearch from "../../common/CustomSearch.com";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { UserResponse } from "../../../types/user/User.res.type";
import AdminDeleteUser from "./AdminDeleteUser";
import AdminCreateUserForm from "./AdminCreateUser";
import AdminViewUser from "./AdminViewUser";
import { UserRole } from "../../../app/enums/userRole.enum";

const { Option } = Select;

type BackendUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
  verify?: number;
  username?: string;
  avatar?: string;
  role?: number | string;
  phoneNumber?: string;
  gender?: string;
};

type UserTableRow = UserResponse & {
  roleCode: number | null;
  roleLabel: string;
  roleColor: string;
  username?: string;
  createdAtText?: string;
};

const mapRoleFromBackend = (
  backendRole: number | string | undefined,
): { role: UserRole | null; code: number | null; label: string; color: string } => {
  if (backendRole === 0 || backendRole === "Admin") {
    return { role: UserRole.ADMIN, code: 0, label: "Admin", color: "volcano" };
  }
  if (backendRole === 1 || backendRole === "Staff") {
    return { role: UserRole.STAFF, code: 1, label: "Staff", color: "geekblue" };
  }
  if (
    backendRole === 2 ||
    backendRole === "User" ||
    backendRole === "Customer"
  ) {
    return { role: UserRole.CUSTOMER, code: 2, label: "Customer", color: "green" };
  }
  if (
    backendRole === 3 ||
    backendRole === "Consultant" ||
    backendRole === "Instructor"
  ) {
    return {
      role: UserRole.INSTRUCTOR,
      code: 3,
      label: "Instructor",
      color: "purple",
    };
  }
  return { role: null, code: null, label: "Unknown", color: "default" };
};

const normalizeUser = (raw: BackendUser): UserTableRow => {
  const fullName = (raw.name || "").trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : fullName;
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";

  const roleMeta = mapRoleFromBackend(raw.role);

  return {
    id: raw._id || raw.id || "",
    firstName,
    lastName,
    fullName: fullName || "Không rõ",
    email: raw.email || "",
    phoneNumber: raw.phoneNumber || "",
    gender: raw.gender || "",
    dob: raw.date_of_birth || "",
    createdAt: (raw.created_at as any) || "",
    updatedAt: (raw.updated_at as any) || "",
    profilePicUrl: raw.avatar || "",
    role: (roleMeta.role || UserRole.CUSTOMER) as UserRole,
    isVerified: raw.verify === 1,
    isDeleted: false,
    password: "",
    ageGroup: "",
    verificationToken: "",
    verificationTokenExpires: new Date(),
    roleCode: roleMeta.code,
    roleLabel: roleMeta.label,
    roleColor: roleMeta.color,
    username: raw.username,
    token: "",
  };
};

const AdminUserManager = () => {
  const [allUsers, setAllUsers] = useState<UserTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await UserService.getAllUsersByAdmin({
        pageNumber: 1,
        pageSize: 1000,
      });
      const payload = res.data as any;

      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      const normalized = list.map((item: BackendUser) => normalizeUser(item));
      setAllUsers(normalized);
    } catch {
      message.error("Lỗi khi lấy danh sách người dùng!");
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return allUsers.filter((user) => {
      const matchKeyword =
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.username || "").toLowerCase().includes(keyword) ||
        (user.phoneNumber || "").toLowerCase().includes(keyword);

      const matchVerified =
        isVerified === undefined ? true : Boolean(user.isVerified) === isVerified;

      const matchRole = roleFilter === undefined ? true : user.roleCode === roleFilter;

      return matchKeyword && matchVerified && matchRole;
    });
  }, [allUsers, isVerified, roleFilter, searchKeyword]);

  const total = filteredUsers.length;

  const pagedUsers = useMemo(() => {
    const start = (current - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [current, filteredUsers, pageSize]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    if (current > maxPage) setCurrent(maxPage);
  }, [current, pageSize, total]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleView = (record: UserResponse) => {
    setViewUserId(record.id);
    setViewModalOpen(true);
  };

  const handleDelete = (record: UserResponse) => {
    setSelectedUser(record);
    setDeleteModalOpen(true);
  };

  const columns: ColumnsType<UserTableRow> = [
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
        <span className="font-medium text-gray-900">{text || "-"}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-blue-600">{text || "-"}</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "roleLabel",
      key: "roleLabel",
      render: (_: string, record: UserTableRow) => (
        <Tag color={record.roleColor} className="font-medium">
          {record.roleLabel}
        </Tag>
      ),
    },
    {
      title: "Xác thực",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (value: boolean) =>
        value ? <Tag color="green">Đã xác thực</Tag> : <Tag color="red">Chưa xác thực</Tag>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => (date ? new Date(date).toLocaleDateString("vi-VN") : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record: UserTableRow) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            title="Xoá"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
          <p className="text-gray-600 mt-1">
            Dữ liệu lấy từ API <strong>GET /user/all</strong> của Admin
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-[#20558A]"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm người dùng mới
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <CustomSearch
          onSearch={(keyword) => {
            setCurrent(1);
            setSearchKeyword(keyword);
          }}
          placeholder="Tìm kiếm theo tên, username, email, số điện thoại"
          inputWidth="w-96"
        />

        <Select
          allowClear
          placeholder="Lọc trạng thái xác thực"
          style={{ width: 220 }}
          value={isVerified}
          onChange={(value) => {
            setCurrent(1);
            setIsVerified(value);
          }}
        >
          <Option value={true}>Đã xác thực</Option>
          <Option value={false}>Chưa xác thực</Option>
        </Select>

        <Select
          allowClear
          placeholder="Lọc theo vai trò"
          style={{ width: 220 }}
          value={roleFilter}
          onChange={(value) => {
            setCurrent(1);
            setRoleFilter(value as number | undefined);
          }}
        >
          <Option value={0}>Admin</Option>
          <Option value={1}>Staff</Option>
          <Option value={2}>Customer</Option>
          <Option value={3}>Instructor</Option>
        </Select>
      </div>

      <div className="mb-4">
        <Tag color="blue">Tổng cộng: {total} tài khoản</Tag>
      </div>

      <Table
        columns={columns}
        dataSource={pagedUsers}
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

      <AdminDeleteUser
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={selectedUser}
        onDeleted={fetchUsers}
      />

      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        width={700}
      >
        <AdminCreateUserForm
          onSuccess={() => {
            setCreateModalOpen(false);
            fetchUsers();
          }}
        />
      </Modal>

      {viewUserId && (
        <AdminViewUser
          userId={viewUserId}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setViewUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUserManager;
