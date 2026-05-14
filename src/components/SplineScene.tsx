import { Suspense, lazy } from 'react'
const SplineLib = lazy(() => import('@splinetool/react-spline'))

type Props = {
  scene: string
  className?: string
  style?: React.CSSProperties
  interactive?: boolean
}

export function SplineScene({ scene, className, style, interactive = false }: Props) {
  if (!scene) return null
  return (
    <Suspense fallback={null}>
      <SplineLib
        scene={scene}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: interactive ? 'auto' : 'none',
          ...style,
        }}
      />
    </Suspense>
  )
}
