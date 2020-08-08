package main

import(
	"log"
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

var upgrader = websocket.Upgrader{}

type Message struct {
	Email string `json:"email"`
	Username string `json: "username"`
	Message string `json: "message"`
}



type Card struct{
	Suit string
	Value int
}

func buildDeck() []Card {
	values := [13]int{2,3,4,5,6,7,8,9,10,11,12,13,14}
	suits := [4]string{"spades","clubs","dimonds","hearts"}
	deck  := []Card{}
	for _,suit := range suits {
		for _, value := range values{
			var newCard Card
			newCard.Suit = suit
			newCard.Value = value
			deck = append(deck, newCard)
		}
	}
	for _,card := range deck{
		fmt.Println(card)
	}
	return deck
}

func main() {

	fmt.Println("----")
	buildDeck()
	//for _,card := range newDeck{
	//	fmt.Println(card)
	//}

	fmt.Println("~~~~~")
	// create a simple file server
	fs := http.FileServer(http.Dir("../public"))
	http.Handle("/",fs)

	// route for websockets
	http.HandleFunc("/ws", handleConnections)

	// start listening
	go handleMessages()

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil{
		log.Fatal("ListenAndServe: ", err)
	}
}


func handleConnections(w http.ResponseWriter, r *http.Request){
	// upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w,r,nil)
	if err != nil {
		log.Fatal(err)
	}

	// make sure we close the connection when we are done
	defer ws.Close()

	// Register our new client
	clients[ws] = true

	for {
		var msg Message
		// read in a new message as JSON and map it to a message object

		err := ws.ReadJSON(&msg)
		if err != nil{
			log.Printf("error %v",err)
			delete(clients,ws)
			break
		}
		broadcast <- msg
	}

}

func handleMessages() {
	for {
		// grab the next message from the broadcast channel
		msg := <-broadcast
		log.Println("new Message: %v", msg)
		// send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients,client)
			}
		}
	}
}


