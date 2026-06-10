// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

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
          width: '450px', height: '100%', backgroundColor: '#0052cc', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="280" height="280" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="20" fill="#ffffff" />
            <path d="M50 16 L84 50 L50 84 L16 50 Z" fill="none" stroke="#0052cc" strokeWidth="4.5" />
            <path d="M50 16 Q50 50 84 50 Q50 50 50 84 Q50 50 16 50 Q50 50 50 16" fill="#0052cc" opacity="0.15" />
            <circle cx="50" cy="50" r="14" fill="#0052cc" />
          </svg>
        </div>

        {/* Right Side Content Matrix */}
        <div style={{
          flex: 1, height: '100%', padding: '90px 70px', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              backgroundColor: '#deebff', color: '#0747a6', padding: '8px 16px',
              borderRadius: '6px', fontSize: '15px', fontWeight: '800',
              textTransform: 'uppercase', letterSpacing: '0.06em', width: 'fit-content', marginBottom: '32px'
            }}>
              Real-Time Telemetry Stream
            </div>
            
            <div style={{ fontSize: '76px', fontWeight: '800', color: '#172b4d', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
              Advantage Software
            </div>
            
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#0052cc', marginTop: '6px', letterSpacing: '-0.02em' }}>
              Teams Workspace
            </div>
            
            <div style={{ fontSize: '24px', color: '#44546f', marginTop: '30px', lineHeight: '1.5', maxWidth: '640px' }}>
              An enterprise operations framework built to bridge live hardware telephony lines directly with your Zoho system timelines.
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', fontSize: '18px',
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
