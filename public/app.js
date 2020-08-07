new Vue({
	el: '#app',

	data: {
		ws: null, // Our websocket
		newMsg: '', // Holds new messages to be sent to the server
		chatContent: '', // A running list of chat messages displayed on the screen
		email: null, // Email address used for grabbing an avatar
		username: null, // Our username
		joined: false // True if email and username have been filled in
    	},
	created: function() {
		var self = this;
		this.ws = new WebSocket('ws://' + window.location.host + '/ws');
		this.ws.addEventListener('message', function(e){
			var msg = JSON.parse(e.data);
			console.log(e)
			console.log(msg)
			self. chatContent += `<div class="chip">
				<img src="${ self.gravatarURL(msg.email)}">
				${msg.Username}: ${msg.Message}
				</div>
				<br/>`
			var element = document.getElementById('chat-messages');
			element.scrollTop = element.scrollHeight;
		})
	},
	methods:{
		send: function() {
			if(this.newMsg != ''){
				this.ws.send(
					// refactor this to do it in vue, not this missmatch jsquery/vue madness
					JSON.stringify({
						email: this.email,
						username: this.username,
						message: $('<p>').html(this.newMsg).text()
					})
				);
				this.newMsg = '';
			}
		},
		join: function(){
			if(!this.email){
				Materialize.toast('you need an email', 2000);
				return;
			}
			if(!this.username){
				Materialize.toast('need a username', 2000);
			}
			this.email = $('<p>').html(this.email).text();
			this.username = $('<p>').html(this.username).text();
			this.joined = true;
		},
		gravatarURL: function(email){
			return 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(email);
		}
	
	}
});
