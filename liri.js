require("dotenv").config();
// to access the keys in keys.js
var keys = require("./keys.js");

var keys = {
    id: "SPOTIFY_ID",
    secret: "SPOTIFY_SECRET"
};

//var spotify = new Spotify(keys.spotify);

//to include the Node Spotify API npm package


var Spotify = require('node-spotify-api');

//pulling Node Spotify API info from keys.js
//var spotify = new Spotify({
	//id: keys.spotifyKeys.id,
	//secret: keys.spotifyKeys.secret
//});


//variable to hold song the user wants to search for with Spotify
var songChoice = "";

//to include the Concert npm stuff

var Concert = require("concert"); //find out what the concert npm is from instructions

//may need to add and then get concert API info from keys.js
var concert = new Concert ({
    key_1_name: keys.concertKeys.one_key,
    key_2_name: keys.concertKeys.two_key
});

//to include the Request API npm package
//this will be used for the Open Movie Database (OMDB)
var request = require('request');

//the key to use OMDB
//var omdbKey = "40e9cece"; //Just for reference. I ended up not using this variable

//variable to hold movie the user wants to search for with OMDB
var omdbRequest = "";



//to include the fs library
var fs = require("fs");



//this variable will be used to store user commands
/*command options are as follows:
	concert-this		>> will search for the concert the user wants
	spotify-this-song	>> will search for a particular song and display info from Spotify
	movie-this			>> will search a particular movie and display info from OMDB
	do-what-it-says		>> will read off of random.txt and perfrom the command written inside the file
*/
var userCommand = process.argv[2];



//======================= THE CALLS =======================


//for the concert calls
if (userCommand === "concert-this") {

	concertCall();
}


//for the spotify calls 
else if (userCommand === "spotify-this-song") {

	spotifyCheck();
	spotifyCall(songChoice);
}


//for the open movie database (OMDB) calls
else if (userCommand === "movie-this") {

	movieCheck();
	movieCall(omdbRequest);
}



//for the do-what-it-says call
else if (userCommand === "do-what-it-says") {

	justDoIt();	
}


//if the user forgets to put in a command for process.argv[2]
//or if the command is spelled incorrectly
else {
	return console.log("There was an error.");
}




//======================= THE FUNCTIONS =======================


//function for the concert calls
function concertCall() {
	
	concert.get("statuses/user_timeline", concert, function(error, concert, response){

		if(error) {
			return console.log(error);

		} else {

			console.log("Concerts from " + concert.name + ":");
			console.log("");

			for (var h = 0; h < concert.length; h++) {

				//convert UTC time to local time for concert timestamp part 1
				//var concertDate = new Date(concert[h].created_at);

				console.log(concert[h].text);

				//convert UTC time to local time for concert timestamp part 2
				console.log(concertDate.toString()); 
				console.log("------------------------------------------");

				//console.log(JSON.stringify(concert, null, 2)); //<< prints out entire response of call. saving for reference.
			}

		}


	});

};




//functions for the spotify calls
//spotifyCheck() figures out what the user is searching and puts it in variable songChoice
//spotifyCall() executes the search with songChoice
function spotifyCheck () {
	//the song that will be searched

	//if the user doesn't put in a song, the default will be Bad Romance by Lady Gaga
	if (!process.argv[3]) {
		songChoice = "Bad Romance";

	} else {
		//this accomodates song titles with multiple words in it
		for (i = 3; i < process.argv.length; i++) {
			songChoice = process.argv[i];
			// console.log(songChoice); //test
		}
	}
};

function spotifyCall(songChoice) {

	spotify.search({type: "track", query: songChoice, limit: 1}, function(error, response){
		if (error) {
			return console.log(error);
		}

		//printing out song information
		for (var j = 0; j < response.tracks.items[0].album.artists.length; j++) {
			console.log("Artist(s): " + response.tracks.items[0].album.artists[j].name);
			console.log("Song: " + response.tracks.items[0].name);
			console.log("Song Link: " + response.tracks.items[0].external_urls.spotify);
			console.log("Album: " + response.tracks.items[0].album.name);
		}
		
		//console.log(JSON.stringify(response, null, 2)); //<<keeping this for reference

	});

};







//function for the open movie database (OMDB) calls
//movieCheck() figures out what the user is searching and puts it in variable omdbRequest
//movieCall() executes the search with omdbRequest
function movieCheck() {

	//if the user doesn't put in a movie title, the default search will be Mr. Nobody
	if (!process.argv[3]) {
		omdbRequest = "Mr. Nobody";

	} else {
		//the user's choice will be stored in variable omdbrequest
		//this accomodates movie titles with multiple words in it
		for (var k = 3; k < process.argv.length; k++) {
			omdbRequest += process.argv[k] + "+";
			//console.log(omdbRequest); //test
		}

	}

};

function movieCall(omdbRequest) {

	//variable to hold the omdb url search with api key and omdb request
	var omdbMovie = "http://www.omdbapi.com/?apikey=40e9cece&t=" + omdbRequest;

	
	request(omdbMovie, function (error, response, body) {
		if (error) {
			return console.log(error);
		}

		//printint out desired information
		console.log("Title of the movie: " + JSON.parse(body).Title);
		console.log("Year the movie came out: " + JSON.parse(body).Year);
		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		console.log("Country where the movie was produced: " + JSON.parse(body).Country);
		console.log("Movie language: " + JSON.parse(body).Language);
		console.log("Movie plot: " + JSON.parse(body).Plot);
		console.log("Actors in the movie: " + JSON.parse(body).Actors);


		//console.log(body);  //<<keeping for reference
	});

};





//function for the do-what-it-says call
function justDoIt() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		} else {
			
			//splits whatever is in random.txt into strings.
			//the split occurs wherever a comma exists.
			//each split string is put into an index in an array call "theSplit"
			var theSplit = data.split(",");

			if (theSplit[0] === "spotify-this-song") {
				songChoice = theSplit[1];

				//this will skip over spotifyCheck() and 
				//execute spotifyCall() with songChoice = whatever is in index 1 of theSplit
				spotifyCall(songChoice);
			} 

			else if (theSplit[0] === "movie-this") {
				omdbRequest = theSplit[1];

				//this will skip over omdbCheck() and 
				//execute omdbCall() with omdbRequest = whatever is in index 1 of theSplit
				movieCall(omdbRequest);
			}

			else if (theSplit[0] === "my-tweets") {
				myTweets.screen_name = theSplit[1];
				//console.log(myTweets.screen_name); //test

				//execute concertCall, pulls tweets from whatever account theSplit[1] is
				//if testing this call out, DO NOT USE " " OR ' ' AROUND THE SCREEN NAME FOR INDEX 1 
				//IN random.txt!! 
				concertCall();
			}

			else {
				console.log("Error: There's a problem with this call.")
			}

			//console.log(data); //test
			//console.log(theSplit); //test

		}

	});
}