import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Table, Button, Tooltip, Avatar, Space, Tag, Typography, Row, Col, Input, Select, Empty, message } from "antd";
import { UserOutlined, PlusOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons";
import useMyStudents from "../hooks/useMyStudents.js";

const { Title, Text } = Typography;

const getInitials = (name) => {
  if (!name) return "ST";
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
};

const formatDate = (value) => {
  if (!value) return "Not added";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not added";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyStudentsPage = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    divisions,
    selectedDivisionId,
    setSelectedDivisionId,
    students,
    loadingDivisions,
    loadingStudents,
  } = useMyStudents();

  // Route division ID mapping if pre-navigated
  const routeDivisionId = location.state?.selectedDivisionId || "";
  const hasAppliedRouteDivision = useRef(false);

  useEffect(() => {
    if (hasAppliedRouteDivision.current || !routeDivisionId || divisions.length === 0) {
      return;
    }
    const exists = divisions.some((d) => d._id === routeDivisionId);
    if (exists) {
      setSelectedDivisionId(routeDivisionId);
    }
    hasAppliedRouteDivision.current = true;
  }, [divisions, routeDivisionId, setSelectedDivisionId]);

  const selectedDivision = useMemo(() => {
    return divisions.find((d) => d._id === selectedDivisionId) || null;
  }, [divisions, selectedDivisionId]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = search.toLowerCase();
      const matchesSearch =
        student.nameEnglish?.toLowerCase().includes(searchValue) ||
        student.nameArabic?.toLowerCase().includes(searchValue);
      const matchesStatus = statusFilter === "all" ? true : student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const columns = [
    {
      title: "Roll No",
      key: "rollNo",
      width: 80,
      align: "center",
      render: (_, __, index) => <span style={{ fontWeight: 600, color: "#595959" }}>{index + 1}</span>
    },
    {
      title: "Student Name",
      key: "name",
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            src={record.photo}
            size={40}
            style={{ backgroundColor: "#1890ff", fontWeight: "bold" }}
          >
            {getInitials(record.nameEnglish)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: "#262626" }}>{record.nameEnglish}</div>
            {record.nameArabic && (
              <div style={{ fontSize: 12, color: "#8c8c8c", fontStyle: "italic" }}>
                {record.nameArabic}
              </div>
            )}
          </div>
        </Space>
      )
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => <span style={{ textTransform: "capitalize" }}>{gender || "-"}</span>
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dob",
      render: (dob) => <span>{formatDate(dob)}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"} style={{ borderRadius: 4, fontWeight: 600 }}>
          {status?.toUpperCase() || "ACTIVE"}
        </Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            size="small"
            style={{ borderRadius: 4 }}
            onClick={() => message.info(`Edit student details action for ${record.nameEnglish}`)}
          >
            Edit Details
          </Button>

          {/* Delete Guardrail Tooltip */}
          <Tooltip title="Admin Permission Required">
            <Button
              type="text"
              danger
              disabled
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: "8px 0" }}>
      {/* HEADER */}
      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: 8,
        border: "1px solid #f0f0f0",
        marginBottom: 24
      }}>
        <Title level={2} style={{ margin: 0, fontWeight: "bold" }}>My Classroom Students</Title>
        <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
          Monitor division folders, examine profile files, and adjust student details inside your assigned LP classrooms.
        </p>
      </div>

      <Row gutter={[20, 20]}>
        {/* LEFT DIVISION PICKER */}
        <Col xs={24} md={6}>
          <Card
            title={
              <Space>
                <TeamOutlined style={{ color: "#1890ff" }} />
                <span style={{ fontWeight: "bold" }}>Class Divisions</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            {loadingDivisions ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>Loading classroom divisions...</div>
            ) : divisions.length === 0 ? (
              <Empty description="No divisions assigned." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {divisions.map((d) => {
                  const isActive = d._id === selectedDivisionId;
                  return (
                    <div
                      key={d._id}
                      onClick={() => setSelectedDivisionId(d._id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 6,
                        cursor: "pointer",
                        border: isActive ? "1px solid #91d5ff" : "1px solid #f0f0f0",
                        background: isActive ? "#e6f7ff" : "#fafafa",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ fontWeight: "bold", color: isActive ? "#1890ff" : "#262626" }}>
                        {d.classId?.name}
                      </div>
                      <div style={{ fontSize: 12, color: isActive ? "#096dd9" : "#8c8c8c", marginTop: 2 }}>
                        Division: {d.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>

        {/* RIGHT STUDENTS REGISTER LIST */}
        <Col xs={24} md={18}>
          <Card
            title={
              <Space direction="vertical" size={2}>
                <span style={{ fontWeight: "bold", fontSize: 16 }}>
                  {selectedDivision
                    ? `${selectedDivision.classId?.name} - ${selectedDivision.name} Roster`
                    : "Select Assigned Division"}
                </span>
                <span style={{ fontSize: 12, color: "#8c8c8c", fontWeight: "normal" }}>
                  Class records details
                </span>
              </Space>
            }
            extra={
              /* Add Student Guardrail Tooltip */
              <Tooltip title="Admin Permission Required">
                <Button
                  type="primary"
                  disabled
                  icon={<PlusOutlined />}
                  style={{ borderRadius: 6 }}
                >
                  Add Student
                </Button>
              </Tooltip>
            }
            bordered={false}
            style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
          >
            {/* SEARCH AND FILTERS */}
            <div style={{
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}>
              <Input
                placeholder="Search students..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 220, borderRadius: 4 }}
                allowClear
              />
              
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 140 }}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </div>

            {loadingStudents ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>Loading student lists...</div>
            ) : !selectedDivisionId ? (
              <Empty description="Select a division from the left panel to load the student list." />
            ) : filteredStudents.length === 0 ? (
              <Empty description="No matching students found." />
            ) : (
              <Table
                columns={columns}
                dataSource={filteredStudents}
                rowKey="_id"
                pagination={{ pageSize: 8 }}
                style={{ marginTop: 10 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyStudentsPage;