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
  Tag,
  Upload,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';

interface Student {
  id: number;
  name: string;
  student_id: string;
  created_at: string;
  is_active: boolean;
  rollCallCount: number;
  lastRollCallTime: string | null;
}

type StudentId = number;

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

interface SearchParams {
  keyword?: string;
  page: number;
  pageSize: number;
}

const StudentsManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    pageSize: 10
  });

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

  const loadStudents = async (params: SearchParams = searchParams) => {
    setLoading(true);
    setSelectedRowKeys([]);
    try {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        pageSize: params.pageSize.toString(),
        ...(params.keyword && { keyword: params.keyword })
      });
      const response = await fetch(`/api/users?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code === 200) {
        const mappedStudents = result.data.list.map((user: any) => ({
          id: user.id,
          name: user.name,
          student_id: user.student_id,
          created_at: user.created_at,
          is_active: user.is_active,
          rollCallCount: user.rollCallCount,
          lastRollCallTime: user.lastRollCallTime
        }));
        setStudents(mappedStudents);
        setPagination({
          ...pagination,
          current: params.page,
          total: result.data.total
        });
      } else {
        throw new Error(result.message || '获取学生列表失败');
      }
    } catch (error) {
      console.error('加载学生列表失败:', error);
      message.error('获取学生列表失败，请稍后重试');
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
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.code === 200) {
        message.success('删除成功');
        loadStudents(searchParams);
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除学生失败:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const url = editingStudent ? `/api/users/${editingStudent.id}` : '/api/users';
      const method = editingStudent ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          student_id: values.student_id,
          is_active: values.is_active
        }),
      });
      const result = await response.json();
      if (result.code === 200) {
        message.success(`${editingStudent ? '更新' : '添加'}成功`);
        setModalVisible(false);
        form.resetFields();
        loadStudents(searchParams);
      } else {
        message.error(result.message || `${editingStudent ? '更新' : '添加'}失败`);
      }
    } catch (error) {
      console.error(`${editingStudent ? '更新' : '添加'}学生失败:`, error);
      message.error(`${editingStudent ? '更新' : '添加'}失败，请稍后重试`);
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      ellipsis: true,
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
      key: 'student_id',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? '在校' : '离校'}
        </Tag>
      )
    },
    {
      title: '被点名次数',
      dataIndex: 'rollCallCount',
      key: 'rollCallCount',
      width: 120,
      sorter: (a, b) => a.rollCallCount - b.rollCallCount
    },
    {
      title: '最近点名',
      dataIndex: 'lastRollCallTime',
      key: 'lastRollCallTime',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString() : '从未被点名',
      sorter: (a, b) => {
        if (!a.lastRollCallTime) return 1;
        if (!b.lastRollCallTime) return -1;
        return new Date(b.lastRollCallTime).getTime() - new Date(a.lastRollCallTime).getTime();
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
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
            title="确定要删除这名学生吗？"
            description="此操作将永久删除该学生信息，是否继续？"
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

  const handleSearch = (values: any) => {
    const newParams = {
      ...searchParams,
      keyword: values.keyword,
      page: 1
    };
    setSearchParams(newParams);
    loadStudents(newParams);
  };

  const handleTableChange = (pagination: any) => {
    const newParams = {
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setSearchParams(newParams);
    loadStudents(newParams);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/users/export', {
        method: 'GET',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '学生名单.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请稍后重试');
    }
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<StudentId[]>([]);

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/users/import',
    accept: '.xlsx,.xls',
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          message.success('导入成功');
          loadStudents(searchParams);
        } else {
          message.error(info.file.response.message || '导入失败');
        }
      } else if (info.file.status === 'error') {
        message.error('导入失败，请稍后重试');
      }
    },
  };

  return (
    <PageContainer
      title="学生信息管理"
      // subTitle="管理班级学生信息"
      extra={[
        <Form
          key="search"
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword">
            <Input.Search
              placeholder="搜索学生姓名或学号"
              style={{ width: 250 }}
              allowClear
              onSearch={() => searchForm.submit()}
            />
          </Form.Item>
        </Form>
      ]}
    >
      <Card
        title="学生列表"
        extra={
          <Space>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>导入学生</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出学生</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingStudent(null);
                setModalVisible(true);
              }}
            >
              添加学生
            </Button>
          </Space>
        }
      >
        <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 名学生`
        }}
        onChange={handleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys as StudentId[]),
        }}
      />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title="确定要删除选中的学生吗？"
            description="此操作将永久删除选中的学生信息，是否继续？"
            onConfirm={handleBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>批量删除 ({selectedRowKeys.length})</Button>
          </Popconfirm>
        )}
        <div style={{ flex: 1 }} />
        <div>
          <span style={{ marginRight: 8 }}>共选择 {selectedRowKeys.length} 项</span>
          {selectedRowKeys.length > 0 && (
            <Button type="link" onClick={() => setSelectedRowKeys([])}>清空选择</Button>
          )}
        </div>
      </div>
      </Card>

      <Modal
        title={editingStudent ? '编辑学生' : '添加学生'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingStudent(null);
        }}
        onOk={() => {
          form.validateFields()
            .then(() => form.submit())
            .catch((info) => {
              console.log('验证失败:', info);
            });
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editingStudent || { is_active: true }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入学生姓名' },
              { max: 50, message: '姓名不能超过50个字符' },
              { pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/, message: '姓名只能包含中文、英文和空格' }
            ]}
          >
            <Input placeholder="请输入学生姓名" />
          </Form.Item>
          <Form.Item
            name="student_id"
            label="学号"
            rules={[
              { required: true, message: '请输入学号' },
              { pattern: /^\d{8,12}$/, message: '学号必须是8-12位数字' }
            ]}
          >
            <Input placeholder="请输入8-12位学号" />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="状态"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="在校"
              unCheckedChildren="离校"
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default StudentsManagement;