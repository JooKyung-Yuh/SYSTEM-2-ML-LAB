import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'System 2 ML Lab';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '60px 80px',
        }}
      >
        {/* Top line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '40px',
              background: '#0066cc',
              borderRadius: '2px',
            }}
          />
          <span
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '2px',
              fontWeight: 400,
            }}
          >
            KOREA UNIVERSITY
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          SYSTEM 2 ML LAB
        </div>

        {/* Page title */}
        {title !== 'System 2 ML Lab' && (
          <div
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            {title}
          </div>
        )}

        {/* Bottom tagline */}
        <div
          style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '32px',
            letterSpacing: '1px',
          }}
        >
          Meta-Learning · System 2 Deep Learning · LLM Reasoning
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
