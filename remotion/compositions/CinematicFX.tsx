import { AbsoluteFill, useCurrentFrame, random } from 'remotion'

export type CinematicFXProps = {
  aberration: number  // 0–1, spikes on scene transition
}

export const CinematicFX: React.FC<CinematicFXProps> = ({ aberration }) => {
  const frame = useCurrentFrame()

  // New noise seed every frame → real film grain movement
  const seed    = frame % 199
  const freq    = 0.63 + random(`f${seed}`) * 0.08
  const opacity = 0.050 + random(`o${seed}`) * 0.016

  // Chromatic aberration: R channel left, B channel right
  const ab = aberration * 6

  const svg = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='${freq.toFixed(4)}' numOctaves='4' seed='${seed}' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>`

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>

      {/* Aberration R */}
      {aberration > 0.01 && (
        <AbsoluteFill style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255,20,20,${0.07 * aberration}) 0%, transparent 70%)`,
          transform: `translateX(${-ab}px)`,
          mixBlendMode: 'screen',
        }} />
      )}

      {/* Aberration B */}
      {aberration > 0.01 && (
        <AbsoluteFill style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 50%, rgba(20,60,255,${0.07 * aberration}) 0%, transparent 70%)`,
          transform: `translateX(${ab}px)`,
          mixBlendMode: 'screen',
        }} />
      )}

      {/* Animated grain */}
      <AbsoluteFill style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: '155px',
        opacity,
        mixBlendMode: 'overlay',
      }} />

    </AbsoluteFill>
  )
}
