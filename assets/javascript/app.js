
$( document ).ready(function() {
var config = {
	apiKey: "AIzaSyCw6cmpxZp9Svekhc_eWuPP0ER6earbeeE",
	authDomain: "rps-multiplayer-dc301.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-dc301.firebaseio.com",
	storageBucket: "rps-multiplayer-dc301.appspot.com",
	messagingSenderId: "25891792011"
};
firebase.initializeApp(config);

var database = firebase.database();	// Create a variable to reference the database.

var connections_ref = database.ref("/connections"); //our special created database
var connected_ref = database.ref(".info/connected");	//special database firebase gives us
connected_ref.on("value", function (snapshot){	//basically a bunch of code to log how many people are connected
	if (snapshot.val()) {
		var con = connections_ref.push(true);
		//when someone connects, add it to our list of connections
		con.onDisconnect().remove();
	}	

});
var player_number;		//used to see which number connection someone is
var user;		//used as a shortcut to not have to write redundant code; user is whatever user it is.. :P
connections_ref.on("value", function(snapshot){
	if (snapshot.numChildren() ===1){
		player_number = 1;	//if 1 person is connected, you are player one 
		user = player_1;
	} else if (snapshot.numChildren() === 2 && !player_number){
		player_number = 2;//if 2 people are connected, you are player two 
		user = player_2;
	}
})

//TODO: ASSIGN DB POSITION TO PLAYER_NUMBER AND STUFF 

var player_1 = {	//database objects for name of char, total wins/losses,  
	name: "",		//if it's their turn or not, and
	wins: 0,		//whether they choose rock/paper/scissors
	losses: 0,
	is_turn: true,
	choice: ""
};
var player_2 = {
	name: "",
	wins: 0,
	losses: 0,
	is_turn: false,
	choice: ""
};


database.ref().on("value", function(snapshot){	//on any change to the DB
	console.log(snapshot.val());

	if (snapshot.child("player_1_db").exists()) {		//if a player one is already logged in DB,
		player_1 = snapshot.val().player_1_db; 			//replace the local variable w/ the DB one
		$(".player_1_headline").html(player_1.name); }	//write name to game play box
		if (user === player_1) {	//TODO: why doesn't this work? 
			console.log("in the loop");
			$("#name").hide();	//takes away name-input button to avoid re-writing db
			$("#start-button").hide();	//takes away start button to avoid re-writing db
		}
	if (snapshot.child("player_2_db").exists()) {		//if a player two is already logged in DB,
		player_2 = snapshot.val().player_2_db; 			//replace the local variable w/ the DB one
		$(".player_2_headline").html(player_2.name); }	//write name to game play box
		if (user === player_2){		//TODO: why doesn't this work? 
			console.log("in the loop");
			$("#name").hide();	//takes away name-input button to avoid re-writing db
			$("#start-button").hide();	//takes away start button to avoid re-writing db
		}
	
	if (user.is_turn === true){
		$(".name_or_turn_status_box").html("It's your turn!"); }	//if w/e user it is has a turn, tell 'em!
	else { $(".name_or_turn_status_box").html("Wait for other player to go."); } //otherwise tell 'em to wait

	console.log(player_1);
	console.log(player_2);
	console.log(player_number);
})


$("#start-button").on("click", function(event) {	
	event.preventDefault();							//prevent form from submitting
	if (player_1.name=== ""){						//if a name isn't stored in local variable yet for player one
		player_1.name = $("#name").val().trim();	//gets player name from input box
		$(".name_or_turn_status_box").html("Hey, player 1.");	
		$(".player_1_headline").html(player_1.name); }	//write their name into game box

	else if (player_2.name === ""){					//if a name isn't stored in local variable yet for player one
		player_2.name = $("#name").val().trim();	//gets player name from input box
		$(".name_or_turn_status_box").html("Hey, player 2.");
		$(".player_2_headline").html(player_2.name); }	//write their name into game box
	
	else { console.log("well fruck we got a problem");	} //this is if things explode and 3 unique people log onto my game, like wut?

	database.ref().set({	//sets database equivalents to my player one and 2
		player_1_db: player_1,
		player_2_db: player_2
	});
	$("#name").hide();	//takes away name-input button to avoid re-writing db
	$("#start-button").hide();	//takes away start button to avoid re-writing db

});



$("#chat-send-button").on("click", function(event) {
	event.preventDefault();	//prevent form from submitting

	//does nothing else yet, mhmkk?
});

}); //close docu ready