<template>
    <div class="hello">
        <h1>Welcome to PokerFace</h1>
        <h2>A place to play poker face to face</h2>
        <p>
            Here is a list of games that are currently ongoing. Join watch or create your own!
        </p>
        <h3>Create a new game</h3>
        <input type="text" name="Game Name" v-model="gameName" placeholder="Game Name?" class="game-name">
        <button type="submit" v-on:click="newGame">Create!</button>
        <h3>Current Games</h3>
        <ul id="games">
            <li v-for="game in games" v-bind:key="game.id">
                <router-link :to="{path: '/game/' + game.id ,params:{id:game.id}}">{{game.name}}</router-link> -- {{game.status}}
            </li>
        </ul>         
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    name: 'Home',
    data: function(){
        return {
            games:[
                {
                    name: "first game",
                    id: 0,
                    status: "finished"
                }
            ],
            socket:{},
            gameName:""
        }
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
        console.log("starting up home components");
        this.socket = io('http://localhost:3000');
        this.socket.emit('join table', 'lobby');
        this.socket.emit('request games');
        console.log(this.socket)
        this.socket.on('list games', (games) => {
            //console.log(games);    
            this.games = games
        });

        this.socket.on('room message', (msg) =>{
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
