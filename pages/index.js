import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space } from "antd";

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
      messageApi.error("Error adding student");
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
      messageApi.error("Error updating student");
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
      messageApi.error("Error deleting student");
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
          <Button onClick={() => handleEditStudent(record)}>Edit</Button>
          <Button danger onClick={() => handleDeleteStudent(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    if (editingStudent) {
      handleUpdateStudent();
    } else {
      handleAddStudent();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <h1>Students</h1>
      <Button
        type="primary"
        onClick={() => {
          setEditingStudent(null);
          form.resetFields();
          setIsModalOpen(true);
        }}
      >
        Add Student
      </Button>

      <Table
        dataSource={students}
        columns={columns}
        loading={loading}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingStudent ? "Edit Student" : "Add New Student"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        okText={editingStudent ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter student email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
