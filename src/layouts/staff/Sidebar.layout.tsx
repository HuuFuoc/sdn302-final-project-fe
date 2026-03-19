import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Button, message } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth.context";
import { ROUTER_URL } from "../../consts/router.path.const";

const { Sider } = Layout;

const SidebarLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    message.success("Đăng xuất thành công!");
    navigate(ROUTER_URL.AUTH.LOGIN);
  };

  const userMenu: MenuProps = {
    items: [
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
        onClick: () => navigate(ROUTER_URL.STAFF.SETTINGS),
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = [
    { key: ROUTER_URL.STAFF.BASE, icon: <DashboardOutlined />, label: "Tổng quan" },
    { key: ROUTER_URL.STAFF.CONTENT, icon: <EditOutlined />, label: "Quản lý bài đăng" },
    { key: ROUTER_URL.STAFF.INSTRUCTORS, icon: <TeamOutlined />, label: "Quản lý giảng viên" },
    {
      key: ROUTER_URL.STAFF.INSTRUCTOR_REQUESTS,
      icon: <CheckCircleOutlined />,
      label: "Duyệt yêu cầu giảng viên",
    },
    { key: ROUTER_URL.STAFF.SETTINGS, icon: <SettingOutlined />, label: "Cài đặt" },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const sorted = [...menuItems].sort((a, b) => b.key.length - a.key.length);
    return sorted.find((item) => path.startsWith(item.key))?.key ?? ROUTER_URL.STAFF.BASE;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={{
        background: "var(--color-sidebar, #1a1a2e)",
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      className="flex flex-col"
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* Zone 1: Header - Profile/Logo - Clickable → Home */}
        <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center justify-between gap-2">
            <Link
              to={ROUTER_URL.COMMON.HOME}
              className={`flex flex-1 min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/5 active:scale-[0.98] ${collapsed ? "justify-center" : ""}`}
            >
              <Avatar
                src={userInfo?.profilePicUrl}
                icon={!userInfo?.profilePicUrl && <UserOutlined />}
                size={collapsed ? "default" : "small"}
                className="shrink-0 bg-[var(--color-success,#16a34a)] text-white"
              />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </div>
                  <div className="text-xs text-white/60">Nhân viên · Mỹ thuật thiếu nhi</div>
                </div>
              )}
            </Link>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="shrink-0 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5"
              style={{ width: 36, height: 36, fontSize: 16 }}
            />
          </div>
        </div>

        {/* Zone 2: Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = getSelectedKey() === item.key;
              return (
                <li key={item.key}>
                  <Link
                    to={item.key}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-[var(--color-success,#16a34a)] text-white shadow-sm"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center text-[15px]"
                      style={{ opacity: isActive ? 1 : 0.85 }}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Zone 3: Footer - Email - Fixed at bottom */}
        {!collapsed && (
          <div className="shrink-0 border-t border-white/10 px-4 py-3">
            <Dropdown menu={userMenu} trigger={["click"]} placement="topLeft">
              <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-white/5">
                <Avatar
                  src={userInfo?.profilePicUrl}
                  icon={!userInfo?.profilePicUrl && <UserOutlined />}
                  size={24}
                  className="shrink-0 bg-white/10 text-white/80"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs text-white/60">Email</div>
                  <div className="truncate text-xs font-medium text-white/90">
                    {userInfo?.email || "—"}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default SidebarLayout;
