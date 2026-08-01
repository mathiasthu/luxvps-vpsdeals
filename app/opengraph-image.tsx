import { ImageResponse } from 'next/og';
import { DATACENTER_LOCATION } from '@/lib/seo';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'LuxVPS Deal Finder — cheap KVM, Ryzen and EPYC VPS deals in Frankfurt, Germany';

// Applies to every route that does not ship its own opengraph-image
// (deal pages override it in app/deals/[slug]/opengraph-image.tsx).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0D1117 0%, #1a0408 50%, #0D1117 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '70px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
          <span style={{ color: '#E63946', fontSize: 34, fontWeight: 900 }}>Lux</span>
          <span style={{ color: '#ffffff', fontSize: 34, fontWeight: 900 }}>VPS</span>
          <span style={{ color: '#FFD60A', fontSize: 22, fontWeight: 500, marginLeft: 12 }}>
            Deal Finder
          </span>
        </div>

        <div
          style={{
            color: '#ffffff',
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 22,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Cheap KVM, Ryzen &amp; EPYC</span>
          {/* Satori needs an explicit display on any element with more than one child */}
          <div style={{ display: 'flex' }}>
            <span>VPS Deals in&nbsp;</span>
            <span style={{ color: '#E63946' }}>Frankfurt</span>
          </div>
        </div>

        <div style={{ color: '#8B949E', fontSize: 26, marginBottom: 44 }}>
          {`Live stock · Daily prices · Full root access · ${DATACENTER_LOCATION}`}
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {['KVM Root Servers', 'Ryzen KVM', 'EPYC KVM'].map((line) => (
            <div
              key={line}
              style={{
                background: '#161B22',
                border: '1px solid #30363D',
                borderRadius: 12,
                padding: '14px 26px',
                color: '#E6EDF3',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #E63946, #FFD60A, #06D6A0)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
