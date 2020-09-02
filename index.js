var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    // TODO:
    // this is currently broken because it is messing up all kinds of relative paths
    // look how to deploy a project that uses Vue CLI + node backend
    res.sendFile(__dirname + '/frontend/dist/index.html');

});



const suites = ["spades", "hearts", "clubs", "diamonds"]
const values = [1,2,3,4,5,6,7,8,9,10,11,12,13]

games = []


io.on('connection', (socket) => {
	console.log('a user connected');
    io.emit('list games', games)


    socket.on('new game', (name) => {
        console.log("new game created")
        games.push({
            "name": name,
            "id": Date.now(),
            "status": "sheaduled"
        })
        io.emit('list games', games)
    })

    socket.on('request games',() => {
        io.emit('list games', games)
    })

	socket.on('disconnect', () => {
		console.log("a user has dissconnected")
	});
});



http.listen(3000, () => {
	console.log("listening on port 3000");
})
