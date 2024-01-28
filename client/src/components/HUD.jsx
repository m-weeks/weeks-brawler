export default function HUD({ localState, gameState }) {
  const myPlayer = gameState?.players?.[localState?.clientId];

  return (
    <>
      <div style={{ position: 'absolute', top: 25, left: 25 }}>
        <div style={{ backgroundColor: 'red', width: 100, height: 25, position: 'absolute' }}>
        </div>
        <div style={{ backgroundColor: 'green', width: Math.max(myPlayer?.health ?? 100, 0), height: 25, position: 'absolute' }}>
        </div>
      </div>
      {
          myPlayer?.health <= 0 ? (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 60 }}>
              DEAD
            </div>
          ) : null
      }
    </>
  )
}