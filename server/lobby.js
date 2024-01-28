import _ from 'lodash';
const LOBBY_SIZE = 4;

const lobby = {
  clients: {},
};

const initialGameState = {
  players: {},
};

const gameState = _.cloneDeep(initialGameState);

export const addToLobby = (ws, clientId) => {
  if (Object.keys(lobby.clients).length >= LOBBY_SIZE) {
    console.log('LOBBY FULL, REJECTING');
    return;
  }

  lobby.clients[clientId] = ws;

  const player = {
    x: 1.5,
    z: 1.5,
    angle: Math.PI,
    punching: false,
    moving: false,
    health: 100,
    iFrame: false
  };

  gameState.players[clientId] = player;

  console.log('PLAYER JOINED', clientId)
  console.log('NUM PLAYERS', Object.keys(gameState.players).length);
}

export const removeFromLobby = (clientId) => {
  delete gameState.players[clientId];
  delete lobby.clients[clientId];
}

export const updatePlayerState = (clientId, newPlayerState) => {
  const prevState = gameState.players[clientId];
  if (!prevState) {
    return;
  }

  gameState.players[clientId] = {
    ...prevState,
    ...newPlayerState,
    id: clientId, // ensure clientId is not overwritten
  }
};

export const hitPlayer = (clientId, curClientId) => {
  const curPlayer = gameState.players[curClientId];
  // If the current player is dead or currently in iframes don't let them attack
  if (curPlayer.health <=0 || curPlayer.iFrame) {
    return;
  }
  const player = gameState.players[clientId]
  if (player.health <= 0 || player.iFrame) {
    return;
  }
  player.health -= 10;
  player.iFrame = true;
  setTimeout(() => {
    gameState.players[clientId].iFrame = false;
  }, 500)
}

const broadcastMsg = (data = {}) => {
  _.forEach(lobby.clients, (ws, clientId) => {
    ws.send(JSON.stringify({
      ...data,
      clientId,
    }))
  });
}

export const updateClients = () => {
  broadcastMsg({
    type: 'SYNC',
    data: gameState,
  });
};

setInterval(() => {
  updateClients();
}, 15);
