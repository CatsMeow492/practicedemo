import React from 'react';

// Mock all common Lucide icons
const createIconMock = (name) => (props) => {
  return React.createElement(
    'div', 
    { 
      'data-testid': `${name.toLowerCase()}-icon`,
      ...props,
    }, 
    `${name} Icon`
  );
};

// Export specific icons used in the app
export const Moon = createIconMock('Moon');
export const Sun = createIconMock('Sun');

// Add other icons as needed
export const Check = createIconMock('Check');
export const X = createIconMock('X');
export const ChevronDown = createIconMock('ChevronDown');
export const ChevronUp = createIconMock('ChevronUp');
export const ChevronLeft = createIconMock('ChevronLeft');
export const ChevronRight = createIconMock('ChevronRight');
export const Search = createIconMock('Search');
export const Info = createIconMock('Info');
export const Globe = createIconMock('Globe');
export const Map = createIconMock('Map');
export const User = createIconMock('User');
export const LogIn = createIconMock('LogIn');
export const LogOut = createIconMock('LogOut');

// Default export for dynamic imports
export default {
  Moon,
  Sun,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Info,
  Globe,
  Map,
  User,
  LogIn,
  LogOut,
}; 