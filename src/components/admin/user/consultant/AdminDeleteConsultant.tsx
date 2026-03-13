import React from "react";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ConsultantService } from "../../../../services/consultant/consultant.service";
import type { Consultant } from "../../../../types/consultant/consultant.res.type";

interface AdminDeleteConsultantProps {
  open: boolean;
  onClose: () => void;
  consultant: Consultant | null;
  onDeleted: () => void;
}

const AdminDeleteConsultant: React.FC<AdminDeleteConsultantProps> = ({
  open,
  onClose,
  consultant,
  onDeleted,
}) => {
  const handleDelete = async () => {
    if (!consultant) {
      message.error("Không tìm thấy giảng viên.");
      return;
    }

    try {
      const res = await ConsultantService.getAllConsultants({
        PageNumber: 1,
        PageSize: 1000,
      });

      const consultantData = res.data?.data?.find((c) => c.userId === consultant.id);

      if (!consultantData) {
        message.error("Không tìm thấy giảng viên tương ứng với người dùng này!");
        return;
      }

      await ConsultantService.deleteConsultant({ id: consultantData.id });
      message.success(`Đã gỡ giảng viên: ${consultant.fullName}`);
      onClose();
      onDeleted?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Gỡ giảng viên thất bại!");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleDelete}
      okText="Xác nhận gỡ"
      okType="danger"
      cancelText="Hủy"
      title={
        <span className="text-red-600">
          <ExclamationCircleOutlined className="mr-2" />
          Xác nhận gỡ giảng viên
        </span>
      }
    >
      {consultant ? (
        <p>
          Bạn có chắc muốn gỡ giảng viên <strong>{consultant.fullName}</strong> không?
        </p>
      ) : (
        <p>Không tìm thấy thông tin giảng viên.</p>
      )}
    </Modal>
  );
};

export default AdminDeleteConsultant;
