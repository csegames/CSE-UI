// Module to access Camelot Unchained's REST API
// Originally written by Mehuge (https://www.github.com/Mehuge)

var util = require('util');
var request = require('request');

if (typeof Promise === 'undefined') Promise = require('bluebird');

var servers = [];

function restAPI(name) {
  var server = name || "Hatchery";

  function getServerInfo(serverName) {
    var domain = "camelotunchained.com";
    if (serverName) {
      for (var i = 0; i < servers.length; i++) {
        if (servers[i].name === serverName) {
          return servers[i];
        }
      }
      return {
        host: (serverName === "Hatchery" ? "hatchery" : serverName.toLowerCase()) + "." + domain
      };
    }
    return {
      host: "api.citystateentertainment.com"
    };
  }
  
  function getServerURI(verb) {
    var host, port = 8000, protocol = "http:";
    switch (verb) {
      case "servers":
        port = 8001;
        host = getServerInfo().host;
        break;
      case "characters":
        protocol = "https:";
        port = 4443;
        host = getServerInfo(server).host;
        break;
      default:
        if (typeof cuAPI !== "undefined" && "serverURL" in cuAPI) return cuAPI.serverURL;
        host = getServerInfo(server).host;
        break;
    }
    return protocol + "//" + host + ":" + port + "/api/";
  }
  
  var call = function(verb, params) {
    var serverURI = getServerURI(verb);
  
    // Call the CU REST API, returns a promise
    params = params || {};
    return new Promise(function (fulfill, reject) {
      request({
        uri: serverURI + verb,
        method: params.type || "GET",
        qs: params.query,
        timeout: params.timeout,
      },
      function (error, response, body) {
        if (error) {
          util.log("[ERROR] Unable to read API (" + verb + "): " + error);
          reject(error);
        } else {
          try {
              fulfill(JSON.parse(body));
          } catch (e) {
              util.log("[ERROR] Invalid JSON returned by API (" + verb + "): " + e);
              reject('Invalid JSON returned by API');
          }
        }
      });
    });
  };
  
  return {
  
    getAbilities: function() {
      return call("abilities", { timeout: 2000 });
    },
  
    getAttributes: function() {
      return call("game/attributes", { timeout: 2000 });
    },
    
    getBanes: function() {
      return call("game/banes", { timeout: 2000 });
    },
    
    getBanners: function() {
      return call("banners", { timeout: 2000 });
    },
    
    getBoons: function() {
      return call("game/boons", { timeout: 2000 });
    },
    
    getBuildingBlocks: function() {
      return call("buildingblocks", {timeout: 2000 });
    },
    
    getCharacters: function(loginToken) {
      return call("characters", { query: { loginToken: loginToken }, timeout: 2000 });
    },
    
    getControlGame: function(query) {
      return call("game/controlgame", { query: query, timeout: 2000 });
    },
    
    getCraftedAbilities: function(query) {
      return call("craftedabilities", { query: query, timeout: 2000 });
    },
    
    getEvents: function() {
      return call("scheduledevents", { timeout: 2000 });
    },
    
    getFactions: function() {
      return call("game/factions", { timeout: 2000 });
    },
    
    getKills: function(query) {
      return call("kills", { query: query, timeout: 2000 });
    },
    
    getPatchNotes: function() {
      return call("patchnotes", { timeout: 2000 });
    },
    
    getPlayers: function() {
      return call("game/players", { timeout: 2000 });
    },
    
    getRaces: function() {
      return call("game/races", { timeout: 2000 });
    },
    
    getServers: function () {
      // Per CSE, there will be a single API for all online servers before we need
      // more than channel 4 and channel 10
      return new Promise(function (fulfill, reject) {
        var serverList = [];
        var channels = [
          call("servers", {query: {channelID:"4"}, timeout: 2000}),
          call("servers", {query: {channelID:"10"}, timeout: 2000}),
        ];

        Promise.all(channels).then(function (listAll) {
          for (var i = 0; i < listAll.length; i++) {
            if (listAll[i] !== null) serverList = serverList.concat(listAll[i]);
          }
          fulfill(serverList);
        })
      });
    },
    
    getSpawnPoints: function() {
      return call("game/spawnpoints", {timeout: 2000 });
    }
  }
}

module.exports = restAPI;