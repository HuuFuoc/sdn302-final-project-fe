import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth.context";
import { ROUTER_URL } from "../../consts/router.path.const";

const { Sider } = Layout;

const createFocusHandlers = (itemName: string) => ({
  onFocus: (e: any) => {
    e.target.style.transform = "scale(1.01)";
    e.target.style.transition = "all 0.15s ease";
    e.target.style.backgroundColor = "rgba(24, 144, 255, 0.1)";
    e.target.style.borderRadius = "6px";
    console.log(`${itemName} item focused`);
  },
  onBlur: (e: any) => {
    e.target.style.transform = "scale(1)";
    e.target.style.backgroundColor = "transparent";
    console.log(`${itemName} item blurred`);
  },
});

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
        key: "profile",
        icon: <UserOutlined />,
        label: "Hồ sơ cá nhân",
        onClick: () => navigate("/profile"),
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
        onClick: () => navigate(ROUTER_URL.CONSULTANT.SETTINGS),
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
      key: ROUTER_URL.CONSULTANT.BASE,
      icon: <DashboardOutlined />,
      label: <Link to={ROUTER_URL.CONSULTANT.BASE}>Tổng quan</Link>,
      ...createFocusHandlers("Dashboard"),
    },
    {
      key: ROUTER_URL.CONSULTANT.CLIENTS,
      icon: <TeamOutlined />,
      label: <Link to={ROUTER_URL.CONSULTANT.CLIENTS}>Khách hàng</Link>,
      ...createFocusHandlers("Clients"),
    },
    {
      key: ROUTER_URL.CONSULTANT.COURSES,
      icon: <BookOutlined />,
      label: <Link to={ROUTER_URL.CONSULTANT.COURSES}>Quản lý khóa học</Link>,
      ...createFocusHandlers("Courses"),
    },
    {
      key: ROUTER_URL.CONSULTANT.REPORTS,
      icon: <DollarOutlined />,
      label: <Link to={ROUTER_URL.CONSULTANT.REPORTS}>Doanh thu</Link>,
      ...createFocusHandlers("Revenue"),
    },
    {
      key: ROUTER_URL.CONSULTANT.SETTINGS,
      icon: <SettingOutlined />,
      label: <Link to={ROUTER_URL.CONSULTANT.SETTINGS}>Cài đặt</Link>,
      ...createFocusHandlers("Settings"),
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const exactMatch = menuItems.find((item) => path === item.key);
    if (exactMatch) return exactMatch.key;

    const startsWithMatch = menuItems.find((item) => path.startsWith(item.key));
    if (startsWithMatch) return startsWithMatch.key;

    return ROUTER_URL.CONSULTANT.BASE;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      className="instructor-sider"
      style={{
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="instructor-sider-header">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link to={ROUTER_URL.COMMON.HOME} className="instructor-sider-logo">
              <div className="bg-amber-500 rounded-xl p-2.5 text-white font-bold shadow-sm">
                ART
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#78350F",
                    lineHeight: 1.3,
                  }}
                >
                  Tư vấn viên
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#B45309",
                    marginTop: "1px",
                  }}
                >
                  Mỹ thuật thiếu nhi
                </div>
              </div>
            </Link>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 32,
              height: 32,
              color: "#92400E",
            }}
          />
        </div>
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="instructor-sider-menu"
      />

      {!collapsed && (
        <div className="instructor-sider-footer">
          <Dropdown menu={userMenu} trigger={["click"]} placement="topLeft">
            <div className="instructor-sider-footer-inner">
              <Avatar
                src={userInfo?.profilePicUrl}
                icon={!userInfo?.profilePicUrl && <UserOutlined />}
                size="small"
                style={{ backgroundColor: "#f59e0b" }}
              />
              <div className="text-slate-800 flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {userInfo?.firstName} {userInfo?.lastName}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {userInfo?.email}
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
      )}
    </Sider>
  );
};

export default SidebarLayout;
