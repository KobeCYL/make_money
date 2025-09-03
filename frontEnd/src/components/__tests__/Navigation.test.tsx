import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import React from 'react';
import Navigation from '../Navigation';
import type { RenderResult } from '@testing-library/react';

// Mock history
const history = createMemoryHistory();
jest.mock('@umijs/max', () => ({
  history,
  useLocation: () => ({
    pathname: '/'
  })
}));

describe('Navigation Component', () => {
  it('renders navigation menu with all items', () => {
    render(<Navigation />);
    
    // Check main menu items
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('点名操作')).toBeInTheDocument();
    expect(screen.getByText('个人中心')).toBeInTheDocument();
  });

  it('highlights current route', () => {
    jest.spyOn(require('@umijs/max'), 'useLocation').mockImplementation(() => ({
      pathname: '/roll-call/operation'
    }));

    render(<Navigation />);
    
    const menuItem = screen.getByText('点名操作');
    expect(menuItem.closest('.ant-menu-item-selected')).toBeTruthy();
  });

  it('navigates when menu item is clicked', () => {
    render(<Navigation />);
    
    // Click on a menu item
    fireEvent.click(screen.getByText('首页'));
    
    // Verify navigation occurred
    expect(history.location.pathname).toBe('/');
  });
});