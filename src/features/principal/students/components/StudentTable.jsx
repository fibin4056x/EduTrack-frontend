import React, { useMemo, useState, useEffect } from "react";
import { Table, Input, Select, Button, Popconfirm, Tag, Avatar, Space, Tooltip, message, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { deleteStudentApi, getClassesApi, getDivisionsApi } from "../api/student.api.js";

const getInitials = (name) => {
  if (!name) return "ST";
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
};

const StudentTable = ({
  students,
  fetchStudents,
  setEditingStudent,
  openModal,
  openBulkUploadModal
}) => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [clsRes, divRes] = await Promise.all([getClassesApi(), getDivisionsApi()]);
        setClasses(clsRes.data || []);
        setDivisions(divRes.data || []);
      } catch (err) {
        console.error("Failed to fetch filter lists:", err);
      }
    };
    fetchFilters();
  }, []);

  const handleDelete = async (studentId) => {
    try {
      await deleteStudentApi(studentId);
      message.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Failed to delete student");
    }
  };

  // Filter students based on search keyword, class, and division
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchValue = search.toLowerCase();
      const matchesSearch =
        student.nameEnglish?.toLowerCase().includes(searchValue) ||
        student.nameArabic?.toLowerCase().includes(searchValue) ||
        student.examRegisterNumber?.toLowerCase().includes(searchValue);

      const studentClassId = student.classId?._id || student.classId;
      const matchesClass = classFilter === "all" ? true : studentClassId === classFilter;

      const studentDivId = student.divisionId?._id || student.divisionId;
      const matchesDivision = divisionFilter === "all" ? true : studentDivId === divisionFilter;

      return matchesSearch && matchesClass && matchesDivision;
    });
  }, [students, search, classFilter, divisionFilter]);

  const columns = [
    {
      title: "Roll No",
      key: "rollNo",
      width: 90,
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
      title: "Class",
      key: "class",
      render: (_, record) => <span>{record.classId?.name || "-"}</span>
    },
    {
      title: "Division",
      key: "division",
      render: (_, record) => (
        <Tag color="purple" style={{ borderRadius: 4, fontWeight: 500 }}>
          {record.divisionId?.name || "-"}
        </Tag>
      )
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
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Student">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => {
                setEditingStudent(record);
                openModal();
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Student">
            <Popconfirm
              title="Delete Student"
              description="Are you sure you want to delete this student record?"
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}
      bodyStyle={{ padding: 0 }}
    >
      {/* FILTER & TOP ACTION CONTROLS BAR */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16
      }}>
        {/* Left Search + Dropdown Filters */}
        <Space size="middle" wrap style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search student name..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220, borderRadius: 6 }}
            allowClear
          />
          <Select
            placeholder="Filter by Class"
            value={classFilter}
            onChange={setClassFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Classes</Select.Option>
            {classes.map(c => (
              <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Division"
            value={divisionFilter}
            onChange={setDivisionFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Divisions</Select.Option>
            {divisions.map(d => (
              <Select.Option key={d._id} value={d._id}>{d.name}</Select.Option>
            ))}
          </Select>
        </Space>

        {/* Right Add Single + Bulk CSV buttons */}
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingStudent(null);
              openModal();
            }}
            style={{ borderRadius: 6 }}
          >
            + Add Single Student
          </Button>

          <Button
            icon={<UploadOutlined />}
            onClick={openBulkUploadModal}
            style={{ borderRadius: 6 }}
          >
            📥 Bulk Import (CSV/Excel)
          </Button>
        </Space>
      </div>

      {/* STUDENT DATA TABLE */}
      <div style={{ padding: "0 24px 24px 24px" }}>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="_id"
          pagination={{ pageSize: 8, showTotal: (total) => `Total ${total} Students` }}
          style={{ marginTop: 16 }}
        />
      </div>
    </Card>
  );
};

export default StudentTable;