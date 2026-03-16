import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, message } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  StarOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlayCircleOutlined,
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
        key: "profile",
        icon: <UserOutlined />,
        label: "Hồ sơ cá nhân",
        onClick: () => navigate("/profile"),
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
        onClick: () => navigate(ROUTER_URL.INSTRUCTOR.SETTINGS),
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
      key: ROUTER_URL.INSTRUCTOR.BASE,
      icon: <DashboardOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.BASE}>Tổng quan</Link>,
    },
    {
      key: ROUTER_URL.INSTRUCTOR.COURSES,
      icon: <BookOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.COURSES}>Khóa học của tôi</Link>,
    },
    {
      key: ROUTER_URL.INSTRUCTOR.LESSONS,
      icon: <PlayCircleOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.LESSONS}>Bài học</Link>,
    },
    {
      key: ROUTER_URL.INSTRUCTOR.STUDENTS,
      icon: <TeamOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.STUDENTS}>Học viên</Link>,
    },
    {
      key: ROUTER_URL.INSTRUCTOR.REVIEWS,
      icon: <StarOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.REVIEWS}>Đánh giá</Link>,
    },
    {
      key: ROUTER_URL.INSTRUCTOR.REVENUE,
      icon: <DollarOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.REVENUE}>Doanh thu</Link>,
    },
    {
      key: ROUTER_URL.INSTRUCTOR.SETTINGS,
      icon: <SettingOutlined />,
      label: <Link to={ROUTER_URL.INSTRUCTOR.SETTINGS}>Cài đặt</Link>,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    const exactMatch = menuItems.find((item) => path === item.key);
    if (exactMatch) return exactMatch.key;

    const startsWithMatch = menuItems.find((item) => path.startsWith(item.key));
    if (startsWithMatch) return startsWithMatch.key;

    return ROUTER_URL.INSTRUCTOR.BASE;
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
        borderRight: "1px solid rgba(226,232,240,0.7)",
        background: "#FFF9DD",
      }}
    >
      {/* Header */}
      <div className="instructor-sider-header">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="instructor-sider-logo">
              <div className="bg-amber-500 rounded-xl p-2.5 text-white font-bold shadow-sm">
                GV
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold tracking-wide">
                  Giảng viên
                </div>
                <div className="text-[11px] text-gray-300">
                  Khóa học vẽ &amp; mỹ thuật
                </div>
              </div>
            </div>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 32,
              height: 32,
              color: "white",
            }}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="instructor-sider-menu"
      />

      {/* User Profile */}
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
