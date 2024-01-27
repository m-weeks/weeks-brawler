export default function Wall({ position, args, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color ?? "grey" } />
    </mesh>
  );
}