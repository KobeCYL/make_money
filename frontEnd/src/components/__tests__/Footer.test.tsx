import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('should render without error', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });

  it('should contain copyright text', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/智能点名系统/);
    expect(copyrightText).toBeInTheDocument();
  });
});