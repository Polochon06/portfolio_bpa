import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const GOLD = '#c9a84c'
const DARK = '#06040a'
const CREAM = '#f0ebe0'

type Props = {
  title: string
  subtitle: string
}

export const SceneCard: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const lineScale = spring({ frame, fps, from: 0, to: 1, config: { damping: 18, stiffness: 70 }, delay: 10 })

  const titleChars = title.split('')
  const titleY = (i: number) =>
    interpolate(frame, [20 + i * 4, 55 + i * 4], [100, 0], { extrapolateRight: 'clamp' })

  const subOpacity = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp' })

  const globalOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <AbsoluteFill style={{ background: DARK, opacity: globalOpacity }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 65% at 50% 50%, transparent 20%, rgba(6,4,10,0.7) 100%)`,
        zIndex: 5,
      }} />

      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'flex-end',
        padding: '0 12% 12%',
        zIndex: 10,
      }}>
        {/* Gold line */}
        <div style={{
          width: 44, height: 1, background: GOLD,
          transform: `scaleX(${lineScale})`,
          transformOrigin: 'left center',
          marginBottom: 28,
        }} />

        {/* Title */}
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          {titleChars.map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: 'Georgia, serif',
              fontSize: 96,
              fontWeight: 400,
              color: CREAM,
              letterSpacing: ch === ' ' ? '0.08em' : '0.03em',
              transform: `translateY(${titleY(i)}px)`,
            }}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: 'sans-serif', fontSize: 14,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(240,235,224,0.5)',
          opacity: subOpacity, marginTop: 20,
        }}>
          {subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
