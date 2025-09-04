import { HomeOutlined, UserOutlined, HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { history, useLocation } from '@umijs/max';
import React from 'react';
import type { MenuProps } from 'antd';
import useStyles from './style';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    label: '首页',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: '点名操作',
    key: '/roll-call/operation',
    icon: <CheckCircleOutlined />,
  },
  {
    label: '面试历史',
    key: '/roll-call/history',
    icon: <HistoryOutlined />,

  },
   {
    label: '学生管理',
    key: '/roll-call/students',
    icon: <UserOutlined />,

  },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const { styles } = useStyles();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    history.push(key);
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      className={styles.menu}
    />
  );
};

export default Navigation;