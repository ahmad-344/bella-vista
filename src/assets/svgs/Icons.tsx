// ============================================
// BELLA VISTA — SVG Icon Components
// All icons are custom SVGs, no emoji
// ============================================

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function LeafIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6.5 17.5C6.5 17.5 4 14 4 9C4 5.13 7.13 2 11 2C15 2 18 5 18 9C18 13.5 14 17 14 17L12 22L6.5 17.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 2C11 2 10 8 14 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function ChefHatIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 14V18H18V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14C8 14 8 10 6 10C4 10 4 12 4 12C4 10 6 8 8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 14C16 14 16 10 18 10C20 10 20 12 20 12C20 10 18 8 16 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <ellipse cx="12" cy="8" rx="4" ry="3" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

export function WineGlassIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 15V21M9 21H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 3H17L15 12C14.5 13.5 13 15 12 15C11 15 9.5 13.5 9 12L7 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 7.5H16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function CalendarIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M3 9H21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 2V6M16 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="14" r="1" fill={color}/>
      <circle cx="12" cy="14" r="1" fill={color}/>
      <circle cx="16" cy="14" r="1" fill={color}/>
      <circle cx="8" cy="18" r="1" fill={color}/>
      <circle cx="12" cy="18" r="1" fill={color}/>
    </svg>
  );
}

export function ClockIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 7V12L15 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PhoneIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6.6 10.8C7.8 13.2 9.8 15.2 12.2 16.4L14.2 14.4C14.5 14.1 14.9 14 15.3 14.2C16.6 14.6 18 14.9 19.5 14.9C20.3 14.9 21 15.6 21 16.4V19.5C21 20.3 20.3 21 19.5 21C10.4 21 3 13.6 3 4.5C3 3.7 3.7 3 4.5 3H7.5C8.3 3 9 3.7 9 4.5C9 6.1 9.3 7.5 9.7 8.8C9.9 9.1 9.8 9.5 9.5 9.8L7.4 11.9C7.1 11.5 6.8 11.2 6.6 10.8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MapPinIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C8.7 2 6 4.7 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.7 15.3 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="8" r="2.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

export function MailIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M2 8L12 13L22 8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function WhatsAppIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.5 3.4 17L2 22L7.2 20.6C8.7 21.5 10.3 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 10.5C9 10.5 9 14 14.5 15C14.5 15 16 15 16.5 13.5C16.5 13.5 14.5 12.5 14 12.5C14 12.5 13.5 12.5 13 13C13 13 11 12 11 10.5C11 10.5 11.5 10 11.5 9.5C11.5 9 10.5 7 10.5 7C9 7 9 8.5 9 10.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function InstagramIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill={color}/>
    </svg>
  );
}

export function FacebookIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 2H15C13.7 2 12.4 2.5 11.5 3.4C10.5 4.3 10 5.6 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.7 14.1 6.4 14.3 6.2C14.5 6 14.7 5.9 15 5.9H18V2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TwitterIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4L10.5 12.5M4 4H8L12 9.5M4 4L20 20H16L10.5 12.5M20 4L13.5 11.5M20 4H16L12 9.5M20 4L10.5 12.5L8 20H12L13.5 17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronDownIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArrowRightIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12H19M13 6L19 12L13 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function StarIcon({ className = '', size = 20, color = '#c9a84c', filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} className={className}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CheckIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MenuIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 6H21M3 12H21M3 18H21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function CloseIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function WindowTableIcon({ className = '', size = 28, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <rect x="2" y="2" width="24" height="18" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M2 10H26" stroke={color} strokeWidth="1.5"/>
      <path d="M14 2V10" stroke={color} strokeWidth="1.5"/>
      <path d="M9 20V26M19 20V26" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 26H22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function GardenIcon({ className = '', size = 28, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M14 20V28M10 28H18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 20C14 20 8 16 8 10C8 6.7 10.7 4 14 4C17.3 4 20 6.7 20 10C20 16 14 20 14 20Z" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 14C6 14 2 12 2 8C4 8 7 10 8 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 14C22 14 26 12 26 8C24 8 21 10 20 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function HallIcon({ className = '', size = 28, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M2 26V8L14 2L26 8V26H2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="11" y="16" width="6" height="10" stroke={color} strokeWidth="1.5"/>
      <rect x="5" y="12" width="5" height="5" stroke={color} strokeWidth="1.5"/>
      <rect x="18" y="12" width="5" height="5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

export function PrivateRoomIcon({ className = '', size = 28, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <rect x="2" y="10" width="24" height="18" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M9 10V7C9 4.2 11.2 2 14 2C16.8 2 19 4.2 19 7V10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="19" r="2" stroke={color} strokeWidth="1.5"/>
      <path d="M14 21V24" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function DirectionsIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 11L12 3L21 11V21H15V15H9V21H3V11Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function QuoteIcon({ className = '', size = 32, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M4 16C4 10.5 7.5 6 13 5V9C10 10 9 12.5 9 14H13V22H4V16Z" fill={color} opacity="0.3"/>
      <path d="M18 16C18 10.5 21.5 6 27 5V9C24 10 23 12.5 23 14H27V22H18V16Z" fill={color} opacity="0.3"/>
    </svg>
  );
}

export function CelebrationIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5.5 2L6.5 5.5M18.5 2L17.5 5.5M2 18.5L5.5 17.5M22 18.5L18.5 17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 8L16 20L19 13L13 10L8 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 8L4 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function DiamondIcon({ className = '', size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 2L14 8L8 14L2 8L8 2Z" stroke={color} strokeWidth="1" fill={color} opacity="0.6"/>
    </svg>
  );
}

export function ScrollDownIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="8" y="2" width="8" height="14" rx="4" stroke={color} strokeWidth="1.5"/>
      <circle cx="12" cy="6" r="1.5" fill={color}/>
      <path d="M8 22L12 18L16 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function WheelchairIcon({ className = '', size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="4" r="2" stroke={color} strokeWidth="1.5"/>
      <path d="M12 6V14H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 10H7L5 17H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="20" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="18" cy="20" r="2.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}
