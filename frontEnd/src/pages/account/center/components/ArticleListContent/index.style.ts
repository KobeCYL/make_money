import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  listContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  description: {
    lineHeight: '22px',
    marginTop: 16,
    marginBottom: 16,
    color: 'rgba(0, 0, 0, 0.65)',
  },
  extra: {
    color: 'rgba(0, 0, 0, 0.45)',
    marginTop: 16,
    lineHeight: '22px',
    display: 'flex',
    justifyContent: 'space-between',
  },
};

export default styles;
