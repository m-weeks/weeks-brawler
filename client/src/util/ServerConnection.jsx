import { useEffect, useState, useRef, useCallback } from 'react'
import _ from 'lodash';

export default ({ children }) => {
  const [gameState, setGameState] = useState({
    players: {}
  });

  const [localState, setLocalState] = useState({
    loaded: false,
    clientId: undefined,
    myPlayer: null,
  })

  const socketRef = useRef(null);
  const localStateRef = useRef(localState)
  localStateRef.current = localState

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_SERVER);
    socketRef.current = socket;

    socket.onopen = (e) => {
      console.log('Connected');
      setLocalState((oldState) => ({
        ...oldState,
        loaded: true
      }))
      socket.send(JSON.stringify(
        {
          type: 'JOIN',
        }
      ));
    };
  
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
  
      if (msg.type === 'SYNC') {
        setGameState((oldState) => {
          const newState = _.cloneDeep(oldState);
          _.assign(newState, msg.data)
          return newState;
        });
        setLocalState((oldState) => {
          const result = {
            ...oldState,
            clientId: msg.clientId,
          }

          if (!result.myPlayer) {
            result.myPlayer = msg.data.players[msg.clientId];
          }

          return result;
        })
      }
    }
  
    socket.onclose = (e) => {
      console.log('Connection closed');
    }
  
    socket.onerror = (e) => {
      console.error('Socket error');
    }

    return () => {
      console.log('CLOSING CONNECTION')
      socket.close();
    }
  }, [])

  const sendMessage = useCallback((type, state) => {
    socketRef.current.send(JSON.stringify(
      {
        type,
        data: state,
      }
    ))
  }, [])

  const updatePlayer = (newValues) => {
    setLocalState((oldState) => ({
      ...oldState,
      myPlayer: {
        ...(_.cloneDeep(oldState.myPlayer)),
        ...newValues
      }
    }))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStateRef.current.loaded) {
        sendMessage('PLAYER_STATE', localStateRef.current.myPlayer);
      }
    }, 15);

    return () => {
      clearInterval(interval)
    }
  }, [sendMessage])

  if (!localState.loaded) {
    return null;
  }

  return (
    <>
      {children({ gameState, localState, updatePlayer, sendMessage })}
    </>
  )
}