var config = {
  type: Phaser.AUTO,
  parent: 'Multiplayer-game',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
 
var game = new Phaser.Game(config);
 
function preload() 
{
  this.load.image('ship', 'assets/spaceShips_001.png');

}
 
function create()
{
  var self = this;
  this.socket = io();
  this.players = this.add.group();
 
  //We used  socket.on to listen for the  currentPlayers event, and when this event is triggered, the function we provided will be called with the  players object that we passed from our server.
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'ship');
      }
    });
  });
}
 
function update() {}


function displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  //We used  setTint() to change the color of the ship game object, and we choose the color depending on the team that was generated when we created our player info on the server.
  if (playerInfo.team === 'blue') player.setTint(0x0000ff);
  else player.setTint(0xff0000);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}