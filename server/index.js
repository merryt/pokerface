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


let games = []



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
        io.emit('list games', games)
    })

    socket.on('request games',() => {
        io.emit('list games', games)
    })

	socket.on('disconnect', () => {
		console.log("a user has dissconnected")
	});



    // joining ae specific table
    socket.on('join table',(tableId, playerName) => {
        console.log("playerName: "+playerName)
        console.log("playerSocket: "+socket.id)
        // add player to participants array for that game
        games.forEach((game) =>{
            if(game.id === tableId){
                game.participants.push(socket.id)
            }
        });
        // have that player join that room
        socket.join(tableId)
        socket.to(tableId).broadcast.emit("room message", "just this room: player: " + socket.id + " joined: " + tableId)
    });


    socket.on('take a seat', (tableId, playerId) => {
        const thisGame = games.find( game => game.id === tableId)

        thisGame.seatedPlayers.push(playerId)

        console.log("-------Someone is taking a seat!!!--------")
        console.log("table id: " + tableId)
        // console.log( "games:")
        // console.log(games)
        console.log("player id: " + playerId)

        
        console.log("this game:")
        console.log(thisGame)
        

        const otherUsers = thisGame.participants.filter( participant => participant != playerId)
        if(otherUsers){
            socket.emit("other user", otherUsers[0]);
            socket.to(otherUsers[0]).emit("user joined", socket.id);
        }

    })

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });



    // going to need to create a loop that represents dealing the cards
    // lets make indian poker first

});



http.listen(3000, () => {
	console.log("listening on port 3000");
})
