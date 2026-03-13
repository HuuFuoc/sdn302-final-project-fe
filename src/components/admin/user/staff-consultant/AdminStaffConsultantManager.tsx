import React, { useState } from "react";
import { Tabs } from "antd";
import { UserOutlined, TeamOutlined, AuditOutlined } from "@ant-design/icons";
import AdminStaffManager from "../staff/AdminStaffManager";
import AdminConsultantManager from "../consultant/AdminConsultantManager";
import AdminInstructorRequestManager from "./AdminInstructorRequestManager";

const AdminStaffConsultantManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("staff");

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý Nhân viên & Giảng viên
        </h1>
        <p className="text-gray-600">
          Quản lý tập trung nhân sự và duyệt yêu cầu trở thành giảng viên
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
              key: "staff",
              label: (
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  Nhân viên
                </span>
              ),
              children: <AdminStaffManager />,
            },
            {
              key: "instructor",
              label: (
                <span className="flex items-center gap-2">
                  <TeamOutlined />
                  Giảng viên
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
