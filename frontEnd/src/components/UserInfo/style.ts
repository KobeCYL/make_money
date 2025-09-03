import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    userInfoCard: {
      marginBottom: 24,
    },
    userInfoContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0',
    },
    avatarHolder: {
      textAlign: 'center',
      marginBottom: 24,
      '& > .ant-avatar': {
        marginBottom: 20,
        background: token.colorPrimary,
      },
    },
    name: {
      fontSize: 20,
      lineHeight: '28px',
      fontWeight: 500,
      color: token.colorTextHeading,
      marginBottom: 4,
    },
    role: {
      fontSize: 14,
      lineHeight: '22px',
      color: token.colorTextSecondary,
    },
    detail: {
      width: '100%',
      padding: '0 32px',
      '& p': {
        position: 'relative',
        marginBottom: 8,
        paddingLeft: 26,
        '&:last-child': {
          marginBottom: 0,
        },
      },
    },
    icon: {
      position: 'absolute',
      left: 0,
      top: '4px',
      width: 14,
      height: 14,
    },
  };
});

export default useStyles;