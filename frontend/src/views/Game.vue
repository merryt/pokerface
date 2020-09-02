<template>
    <div class="hello">
        <h3>Poker Table</h3>
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
            deck: []
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
        console.log("starting up home components")
        this.socket = io('http://localhost:3000')
        this.socket.emit('request games')

        this.socket.on('list games', (games) => {
            this.games = games
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
