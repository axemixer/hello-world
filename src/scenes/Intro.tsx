import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ball} from '../components/Ball';
import {AccentRule, LiveTag, Ticker} from '../components/Broadcast';
import {EASE_OUT, punchIn, reveal} from '../components/anim';
import {COLORS, FONTS} from '../theme';

/** Bars 0-1: the opening sting, cut to land on the bar-2 impact. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ballIn = interpolate(frame, [0, 26], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const spin = interpolate(frame, [0, 90], [-140, 220]);

  const kicker = punchIn(frame, fps, 14);
  const title = punchIn(frame, fps, 20);
  const rule = reveal(frame, 30, 14);
  const sub = punchIn(frame, fps, 36);

  // Two sweeping wipes, the way a broadcast opener brands the screen.
  const wipe = (delay: number) =>
    interpolate(frame, [delay, delay + 18], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASE_OUT,
    });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(165deg, rgba(6,17,25,0.55) 0%, rgba(6,17,25,0.9) 60%, rgba(6,17,25,0.97) 100%)',
        }}
      />

      {/* Angled colour flashes behind the type. */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            top: 470,
            left: -200,
            width: 1600,
            height: 26,
            background: COLORS.orange,
            transform: `rotate(-8deg) scaleX(${wipe(8)})`,
            transformOrigin: 'left center',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 1640,
            left: -200,
            width: 1600,
            height: 14,
            background: COLORS.lime,
            transform: `rotate(-8deg) scaleX(${wipe(14)})`,
            transformOrigin: 'left center',
            opacity: 0.85,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          padding: '74px 44px 64px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <LiveTag progress={punchIn(frame, fps, 4)} label="MAÇ ÖNÜ" />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          <div
            style={{
              opacity: ballIn,
              transform: `translateY(${(1 - ballIn) * 260}px) scale(${0.4 + 0.6 * ballIn})`,
              filter: 'drop-shadow(0 34px 50px rgba(0,0,0,0.7))',
              marginBottom: 46,
            }}
          >
            <Ball size={330} rotation={spin} />
          </div>

          <div
            style={{
              opacity: kicker,
              transform: `translateY(${(1 - kicker) * 30}px)`,
              fontFamily: FONTS.body,
              fontWeight: 700,
              fontSize: 54,
              letterSpacing: 20,
              color: COLORS.lime,
              lineHeight: 1,
              marginBottom: 18,
            }}
          >
            HALI SAHA
          </div>

          <div
            style={{
              opacity: title,
              transform: `scale(${interpolate(title, [0, 1], [1.45, 1])})`,
              fontFamily: FONTS.display,
              fontSize: 208,
              lineHeight: 1.3,
              color: '#fff',
              letterSpacing: 3,
              textShadow: '0 16px 44px rgba(0,0,0,0.8)',
            }}
          >
            MAÇ GÜNÜ
          </div>

          <div style={{marginTop: 64}}>
            <AccentRule
              progress={rule}
              width={620}
              colors={[COLORS.orange, COLORS.lime, COLORS.ice]}
            />
          </div>

          <div
            style={{
              opacity: sub,
              marginTop: 34,
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: 12,
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1,
            }}
          >
            KADROLAR AÇIKLANDI
          </div>
        </div>

        <Ticker progress={reveal(frame, 22, 14)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
