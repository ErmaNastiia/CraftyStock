// Small, self-contained line-icon set (no external dependency).
// Consistent 24x24 viewBox, stroke-based, currentColor — drop-in replacement
// for the emoji that used to live throughout the app.

function base(paths, extraViewBox) {
  return function Icon({ size = 18, strokeWidth = 1.75, className, style }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={extraViewBox || '0 0 24 24'}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
      >
        {paths}
      </svg>
    );
  };
}

export const IconThread = base(
  <>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
    <path d="M8.5 5.3c1.6 2.6 1.6 11 0 13.6M15.5 5.3c-1.6 2.6-1.6 11 0 13.6" />
  </>
);

export const IconBead = base(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 3.5v5.3M12 15.2v5.3M3.5 12h5.3M15.2 12h5.3" />
  </>
);

export const IconShuffle = base(
  <>
    <path d="M3 6h3.2c2 0 3.1 1 4.1 2.4" />
    <path d="M3 18h3.2c2 0 3.1-1 4.1-2.4" />
    <path d="M14 6h7M14 18h7" />
    <path d="M18 3l3 3-3 3M18 15l3 3-3 3" />
    <path d="M11.7 12.2c1 1.4 2.1 2.4 4.1 2.4" />
    <path d="M11.7 11.8c1-1.4 2.1-2.4 4.1-2.4" />
  </>
);

export const IconPalette = base(
  <>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-4.4-4-7.4-9-7.4z" />
    <circle cx="7.5" cy="11" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="16.7" cy="11" r="1.1" fill="currentColor" stroke="none" />
  </>
);

export const IconPackage = base(
  <>
    <path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" />
    <path d="M3 8.5 12 14l9-5.5" />
    <path d="M12 14v7" />
  </>
);

export const IconSettings = base(
  <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.6.7 1.1 1.5 1.1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
  </>
);

export const IconSearch = base(
  <>
    <circle cx="11" cy="11" r="7.5" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const IconArrowLeft = base(<path d="M19 12H5M11 18l-6-6 6-6" />);
export const IconArrowRight = base(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconChevronDown = base(<path d="m6 9 6 6 6-6" />);
export const IconChevronRight = base(<path d="m9 6 6 6-6 6" />);
export const IconX = base(<path d="M18 6 6 18M6 6l12 12" />);
export const IconPlus = base(<path d="M12 5v14M5 12h14" />);
export const IconMinus = base(<path d="M5 12h14" />);
export const IconCheck = base(<path d="M20 6 9 17l-5-5" />);
export const IconCamera = base(
  <>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </>
);
export const IconDownload = base(
  <>
    <path d="M12 3v13" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </>
);
export const IconSun = base(
  <>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
  </>
);
export const IconMoon = base(<path d="M20 14.5a8.5 8.5 0 1 1-10.5-11 7 7 0 0 0 10.5 11z" />);
export const IconMapPin = base(
  <>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </>
);
export const IconFileText = base(
  <>
    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
    <path d="M14 3v5h5" />
    <path d="M8.5 13h7M8.5 16.5h7" />
  </>
);
export const IconAlertCircle = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <circle cx="12" cy="16.2" r="0.4" fill="currentColor" />
  </>
);
export const IconList = base(
  <>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="4.2" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="4.2" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="4.2" cy="18" r="1" fill="currentColor" stroke="none" />
  </>
);
export const IconHash = base(
  <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
);
export const IconTrash = base(
  <>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
  </>
);
export const IconBox = base(
  <>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M4 9h16M9 4v16" />
  </>
);
export const IconInbox = base(
  <>
    <path d="M4 12h4.5l1.5 3h4l1.5-3H20" />
    <path d="M5.5 5h13l1.5 7v6a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18v-6z" />
  </>
);
