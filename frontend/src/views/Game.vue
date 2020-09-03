<template>
    <div class="hello">
        <h3>Poker Table</h3>
        <p>You are:{{playerName}}</p>
        <!-- render table -->
        <!-- render list of players who are watching -->
        <!-- redner people sitting at table -->
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    name: 'Home',
    data: function(){
        return {
            games:[],
            socket:{},
            deck: [],
            playerName: "",
        }
    },
    props:{
        id: String
    },
    methods:{
        newGame: function(){
            if(this.gameName){
                console.log(this.gameName)
                this.socket.emit('new game', this.gameName)
                this.gameName = ""
            }else{
                // Add validation error
            }
                             
        }
    },
    created: function(){
        this.socket = io('http://localhost:3000')
        this.socket.emit('request games')
        this.socket.emit('join table', this.id)
        this.playerName = window.sessionStorage.getItem("playerName")        
        console.log(this.socket)

        // and when you send messages use this syntax
        // socket.to(this.id).emit('some event');

        // get list of people at table
        // get list of people seated at table


        this.socket.on('list games', (games) => {
            this.games = games
        });

        this.socket.on("room message", (msg) =>{
            console.log(msg)
        });

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
input.game-name{
    margin-right: 10px;
}
</style>
