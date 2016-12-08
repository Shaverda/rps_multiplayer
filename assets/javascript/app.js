//TODO: go back and add in connections things later
//TODO: figure out how to write different things to different pages...
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

var player_one, player_two = "";
var player_one_losses, player_one_wins = 0;
var player_two_losses, player_two_wins = 0;
var player_one_rps_choice, player_two_rps_choice = "";


database.ref().on("value", function(snapshot){
	console.log(snapshot + " line 19");
	if (snapshot.child("player_one_db").exists()) {
		player_one = snapshot.val().player_one_db.name;
		$(".name_or_turn_status_box").html("Welcome, "+player_one". It is your turn.");

	}
	if (snapshot.child("player_two_db").exists()) {
		player_two = snapshot.val().player_two_db.name;
		$("#name_or_turn_status_box").html("Welcome, "+player_two". It is your turn.");
	}

})


$("#start-button").on("click", function(event) {
	event.preventDefault();

});



$("#chat-send-button").on("click", function(event) {
	event.preventDefault();
});

}); //close docu ready