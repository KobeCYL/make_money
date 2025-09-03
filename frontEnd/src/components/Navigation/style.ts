import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  menu: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    background: 'transparent',
    fontSize: '16px', // 设计文档中指定的副标题字体大小
    '& .ant-menu-item': {
      padding: `0 ${token.paddingLG}px`,
      margin: 0,
      '&::after': {
        display: 'none',
      },
    },
    '& .ant-menu-submenu': {
      padding: `0 ${token.paddingLG}px`,
      margin: 0,
      '&::after': {
        display: 'none',
      },
    },
    '& .ant-menu-item-selected': {
      color: '#1890ff', // 设计文档中指定的主色调
      backgroundColor: 'transparent',
      '&::after': {
        display: 'none',
      },
    },
    '& .ant-menu-submenu-selected': {
      color: '#1890ff', // 设计文档中指定的主色调
      backgroundColor: 'transparent',
    },
    '@media screen and (max-width: 992px)': {
      '& .ant-menu-item, & .ant-menu-submenu': {
        padding: `0 ${token.padding}px`,
      },
    },
  },
}));

export default useStyles;