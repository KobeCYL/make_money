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
import { 
  getStudents,
  postStudents,
  putStudentsPinyin2025001,
  deleteStudentsPinyin2025001,
  getStudentsSearch,
  getStudentsSortFunds 
} from '@/services/makeMoney/user';
import type { UploadProps } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';

interface Student {
  id: number;
  name: string;
  student_id: string;
  created_at: string;
  is_active: boolean;
  interviewer_count: number;
  applicant_count: string | null;
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
      const response = await getStudents({
        params: {
          page: params.page,
          pageSize: params.pageSize,
          keyword: params.keyword
        }
      });
      if (response.code === 200 && response.data) {
        setStudents(response.data);
        setPagination({
          ...pagination,
          current: params.page,
          total: response.data.length
        });
      } else {
        throw new Error(response.message || '获取学生列表失败');
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
      const response = await deleteStudentsPinyin2025001();
      if (response.code === 200) {
        message.success('删除成功');
        loadStudents(searchParams);
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除学生失败:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      let response;
      if (editingStudent) {
        response = await putStudentsPinyin2025001({
          data: {
            name: values.name,
            student_id: values.student_id,
            is_active: values.is_active
          }
        });
      } else {
        response = await postStudents({
          name: values.name,
          student_id: values.student_id,
          is_active: values.is_active
        });
      }
      
      if (response.code === 200) {
        message.success(`${editingStudent ? '更新' : '添加'}成功`);
        setModalVisible(false);
        form.resetFields();
        loadStudents(searchParams);
      } else {
        message.error(response.message || `${editingStudent ? '更新' : '添加'}失败`);
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
      title: '资产',
      dataIndex: 'funds',
      key: 'funds',
      width: 100,
      sorter: (a, b) => a.funds - b.funds
    },
    {
      title: '面试次数',
      dataIndex: 'interviewer_count',
      key: 'interviewer_count',
      width: 120,
      sorter: (a, b) => a.interviewer_count - b.interviewer_count
    },
    {
      title: '求职次数',
      dataIndex: 'applicant_count',
      key: 'applicant_count',
      width: 180,
      sorter: (a, b) => a.applicant_count - b.applicant_count
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
          {/* <Popconfirm
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
          </Popconfirm> */}
        </Space>
      )
    }
  ];

  const handleSearch = async (values: any) => {
    try {
      const response = await getStudentsSearch({
        keyword: values.keyword
      });
      if (response.code === 200 && response.data) {
        setStudents(response.data);
        setPagination({
          ...pagination,
          current: 1,
          total: response.data.length
        });
      } else {
        message.error(response.message || '搜索失败');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败，请稍后重试');
    }
  };

  const handleBatchDelete = async () => {
    try {
      const deletePromises = selectedRowKeys.map(id => deleteStudentsPinyin2025001());
      const results = await Promise.allSettled(deletePromises);
      
      const successCount = results.filter(result => result.status === 'fulfilled' && result.value.code === 200).length;
      const failCount = selectedRowKeys.length - successCount;
      
      if (successCount > 0) {
        message.success(`成功删除 ${successCount} 名学生`);
        setSelectedRowKeys([]);
        loadStudents(searchParams);
      }
      
      if (failCount > 0) {
        message.error(`${failCount} 名学生删除失败`);
      }
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error('批量删除失败，请稍后重试');
    }
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
      const response = await getStudentsSortFunds();
      if (response.code === 200 && response.data) {
        // 将数据转换为CSV格式
        const csvContent = 'data:text/csv;charset=utf-8,' + 
          '姓名,学号,状态,资金,排名\n' + 
          response.data.map(student => {
            return `${student.name},${student.student_id},${student.is_active ? '在校' : '离校'},${student.funds},${student.ranking}`;
          }).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', '学生名单.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error(response.message || '导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请稍后重试');
    }
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<StudentId[]>([]);

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/students/import',
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
            {/* <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>导入学生</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出学生</Button> */}
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
              onConfirm={() => {
                'use strict';
                console.log('adsfasd')
            }}
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
          { !editingStudent && (  <Form.Item
            name="student_id"
            label="学号"
            rules={[
              { required: true, message: '请输入学号' },
              { pattern: /^\d{8,12}$/, message: '学号必须是8-12位数字' }
            ]}
          >
            <Input placeholder="请输入8-12位学号" />
          </Form.Item>)}
        
          {/* <Form.Item
            name="is_active"
            label="状态"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="在校"
              unCheckedChildren="离校"
            />
          </Form.Item> */}
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default StudentsManagement;
