import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Table, Radio, Input, DatePicker, Select, Button, Space, Avatar, message, Tag, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SaveOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useMyDivisions from "../../hooks/useMyDivisions.js";
import { getStudentsByDivisionApi } from "../../api/teacher.api.js";
import { markAttendanceApi } from "../api/attendance.api.js";

const { Title, Text } = Typography;

function TeacherAttendancePage() {
  const location = useLocation();
  const preselectedDivisionId = location.state?.selectedDivisionId || "";

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState(preselectedDivisionId);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const { divisions } = useMyDivisions();

  useEffect(() => {
    if (selectedDivisionId) {
      fetchStudents();
    }
  }, [selectedDivisionId]);

  const fetchStudents = async () => {
    try {
      const res = await getStudentsByDivisionApi(selectedDivisionId);
      setStudents(res || []);
      
      // Pre-populate attendance state with "present" if empty
      const initialAttendance = {};
      const initialRemarks = {};
      res.forEach(student => {
        initialAttendance[student._id] = "present";
        initialRemarks[student._id] = "";
      });
      setAttendance(initialAttendance);
      setRemarks(initialRemarks);
    } catch (error) {
      console.error(error);
      message.error("Failed to load division roster.");
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleRemarkChange = (studentId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDivisionId) {
      message.warning("Please select a division first.");
      return;
    }

    try {
      setLoading(true);
      for (const student of students) {
        await markAttendanceApi({
          studentId: student._id,
          divisionId: selectedDivisionId,
          status: attendance[student._id] || "present",
          remarks: remarks[student._id] || "",
          date: selectedDate,
        });
      }
      message.success("Daily attendance saved successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to save attendance logs.");
    } finally {
      setLoading(false);
    }
  };

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
      key: "studentName",
      render: (_, record) => (
        <Space size="middle">
          <Avatar style={{ backgroundColor: "#1890ff", fontWeight: "bold" }}>
            {record.nameEnglish?.charAt(0).toUpperCase() || "S"}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: "#262626" }}>{record.nameEnglish}</div>
            {record.nameArabic && (
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.nameArabic}</div>
            )}
          </div>
        </Space>
      )
    },
    {
      title: "Attendance Status (Present/Absent/Late)",
      key: "status",
      width: 320,
      render: (_, record) => (
        <Radio.Group
          value={attendance[record._id] || "present"}
          onChange={(e) => handleStatusChange(record._id, e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="present" style={{
            color: attendance[record._id] === "present" ? "#fff" : "#52c41a",
            borderColor: attendance[record._id] === "present" ? "#52c41a" : "#d9d9d9",
            backgroundColor: attendance[record._id] === "present" ? "#52c41a" : "#fff"
          }}>
            <CheckCircleOutlined /> Present
          </Radio.Button>
          <Radio.Button value="absent" style={{
            color: attendance[record._id] === "absent" ? "#fff" : "#ff4d4f",
            borderColor: attendance[record._id] === "absent" ? "#ff4d4f" : "#d9d9d9",
            backgroundColor: attendance[record._id] === "absent" ? "#ff4d4f" : "#fff"
          }}>
            <CloseCircleOutlined /> Absent
          </Radio.Button>
          <Radio.Button value="late" style={{
            color: attendance[record._id] === "late" ? "#fff" : "#faad14",
            borderColor: attendance[record._id] === "late" ? "#faad14" : "#d9d9d9",
            backgroundColor: attendance[record._id] === "late" ? "#faad14" : "#fff"
          }}>
            <ClockCircleOutlined /> Late
          </Radio.Button>
        </Radio.Group>
      )
    },
    {
      title: "Status Update / Daily Remarks",
      key: "remarks",
      render: (_, record) => (
        <Input
          placeholder="e.g. Late due to rainy weather, Medical leave..."
          value={remarks[record._id] || ""}
          onChange={(e) => handleRemarkChange(record._id, e.target.value)}
          style={{ borderRadius: 4 }}
        />
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
        <Title level={2} style={{ margin: 0, fontWeight: "bold" }}>Daily Attendance Register</Title>
        <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
          Mark, log, and update student attendance status with direct synchronizations to administrative databases.
        </p>
      </div>

      <Card bordered={false} style={{ borderRadius: 8, marginBottom: 24, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
        <Space size="large" wrap style={{ display: "flex", justifyContent: "space-between" }}>
          <Space size="middle" wrap>
            <div style={{ display: "inline-block" }}>
              <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4, fontWeight: 500 }}>Select Division</div>
              <Select
                value={selectedDivisionId}
                onChange={setSelectedDivisionId}
                style={{ width: 220 }}
                placeholder="Choose division..."
              >
                {divisions.map((d) => (
                  <Select.Option key={d._id} value={d._id}>
                    {d.classId?.name} - {d.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ display: "inline-block" }}>
              <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4, fontWeight: 500 }}>Attendance Date</div>
              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(date) => setSelectedDate(date ? date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"))}
                disabledDate={(current) => current && current > dayjs().endOf("day")}
                allowClear={false}
                style={{ width: 180 }}
              />
            </div>
          </Space>

          {students.length > 0 && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={loading}
              size="large"
              style={{ height: 40, borderRadius: 6 }}
            >
              Save Daily Log
            </Button>
          )}
        </Space>
      </Card>

      {/* TABLE */}
      <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={students}
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: "Select an assigned division to load the student list." }}
          style={{ padding: "12px 24px 24px" }}
        />
      </Card>
    </div>
  );
}

export default TeacherAttendancePage;
