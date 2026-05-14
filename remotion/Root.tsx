import { Composition } from 'remotion'
import { Intro } from './compositions/Intro'
import { SceneCard } from './compositions/SceneCard'

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={180}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="SceneCard"
        component={SceneCard}
        durationInFrames={120}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{ title: 'Paul Blanc', subtitle: 'Développeur Créatif' }}
      />
    </>
  )
}
