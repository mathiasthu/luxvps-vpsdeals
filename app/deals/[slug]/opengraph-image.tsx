import { ImageResponse } from 'next/og';
import { getDealBySlug } from '@/lib/scraper';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#0D1117',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#E63946', fontSize: 48, fontWeight: 900 }}>
            LuxVPS Deal Finder
          </span>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0D1117 0%, #1a0408 50%, #0D1117 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <span style={{ color: '#E63946', fontSize: 28, fontWeight: 900 }}>Lux</span>
          <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 900 }}>VPS</span>
          <span style={{ color: '#8B949E', fontSize: 18, fontWeight: 400, marginLeft: 10 }}>
            Deal Finder
          </span>
          {deal.badge && (
            <div
              style={{
                marginLeft: 'auto',
                background: deal.badge === 'best-value' ? '#06D6A0' : '#FFD60A',
                color: '#0D1117',
                fontSize: 14,
                fontWeight: 800,
                padding: '6px 16px',
                borderRadius: 20,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {deal.badge === 'best-value' ? 'Best Value' : 'Hot Deal'}
            </div>
          )}
        </div>

        {/* Deal name */}
        <div style={{ color: '#ffffff', fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          {deal.name}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 40 }}>
          <span style={{ color: '#E63946', fontSize: 72, fontWeight: 900 }}>
            €{deal.price.toFixed(2)}
          </span>
          <span style={{ color: '#8B949E', fontSize: 24, marginLeft: 8 }}>/month</span>
        </div>

        {/* Specs row */}
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'RAM', value: deal.specs.ram },
            { label: 'CPU', value: deal.specs.cpu },
            { label: 'Storage', value: deal.specs.disk },
            { label: 'Bandwidth', value: deal.specs.bandwidth },
          ].map((spec) => (
            <div
              key={spec.label}
              style={{
                background: '#161B22',
                border: '1px solid #30363D',
                borderRadius: 12,
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span style={{ color: '#8B949E', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
                {spec.label}
              </span>
              <span style={{ color: '#E6EDF3', fontSize: 20, fontWeight: 700 }}>{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
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
