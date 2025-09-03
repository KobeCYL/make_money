import { Layout } from 'antd';
import React from 'react';
import { Outlet } from '@umijs/max';
import { Footer, Navigation } from '@/components';
import useStyles from './style';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>智能点名系统</div>
        <Navigation />
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;