import Scene from './components/scene/Scene'
import GameHUD from './components/ui/GameHUD'

export default function App() {
  return (
    // 풀스크린: 3D 씬이 배경, UI가 위에 떠있음
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)' }}>
      <Scene />
      <GameHUD />
    </div>
  )
}
