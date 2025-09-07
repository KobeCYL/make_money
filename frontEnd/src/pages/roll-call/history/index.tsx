import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Tag, Space, Avatar, DatePicker, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { getRecords } from '@/services/makeMoney/history';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';

interface RollCallRecord {
  id: number;
  date: number;
  candidate: string;
  interviewer: string;
  question: string;
  score_result: string;
  reward_amount: number;
}

const columns: ColumnsType<RollCallRecord> = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    sorter: (a, b) => a.date - b.date,
  },
  {
    title: '求职者',
    dataIndex: 'candidate',
    key: 'candidate',
    render: (candidate) => (
      <Space>
        <Avatar style={{ border: '2px solid #f5222d', backgroundColor: '#fafafa' }}>
          {candidate.slice(0, 1)}
        </Avatar>
        {candidate}
      </Space>
    ),
  },
  {
    title: '面试官',
    dataIndex: 'interviewer',
    key: 'interviewer',
    render: (interviewer) => (
      <Space>
        <Avatar style={{ border: '2px solid #1890ff', backgroundColor: '#fafafa' }}>
          {interviewer.slice(0, 1)}
        </Avatar>
        {interviewer}
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
    dataIndex: 'score_result',
    key: 'score_result',
    render: (score_result) => (
      <Tag color={score_result.includes('达标') || score_result.includes('优秀') ? 'success' : 'error'}>
        {score_result}
      </Tag>
    ),
  },
  {
    title: '奖励金额',
    dataIndex: 'reward_amount',
    key: 'reward_amount',
    render: (reward_amount) => `¥${parseFloat(reward_amount).toFixed(2)}`,
    sorter: (a, b) => parseFloat(a.reward_amount) - parseFloat(b.reward_amount),
  },
];

const RollCallHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<RollCallRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await getRecords();
      if (response.code === 200 && response.data) {
        setRecords(response.data);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error('获取面试记录失败:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSearch = () => {
    // 实现搜索逻辑
    const filteredRecords = records.filter(record => {
      const matchText = searchText.toLowerCase();
      const matchDate = !dateRange[0] || !dateRange[1] || 
        (record.date >= dateRange[0].valueOf() && record.date <= dateRange[1].valueOf());
      
      return matchDate && (
        record.candidate.toLowerCase().includes(matchText) ||
        record.interviewer.toLowerCase().includes(matchText) ||
        record.question.toLowerCase().includes(matchText)
      );
    });
    setRecords(filteredRecords);
  };

  const handleReset = () => {
    setSearchText('');
    setDateRange([null, null]);
    fetchRecords();
  };

  return (
    <PageContainer>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <DatePicker.RangePicker 
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            showTime
          />
          <Input
            placeholder="搜索求职者/面试官/问题"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>搜索</Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{
            total: total,
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default RollCallHistory;