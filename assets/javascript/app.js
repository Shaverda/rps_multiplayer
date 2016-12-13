
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

var player_1 = {	//database objects for name of char, total wins/losses,  
	name: "",		//if it's their turn or not, and
	wins: 0,		//whether they choose rock/paper/scissors
	losses: 0,
	is_turn: true,
	choice : ""
};
var player_2 = {
	name: "",
	wins: 0,
	losses: 0,
	is_turn: false,
	choice : ""
};

var turn_number = 1;

var player_number;		//used to see which number connection someone is

connections_ref.on("value", function(snapshot){
	if (snapshot.numChildren() ===1){
		player_number = 1;	//if 1 person is connected, you are player one 
	} else if (snapshot.numChildren() === 2 && !player_number){
		player_number = 2;//if 2 people are connected, you are player two 
	}
	//TODO: FIX RESET FOR WHEN USERS CLOSE WINDOWS AND STUFF
})

database.ref().on("value", function(snapshot){	//on any change to the DB
	console.log(snapshot.val());

	if (snapshot.child("player_1_db").exists()) {		//if a player one is already logged in DB,
		player_1 = snapshot.val().player_1_db; 			//replace the local variable w/ the DB one
		$(".player_1_headline").html(player_1.name); }	//write name to game play box
		if (player_number === 1) {	
		//	$("#name").hide();	//takes away name-input button to avoid re-writing db
		//	$("#start-button").hide();	//takes away start button to avoid re-writing db
		}
	if (snapshot.child("player_2_db").exists()) {		//if a player two is already logged in DB,
		player_2 = snapshot.val().player_2_db; 			//replace the local variable w/ the DB one
		$(".player_2_headline").html(player_2.name); }	//write name to game play box
		if (player_number === 2){		 
		//	$("#name").hide();	//takes away name-input button to avoid re-writing db
		//	$("#start-button").hide();	//takes away start button to avoid re-writing db
		}
	
	if (player_1.name != "" && player_2.name != ""){
		if (player_number === 1){
			if (player_1.is_turn === true){
				$(".name_or_turn_status_box").html("It's your turn!"); 
			}
			else { $(".name_or_turn_status_box").html("Wait for other player to go."); }
		}
		else {
			if (player_2.is_turn === true) {
				$(".name_or_turn_status_box").html("It's your turn!"); 
			}
			else { $(".name_or_turn_status_box").html("Wait for other player to go."); }
		}
	}

	if (player_2.is_turn === true){
		append_rps_buttons();
	}
	//this all needs to be re-worked such that
	console.log(player_1);
	console.log(player_2);
	console.log(player_number);
})

function append_rps_buttons(){
	var rock_button = "<button class='btn btn-primary rps_choice' id='rock-button' value='0' type='submit'>rock</button>";
	var paper_button = "<button class='btn btn-primary rps_choice' id='paper-button' value ='1' type='submit'>paper</button>";
	var scissors_button = "<button class='btn btn-primary rps_choice' id='scissors-button' value='2' type='submit'>scissors</button>";
	console.log(player_1);
	console.log(player_2);
	if (player_number === 1) {	
		if (player_1.is_turn == true && $(".first_player_box button").length == 0){ //2nd part makes sure the buttons don't appear twice. silly fix :P 
			$(".first_player_box").append(rock_button);
			$(".first_player_box").append(paper_button);
			$(".first_player_box").append(scissors_button);	
		}
	} else {
		if (player_2.is_turn == true && $(".second_player_box button").length == 0){ //2nd part makes sure the buttons don't appear twice. silly fix :P 
			$(".second_player_box").append(rock_button);
			$(".second_player_box").append(paper_button);
			$(".second_player_box").append(scissors_button);
		}	
	}
}

function compare_answers(){
	//ACTUALLY FINISH THIS. COMPARING VALUES TO WINNER MATRIX N SHIT
	var answer_choices = ["rock", "paper", "scissors"];
	var turnout = [["tie", "lose", "win"], ["win", "tie", "lose"], ["lose", "win", "tie"]];
	var turnout_player_1 = turnout[player_1.choice][player_2.choice];
	var turnout_player_2 = turnout[player_2.choice][player_1.choice];

	$(".first_player_box").append("<h1 style'margin: auto auto'>" + answer_choices[player_1.choice]);
	$(".second_player_box").append("<h1 style'margin: auto auto'>" + answer_choices[player_2.choice]);

	if (turnout_player_1 == "tie"){
		$(".results_box").html("It's a tie game, folks!");
	}
	else if (turnout_player_1 == "win"){
		$(".results_box").html(player_1.name + " wins!");
		player_1.wins += 1;
		player_2.losses += 1;
	}
	else {
		$(".results_box").html(player_2.name + " wins!");
		player_2.wins += 1;
		player_1.losses += 1;
	}
	database.ref().set({	//sets database equivalent to my player one and 2
		player_1_db: player_1,
		player_2_db: player_2
	});


}

$(document).on("click", ".rps_choice", function(){
    event.preventDefault();
	if (player_number === 1){
		player_1.choice = $(this).val(); //logs current user rps choice
		player_1.is_turn = false; 	//TODO: FIGURE OUT WHY NOT PROGRESSING THROUGH TURNS
		player_2.is_turn = true;
		$(".first_player_box .rps_choice").remove();
	} else { 
		player_2.choice = $(this).val(); //logs current user rps choice
		player_2.is_turn = false; //TODO: FIGURE OUT WHY NOT PROGRESSING THROUGH TURNS 
		player_1.is_turn = true;
		$(".second_player_box .rps_choice").remove();
	}	
	database.ref().set({	//sets database equivalents to my player one and 2
		player_1_db: player_1,
		player_2_db: player_2
	});

    if (player_number === 1) {
    	append_rps_buttons();
    }
    else {
    	compare_answers();
    }
});

$("#start-button").on("click", function(event) {	
	event.preventDefault();							//prevent form from submitting
	if (player_number === 1 ){						//if a name isn't stored in local variable yet for player one
		player_1.name = $("#name").val().trim();	//gets player name from input box
		$(".name_or_turn_status_box").html("Hey, player 1.");	
		$(".player_1_headline").html(player_1.name); }	//write their name into game box

	else if (player_number === 2){					//if a name isn't stored in local variable yet for player one
		player_2.name = $("#name").val().trim();	//gets player name from input box
		$(".name_or_turn_status_box").html("Hey, player 2.");
		$(".player_2_headline").html(player_2.name); }	//write their name into game box
	
	else { console.log("well fruck we got a problem");	} //this is if things explode and 3 unique people log onto my game, like wut?

	database.ref().set({	//sets database equivalent to my player one and 2
		player_1_db: player_1,
		player_2_db: player_2
	});
	$("#name").hide();	//takes away name-input button to avoid re-writing db
	$("#start-button").hide();	//takes away start button to avoid re-writing db
	append_rps_buttons();

});



$("#chat-send-button").on("click", function(event) {
	event.preventDefault();	//prevent form from submitting

	//does nothing else yet, mhmkk?
});

}); //close docu ready