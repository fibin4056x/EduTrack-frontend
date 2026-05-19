import React, { useState } from "react";
import { Table, Tag, Button, Avatar, Space, Popconfirm, message } from "antd";
import { UserOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { updateTeacherStatus } from "../api/teacher.api.js";

const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

function TeacherTable({ teachers, refreshTeachers }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      setUpdatingId(id);
      await updateTeacherStatus(id, newStatus);
      message.success(`Teacher account has been successfully ${newStatus === "active" ? "activated" : "suspended"}.`);
      refreshTeachers();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to update teacher status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      title: "Teacher",
      key: "teacher",
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            style={{
              backgroundColor: record.status === "active" ? "#f9f0ff" : "#f5f5f5",
              color: record.status === "active" ? "#722ed1" : "#bfbfbf",
              fontWeight: 600,
              fontSize: 14,
              border: record.status === "active" ? "1px solid #d3adf7" : "1px solid #d9d9d9"
            }}
            icon={!record.name ? <UserOutlined /> : undefined}
          >
            {record.name ? getInitials(record.name) : undefined}
          </Avatar>
          <span style={{ fontWeight: 600, color: "#262626" }}>{record.name}</span>
        </Space>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#595959", fontFamily: "monospace" }}>{text}</span>,
    },
    {
      title: "Account Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isActive = status === "active";
        return (
          <Tag
            icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
            color={isActive ? "success" : "error"}
            style={{
              borderRadius: 20,
              padding: "2px 10px",
              fontWeight: 600
            }}
          >
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Workspace Actions",
      key: "actions",
      render: (_, record) => {
        const isActive = record.status === "active";
        return (
          <Popconfirm
            title={`${isActive ? "Suspend" : "Activate"} teacher account?`}
            description={`Are you sure you want to change status to ${isActive ? "suspended" : "active"}?`}
            onConfirm={() => handleStatusChange(record._id, record.status)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: isActive }}
          >
            <Button
              type={isActive ? "default" : "primary"}
              danger={isActive}
              loading={updatingId === record._id}
              style={{
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13
              }}
            >
              {isActive ? "Suspend" : "Activate"}
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)"
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          background: "#fafafa"
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f1f1f", margin: 0 }}>Faculty Listing</h2>
          <p style={{ color: "#8c8c8c", fontSize: 13, margin: "4px 0 0 0" }}>
            Monitor administrator profiles and control system access states.
          </p>
        </div>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            padding: "6px 16px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: 11, color: "#8c8c8c", textTransform: "uppercase", fontWeight: 600 }}>Total Teachers</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#262626" }}>{teachers.length}</div>
        </div>
      </div>

      <Table
        dataSource={teachers}
        columns={columns}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showTotal: (total) => `Total ${total} teachers`
        }}
        locale={{
          emptyText: (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>👨‍🏫</div>
              <h3 style={{ color: "#262626", fontWeight: 600 }}>No teachers registered</h3>
              <p style={{ color: "#8c8c8c", fontSize: 13, marginTop: 4 }}>Add a teacher account to populate this database roster.</p>
            </div>
          )
        }}
      />
    </div>
  );
}

export default TeacherTable;
