// 원형 우드톤 바닥
export default function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[8, 64]} />
      <meshStandardMaterial color="#E8D9BE" roughness={0.8} />
    </mesh>
  )
}
