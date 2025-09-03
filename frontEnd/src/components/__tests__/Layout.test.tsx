import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import MainLayout from '../Layout';
import type { RenderResult } from '@testing-library/react';

// Mock the Outlet component from @umijs/max
jest.mock('@umijs/max', () => ({
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useLocation: () => ({
    pathname: '/'
  }),
  history: {
    push: jest.fn()
  }
}));

// Mock the Navigation component
jest.mock('../Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="navigation">Navigation Component</div>;
  };
});

// Mock the Footer component
jest.mock('../Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Component</div>;
  };
});

describe('MainLayout Component', () => {
  it('renders all layout components', () => {
    render(<MainLayout />);
    
    // Check if the logo text is rendered
    expect(screen.getByText('智能点名系统')).toBeInTheDocument();
    
    // Check if Navigation component is rendered
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    
    // Check if Outlet is rendered
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    
    // Check if Footer component is rendered
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    render(<MainLayout />);
    
    // Check if the main layout container exists
    const layoutElement = screen.getByRole('main');
    expect(layoutElement).toBeInTheDocument();
    
    // Check if header exists
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
    
    // Check if content section exists
    const contentElement = screen.getByRole('main');
    expect(contentElement).toBeInTheDocument();
  });
});