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

export const Intro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Ligne gold — scale X de 0 à 1
  const lineScale = spring({ frame, fps, from: 0, to: 1, config: { damping: 20, stiffness: 80 }, delay: 20 })

  // Eyebrow opacity
  const eyebrowOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp' })

  // Titre — chaque lettre montée depuis le bas
  const titleChars = 'PAUL BLANC'.split('')
  const titleY = (i: number) =>
    interpolate(frame, [40 + i * 3, 70 + i * 3], [120, 0], { extrapolateRight: 'clamp' })
  const titleOpacity = (i: number) =>
    interpolate(frame, [40 + i * 3, 60 + i * 3], [0, 1], { extrapolateRight: 'clamp' })

  // Sous-titre
  const subOpacity = interpolate(frame, [90, 115], [0, 1], { extrapolateRight: 'clamp' })

  // Vignette pulsée légère
  const vigOpacity = interpolate(frame, [0, 30], [1, 0.55], { extrapolateRight: 'clamp' })

  // Fade out global en fin
  const globalOpacity = interpolate(frame, [durationInFrames - 25, durationInFrames - 5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ background: DARK, opacity: globalOpacity }}>
      {/* Grain */}
      <AbsoluteFill style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '160px',
        opacity: 0.045,
        pointerEvents: 'none',
        zIndex: 10,
      }} />

      {/* Vignette */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 65% at 50% 50%, transparent 20%, rgba(6,4,10,${vigOpacity}) 100%)`,
        zIndex: 5,
      }} />

      {/* Contenu centré */}
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>

        {/* Ligne gold */}
        <div style={{
          width: 64,
          height: 1,
          background: GOLD,
          transform: `scaleX(${lineScale})`,
          transformOrigin: 'left center',
          marginBottom: 32,
          opacity: lineScale,
        }} />

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 13,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: GOLD,
          opacity: eyebrowOpacity,
          marginBottom: 24,
        }}>
          Portfolio 2025
        </div>

        {/* Titre lettre par lettre */}
        <div style={{ display: 'flex', overflow: 'hidden', lineHeight: 1 }}>
          {titleChars.map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: 'Georgia, serif',
                fontSize: 140,
                fontWeight: 400,
                color: CREAM,
                letterSpacing: ch === ' ' ? '0.12em' : '0.06em',
                transform: `translateY(${titleY(i)}px)`,
                opacity: titleOpacity(i),
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>

        {/* Sous-titre */}
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 15,
          fontWeight: 300,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(240,235,224,0.5)',
          opacity: subOpacity,
          marginTop: 28,
        }}>
          Développeur Créatif — Motion Design — Java · React
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
