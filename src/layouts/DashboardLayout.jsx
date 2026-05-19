import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Input, Badge, Dropdown, Space, Avatar, Button } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { useAuth } from "../features/auth/hooks/useAuth";

const { Header, Sider, Content } = Layout;

function DashboardLayout({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items config for Admin (Principal) & Teacher
  const menuItems = role === "principal"
    ? [
        {
          key: "/principal/dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          key: "/principal/classes",
          icon: <BookOutlined />,
          label: "Classes & Divisions",
        },
        {
          key: "/principal/teachers",
          icon: <TeamOutlined />,
          label: "Teacher Assignment",
        },
        {
          key: "/principal/students",
          icon: <UserOutlined />,
          label: "Student Management",
        },
        {
          key: "/principal/settings",
          icon: <SettingOutlined />,
          label: "Settings",
        },
      ]
    : [
        {
          key: "/teacher/dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          key: "/teacher/students",
          icon: <UsergroupAddOutlined />,
          label: "Students",
        },
        {
          key: "/teacher/attendance",
          icon: <ContainerOutlined />,
          label: "Attendance",
        },
      ];

  const profileMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => navigate(role === "principal" ? "/principal/settings" : "#"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
    }
  };

  // Determine current active menu key
  const activeKey = location.pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          borderRight: "1px solid #f0f0f0",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid #f0f0f0",
          gap: 12,
          overflow: "hidden"
        }}>
          <div style={{
            minWidth: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #1890ff, #096dd9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16
          }}>
            SL
          </div>
          {!collapsed && (
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: "bold", color: "#1f1f1f", fontSize: 15 }}>SLMS</div>
              <div style={{ fontSize: 10, color: "#8c8c8c", fontWeight: 500, letterSpacing: 0.5 }}>LP SCHOOL HUB</div>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>

      {/* MAIN CONTAINER */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        {/* HEADER */}
        <Header style={{
          background: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 90,
          height: 64,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 40, height: 40 }}
            />
            {role === "principal" ? (
              <Input.Search
                placeholder="Search resources, students..."
                style={{ width: 250, borderRadius: 6 }}
                allowClear
              />
            ) : (
              <div style={{ fontWeight: "600", color: "#1890ff", fontSize: 14, background: "#e6f7ff", padding: "4px 12px", borderRadius: 4, border: "1px solid #91d5ff" }}>
                Teacher View - Class 1-A
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Badge count={3} size="small" offset={[2, 0]}>
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 18, color: "#595959" }} />}
              />
            </Badge>

            <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: "#1890ff" }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 500, color: "#262626" }}>
                  {role === "principal" ? "Principal Account" : "Teacher Account"}
                </span>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* CONTENT */}
        <Content style={{
          padding: 24,
          minHeight: "calc(100vh - 64px)",
          background: "#f0f2f5"
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;