import Wall from './Wall'

export const mapData = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1]
]

export default function Map() {
  const wallSize = [1, 1, 1]; // Assuming each wall is 1x1x1 (WxHxD)

  const floorWidth = mapData.length;
  const floorDepth = mapData[0].length;
  const floorSize = [floorWidth, 0, floorDepth];

  return (
    <>
      <Wall args={floorSize} position={[(floorWidth - 1) / 2, -0.5, (floorDepth - 1) / 2]} color="brown" />
      <Wall args={floorSize} position={[(floorWidth - 1) / 2, 0.5, (floorDepth - 1) / 2]} color="brown" />

      {
        mapData.flatMap((row, i) => (
          row.map((cell, j) => 
            cell === 1 ? <Wall key={`${i}-${j}`} position={[i, 0, j]} args={wallSize} /> : null
          )
        ))
      }
    </>
  );
}