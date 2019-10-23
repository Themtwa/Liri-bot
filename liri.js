require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var requestType = process.argv[2];
var searchItem = process.argv[3];
var output = "";

function runLiri(requestType, searchItem) {
    outputToFile(">> node liri.js " + requestType + ' "' + searchItem + '"\n');
    switch (requestType) {
        case "spotify-this-song":

            if (searchItem === undefined) {
                searchItem = "Inside Out";
            }
            spotify.search({
                    type: "track",
                    query: searchItem,
                    limit: 10
                },
                function (error, data) {
                    if (error) {
                        return console.log("Error occurred: " + error);
                    }

                    for (var i = 0; i < data.tracks.items.length; i++) {
                        if (data.tracks.items[i].name.toLowerCase() === searchItem.toLowerCase()) {
                            if (data.tracks.items[i].preview_url != null) {
                                var previewURL = "\nListen to a bit of the song: " +
                                    data.tracks.items[i].preview_url;
                            } else {
                                previewURL = "\nNo song preview is available.";
                            }
                            output = "  ------------  \nSong Name: " + data.tracks.items[i].name +
                                "\nArtist: " + data.tracks.items[i].artists[0].name + "\nAlbum: " +
                                data.tracks.items[i].album.name + previewURL + "\n  ------------  \n";
                            outputToFile(output);
                            console.log(output);
                            return false;
                        }
                    }
                    output = "  ------------  \nThere was no exact match to that song name.\n  ------------  \n";
                    outputToFile(output);
                    console.log(output);
                });
            break;

        case "movie-this":

            if (searchItem === undefined) {
                searchItem = "Alien";
            }

            var queryURL = "https://www.omdbapi.com/?apikey=" + keys.omdb_key + "&t=" + searchItem;

            axios.get(queryURL).then(function (response) {
                if (response.data.Error) {
                    output = "  ------------  \n" + response.data.Error + "\n  ------------  \n";
                    console.log(output)
                    outputToFile(output);
                    return false;
                }
                var tomRating = "";
                if (response.data.Ratings[0]) {
                    response.data.Ratings.forEach(element => {
                        if (element.Source === "Rotten Tomatoes") {
                            tomRating = "\nRotten Tomatoes Rating: " + element.Value;
                        } else if (tomRating === "") {
                            tomRating = "\nRotten Tomatoes rating doesn't exist!";
                        }
                    });
                } else {
                    tomRating = "\nRotten Tomatoes rating doesn't exist!";
                }

                output = "  ------------  \nMovie Title: " + response.data.Title +
                    "\nYear Released: " + moment(response.data.Released, "DD MMM YYYY").format("YYYY") +
                    "\nRating: " + response.data.Rated.toUpperCase() +
                    "\nIMDB Rating: " + response.data.imdbRating + tomRating +
                    "\nCountry Produced: " + response.data.Country +
                    "\nLanguage: " + response.data.Language +
                    "\nPlot: " + response.data.Plot +
                    "\nActors: " + response.data.Actors +
                    "\n  ------------  \n";

                outputToFile(output);
                console.log(output);
            });
            break;
    }
}



runLiri(requestType, searchItem);