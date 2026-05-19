import React from "react";
import { Card, Form, Input, Button, Switch, Divider, Tabs, message, Space } from "antd";
import { SettingOutlined, BellOutlined, SafetyCertificateOutlined, AppstoreOutlined } from "@ant-design/icons";

const SettingsPage = () => {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    message.success("Settings saved successfully!");
  };

  const generalTab = (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        schoolName: "LP School SLMS",
        academicYear: "2025-2026",
        email: "admin@slms.com",
      }}
      onFinish={handleSave}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="schoolName"
        label="School Name"
        rules={[{ required: true, message: "Please input school name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="academicYear"
        label="Active Academic Year"
        rules={[{ required: true, message: "Please input academic year" }]}
      >
        <Input placeholder="e.g. 2025-2026" />
      </Form.Item>
      <Form.Item
        name="email"
        label="System Notification Email"
        rules={[{ required: true, type: "email", message: "Please input a valid email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save General Settings
        </Button>
      </Form.Item>
    </Form>
  );

  const securityTab = (
    <div style={{ maxWidth: 600 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Password Controls</div>
          <p style={{ color: "#8c8c8c", fontSize: 13 }}>Enforce secure authentication protocols across teacher and student accounts.</p>
        </div>
        <Form layout="vertical" onFinish={() => message.success("Password rules updated!")}>
          <Form.Item label="Minimum Password Length" name="minChar" initialValue="6">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="requireSpecial" label="Require Special Character" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save Security Settings
          </Button>
        </Form>
      </Space>
    </div>
  );

  const notificationTab = (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600 }}>Teacher Attendance Reminders</div>
          <div style={{ color: "#8c8c8c", fontSize: 12 }}>Notify admin if teacher attendance sheet is not completed by 10 AM.</div>
        </div>
        <Switch defaultChecked />
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600 }}>Student Bulk Import Alerts</div>
          <div style={{ color: "#8c8c8c", fontSize: 12 }}>Email detailed statistics report on successful CSV upload.</div>
        </div>
        <Switch defaultChecked />
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600 }}>Daily Statistics Backups</div>
          <div style={{ color: "#8c8c8c", fontSize: 12 }}>Perform auto system backups of databases every night.</div>
        </div>
        <Switch defaultChecked />
      </div>
    </Space>
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <AppstoreOutlined />
          General
        </span>
      ),
      children: generalTab,
    },
    {
      key: "2",
      label: (
        <span>
          <SafetyCertificateOutlined />
          Security
        </span>
      ),
      children: securityTab,
    },
    {
      key: "3",
      label: (
        <span>
          <BellOutlined />
          Notifications
        </span>
      ),
      children: notificationTab,
    },
  ];

  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1f1f1f", margin: 0 }}>System Settings</h1>
        <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
          Configure SLMS environment variables, security constraints, and automated alerts.
        </p>
      </div>

      <Card style={{ borderRadius: 8, boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </div>
  );
};

export default SettingsPage;
