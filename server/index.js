const path = require('path');
const jsdom = require('jsdom');

//Referenced the express module, which is a web framework that will help us render our static files.
const express = require('express');
//Created a new instance of express called it "app"
const app = express();

//Supplied the app to the HTTP server, which allow express to handle the HTTP request.
const server = require('http').Server(app);
const { JSDOM } = jsdom;
 


//Updated the server to render our static files using the built-in  express.static middleware function in Express.
app.use(express.static(__dirname + '/public'));
 
//Root route serve to index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 

//we need to wait for our virtual DOM to be ready and then start our express server.
function setupAuthoritativePhaser() {
  //This return a promise so we use ".then" to put the logic into it.
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {
    dom.window.gameLoaded = () => {
      server.listen(8081, function () {
        console.log(`Listening on ${server.address().port}`);
      });
    };
  }).catch((error) => {
    console.log(error.message);
  });
}
 
setupAuthoritativePhaser();