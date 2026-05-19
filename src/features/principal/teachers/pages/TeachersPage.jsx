import React, { useMemo } from "react";
import { Card, Row, Col, Space, Button, Alert } from "antd";
import { UserOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import AddTeacherModal from "../components/AddTeacherModal";
import TeacherTable from "../components/TeacherTable";
import useTeachers from "../hooks/useTeachers";

function TeachersPage() {
  const { teachers, loading, error, fetchTeachers } = useTeachers();

  // =========================================
  // STATS CALCULATIONS
  // =========================================
  const stats = useMemo(() => {
    return teachers.reduce(
      (acc, teacher) => {
        acc.total += 1;
        if (teacher.status === "active") {
          acc.active += 1;
        }
        if (teacher.status === "suspended") {
          acc.suspended += 1;
        }
        return acc;
      },
      { total: 0, active: 0, suspended: 0 }
    );
  }, [teachers]);

  if (error) {
    return (
      <Alert
        message="Load Error"
        description="Failed to load teacher records. Please check backend connection state."
        type="error"
        showIcon
        style={{ borderRadius: 8 }}
      />
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* HEADER SECTION */}
      <div
        style={{
          background: "#ffffff",
          padding: "24px",
          borderRadius: 12,
          border: "1px solid #f0f0f0",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)"
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1f1f1f", margin: 0 }}>Faculty Management</h1>
          <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
            Add teachers, manage accounts, and assign access permissions.
          </p>
        </div>
        <AddTeacherModal refreshTeachers={fetchTeachers} />
      </div>

      {/* STATS OVERVIEW */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
            <Space size="large">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  background: "#e6f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1890ff",
                  fontSize: 22
                }}
              >
                <UserOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Total Roster</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : stats.total}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
            <Space size="large">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  background: "#f6ffed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#52c41a",
                  fontSize: 22
                }}
              >
                <CheckCircleOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Active Accounts</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : stats.active}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
            <Space size="large">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  background: "#fff2e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fa8c16",
                  fontSize: 22
                }}
              >
                <StopOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Suspended</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : stats.suspended}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* TABLE SECTION */}
      {loading ? (
        <Card style={{ borderRadius: 10, border: "1px solid #f0f0f0" }}>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ display: "inline-block", width: 32, height: 32, borderRadius: "50%", border: "3px solid #1890ff", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#8c8c8c", marginTop: 12 }}>Retrieving faculty roster...</p>
          </div>
        </Card>
      ) : (
        <TeacherTable teachers={teachers} refreshTeachers={fetchTeachers} />
      )}
    </div>
  );
}

export default TeachersPage;