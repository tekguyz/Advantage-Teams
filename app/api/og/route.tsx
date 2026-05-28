import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        height: '100%', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f4f5f7',
        fontFamily: 'system-ui, sans-serif', 
        padding: '60px'
      }}>
        <svg width="160" height="160" viewBox="0 0 100 100" style={{ marginBottom: '32px' }}>
          <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="#172b4d" strokeWidth="4" />
          <path d="M50 5 Q50 50 95 50 Q50 50 50 95 Q50 50 5 50 Q50 50 50 5" fill="#172b4d" opacity={0.15} />
          <circle cx="50" cy="50" r="18" fill="#0052cc" />
        </svg>

        <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#172b4d', letterSpacing: '-0.02em' }}>
          Advantage Teams
        </div>

        <div style={{ fontSize: '24px', color: '#5e6c84', marginTop: '16px' }}>
          Performance Analytics & Telemetry Workspace
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
