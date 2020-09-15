# pokerface


I think to get it running you will need to:
- go to the server folder and use `npm install` then `npm run serve`
- then in the client folder do `npm install` and `npm run serve`
- go to `http://localhost:8080` in your webbrowser (this is the client, pretty sure the serve is running on 3000)

TODO
- For dev purposed, I think the next thing I need to do is ues session storage to build a concept of a user, eventully this will need to be upgraded to using a proper email system, firebase, or OAuth 2.0
- RTC -- In each room players should be asked to join with video. If they have video and audio they are considered seated.
- Poker -- We will need to have a system for drawing cards from a deck and passing them to each player
- scoring -- For pokerface the way you score a point is by having the highest score of everyone who makes it to showdown. if you go to showdown and don't have the highest card you go to zero. First to 10 gets a star


Additional Resources
- Socket.io is the tool we are using for a lot of this so here is some documentation https://socket.io/get-started/chat/#Serving-HTML
- We are using WebRTC, here is some documentation https://www.html5rocks.com/en/tutorials/webrtc/basics/ and https://www.html5rocks.com/en/tutorials/getusermedia/intro
- here is anouther tutorial https://levelup.gitconnected.com/build-your-own-video-chat-with-vue-webrtc-socketio-node-redis-eb51b78f9f55
