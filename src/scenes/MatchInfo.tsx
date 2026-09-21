import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MATCH} from '../data';
import {punchIn} from '../components/anim';
import {COLORS, FONTS, shadow} from '../theme';

const CalendarIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    <rect x="7" y="13.5" width="4" height="3.5" rx="0.8" fill={color} stroke="none" />
  </svg>
);

const PinIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

const ClockIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6.8V12l3.6 2.3" strokeLinecap="round" />
  </svg>
);

const ROWS = [
  {label: 'GÜN', value: MATCH.day, Icon: CalendarIcon, tint: COLORS.lime},
  {label: 'SAHA', value: MATCH.venue, Icon: PinIcon, tint: COLORS.orange},
  {label: 'SAAT', value: MATCH.time, Icon: ClockIcon, tint: COLORS.ice},
];

/** Bars 2-5: the three facts that actually matter, one per bar. */
export const MatchInfo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const header = punchIn(frame, fps, 0);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 70px',
        gap: 34,
      }}
    >
      <div
        style={{
          opacity: header,
          transform: `translateY(${(1 - header) * -40}px)`,
          fontFamily: FONTS.body,
          fontWeight: 700,
          fontSize: 50,
          letterSpacing: 16,
          color: 'rgba(255,255,255,0.72)',
          marginBottom: 12,
        }}
      >
        MAÇ BİLGİLERİ
      </div>

      {ROWS.map(({label, value, Icon, tint}, i) => {
        const p = punchIn(frame, fps, 14 + i * 30);
        const glow = interpolate(
          frame,
          [14 + i * 30, 26 + i * 30, 52 + i * 30],
          [0, 1, 0.22],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );

        return (
          <div
            key={label}
            style={{
              opacity: p,
              transform: `translateX(${(1 - p) * (i % 2 === 0 ? -520 : 520)}px)`,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              padding: '30px 46px',
              borderRadius: 34,
              background: 'rgba(6,17,25,0.72)',
              border: `4px solid ${tint}`,
              boxShadow: `${shadow(1)}, 0 0 ${60 * glow}px ${tint}`,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Icon color={tint} />
            <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1}}>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontWeight: 600,
                  fontSize: 38,
                  letterSpacing: 10,
                  color: tint,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: value.length > 9 ? 108 : 128,
                  color: '#fff',
                  letterSpacing: 1,
                  marginTop: 8,
                  lineHeight: 1.3, // reserves the Ş / Ç descender inside the line box
                }}
              >
                {value}
              </span>
            </div>
          </div>
        );
      })}

      <div
        style={{
          opacity: punchIn(frame, fps, 104),
          marginTop: 18,
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: 8,
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        {MATCH.venueNote} · 6&apos;YA 6
      </div>
    </AbsoluteFill>
  );
};
