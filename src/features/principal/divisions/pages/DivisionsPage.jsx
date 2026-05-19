import React, { useState } from "react";
import { Card, Row, Col, Space, Button, Alert } from "antd";
import { AppstoreOutlined, CheckCircleOutlined, UserOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";
import AddDivisionModal from "../components/AddDivisionModal.jsx";
import DivisionTable from "../components/DivisionTable.jsx";
import useDivisions from "../hooks/useDivisions.js";

const DivisionsPage = () => {
  const { divisions, loading, fetchDivisions } = useDivisions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDivision(null);
  };

  const activeDivisions = divisions.filter(
    (division) => division.status === "active"
  ).length;

  const totalCapacity = divisions.reduce(
    (total, division) => total + (Number(division.capacity) || 0),
    0
  );

  const assignedTeachers = divisions.filter((division) =>
    Boolean(division.assignedTeacher?._id || division.assignedTeacher)
  ).length;

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
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1f1f1f", margin: 0 }}>Division Management</h1>
          <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
            Add and manage LP class divisions, track seating capacity, and link assigned classroom teachers.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ borderRadius: 6, fontWeight: 600 }}
        >
          Add Division
        </Button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} xl={6}>
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
                <AppstoreOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Total Divisions</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : divisions.length}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
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
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Active Classes</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : activeDivisions}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
            <Space size="large">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  background: "#f9f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#722ed1",
                  fontSize: 22
                }}
              >
                <UserOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Assigned Teachers</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : assignedTeachers}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
            <Space size="large">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  background: "#fff7e6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fa8c16",
                  fontSize: 22
                }}
              >
                <TeamOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Total Capacity</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>
                  {loading ? "..." : totalCapacity}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* TABLE REGISTER */}
      {loading ? (
        <Card style={{ borderRadius: 10, border: "1px solid #f0f0f0" }}>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ display: "inline-block", width: 32, height: 32, borderRadius: "50%", border: "3px solid #1890ff", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#8c8c8c", marginTop: 12 }}>Retrieving school division data...</p>
          </div>
        </Card>
      ) : (
        <DivisionTable
          divisions={divisions}
          fetchDivisions={fetchDivisions}
          setEditingDivision={setEditingDivision}
          openModal={() => setIsModalOpen(true)}
        />
      )}

      {/* MODAL WINDOW */}
      <AddDivisionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingDivision={editingDivision}
        fetchDivisions={fetchDivisions}
        clearEdit={() => setEditingDivision(null)}
      />
    </div>
  );
};

export default DivisionsPage;
