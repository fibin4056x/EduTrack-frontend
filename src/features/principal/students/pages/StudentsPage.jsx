import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Modal, Button, Badge, Space, Alert } from "antd";
import { UserOutlined, UserAddOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import useStudents from "../hooks/useStudents";
import AddStudentModal from "../components/AddStudentModal";
import StudentsTable from "../components/StudentTable";
import BulkStudentUpload from "../components/BulkStudentUpload";
import { getClassesApi, getDivisionsApi } from "../api/student.api.js";

const StudentsPage = () => {
  const location = useLocation();
  const { students, loading, fetchStudents } = useStudents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [pageError, setPageError] = useState("");

  const fetchInitialData = async () => {
    try {
      setPageError("");
      const [classesResponse, divisionsResponse] = await Promise.all([
        getClassesApi(),
        getDivisionsApi(),
      ]);
      setClasses(classesResponse.data || []);
      setDivisions(divisionsResponse.data || []);
    } catch (error) {
      console.error(error);
      setPageError("Failed to load dependency class/division lists.");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
  };

  const stats = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        acc.total += 1;
        if (student.status !== "inactive") {
          acc.active += 1;
        }
        return acc;
      },
      { total: 0, active: 0 }
    );
  }, [students]);

  return (
    <div style={{ padding: "8px 0" }}>
      {/* HEADER SECTION */}
      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: 8,
        border: "1px solid #f0f0f0",
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1f1f1f", margin: 0 }}>Student Management</h1>
          <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
            Maintain comprehensive lower primary registration folders, trace enrollments, and coordinate rosters.
          </p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {pageError && (
        <Alert
          message="System Notification"
          description={pageError}
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 6 }}
        />
      )}

      {/* STATS OVERVIEW CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <Space size="large">
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 8,
                background: "#e6f7ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1890ff",
                fontSize: 22
              }}>
                <UserOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Total Students</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>{loading ? "..." : stats.total}</div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <Space size="large">
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 8,
                background: "#f6ffed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#52c41a",
                fontSize: 22
              }}>
                <UserAddOutlined />
              </div>
              <div>
                <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Active Students</div>
                <div style={{ fontSize: 26, fontWeight: "bold", color: "#262626", marginTop: 2 }}>{loading ? "..." : stats.active}</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* STUDENT REGISTRY TABLE */}
      <StudentsTable
        students={students}
        fetchStudents={fetchStudents}
        setEditingStudent={setEditingStudent}
        openModal={() => setIsModalOpen(true)}
        openBulkUploadModal={() => setIsBulkModalOpen(true)}
      />

      {/* SINGLE STUDENT ADD / EDIT MODAL */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStudent={editingStudent}
        fetchStudents={fetchStudents}
        clearEdit={() => setEditingStudent(null)}
      />

      {/* BULK EXCEL UPLOAD MODAL */}
      <Modal
        title="📥 Bulk Import Student Records"
        open={isBulkModalOpen}
        onCancel={handleCloseBulkModal}
        footer={null}
        width={720}
        destroyOnClose
        style={{ borderRadius: 8 }}
      >
        <div style={{ marginTop: 16 }}>
          <BulkStudentUpload
            classes={classes}
            divisions={divisions}
            fetchStudents={async () => {
              await fetchStudents();
              handleCloseBulkModal();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default StudentsPage;