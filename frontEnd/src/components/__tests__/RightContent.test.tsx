import { render, screen } from '@testing-library/react';
import RightContent from '../RightContent';

const mockInitialState = {
  settings: {
    navTheme: 'light',
    layout: 'mix',
    contentWidth: 'Fluid',
  },
};

jest.mock('@/hooks/useInitialState', () => ({
  useInitialState: () => [mockInitialState],
}));

describe('RightContent', () => {
  it('should render without error', () => {
    const { container } = render(<RightContent />);
    expect(container).toBeTruthy();
  });

  it('should render language switcher', () => {
    render(<RightContent />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});