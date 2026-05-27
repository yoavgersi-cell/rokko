import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2D7D5A',
          width: 180,
          height: 180,
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="white"
        >
          <circle cx="6.5" cy="9.5" r="2" />
          <circle cx="10.5" cy="6.5" r="2" />
          <circle cx="14.5" cy="6.5" r="2" />
          <circle cx="18" cy="9.5" r="2" />
          <ellipse cx="12" cy="15" rx="5" ry="4" />
        </svg>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
