import React from 'react';

const MockIcon = ({ size = 24, ...props }: { size?: number; [key: string]: any }) => (
  <div
    data-testid={`mock-icon-${props['data-testid'] || ''}`}
    style={{ width: size, height: size }}
  >
    {props.children || 'Icon'}
  </div>
);

// Create mock icons
export const Moon = (props: any) => (
  <MockIcon data-testid="moon-icon" {...props}>
    Moon Icon
  </MockIcon>
);
export const Sun = (props: any) => (
  <MockIcon data-testid="sun-icon" {...props}>
    Sun Icon
  </MockIcon>
);
export const ChevronDown = (props: any) => (
  <MockIcon data-testid="chevron-down-icon" {...props}>
    ChevronDown Icon
  </MockIcon>
);
export const ChevronUp = (props: any) => (
  <MockIcon data-testid="chevron-up-icon" {...props}>
    ChevronUp Icon
  </MockIcon>
);
export const Globe = (props: any) => (
  <MockIcon data-testid="globe-icon" {...props}>
    Globe Icon
  </MockIcon>
);
export const Languages = (props: any) => (
  <MockIcon data-testid="languages-icon" {...props}>
    Languages Icon
  </MockIcon>
);
export const MapPin = (props: any) => (
  <MockIcon data-testid="map-pin-icon" {...props}>
    MapPin Icon
  </MockIcon>
);
export const Users = (props: any) => (
  <MockIcon data-testid="users-icon" {...props}>
    Users Icon
  </MockIcon>
);
export const Home = (props: any) => (
  <MockIcon data-testid="home-icon" {...props}>
    Home Icon
  </MockIcon>
);
export const Info = (props: any) => (
  <MockIcon data-testid="info-icon" {...props}>
    Info Icon
  </MockIcon>
);
export const Send = (props: any) => (
  <MockIcon data-testid="send-icon" {...props}>
    Send Icon
  </MockIcon>
);
export const Loader = (props: any) => (
  <MockIcon data-testid="loader-icon" {...props}>
    Loader Icon
  </MockIcon>
);

// Add more icons as needed
