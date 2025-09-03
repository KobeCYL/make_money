import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { Line } from '@ant-design/plots';

const RollCallStatus: React.FC = () => {
  // 示例数据
  const lineData = [
    { date: '2024-03-01', count: 3 },
    { date: '2024-03-02', count: 4 },
    { date: '2024-03-03', count: 2 },
    { date: '2024-03-04', count: 5 },
    { date: '2024-03-05', count: 3 },
    { date: '2024-03-06', count: 6 },
    { date: '2024-03-07', count: 4 },
  ];

  const config = {
    data: lineData,
    xField: 'date',
    yField: 'count',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col span={6}>
          <Card>
            <Statistic
              title="今日点名次数"
              value={8}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本周点名次数"
              value={42}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月点名次数"
              value={156}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总点名次数"
              value={1024}
              suffix="次"
            />
          </Card>
        </Col>

        {/* 趋势图 */}
        <Col span={24}>
          <Card title="点名趋势">
            <Line {...config} />
          </Card>
        </Col>

        {/* 进度统计 */}
        <Col span={12}>
          <Card title="求职进度">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={75}
                  format={(percent) => `${percent}%`}
                />
                <div style={{ marginTop: 8, textAlign: 'center' }}>本周完成率</div>
              </Col>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={85}
                  format={(percent) => `${percent}%`}
                />
                <div style={{ marginTop: 8, textAlign: 'center' }}>本月完成率</div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="面试进度">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={60}
                  format={(percent) => `${percent}%`}
                />
                <div style={{ marginTop: 8, textAlign: 'center' }}>本周完成率</div>
              </Col>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={70}
                  format={(percent) => `${percent}%`}
                />
                <div style={{ marginTop: 8, textAlign: 'center' }}>本月完成率</div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default RollCallStatus;