var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    // TODO:
    // this is currently broken because it is messing up all kinds of relative paths
    // look how to deploy a project that uses Vue CLI + node backend
    res.sendFile(__dirname + '/frontend/dist/index.html');

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
            "id": Date.now(),
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



    // joining a specific table
    socket.on('join table',(id) => {
        // add player to participants array for that game
        // have that player join that room
        socket.join(id);
        io.to(id).emit("room message", "Someone joined " + id)
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
