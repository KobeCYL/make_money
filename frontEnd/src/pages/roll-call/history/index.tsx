import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Space, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface RollCallRecord {
  key: string;
  date: string;
  student: {
    name: string;
    avatar: string;
  };
  interviewer: {
    name: string;
    avatar: string;
  };
  question: string;
  result: 'success' | 'fail';
  reward: number;
}

const columns: ColumnsType<RollCallRecord> = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '求职者',
    dataIndex: 'student',
    key: 'student',
    render: (student) => (
      <Space>
        <Avatar src={student.avatar} style={{ border: '2px solid #f5222d' }} />
        {student.name}
      </Space>
    ),
  },
  {
    title: '面试官',
    dataIndex: 'interviewer',
    key: 'interviewer',
    render: (interviewer) => (
      <Space>
        <Avatar src={interviewer.avatar} style={{ border: '2px solid #1890ff' }} />
        {interviewer.name}
      </Space>
    ),
  },
  {
    title: '面试问题',
    dataIndex: 'question',
    key: 'question',
    ellipsis: true,
  },
  {
    title: '评分结果',
    dataIndex: 'result',
    key: 'result',
    render: (result) => (
      <Tag color={result === 'success' ? 'success' : 'error'}>
        {result === 'success' ? '能力达标' : '需要提升'}
      </Tag>
    ),
  },
  {
    title: '奖励金额',
    dataIndex: 'reward',
    key: 'reward',
    render: (reward) => `¥${reward.toFixed(2)}`,
  },
];

// 示例数据
const data: RollCallRecord[] = [
  {
    key: '1',
    date: '2024-03-12 14:30:00',
    student: {
      name: '张三',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    },
    interviewer: {
      name: '李四',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    },
    question: '请描述一下你最近完成的一个项目，以及你在其中遇到的挑战和解决方案。',
    result: 'success',
    reward: 20.00,
  },
  // 可以添加更多示例数据
];

const RollCallHistory: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default RollCallHistory;