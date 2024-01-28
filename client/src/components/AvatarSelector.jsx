import { useState } from "react";
import avatars from "./assets/avatars";

export const avatarData = {
  modelId: undefined
}

export default ({ children }) => {
  const [avatar, setAvatar] = useState(undefined)
  avatarData.modelId = avatar;

  if (avatar == null) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexWrap: 'wrap', }}>
        {avatars.map((avatar, index) => (
          <>
            <div
              style={{
                margin: '16px',
                border: '1px solid black',
                borderRadius: '10px',
                overflow: 'hidden',
                width: 'calc(33% - 34px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <img src={avatar.front.idle} style={{ width: '100%' }} />
              </div>
              <div
                style={{ textAlign: 'center', fontSize: '32px', backgroundColor: 'lightblue', borderRadius: '5px', cursor: 'pointer' }}
                onClick={() => { setAvatar(index) }}
              >
                {avatar.name}
              </div>
            </div>
          </>
        ))}
      </div>
    )
  }

  return children;
}