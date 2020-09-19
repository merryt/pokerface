<template>
    <div class="hello">
        <h3>Poker Table</h3>
        <button type="submit" v-show="!seated" v-on:click="haveASeat">Sit Down</button>
        <div class="board">
            <div class="player">
                {{ playerId }}
                <video autoplay v-show="seated" class="my-video" ref="my-video"></video>
            </div>
            <div class="player">
                {{ otherUser.current }}
                <video autoplay v-show="seated" class="seatOne-video" ref="partnerVideo"></video>
            </div>
        </div>
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
            peerRef: {},
            playerId: "",
            seated: false,
            myStream: {},
            partnerVideo: {},
            otherUser: {
                current: "empy seat",
            },
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
            
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                const video = this.$refs['my-video'];
                video.srcObject = stream
                this.myStream = stream
                this.seated = true;
                this.socket.emit("take a seat", this.id, this.playerId )  
            });
        },
        hasGetUserMedia: function(){
            return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        },
        callUser: function(userId){
            this.peerRef.current = this.createPeer(userId)
            this.myStream.getTracks().forEach(track => {
                console.log(track)
                this.peerRef.current.addTrack(track, this.myStream)
            });
        },
        createPeer: function(userId){
            const peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.stunprotocol.org"
                    },
                    {
                        urls: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                ]
            });

            peer.onicecandidate = this.handleICECandidateEvent;
            peer.ontrack = this.handleTrackEvent;
            peer.onnegotiationneeded = () => this.handleNegotiationNeededEvent(userId);

            return peer;
        },
        handleNegotiationNeededEvent: function(userID) {
            this.peerRef.current.createOffer().then(offer => {
                return this.peerRef.current.setLocalDescription(offer);
            }).then(() => {
                const payload = {
                    target: userID,
                    caller: this.playerId,
                    sdp: this.peerRef.current.localDescription
                };
                this.socket.emit("offer", payload);
            }).catch(e => console.log(e));
        },
        handleICECandidateEvent: function(e) {
            if (e.candidate) {
                const payload = {
                    target: this.otherUser.current,
                    candidate: e.candidate,
                }
                this.socket.emit("ice-candidate", payload);
            }
        },
        handleTrackEvent: function(e) {
            console.log(e)
            const video = this.$refs['partnerVideo']
            video.srcObject = e.streams[0];
            // this.partnerVideo.srcObject = e.streams[0];
        },
        handleRecieveCall: function(incoming) {
            this.peerRef.current = this.createPeer();
            const desc = new RTCSessionDescription(incoming.sdp);
            this.peerRef.current.setRemoteDescription(desc).then(() => {
                this.myStream.getTracks().forEach(track => this.peerRef.current.addTrack(track, this.myStream));
            }).then(() => {
                return this.peerRef.current.createAnswer();
            }).then(answer => {
                return this.peerRef.current.setLocalDescription(answer);
            }).then(() => {
                const payload = {
                    target: incoming.caller,
                    caller: this.playerId,
                    sdp: this.peerRef.current.localDescription
                }
                this.socket.emit("answer", payload);
            })
        },
        handleAnswer: function(message) {
            const desc = new RTCSessionDescription(message.sdp);
            this.peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
        },
        handleNewICECandidateMsg: function(incoming) {
            const candidate = new RTCIceCandidate(incoming);

            this.peerRef.current.addIceCandidate(candidate)
                .catch(e => console.log(e));
        }
    },
    created: function(){
        this.socket = io('http://localhost:3000')
        this.socket.emit('request games')  
        this.socket.on('connect', () => this.playerId = this.socket.id);
        this.socket.emit('join table', this.id, this.playerId)
       

        // and when you send messages use this syntax
        // socket.to(this.id).emit('some event');

        // get list of people at table
        // get list of people seated at table


        this.socket.on('other user', userID => {
            console.log("test")
            this.callUser(userID);
            this.otherUser.current = userID;
        });

        this.socket.on("user joined", userID => {
            console.log("test")
            this.otherUser.current = userID;
        });
        

        this.socket.on("room message", (msg) =>{
            console.log(msg)
        });

        this.socket.on("offer", this.handleRecieveCall);

        this.socket.on("answer", this.handleAnswer);

        this.socket.on("ice-candidate", this.handleNewICECandidateMsg);

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
video{
    width:100%
}
.board{
    display:flex;
    justify-content: space-around;
}
.player{
    width:30%
}
</style>
