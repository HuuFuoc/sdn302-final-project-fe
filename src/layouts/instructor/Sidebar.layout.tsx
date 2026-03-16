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
      }}
    >
      {/* Header */}
      <div className="instructor-sider-header">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="instructor-sider-logo">
              <div
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #EA580C)",
                  borderRadius: "12px",
                  padding: "8px 10px",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.03em",
                  boxShadow: "0 2px 8px rgba(245,158,11,0.35)",
                  flexShrink: 0,
                }}
              >
                GV
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
                  Giảng viên
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#B45309",
                    marginTop: "1px",
                  }}
                >
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
              color: "#92400E",
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
                size="default"
                style={{
                  backgroundColor: "#FDE68A",
                  color: "#92400E",
                  border: "2px solid #F59E0B",
                  flexShrink: 0,
                }}
              />
              <div className="text-slate-800 flex-1 min-w-0">
                <div
                  className="text-sm truncate"
                  style={{ fontWeight: 600, color: "#44403C" }}
                >
                  {userInfo?.firstName} {userInfo?.lastName}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "#A8A29E", marginTop: "1px" }}
                >
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
