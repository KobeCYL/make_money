import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';

interface Student {
  id: number;
  name: string;
  student_id: string;
  created_at: string;
  is_active: boolean;
}

const StudentsManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();

  // 模拟学生数据
  const mockStudents: Student[] = [
    {
      id: 1,
      name: '张三',
      student_id: '2024001',
      created_at: '2024-01-15T10:00:00Z',
      is_active: true
    },
    {
      id: 2,
      name: '李四',
      student_id: '2024002',
      created_at: '2024-01-15T10:05:00Z',
      is_active: true
    },
    {
      id: 3,
      name: '王五',
      student_id: '2024003',
      created_at: '2024-01-15T10:10:00Z',
      is_active: false
    }
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // TODO: 调用后端API获取学生列表
      // const response = await getStudentsAPI();

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      setStudents(mockStudents);
    } catch (error) {
      message.error('加载学生列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: 调用后端API删除学生
      // await deleteStudentAPI(id);

      setStudents(students.filter(s => s.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingStudent) {
        // TODO: 调用后端API更新学生
        // await updateStudentAPI(editingStudent.id, values);

        setStudents(students.map(s =>
          s.id === editingStudent.id ? { ...s, ...values } : s
        ));
        message.success('更新成功');
      } else {
        // TODO: 调用后端API添加学生

        fetch('/api/data', {
          method: 'POST',
          body: JSON.stringify(values)
        })

        // const newStudent = await addStudentAPI(values);

        const newStudent: Student = {
          id: Date.now(),
          ...values,
          created_at: new Date().toISOString(),
          is_active: true
        };
        setStudents([...students, newStudent]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error(editingStudent ? '更新失败' : '添加失败');
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '学号',
      dataIndex: 'student_id',
      key: 'student_id'
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? '活跃' : '非活跃'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => new Date(time).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个学生吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <PageContainer
      title="学生管理"
      subTitle="管理班级学生信息"
      extra={[
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加学生
        </Button>
      ]}
    >
      <Card>
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 名学生`
          }}
        />
      </Card>

      <Modal
        title={editingStudent ? '编辑学生' : '添加学生'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入学生姓名' },
              { max: 50, message: '姓名不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入学生姓名" />
          </Form.Item>
          <Form.Item
            name="student_id"
            label="学号"
            rules={[
              { required: true, message: '请输入学号' },
              { max: 20, message: '学号不能超过20个字符' }
            ]}
          >
            <Input placeholder="请输入学号" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default StudentsManagement;