// Icon set ported 1:1 from the inline SVGs in Cagette.dc.html.
import Svg, { Circle, Path } from 'react-native-svg';

export function HomeIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11l8-6 8 6M6 10v9h12v-9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function StockIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M4 8l8 4 8-4M12 12v8" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function ScanIcon({ color = '#fff', size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 9a2 2 0 012-2h1.5l1-2h5l1 2H20a0 0 0 010 0 2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function AlertsIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M10 19a2 2 0 004 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function PromosIcon({ color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 4h7l9 9-7 7-9-9V4z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Circle cx="8.5" cy="8.5" r="1.6" fill={color} />
    </Svg>
  );
}

export function CheckIcon({ color = '#fff', size = 15, strokeWidth = 3.4 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function LeafIcon({ color = '#fff', size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C9 7 7 9 7 13a5 5 0 0010 0c0-4-2-6-5-10z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ color = '#9a927f', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} />
      <Path d="M20 20l-3.5-3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ListLinesIcon({ color = '#B07A1E', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16M4 12h10M4 17h7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function FlipCameraIcon({ color = 'rgba(255,255,255,0.8)', size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function DialIcon({ color = '#fff', size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 12a6 6 0 0112 0M6 12a6 6 0 0012 0M3 12h1M20 12h1"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
