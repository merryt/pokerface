var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const {v4: uuidCreator} = require('uuid')

app.get('/', (req, res) => {
    // TODO:
    // this is currently broken because it is messing up all kinds of relative paths
    // look how to deploy a project that uses Vue CLI + node backend
    res.sendFile(__dirname + '../frontend/dist/index.html');

});


const suites = ["s", "h", "c", "d"]
const values = ["a",2,3,4,5,6,7,8,9,10,"j","q","k"]
let unshuffledDeck = []
suites.forEach((suit) => {
    values.forEach((value)=>{
        unshuffledDeck.push(value+suit)
    })
})


games = []



io.on('connection', (socket) => {
	console.log('a user connected');
    io.emit('list games', games)


    socket.on('new game', (name) => {
        console.log("new game created")
        games.push({
            "name": name,
            "id": uuidCreator(),
            "status": "sheaduled",
            "participants": [],
            "seatedPlayers": [],
        })
        console.log(games.length)
        io.emit('list games', games)
    })

    socket.on('request games',() => {
        io.emit('list games', games)
    })

	socket.on('disconnect', () => {
		console.log("a user has dissconnected")
	});



    // joining a specific table
    socket.on('join table',(table_id, playerName) => {
        console.log("playerName: "+playerName)
        console.log("playerSocket: "+socket.id)
        // add player to participants array for that game
        games.forEach((game) =>{
            if(game.id = table_id){
                game.participants.push(socket.id)
            }
        });
        // have that player join that room
        io.to(table_id).emit("room message", "player: " + socket.id + " joined: " + table_id)
    });


    socket.on('take a seat', (id) => {
        console.log("someone is taking a seat")
    })
    // going to need to create a loop that represents dealing the cards
    // lets make indian poker firce

});



http.listen(3000, () => {
	console.log("listening on port 3000");
})
