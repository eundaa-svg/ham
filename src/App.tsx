import Scene from './components/scene/Scene'
import GameHUD from './components/ui/GameHUD'

export default function App() {
  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{ background: '#F5EFE4' }}
    >
      <Scene />
      <GameHUD />
    </div>
  )
}
