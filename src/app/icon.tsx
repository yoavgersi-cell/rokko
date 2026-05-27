import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2D7D5A',
          width: 32,
          height: 32,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="white"
        >
          {/* Toe pads */}
          <circle cx="6.5" cy="9.5" r="2" />
          <circle cx="10.5" cy="6.5" r="2" />
          <circle cx="14.5" cy="6.5" r="2" />
          <circle cx="18" cy="9.5" r="2" />
          {/* Main pad */}
          <ellipse cx="12" cy="15" rx="5" ry="4" />
        </svg>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
