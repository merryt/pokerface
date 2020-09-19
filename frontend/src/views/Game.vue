<template>
    <div class="hello">
        <h3>Poker Table</h3>
        <p>You are:{{playerName}}</p>
        <button type="submit" v-show="!seated" v-on:click="haveASeat">Sit Down</button>
        <video autoplay v-show="seated" class="my-video" ref="my-video"></video>
        <!-- render list of players who are watching -->
        <!-- redner people sitting at table -->
        <name></name>
    </div>
</template>

<script>
import io from 'socket.io-client'
import name from '../components/name'

export default {
    name: 'Home',
    data: function(){
        return {
            games:[],
            socket:{},
            deck: [],
            playerName: "",
            playerId: "",
            seated: false
        }
    },
    props:{
        id: String
    },
    methods:{
        haveASeat: function(){
            if (!this.hasGetUserMedia()) {alert( "your browser doesn't support this" )}
            const constraints = {
                video: true           
            };
            const video = this.$refs['my-video'];
            console.log(video)
            console.log(this)
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video.srcObject = stream
                this.seated = true;
            });
        },
        hasGetUserMedia: function(){
            return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        }
    },
    created: function(){
        this.socket = io('http://localhost:3000')
        this.socket.emit('request games')  
        this.playerName = window.sessionStorage.getItem("playerName")        
        this.playerId = this.socket.id
        this.socket.emit('join table', this.id, this.socket.id)
       

        // and when you send messages use this syntax
        // socket.to(this.id).emit('some event');

        // get list of people at table
        // get list of people seated at table



        this.socket.on("room message", (msg) =>{
            console.log(msg)
        });

    },
    components:{
        name
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
