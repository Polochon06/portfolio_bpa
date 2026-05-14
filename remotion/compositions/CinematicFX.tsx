import { AbsoluteFill, useCurrentFrame } from 'remotion'

export type CinematicFXProps = {
  aberration: number  // 0–1, spikes on scene transition
}

export const CinematicFX: React.FC<CinematicFXProps> = ({ aberration }) => {
  useCurrentFrame()

  if (aberration <= 0.01) return null

  const ab = aberration * 8

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255,20,20,${0.09 * aberration}) 0%, transparent 70%)`,
        transform: `translateX(${-ab}px)`,
        mixBlendMode: 'screen',
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(20,60,255,${0.09 * aberration}) 0%, transparent 70%)`,
        transform: `translateX(${ab}px)`,
        mixBlendMode: 'screen',
      }} />
    </AbsoluteFill>
  )
}
