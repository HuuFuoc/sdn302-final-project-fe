import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  BookOutlined,
  EditOutlined,
  BarChartOutlined,
  CrownOutlined,
  LogoutOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Tooltip, Badge, Avatar, Divider } from "antd";
import { cn } from "../../utils/cn";
import { useAuth } from "../../contexts/Auth.context";

const navSections = [
  {
    title: "Tổng Quan",
    items: [
      {
        name: "Bảng Điều Khiển",
        to: ROUTER_URL.ADMIN.BASE,
        icon: <DashboardOutlined />,
        badge: null,
        description: "Tổng quan hệ thống",
      },
      {
        name: "Thống Kê & Báo Cáo",
        to: ROUTER_URL.ADMIN.ANALYTICS,
        icon: <BarChartOutlined />,
        badge: null,
        description: "Phân tích dữ liệu và báo cáo",
      },
    ],
  },
  {
    title: "Quản Lý Người Dùng",
    items: [
      {
        name: "Tài Khoản Người Dùng",
        to: ROUTER_URL.ADMIN.MANAGER_USER,
        icon: <TeamOutlined />,
        badge: "2.8k",
        description: "Quản lý tất cả tài khoản",
      },
      {
        name: "Giảng viên & Quản lý giảng viên",
        to: ROUTER_URL.ADMIN.STAFF_CONSULTANTS,
        icon: <CrownOutlined />,
        badge: "45",
        description: "Quản lý giảng viên và yêu cầu giảng viên",
      },
    ],
  },
  {
    title: "Nội Dung",
    items: [
      {
        name: "Quản Lý Khóa Học",
        to: ROUTER_URL.ADMIN.MANAGER_COURSE,
        icon: <BookOutlined />,
        badge: "23",
        description: "Danh sách khóa học",
      },
      {
        name: "Quản Lý Danh Mục",
        to: ROUTER_URL.ADMIN.MANAGER_CATEGORY,
        icon: <FolderOpenOutlined />,
        badge: null,
        description: "Quản lý danh mục khóa học",
      },
      {
        name: "Quản Lý Bài Đăng",
        to: ROUTER_URL.ADMIN.MANAGER_BLOG,
        icon: <EditOutlined />,
        badge: "156",
        description: "Quản lý bài đăng hệ thống",
      },
      {
        name: "Cài Đặt Hệ Thống",
        to: ROUTER_URL.ADMIN.SETTINGS,
        icon: <SettingOutlined />,
        badge: null,
        description: "Cấu hình chung",
      },
    ],
  },
];

const SidebarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { userInfo, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: transparent;
          }
          .custom-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>
      <motion.aside
        className={cn(
          "bg-gradient-to-b from-[#20558A] via-[#1e4d7a] to-[#1a4269] text-white flex flex-col h-screen relative transition-all duration-300 ease-in-out shadow-xl fixed left-0 top-0 z-50 overflow-hidden",
          collapsed ? "w-16" : "w-80"
        )}
        animate={{ width: collapsed ? "4rem" : "20rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1) 1px,transparent 1px)] [background-size:20px_20px] opacity-30"></div>

        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 bg-white rounded-full p-2 shadow-lg border border-gray-200 text-[#20558A] hover:text-[#1e4d7a] hover:shadow-xl transition-all z-20"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        <div
          className={cn(
            "p-6 border-b border-[#20558A]/30 flex items-center relative z-10",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <NavLink
            to={ROUTER_URL.COMMON.HOME}
            className="flex items-center space-x-3 group"
          >
            <div className="flex-shrink-0">
              <div className="bg-white rounded-lg p-3 text-[#20558A] font-bold transform group-hover:rotate-3 transition-transform shadow-lg">
                <CrownOutlined className="text-xl" />
              </div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-white"
                >
                  <div className="text-xl font-bold">ADMIN</div>
                  <div className="text-xs text-blue-200">Bảng Điều Khiển</div>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </div>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mx-4 my-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 relative z-10"
          >
            <div className="flex items-center space-x-3">
              <Avatar
                src={userInfo?.profilePicUrl}
                icon={<UserOutlined />}
                size="large"
                className="bg-white text-[#20558A] shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <p className="text-blue-200 text-xs">Quản trị viên hệ thống</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-200">Đang hoạt động</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col">
          <nav className="flex-1 px-4 py-2 space-y-2 relative z-10 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {navSections.map((section, sectionIndex) => (
              <div key={section.title} className="mb-6">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                    className="px-3 py-2 mb-2"
                  >
                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      {section.title}
                    </p>
                  </motion.div>
                )}

                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: sectionIndex * 0.1 + itemIndex * 0.05,
                      }}
                      whileHover={{ x: collapsed ? 0 : 5 }}
                    >
                      {collapsed ? (
                        <Tooltip
                          title={
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs opacity-80">
                                {item.description}
                              </div>
                            </div>
                          }
                          placement="right"
                        >
                          <NavLink
                            to={item.to}
                            end={item.to === ROUTER_URL.ADMIN.BASE}
                            className={({ isActive }) =>
                              clsx(
                                "flex items-center justify-center p-3 rounded-xl transition-all duration-200 relative group",
                                isActive
                                  ? "bg-white text-[#20558A] shadow-lg"
                                  : "hover:bg-white/20 hover:shadow-lg text-white"
                              )
                            }
                          >
                            <span className="text-lg">{item.icon}</span>
                            {item.badge && (
                              <Badge
                                count={item.badge}
                                size="small"
                                className="absolute -top-1 -right-1"
                              />
                            )}
                          </NavLink>
                        </Tooltip>
                      ) : (
                        <NavLink
                          to={item.to}
                          end={item.to === ROUTER_URL.ADMIN.BASE}
                          className={({ isActive }) =>
                            clsx(
                              "flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group relative",
                              isActive
                                ? "bg-white text-[#20558A] shadow-lg"
                                : "hover:bg-white/20 hover:shadow-lg text-white"
                            )
                          }
                        >
                          <span className="text-lg flex-shrink-0">
                            {item.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">
                                {item.name}
                              </span>
                              {item.badge && (
                                <Badge
                                  count={item.badge}
                                  size="small"
                                  className="flex-shrink-0 ml-2"
                                />
                              )}
                            </div>
                            <p className="text-xs opacity-70 truncate mt-1">
                              {item.description}
                            </p>
                          </div>
                        </NavLink>
                      )}
                    </motion.li>
                  ))}
                </ul>

                {!collapsed && sectionIndex < navSections.length - 1 && (
                  <Divider className="border-[#20558A]/30 my-4" />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div
          className={cn(
            "p-4 border-t border-[#20558A]/30 relative z-10 flex-shrink-0",
            collapsed ? "text-center" : ""
          )}
        >
          {!collapsed ? (
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white group"
              >
                <LogoutOutlined className="text-lg" />
                <span className="font-medium">Đăng xuất</span>
              </button>
              <p className="text-xs text-blue-200 text-center">
                © {new Date().getFullYear()} PDP Admin System
              </p>
            </div>
          ) : (
            <Tooltip title="Đăng xuất" placement="right">
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white"
              >
                <LogoutOutlined className="text-lg" />
              </button>
            </Tooltip>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default SidebarLayout;
