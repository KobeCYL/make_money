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
    key: '/roll-call',
    icon: <CheckCircleOutlined />,
    children: [
      {
        label: '点名',
        key: '/roll-call/operation',
      },
      {
        label: '历史记录',
        key: '/roll-call/history',
      },
      {
        label: '学生管理',
        key: '/roll-call/students',
      },
      {
        label: '状态统计',
        key: '/roll-call/status',
      },
    ],
  },
  {
    label: '个人中心',
    key: '/account',
    icon: <UserOutlined />,
    children: [
      {
        label: '个人信息',
        key: '/account/center',
      },
      {
        label: '设置',
        key: '/account/settings',
      },
    ],
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