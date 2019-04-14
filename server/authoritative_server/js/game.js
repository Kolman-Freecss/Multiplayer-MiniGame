const players = {};

const config = {
    type: Phaser.HEADLESS,
    parent: 'Multiplayer-game',
    width: 800,
    height: 600,
    autoFocus: false,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
   
function preload()
{
  this.load.image('ship', 'assets/spaceShips_001.png');
}
  
function create()
{

  //We created a new variable called self and we use it to store a reference to this Phaser Scene.
  const self = this;
  //If you are not familiar with groups in Phaser, they are a way for us to manage similar game objects and control them as one unit
  this.players = this.physics.add.group();

  //referenced the socket.io module and had it listen to our server object.
  //added logic to listen for connections and disconnections.
  io.on('connection', function (socket) {
    console.log('a user connected');

    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
    // add player to server
    addPlayer(self, players[socket.id]);
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });
  });

}
  
function update() {}

function addPlayer(self, playerInfo) {
  //self.physics.add.image to allow that game object to use the arcade physics
  //We used  setOrigin() to set the origin of the game object to be in the middle of the object instead of the top left. The reason we did this because, when you rotate a game object, it will be rotated around the origin point
  //We used  setDisplaySize() to change the size and scale of the game object
  const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  player.setDrag(100);
  player.setAngularDrag(100);
  player.setMaxVelocity(200);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy();
    }
  });
}
  
const game = new Phaser.Game(config);

//we called window.gameLoaded() which we defined in the callback function in index.js
window.gameLoaded();

