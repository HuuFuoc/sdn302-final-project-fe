import React, { useState } from "react";
import { Tabs } from "antd";
import { TeamOutlined, AuditOutlined } from "@ant-design/icons";
import AdminConsultantManager from "../consultant/AdminConsultantManager";
import AdminInstructorRequestManager from "./AdminInstructorRequestManager";

const AdminStaffConsultantManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("instructor");

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý giảng viên
        </h1>
        <p className="text-gray-600">
          Quản lý giảng viên và duyệt yêu cầu trở thành giảng viên
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="px-6 pt-4"
          items={[
            {
              key: "instructor",
              label: (
                <span className="flex items-center gap-2">
                  <TeamOutlined />
                  Giảng viên và quản lý giảng viên
                </span>
              ),
              children: <AdminConsultantManager />,
            },
            {
              key: "instructor-request",
              label: (
                <span className="flex items-center gap-2">
                  <AuditOutlined />
                  Yêu cầu giảng viên
                </span>
              ),
              children: <AdminInstructorRequestManager />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AdminStaffConsultantManager;
