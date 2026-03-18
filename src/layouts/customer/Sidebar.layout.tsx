import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Button, message } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
        onClick: () => navigate(ROUTER_URL.CUSTOMER.SETTINGS),
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
    {
      key: ROUTER_URL.CUSTOMER.BASE,
      icon: <DashboardOutlined />,
      label: "Tổng quan",
    },
    {
      key: ROUTER_URL.CUSTOMER.MY_COURSE,
      icon: <BookOutlined />,
      label: "Khóa học của tôi",
    },
    {
      key: ROUTER_URL.CUSTOMER.ORDER_HISTORY,
      icon: <FileTextOutlined />,
      label: "Lịch sử đơn hàng",
    },
    {
      key: ROUTER_URL.CUSTOMER.SETTINGS,
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const exactMatch = menuItems.find((item) => path === item.key);
    if (exactMatch) return exactMatch.key;

    const startsWithMatch = menuItems.find((item) => path.startsWith(item.key));
    if (startsWithMatch) return startsWithMatch.key;

    return ROUTER_URL.CUSTOMER.BASE;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      style={{
        background: "linear-gradient(180deg, #e8f4fc 0%, #fdf9f3 100%)",
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: "0 0 30px rgba(15, 40, 80, 0.08)",
      }}
      className="flex flex-col"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm">
            {!collapsed && (
              <Link to={ROUTER_URL.COMMON.HOME} className="flex items-center space-x-3">
                <div className="rounded-xl bg-gradient-to-br from-primary to-[#6610F2] px-3 py-2 text-sm font-bold text-white shadow-md">
                  ART
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                    Tài khoản khách hàng
                  </span>
                  <span className="text-[11px] text-slate-500">Hành trình mỹ thuật của bé</span>
                </div>
              </Link>
            )}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center rounded-xl text-slate-600 hover:bg-white/80"
              style={{
                fontSize: "18px",
                width: 34,
                height: 34,
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = getSelectedKey() === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`group flex w-full items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "border border-primary/20 bg-white text-primary shadow-md"
                      : "border border-transparent bg-white/40 text-slate-700 hover:bg-white/80 hover:text-primary"
                    }`}
                >
                  <span
                    className={`mr-3 flex items-center justify-center rounded-xl text-base transition-colors duration-200
                      ${isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-white/80 text-slate-500 group-hover:bg-primary/5 group-hover:text-primary"
                      }`}
                    style={{ width: 32, height: 32 }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="px-4 pb-4 pt-2">
            <div className="rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-sm">
              <Dropdown menu={userMenu} trigger={["click"]} placement="topLeft">
                <button className="w-full cursor-pointer rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-slate-50">
                  <div className="flex items-center">
                    <Avatar
                      src={userInfo?.profilePicUrl}
                      icon={!userInfo?.profilePicUrl && <UserOutlined />}
                      size="small"
                      className="mr-3 bg-primary/10 text-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-800">
                        {userInfo?.firstName} {userInfo?.lastName}
                      </div>
                      <div className="truncate text-[11px] text-slate-500">{userInfo?.email}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
                      Quản lý tài khoản
                    </span>
                  </div>
                </button>
              </Dropdown>
            </div>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default SidebarLayout;
