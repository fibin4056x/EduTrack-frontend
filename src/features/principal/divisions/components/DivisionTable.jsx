import React, { useState } from "react";
import { Table, Tag, Button, Space, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { deleteDivisionApi } from "../api/division.api.js";

const DivisionTable = ({
  divisions,
  fetchDivisions,
  setEditingDivision,
  openModal,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (divisionId) => {
    try {
      setDeletingId(divisionId);
      await deleteDivisionApi(divisionId);
      message.success("Division deleted successfully.");
      fetchDivisions();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to delete division.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: "Division",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: 600, color: "#1890ff" }}>{text}</span>,
    },
    {
      title: "Class",
      key: "class",
      render: (_, record) => <span style={{ color: "#262626", fontWeight: 500 }}>{record.classId?.name || "-"}</span>,
    },
    {
      title: "Assigned Teacher",
      key: "teacher",
      render: (_, record) => {
        const teacherName = record.assignedTeacher?.name;
        return teacherName ? (
          <span style={{ color: "#52c41a", fontWeight: 600 }}>👨‍🏫 {teacherName}</span>
        ) : (
          <span style={{ color: "#bfbfbf", fontStyle: "italic" }}>Not Assigned</span>
        );
      },
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity) => <span>{capacity} Students</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isActive = status === "active";
        return (
          <Tag
            icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={isActive ? "success" : "default"}
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => {
              setEditingDivision(record);
              openModal();
            }}
            style={{ fontWeight: 600 }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this division?"
            description="All student relations associated with this division will need to be re-assigned."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deletingId === record._id }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              style={{ fontWeight: 600 }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
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
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f1f1f", margin: 0 }}>School Division Registry</h2>
          <p style={{ color: "#8c8c8c", fontSize: 13, margin: "4px 0 0 0" }}>
            Assign capacities, wire teachers, and manage class configurations.
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
          <div style={{ fontSize: 11, color: "#8c8c8c", textTransform: "uppercase", fontWeight: 600 }}>Total Divisions</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#262626" }}>{divisions.length}</div>
        </div>
      </div>

      <Table
        dataSource={divisions}
        columns={columns}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showTotal: (total) => `Total ${total} divisions`
        }}
        locale={{
          emptyText: (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🏫</div>
              <h3 style={{ color: "#262626", fontWeight: 600 }}>No divisions set up</h3>
              <p style={{ color: "#8c8c8c", fontSize: 13, marginTop: 4 }}>Add a classroom division to connect students and teachers.</p>
            </div>
          )
        }}
      />
    </div>
  );
};

export default DivisionTable;
