import React from 'react';

// Mock all common Lucide icons
const createIconMock = (displayName) => {
  const MockIcon = (props) =>
    React.createElement(
      'div',
      { 'data-testid': `${displayName.toLowerCase()}-icon`, ...props },
      `${displayName} Icon`,
    );
  MockIcon.displayName = displayName; // For better debugging and snapshots
  return MockIcon;
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

// If a default export is absolutely needed by some part of the chain
// (e.g. if modularize-import-loader transforms some imports to default imports from the main package)
// then provide it, but primarily rely on named exports.
const defaultExports = {
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

export default defaultExports;
