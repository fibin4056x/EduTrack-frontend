import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Tag, Badge, Tooltip, Modal, Form, Input, Select, Space, Popconfirm, message, Empty, Divider } from "antd";
import { BookOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UserOutlined, CalendarOutlined, SolutionOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useClasses from "../hooks/useClasses.js";
import { getDivisionsApi } from "../../divisions/api/division.api.js";
import { createClassApi, updateClassApi, deleteClassApi } from "../api/class.api.js";

const ClassesPage = () => {
  const navigate = useNavigate();
  const { classes, loading: classesLoading, fetchClasses } = useClasses();
  const [divisions, setDivisions] = useState([]);
  const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchDivisions = async () => {
    try {
      setDivisionsLoading(true);
      const res = await getDivisionsApi();
      setDivisions(res.data || []);
    } catch (err) {
      console.error("Failed to load divisions:", err);
    } finally {
      setDivisionsLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (editingClass) {
      form.setFieldsValue({
        name: editingClass.name,
        academicYear: editingClass.academicYear,
        status: editingClass.status || "active",
      });
    } else {
      form.resetFields();
    }
  }, [editingClass, form]);

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleFormSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (editingClass) {
        await updateClassApi(editingClass._id, values);
        message.success("Class updated successfully!");
      } else {
        await createClassApi(values);
        message.success("Class created successfully!");
      }
      fetchClasses();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || "Failed to save class details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await deleteClassApi(id);
      message.success("Class deleted successfully");
      fetchClasses();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete class");
    }
  };

  // Group divisions by Class ID
  const getDivisionsByClass = (classId) => {
    return divisions.filter(div => {
      const divClassId = div.classId?._id || div.classId;
      return divClassId === classId;
    });
  };

  const totalClassesCount = classes.length;
  const activeClassesCount = classes.filter(c => c.status !== "inactive").length;
  const totalDivisionsCount = divisions.length;

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
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1f1f1f", margin: 0 }}>School Structure</h1>
          <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
            Design classes, designate division subsets, assign teachers, and coordinate lower primary divisions.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAddModal}
          size="large"
          style={{ height: 44, borderRadius: 6 }}
        >
          Add New Class
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Total Classes</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#1890ff", marginTop: 4 }}>
              {classesLoading ? "..." : totalClassesCount}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Active Classes</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#52c41a", marginTop: 4 }}>
              {classesLoading ? "..." : activeClassesCount}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <div style={{ color: "#8c8c8c", fontSize: 13, textTransform: "uppercase", fontWeight: 600 }}>Total Divisions</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#722ed1", marginTop: 4 }}>
              {divisionsLoading ? "..." : totalDivisionsCount}
            </div>
          </Card>
        </Col>
      </Row>

      {/* CLASSES GRID CARDS REPRESENTING NESTED VISUAL HIERARCHY */}
      {classesLoading || divisionsLoading ? (
        <Card loading bordered={false} style={{ borderRadius: 8 }} />
      ) : classes.length === 0 ? (
        <Card bordered={false} style={{ borderRadius: 8, textAlign: "center", padding: "40px 0" }}>
          <Empty description="No School Classes Configured" />
          <Button type="primary" style={{ marginTop: 16 }} onClick={handleOpenAddModal}>
            Create First Class
          </Button>
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {classes.map((cls) => {
            const classDivs = getDivisionsByClass(cls._id);
            const isInactive = cls.status === "inactive";

            return (
              <Col xs={24} lg={12} key={cls._id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    overflow: "hidden"
                  }}
                  bodyStyle={{ padding: "20px 24px" }}
                  actions={[
                    <Tooltip title="Edit Class Details">
                      <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEditModal(cls)} />
                    </Tooltip>,
                    <Popconfirm
                      title="Are you sure you want to delete this class?"
                      description="This will delete the class and all associated subsets."
                      onConfirm={() => handleDeleteClass(cls._id)}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  ]}
                >
                  {/* Card Header Info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <Space size="middle">
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        background: isInactive ? "#f5f5f5" : "#e6f7ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isInactive ? "#bfbfbf" : "#1890ff",
                        fontSize: 20
                      }}>
                        <BookOutlined />
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: "bold", color: "#262626" }}>{cls.name}</div>
                        <Space style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>
                          <CalendarOutlined />
                          <span>Academic: {cls.academicYear}</span>
                        </Space>
                      </div>
                    </Space>

                    <Tag color={isInactive ? "default" : "green"} style={{ borderRadius: 4, fontWeight: 600 }}>
                      {cls.status?.toUpperCase() || "ACTIVE"}
                    </Tag>
                  </div>

                  <Divider style={{ margin: "12px 0" }} />

                  {/* Nested visual hierarchy: Divisions as tags and sub-lists */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#8c8c8c", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Active Divisions ({classDivs.length})
                    </div>

                    {classDivs.length === 0 ? (
                      <div style={{ padding: "16px 0", textAlign: "center", color: "#bfbfbf", background: "#fafafa", borderRadius: 6, fontSize: 13 }}>
                        No divisions registered.
                        <Button type="link" size="small" onClick={() => navigate("/principal/divisions")} style={{ marginLeft: 4 }}>
                          + Add Division
                        </Button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {classDivs.map((div) => {
                          const teacherName = div.assignedTeacher?.name || div.assignedTeacher || "Unassigned";

                          return (
                            <div
                              key={div._id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#fafafa",
                                padding: "12px 16px",
                                borderRadius: 6,
                                border: "1px solid #f0f0f0"
                              }}
                            >
                              <Space direction="vertical" size={2}>
                                <Space>
                                  <span style={{ fontWeight: "bold", color: "#1f1f1f", fontSize: 14 }}>
                                    {div.name}
                                  </span>
                                  <Tag color={div.status === "active" ? "blue" : "default"} style={{ fontSize: 10, margin: 0, borderRadius: 2 }}>
                                    Cap: {div.capacity}
                                  </Tag>
                                </Space>
                                <div style={{ fontSize: 12, color: "#595959" }}>
                                  <Space>
                                    <TeamOutlined style={{ color: "#8c8c8c" }} />
                                    <span>Teacher: <span style={{ fontWeight: 500, color: teacherName === "Unassigned" ? "#faad14" : "#262626" }}>{teacherName}</span></span>
                                  </Space>
                                </div>
                              </Space>

                              {/* Action items on each division: "Assign Teacher", "Manage Students" */}
                              <Space size="small">
                                <Tooltip title="Assign Class Teacher">
                                  <Button
                                    size="small"
                                    icon={<TeamOutlined />}
                                    onClick={() => navigate("/principal/divisions", { state: { editingDivisionId: div._id } })}
                                    style={{ borderRadius: 4 }}
                                  >
                                    Assign Teacher
                                  </Button>
                                </Tooltip>
                                <Tooltip title="View Division Roster">
                                  <Button
                                    size="small"
                                    type="primary"
                                    ghost
                                    icon={<UserOutlined />}
                                    onClick={() => navigate("/principal/students", { state: { filterClass: cls.name, filterDivision: div.name } })}
                                    style={{ borderRadius: 4 }}
                                  >
                                    Students
                                  </Button>
                                </Tooltip>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* ADD / EDIT CLASS MODAL */}
      <Modal
        title={editingClass ? "Edit School Class" : "Create New School Class"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        style={{ borderRadius: 8 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ status: "active" }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="Class Name"
            rules={[{ required: true, message: "Please input the class name (e.g. Class 1)" }]}
          >
            <Input placeholder="e.g. Class 1" style={{ height: 40, borderRadius: 4 }} />
          </Form.Item>

          <Form.Item
            name="academicYear"
            label="Academic Year"
            rules={[{ required: true, message: "Please input the academic year (e.g. 2025-2026)" }]}
          >
            <Input placeholder="e.g. 2025-2026" style={{ height: 40, borderRadius: 4 }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Class Status"
            rules={[{ required: true }]}
          >
            <Select style={{ height: 40 }}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Divider style={{ margin: "20px 0 16px 0" }} />

          <Form.Item style={{ display: "flex", justifyContent: "flex-end", margin: 0 }}>
            <Space>
              <Button onClick={handleCloseModal} style={{ borderRadius: 4 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} style={{ borderRadius: 4 }}>
                {editingClass ? "Save Changes" : "Create Class"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassesPage;
