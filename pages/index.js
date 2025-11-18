import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Card,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      messageApi.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        messageApi.success("Student added successfully!");
        form.resetFields();
        setIsModalOpen(false);
        fetchStudents();
      } else {
        messageApi.error("Failed to add student");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      name: student.name,
      email: student.email,
    });
    setIsModalOpen(true);
  };

  const handleUpdateStudent = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        messageApi.success("Student updated successfully!");
        form.resetFields();
        setIsModalOpen(false);
        setEditingStudent(null);
        fetchStudents();
      } else {
        messageApi.error("Failed to update student");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStudent = async (student) => {
    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        messageApi.success(`Student "${student.name}" deleted successfully!`);
        fetchStudents();
      } else {
        messageApi.error("Failed to delete student");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: "10%" },
    { title: "Name", dataIndex: "name", key: "name", width: "30%" },
    { title: "Email", dataIndex: "email", key: "email", width: "40%" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" ghost onClick={() => handleEditStudent(record)}>
            Edit
          </Button>
          <Button danger type="primary" ghost onClick={() => handleDeleteStudent(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    if (editingStudent) handleUpdateStudent();
    else handleAddStudent();
  };

  return (
    <div style={{ padding: 40, background: "#f5f6fa", minHeight: "100vh" }}>
      {contextHolder}

      <Card
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            🎓 Student Management
          </Title>

          <Button
            type="primary"
            size="large"
            style={{
              borderRadius: 10,
              padding: "0 22px",
              fontWeight: 600,
            }}
            onClick={() => {
              setEditingStudent(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            + Add Student
          </Button>
        </div>

        <Table
          dataSource={students}
          columns={columns}
          loading={loading}
          rowKey="id"
          style={{
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
          }}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            {editingStudent ? "Edit Student" : "Add New Student"}
          </span>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        okText={editingStudent ? "Update" : "Add"}
        bodyStyle={{ paddingTop: 10 }}
        style={{ borderRadius: 12 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input size="large" placeholder="Enter student name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" placeholder="Enter student email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
