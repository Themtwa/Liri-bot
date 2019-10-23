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

 
        
    }
}



runLiri(requestType, searchItem);