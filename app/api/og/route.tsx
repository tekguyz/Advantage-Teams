// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'row',
        backgroundColor: '#ffffff', fontFamily: 'system-ui, sans-serif', overflow: 'hidden'
      }}>
        {/* Left Side Brand Block */}
        <div style={{
          width: '420px', height: '100%', backgroundColor: '#0052cc', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="220" height="220" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="20" fill="#ffffff" />
            <path d="M50 16 L84 50 L50 84 L16 50 Z" fill="none" stroke="#0052cc" strokeWidth="4" />
            <path d="M50 16 Q50 50 84 50 Q50 50 50 84 Q50 50 16 50 Q50 50 50 16" fill="#0052cc" opacity="0.15" />
            <circle cx="50" cy="50" r="12" fill="#0052cc" />
          </svg>
        </div>

        {/* Right Side Content Matrix */}
        <div style={{
          flex: 1, height: '100%', padding: '80px 60px', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              backgroundColor: '#deebff', color: '#0747a6', padding: '6px 14px',
              borderRadius: '4px', fontSize: '13px', fontWeight: '800',
              textTransform: 'uppercase', letterSpacing: '0.05em', width: 'fit-content', marginBottom: '32px'
            }}>
              Real-Time Telemetry Stream
            </div>
            
            <div style={{ fontSize: '64px', fontWeight: '800', color: '#172b4d', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
              Advantage Software
            </div>
            
            <div style={{ fontSize: '40px', fontWeight: '700', color: '#0052cc', marginTop: '4px', letterSpacing: '-0.02em' }}>
              Teams Workspace
            </div>
            
            <div style={{ fontSize: '22px', color: '#44546f', marginTop: '24px', lineHeight: '1.5', maxWidth: '620px' }}>
              An enterprise operations framework built to bridge live hardware telephony lines directly with your Zoho system timelines.
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', fontSize: '16px',
            fontWeight: '700', color: '#8b949e', letterSpacing: '0.02em'
          }}>
            advantage-teams.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
