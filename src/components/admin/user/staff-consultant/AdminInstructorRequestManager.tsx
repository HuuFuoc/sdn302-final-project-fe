import { useEffect, useState } from "react";
import { Alert, Button, message, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "../../../../contexts/Auth.context";
import { UserRole } from "../../../../app/enums/userRole.enum";
import { ConsultantService } from "../../../../services/consultant/consultant.service";

interface InstructorRequestItem {
  id?: string;
  requestId?: string;
  instructorRequestId?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  note?: string;
  status?: string;
  requestStatus?: string;
  createdAt?: string;
  [key: string]: any;
}

const getRequestStatus = (item: InstructorRequestItem) => {
  return (item.requestStatus || item.status || "Pending").toString();
};

const getRequestId = (item: InstructorRequestItem) => {
  return (
    item.requestId ||
    item.instructorRequestId ||
    item.RequestId ||
    item.requestID ||
    item.instructor_request_id ||
    item.id ||
    item._id ||
    item.request?.id ||
    item.request?.requestId ||
    item.request?.requestID
  );
};

const AdminInstructorRequestManager = () => {
  const { role } = useAuth();
  const [requests, setRequests] = useState<InstructorRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string>("");

  const canReviewRequests =
    role === UserRole.STAFF || role === UserRole.ADMIN;

  const fetchRequests = async () => {
    if (!canReviewRequests) return;

    setLoading(true);
    try {
      const res = await ConsultantService.getInstructorRequests({
        PageNumber: 1,
        PageSize: 100,
      });
      const data = res?.data as any;
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.pageData)
          ? data.pageData
          : Array.isArray(data)
            ? data
            : [];
      setRequests(
        list.map((item: InstructorRequestItem) => ({
          ...item,
          requestId: getRequestId(item),
        }))
      );
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Không thể tải yêu cầu giảng viên"
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canReviewRequests]);

  const handleReview = async (
    record: InstructorRequestItem,
    isApproved: boolean
  ) => {
    const requestId = getRequestId(record);
    if (!requestId) {
      message.error("Thiếu requestId để duyệt yêu cầu");
      return;
    }

    try {
      setReviewingId(requestId);
      await ConsultantService.reviewInstructorRequest({
        requestId,
        isApproved,
      });
      message.success(isApproved ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu");
      fetchRequests();
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message || "Xử lý yêu cầu thất bại");
    } finally {
      setReviewingId("");
    }
  };

  const columns: ColumnsType<InstructorRequestItem> = [
    {
      title: "Người gửi",
      key: "fullName",
      render: (_, record) => record.fullName || record.user?.fullName || "-",
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.email || record.user?.email || "-",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) =>
        value ? new Date(value).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (value: string) => value || "-",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const status = getRequestStatus(record).toLowerCase();
        if (status.includes("approve") || status.includes("accept")) {
          return <Tag color="green">Đã duyệt</Tag>;
        }
        if (status.includes("reject")) {
          return <Tag color="red">Đã từ chối</Tag>;
        }
        return <Tag color="gold">Chờ duyệt</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const status = getRequestStatus(record).toLowerCase();
        const isPending =
          !status.includes("approve") &&
          !status.includes("reject") &&
          !status.includes("accept");

        if (!isPending) {
          return <span className="text-gray-400">Đã xử lý</span>;
        }

        return (
          <Space>
            <Popconfirm
              title="Duyệt yêu cầu này?"
              okText="Duyệt"
              cancelText="Huỷ"
              onConfirm={() => handleReview(record, true)}
            >
              <Button
                type="primary"
                size="small"
                className="bg-green-600"
                loading={reviewingId === getRequestId(record)}
              >
                Duyệt
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Từ chối yêu cầu này?"
              okText="Từ chối"
              cancelText="Huỷ"
              onConfirm={() => handleReview(record, false)}
            >
              <Button
                danger
                size="small"
                loading={reviewingId === getRequestId(record)}
              >
                Từ chối
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Yêu cầu trở thành giảng viên
        </h2>
        <p className="text-gray-600">Duyệt hoặc từ chối yêu cầu từ người dùng</p>
      </div>

      {!canReviewRequests ? (
        <Alert
          type="info"
          showIcon
          message="Bạn không có quyền truy cập"
          description="Chỉ Staff hoặc Admin mới có quyền duyệt yêu cầu giảng viên."
        />
      ) : (
        <Table
          rowKey={(record) => getRequestId(record) || `${record.userId}-${record.createdAt}`}
          columns={columns}
          dataSource={requests}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AdminInstructorRequestManager;
