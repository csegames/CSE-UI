/* SquadBot XMPP bot for Camelot Unchained using Node.js

To use, run `node cu-squadbot.js`

Requires:
 - Node.js
 - github
 - moment
 - node-trello
 - node-xmpp
 - request
 - bluebird*
 - Camelot Unchained account

* The bluebird module is only required when using older versions of Node.js
which don't have Promise support.

Optional:
 - aws-sdk - Needed to send push notifications (SMS/email/etc.) via AWS SNS.
 - node-pushover - Needed to send Pushover notifications.

*/

var sys = require('sys');
var util = require('util');
var path = require('path');
var fs = require('fs');

var githubAPI = require('github');
var moment = require('moment');
var trelloAPI = require('node-trello');
var xmpp = require('node-xmpp');
var request = require('request');

var cuRestAPI = require('./cu-rest.js');
var config = require('./cu-squadbot.cfg');

if (typeof Promise === 'undefined') Promise = require('bluebird');

// Chat command definitions
var commandChar = '!';
var chatCommands = [
{ // #### HELP COMMAND ####
  command: 'help',
  help: "The command " + commandChar + "help displays help for using the various available bot commands.\n" +
    "\nUsage: " + commandChar + "help [command]\n" +
    "\nAvailable commands: ##HELPCOMMANDS##",
  exec: function(server, room, sender, message, extras) {
    var params = getParams(this.command, message);

    if (params.length > 0) {
      for (var i = 0; i < chatCommands.length; i++) {
        if (chatCommands[i].command == params) {
          sendReply(server, room, sender, chatCommands[i].help);
        }
      }
    } else {
      sendReply(server, room, sender, this.help);
    }
  }
},
{ // #### ASSIST COMMAND ####
  command: 'assist',
  help: "The command " + commandChar + "assist displays current Trello cards in the 'Need Assistance' list.\n" +
    "\nUsage: " + commandChar + "assist",
  exec: function(server, room, sender, message, extras) {
    var assistURLs = "";

    trelloAllAssists().then(function(assists) {
      if (assists.length > 0) {
          assists.forEach(function(assist, index) {
            assistURLs += "\n   " + (index + 1) + ": " + assist.shortUrl;
          });
          sendReply(server, room, sender, "There are currently " + assists.length + " Trello cards marked as needing assistance:" + assistURLs);
      } else {
        sendReply(server, room, sender, "No Trello cards currently marked as needing assistance.");
      }
    }, function(error) {
      sendReply(server, room, sender, error);
    });
  }
},
{ // #### BOTINFO COMMAND ####
  command: 'botinfo',
  help: "The command " + commandChar + "botinfo displays information about this chatbot.\n" +
    "\nUsage: " + commandChar + "botinfo",
  exec: function(server, room, sender, message, extras) {
    sendReply(server, room, sender, "The bot is written in Node.js and is running on an OpenShift gear. Source code for the bot can be found here: https://github.com/CUModSquad/SquadBot" +
      "\n\nMuch thanks to the CU Mod Squad for their help.");
  }
},
{ // #### CHATLOG COMMAND ####
  command: 'chatlog',
  help: "The command " + commandChar + "chatlog sends a private message with logged chat messages from a monitored room.\n" +
    "\nUsage: " + commandChar + "chatlog <parameters>\n" +
    "\nAvailable Parameters:" +
    "\n  -h <number> = Specify the number of hours to include in displayed results (maximum of " + config.chatlogLimit + " hours)" +
    "\n  -m <number> = Specify the number of minutes to include in displayed results (maximum of " + (config.chatlogLimit * 60) + " minutes)" +
    "\n  -r <room> = Specify the chat room to include in displayed results" +
    "\n  -u <user> = Specify the user name to include in displayed results" +
    "\n  -t <text> = Specify the message text to include in displayed results (regular expressions allowed)",
  exec: function(server, room, sender, message, extras) {
    var curISODate = new Date().toISOString();
    var searchRoom = null;
    var searchHours = null;
    var searchMins = null;
    var searchUser = null;
    var searchText = null;

    // Parse parameters passed to command
    var params = getParams(this.command, message);
    if (params.length > 0) {
      var paramArray = params.split(' ');
      for (var i = 0; i < paramArray.length; i++) {
        switch(paramArray[i]) {
          case '-r':
            // verify next param is a monitored room then set room to search
            var validRoom = false;
            server.rooms.forEach(function(r){
              if (r.name === paramArray[i + 1]) {
                if (r.privateRoom) {
                  // If privateRoom is true, only allow command from that room
                  if (r.name === room) validRoom = true;
                } else {
                  validRoom = true;
                }
              }
            });
            if (validRoom) {
              searchRoom = paramArray[i + 1];
              i++;
            } else {
              sendReply(server, room, sender, "The room '" + paramArray[i + 1] + "' is not being logged.");
              return;
            }
            break;
          case '-h':
            // verify next param is a positive integer then set hours to search
            if (paramArray[i + 1] % 1 !== 0 || paramArray[i + 1] < 1) {
              sendReply(server, room, sender, "The value following '-h' must be a positive number.");
              return;
            }
            searchHours = parseInt(paramArray[i + 1]);
            i++;
            break;
          case '-m':
            // verify next param is a positive integer then set mins to search
            if (paramArray[i + 1] % 1 !== 0 || paramArray[i + 1] < 1) {
              sendReply(server, room, sender, "The value following '-m' must be a positive number.");
              return;
            }
            searchMins = parseInt(paramArray[i + 1]);
            i++;
            break;
          case '-u':
            // verify next param is a word then set user to search
            if (paramArray[i + 1].search(/^[^\-]+/) === -1) {
              sendReply(server, room, sender, "The value following '-u' must be a user name.");
              return;
            }
            searchUser = paramArray[i + 1];
            i++;
            break;
          case '-t':
            // verify next param exists, then combine all params up to next - or end
            if (paramArray[i + 1].search(/^[^\-]+/) === -1) {
              sendReply(server, room, sender, "The value following '-t' must be text to search for.");
              return;
            }
            var sTxt = "";
            for (var t = i + 1; t < paramArray.length; t++) {
              if (paramArray[t].search(/^[^\-]+/) !== -1) {
                if (sTxt.length > 0) sTxt += " ";
                sTxt += paramArray[t];
              } else {
                break;
              }
            }
            searchText = sTxt;
            break;
          default:
            // Allow ##h and ##m for hours and minutes
            if (paramArray[i].search(/^[0-9]+[Hh]$/) !== -1) searchHours = parseInt(paramArray[i]);
            if (paramArray[i].search(/^[0-9]+[Mm]$/) !== -1) searchMins = parseInt(paramArray[i]);
            if (paramArray[i].search(/^[0-9]+$/) !== -1) searchHours = parseInt(paramArray[i]);
            break;
        }
      }
    } else {
      sendReply(server, room, sender, "Please specify a filter to limit the number of messages displayed. Type `" + commandChar + "help chatlog` for more information.");
      return;
    }

    if (! searchHours && ! searchMins && ! searchRoom && ! searchUser && ! searchText) {
      sendReply(server, room, sender, "Invalid parameters supplied to command. Type `" + commandChar + "help chatlog` for more information.");
      return;
    }

    if (! searchHours && ! searchMins) searchHours = config.chatlogLimit;

    if (searchHours && searchMins) {
      searchMins += searchHours * 60;
      searchHours = null;
    }

    if (room === 'pm') {
      if (searchRoom) {
        var roomName = searchRoom;
      } else {
        sendReply(server, room, sender, "You must specify a room to search with the '-r' parameter.");
        return;
      }
    } else {
      if (searchRoom) {
        var roomName = searchRoom;
      } else {
        var roomName = room.split('@')[0];
      }
      room = 'pm';
      sender = sender + '@' + server.address;
    }

    if (! server.chatlog[roomName]) {
      sendReply(server, room, sender, "No logs are currently saved for the room '" + roomName + "'.");
      return;
    }

    var logResults = "Chat history with filter '";
    if (searchHours) logResults += "hours:" + searchHours + " ";
    if (searchMins) logResults += "mins:" + searchMins + " ";
    if (searchUser) logResults += "user:" + searchUser + " ";
    if (searchText) logResults += "text:" + searchText + " ";
    logResults += "room: " + roomName + "':";

    var matchingChat = [];
    for (var i = 0; i < server.chatlog[roomName].length; i++) {
      if (searchHours) {
        if (moment(curISODate).diff(server.chatlog[roomName][i].timestamp, "hours") < searchHours) matchingChat.push(server.chatlog[roomName][i]);
      }
      if (searchMins) {
        if (moment(curISODate).diff(server.chatlog[roomName][i].timestamp, "minutes") < searchMins) matchingChat.push(server.chatlog[roomName][i]);
      }
    }
    matchingChat.forEach(function(msg) {
      var isMatch = true;
      if (searchUser && msg.sender !== searchUser) isMatch = false;
      if (searchText && msg.message.search(new RegExp(searchText)) === -1) isMatch = false;

      if (isMatch) logResults += "\n   [" + moment(msg.timestamp).format("HH:mm") + "] <" + msg.sender + "> " + msg.message;
    });
    sendReply(server, room, sender, logResults);
  }
},
{ // #### CONTRIBS COMMAND ####
  command: 'contribs',
  help: "The command " + commandChar + "contribs displays all contributors to monitored GitHub organizations.\n" +
    "\nUsage: " + commandChar + "contribs",
  exec: function(server, room, sender, message, extras) {
    var contribUsers = [];
    var contribList = "";
    githubAllContribs().then(function(contribs) {
      if (contribs.length > 0) {
        for (var i = 0; i < contribs.length; i++) {
          if (contribUsers.indexOf(contribs[i].login) === -1) contribUsers.push(contribs[i].login);
        }
        for (var i = 0; i < contribUsers.length; i++) {
          if (contribList.length > 0) contribList += ", ";
          contribList += contribUsers[i];
        }
        sendReply(server, room, sender, "Contributing users to all monitored GitHub organizations: " + contribList);
      } else {
        sendReply(server, room, sender, "No contributors found for monitored GitHub organizations.");
      }
    });
  }
},
{ // #### ISSUES COMMAND ####
  command: 'issues',
  help: "The command " + commandChar + "issues displays current issues for all monitored GitHub organizations.\n" +
    "\nUsage: " + commandChar + "issues [filter]" +
    "\nIf [filter] is specified, displayed issues will be filtered. Otherwise, issues for all monitored organizations will be displayed.",
  exec: function(server, room, sender, message, extras) {
    var issueURLs = "";

    var params = getParams(this.command, message);
    if (params.length > 0) {
      var filter = params.split(' ')[0];
      var targetOrgText = "the GitHub filter '" + filter + "'";
    } else {
      var filter = null;
      var targetOrgText = "all monitored GitHub organizations";
    }

    githubAllIssues(filter).then(function(issues) {
      if (issues.length > 0) {
        if (! filter && issues.length > 5) {
          for (var i = 0; i < 5; i++) {
            issueURLs += "\n   " + (i + 1) + ": " + issues[i].html_url;
          }
          sendReply(server, room, sender, "There are currently " + issues.length + " issues open against " + targetOrgText + ":" + issueURLs +
            "\n To display more than the first 5 issues, include a filter in your command.");
        } else {
          issues.forEach(function(issue, index) {
            issueURLs += "\n   " + (index + 1) + ": " + issue.html_url;
          });
          sendReply(server, room, sender, "There are currently " + issues.length + " issues open against " + targetOrgText + ":" + issueURLs);
        }
      } else {
        sendReply(server, room, sender, "No issues found for " + targetOrgText + ".");
      }
    }, function(error) {
      sendReply(server, room, sender, error);
    });
  }
},
{ // #### MOTD COMMAND ####
  command: 'motd',
  help: "The command " + commandChar + "motd allows setting and viewing the MOTD for the Mod Squad.\n" +
    "\nUsage: " + commandChar + "motd [new MOTD]",
  exec: function(server, room, sender, message, extras) {
    if (extras && extras.motdadmin) {
      var motdadmin = extras.motdadmin;
    } else {
      var motdadmin = false;
    }

    var params = getParams(this.command, message);
    var targetServer = server;

    if (params.length > 0) {
      // User is trying to set a new MOTD.
      if (motdadmin) {
        // User is allowed - Set new MOTD.
        fs.writeFile(targetServer.motdFile, "MOTD: " + params, function(err) {
          if (err) {
            return util.log("[ERROR] Unable to write to MOTD file.");
          }
          targetServer.motd = "MOTD: " + params;
          sendReply(server, room, sender, "MOTD for " + targetServer.name + " set to: " + params);
          util.log("[MOTD] New MOTD for server '" + targetServer.name + "' set by user '" + sender + "'.");
        });
      } else {
        // User is not allowed - Send error.
        sendReply(server, room, sender, "You do not have permission to set an MOTD.");
      }
    } else {
      // User requested current MOTD.
      if (room === 'pm') {
        sendPM(server, targetServer.motd.toString(), sender);
        util.log("[MOTD] MOTD sent to user '" + sender + "' on " + server.name + ".");
      } else {
        sendChat(server, targetServer.motd.toString(), room);
        util.log("[MOTD] MOTD sent to '" + server.name + '/' + room.split('@')[0] + "' per user '" + sender + "'.");
      }
    }
  }
},
{ // #### MOTDOFF COMMAND ####
  command: 'motdoff',
  help: "The command " + commandChar + "motdoff allows users to stop receiving a Message of the Day for a particular server.\n" +
    "\nUsage: " + commandChar + "motdoff [server]\n" +
    "\nIf [server] is specified, all actions will apply to that server. Otherwise, they will apply to the current server.",
  exec: function(server, room, sender, message, extras) {
    var ignoredReceiver = false;
    var targetServer = server;

    targetServer.motdIgnore.forEach(function(receiver) {
      if (receiver === sender) ignoredReceiver = true;
    });

    if (! ignoredReceiver) {
      // Add user to MOTD ignore list
      targetServer.motdIgnore.push(sender);
      fs.writeFile(targetServer.nomotdFile, JSON.stringify(targetServer.motdIgnore), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to write to MOTD Ignore file.");
        }
        sendReply(server, room, sender, "User '" + sender + "' unsubscribed from " + targetServer.name + " MOTD notices.");
        util.log("[MOTD] User '" + sender + "' added to '" + targetServer.name + "' opt-out list.");
      });
    } else {
      // Tell user they already have MOTDs turned off
      sendReply(server, room, sender, "User '" + sender + "' already unsubscribed from " + targetServer.name + " MOTD notices.");
    }
  }
},
{ // #### MOTDON COMMAND ####
  command: 'motdon',
  help: "The command " + commandChar + "motdon allows users to start receiving a Message of the Day for a particular server.\n" +
    "\nUsage: " + commandChar + "motdon [server]\n" +
    "\nIf [server] is specified, all actions will apply to that server. Otherwise, they will apply to the current server.",
  exec: function(server, room, sender, message, extras) {
    var ignoredReceiver = false;
    var targetServer = server;

    targetServer.motdIgnore.forEach(function(receiver) {
      if (receiver === sender) ignoredReceiver = true;
    });

    if (ignoredReceiver) {
      // Remove user from MOTD ignore list
      for (var i = 0; i < targetServer.motdIgnore.length; i++) {
        if (targetServer.motdIgnore[i] === sender) {
          index = i;
          break;
        }
      }
      targetServer.motdIgnore.splice(index, 1);

      fs.writeFile(targetServer.nomotdFile, JSON.stringify(targetServer.motdIgnore), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to write to MOTD Ignore file.");
        }
        sendReply(server, room, sender, "User '" + sender + "' subscribed to " + targetServer.name + " MOTD notices.");
        util.log("[MOTD] User '" + sender + "' removed from '" + targetServer.name + "' opt-out list.");
      });
    } else {
      // Tell user they already have MOTDs turned on
      sendReply(server, room, sender, "User '" + sender + "' already subscribed to " + targetServer.name + " MOTD notices.");
    }
  }
},
{ // #### PRS COMMAND ####
  command: 'prs',
  help: "The command " + commandChar + "prs displays current pull requests for all monitored GitHub organizations.\n" +
    "\nUsage: " + commandChar + "prs [filter]" +
    "\nIf [filter] is specified, displayed pull requests will be filtered. Otherwise, pull requests for all monitored organizations will be displayed.",
  exec: function(server, room, sender, message, extras) {
    var pullURLs = "";

    var params = getParams(this.command, message);
    if (params.length > 0) {
      var filter = params.split(' ')[0];
      var targetOrgText = "the GitHub filter '" + filter + "'";
    } else {
      var filter = null;
      var targetOrgText = "all monitored GitHub organizations";
    }

    githubAllPullRequests(filter).then(function(prs) {
      if (prs.length > 0) {
        if (! filter && prs.length > 5) {
          for (var i = 0; i < 5; i++) {
            pullURLs += "\n   " + (i + 1) + ": " + prs[i].html_url;
          }
          sendReply(server, room, sender, "There are currently " + prs.length + " pull requests open against " + targetOrgText + ":" + pullURLs +
            "\n To display more than the first 5 pull requests, include a filter in your command.");
        } else {
          prs.forEach(function(pr, index) {
            pullURLs += "\n   " + (index + 1) + ": " + pr.html_url;
          });
          sendReply(server, room, sender, "There are currently " + prs.length + " pull requests open against " + targetOrgText + ":" + pullURLs);
        }
      } else {
        sendReply(server, room, sender, "No pull requests found for " + targetOrgText + ".");
      }
    }, function(error) {
      sendReply(server, room, sender, error);
    });
  }
},
{ // #### REPOS COMMAND ####
  command: 'repos',
  help: "The command " + commandChar + "repos displays current repositories for monitored GitHub organizations.\n" +
    "\nUsage: " + commandChar + "repos [organization]\n" +
    "\nIf [organization] is specified, displayed repositories will be filtered. Otherwise, repositories for all monitored organizations will be displayed.",
  exec: function(server, room, sender, message, extras) {
    var repoURLs = "";

    var params = getParams(this.command, message);
    if (params.length > 0) {
      var on = params.split(' ')[0].toLowerCase();
      var onFound = false;
      for (var i = 0; i < config.githubOrgs.length; i++) {
        if (config.githubOrgs[i].toLowerCase() === on) {
          onFound = true;
          break;
        }
      }
      if (gnFound) {
        // first parameter is an organization name
        params = params.slice(gn.length + 1);
        var targetOrg = on;
        var targetOrgText = "the GitHub organization '" + on + "'";
      } else {
        return sendReply(server, room, sender, "Not currently monitoring an organization named '" + on + "'.");
      }
    } else {
      var targetOrg = null;
      var targetOrgText = "all monitored GitHub organizations";
    }

    githubAllRepos(targetOrg).then(function(repos) {
      if (repos.length > 0) {
        repos.forEach(function(repo, index) {
          repoURLs += "\n   " + (index + 1) + ": " + repo.full_name + " - " + repo.html_url;
        });
        sendReply(server, room, sender, "There are currently " + repos.length + " repositories within " + targetOrgText + ":" + repoURLs);
      } else {
        sendReply(server, room, sender, "No repositories found for " + targetOrgText + ".");
      }
    });
  }
},
{ // #### TIPS COMMAND ####
  command: 'tips',
  help: "The command " + commandChar + "tips displays tips for new Mod Squad members.\n" +
    "\nUsage: " + commandChar + "tips [user]\n" +
    "\nIf [user] is specified, tips will be sent to that user. If 'chat' is specified as the user, tips will be sent to chat.",
  exec: function(server, room, sender, message, extras) {
    var params = getParams(this.command, message);
    if (params.length > 0) {
      var pn = params.split(' ')[0].toLowerCase();
      if (pn !== 'chat') {
        if (room === 'pm') {
          // Only allow tips requested via PM to be sent to requester to avoid abuse
          sendReply(server, room, sender, "Tips sent to " + sender.split("@")[0] + ".");
        } else {
          // send message as PM to specified user
          sendReply(server, room, sender, "Tips sent to " + pn + ".");
          room = 'pm';
          sender = pn + '@' + server.address;
        }
      }
    } else {
      // send message as PM to user calling !tips
      sendReply(server, room, sender, "Tips sent to " + sender.split("@")[0] + ".");
      if (room !== 'pm') {
        room = 'pm';
        sender = sender + '@' + server.address;
      }
    }

    sendReply(server, room, sender, "Quick Tips: Welcome to the Mod Squad. Tips coming soon(tm)!");
  }
},
{ // #### USERADD COMMAND ####
  command: 'useradd',
  help: "The command " + commandChar + "useradd adds a user to the Mod Squad member list.\n" +
    "\nUsage: " + commandChar + "useradd <CU User Name> <GitHub User Name> <Trello User Name>\n" +
    "\nIf a GitHub user name or Trello user name is unknown, enter 'none' for that item.",
  exec: function(server, room, sender, message, extras) {
    if (! extras || ! extras.motdadmin) {
      return sendReply(server, room, sender, "You do not have permission to add a user.");
    }
    var params = getParams(this.command, message);
    if (! params.length > 0) {
      return sendReply(server, room, sender, "Usage: " + commandChar + "useradd <CU User Name> <GitHub User Name> <Trello User Name>");
    }
    var aNames = params.split(' ');
    if (aNames.length !== 3) {
      return sendReply(server, room, sender, "Usage: " + commandChar + "useradd <CU User Name> <GitHub User Name> <Trello User Name>");
    }
    var curISODate = new Date().toISOString();
    var cName = aNames[0];
    var gName = aNames[1];
    var tName = aNames[2];
    if (tName.substring(0,1) === '@') tName = tName.substring(1);
    var existingMember = false;
    memberData.forEach(function(user) {
      if (user.cuUser.toLowerCase() === cName.toLowerCase()) existingMember = true;
    });
    if (existingMember) {
      return sendReply(server, room, sender, "The user '" + cName + "' already exists.");
    }

    var githubPromise = getGitHubUser(gName);
    var trelloPromise = getTrelloUser(tName);
    Promise.all([githubPromise, trelloPromise]).then(function(data) {
      var tFullName = data[1].fullName;
      memberData.push({
        cuUser: cName,
        githubUser: gName,
        trelloUser: tName,
        trelloName: tFullName,
        addDate: curISODate
      });
      fs.writeFile(config.memberFile, JSON.stringify(memberData), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to write to member data file.");
        }
        sendReply(server, room, sender, "User '" + cName + "' added to the Mod Squad member list.");
        util.log("[STATUS] User '" + cName + "' added to Mod Squad member list.");
      });
    }, function(error) {
      sendReply(server, room, sender, error);
    });
  }
},
{ // #### USERDEL COMMAND ####
  command: 'userdel',
  help: "The command " + commandChar + "userdel removes a user from the Mod Squad member list.\n" +
    "\nUsage: " + commandChar + "userdel <CU User Name>",
  exec: function(server, room, sender, message, extras) {
    if (! extras || ! extras.motdadmin) {
      return sendReply(server, room, sender, "You do not have permission to add a user.");
    }
    var params = getParams(this.command, message);
    if (! params.length > 0) {
      return sendReply(server, room, sender, "You must supply a user name to delete. Type " + commandChar + "help userdel for information.");
    }
    var dName = params.split(' ')[0].toLowerCase();
    var existingMember = false;
    for (var i = 0; i < memberData.length; i++) {
      if (memberData[i].cuUser.toLowerCase() === dName) {
        existingMember = true;
        memberData.splice(i, 1);
        i--;
      }
    }
    if (existingMember) {
      fs.writeFile(config.memberFile, JSON.stringify(memberData), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to write to member data file.");
        }
        sendReply(server, room, sender, "The user '" + dName + "' has been deleted from the Mod Squad member list.");
        util.log("[STATUS] User '" + dName + "' deleted from Mod Squad member list.");
      });
    } else {
      sendReply(server, room, sender, "The user '" + dName + "' does not exist in the Mod Squad member list.");
    }
  }
},
{ // #### USERMOD COMMAND ####
  command: 'usermod',
  help: "The command " + commandChar + "usermod modifies a user in the Mod Squad member list.\n" +
    "\nUsage: " + commandChar + "usermod <CU User Name> <parameters>\n" +
    "\nAvailable Parameters:" +
    "\n  -g <GitHub User Name> = Specify a new GitHub user name for the Mod Squad member" +
    "\n  -t <Trello User Name> = Specify a new Trello user name for the Mod Squad member",
  exec: function(server, room, sender, message, extras) {
    if (! extras || ! extras.motdadmin) {
      return sendReply(server, room, sender, "You do not have permission to modify a user.");
    }

    var params = getParams(this.command, message);
    if (! params.length > 0) {
      return sendReply(server, room, sender, "You must provide a user name to modify. Type `" + commandChar + "help usermod` for help.");
    }
    var paramArray = params.split(' ');
    var existingMember = false;
    var userToMod = null;
    memberData.forEach(function(member) {
      if (member.cuUser.toLowerCase() === paramArray[0].toLowerCase()) {
        userToMod = paramArray[0];
        existingMember = true;
      }
    });
    if (! existingMember) {
      return sendReply(server, room, sender, "The user '" + paramArray[0] + "' does not exist in the Mod Squad member list.");
    }

    for (var i = 1; i < paramArray.length; i++) {
      switch(paramArray[i]) {
        case '-g':
          // verify next param exists
          if (paramArray[i + 1].search(/^[^\-]+/) === -1) {
            sendReply(server, room, sender, "The value following '-g' must be a user name.");
            return;
          }
          var newGitHubName = paramArray[i + 1];
          i++;
          break;
        case '-t':
          // verify next param exists
          if (paramArray[i + 1].search(/^[^\-]+/) === -1) {
            sendReply(server, room, sender, "The value following '-t' must be a user name.");
            return;
          }
          var newTrelloName = paramArray[i + 1];
          i++;
          break;
      }
    }

    if (! newGitHubName && ! newTrelloName) {
      return sendReply(server, room, sender, "No parameters specified. Type `" + commandChar + "help usermod` for help.");
    }

    // verify GitHub and Trello user names are valid
    var promiseArray = [];
    if (newGitHubName) promiseArray.push(getGitHubUser(newGitHubName));
    if (newTrelloName) promiseArray.push(getTrelloUser(newTrelloName));

    Promise.all(promiseArray).then(function(data) {
      // update memberData with new GitHub information
      if (newGitHubName) {
        for (var i = 0; i < memberData.length; i++) {
          if (memberData[i].cuUser.toLowerCase() === userToMod.toLowerCase()) memberData[i].githubUser = newGitHubName;
        }
      }

      // update memberData with new Trello information
      if (newTrelloName) {
        if (promiseArray.length > 1) {
          var newFullName = data[1].fullName;
        } else {
          var newFullName = data[0].fullName;
        }
        for (var i = 0; i < memberData.length; i++) {
          if (memberData[i].cuUser.toLowerCase() === userToMod.toLowerCase()) {
            memberData[i].trelloUser = newTrelloName;
            memberData[i].trelloName = newFullName;
          }
        }
      }

      // write memberData changes to file
      fs.writeFile(config.memberFile, JSON.stringify(memberData), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to write to member data file.");
        }
        sendReply(server, room, sender, "User '" + userToMod + "' has been modified.");
        util.log("[STATUS] User '" + userToMod + "' modified in Mod Squad member list.");
      });

    }, function(error) {
      sendReply(server, room, sender, error);
    });
  }
},
{ // #### USERLIST COMMAND ####
  command: 'userlist',
  help: "The command " + commandChar + "userlist displays all users in the Mod Squad member list.\n" +
    "\nUsage: " + commandChar + "userlist",
  exec: function(server, room, sender, message, extras) {
    // send message as PM to user calling !userlist
    if (room !== 'pm') {
      sendReply(server, room, sender, "Mod Squad member list sent to " + sender.split("@")[0] + ".");
      room = 'pm';
      sender = sender + '@' + server.address;
    }
    var sortedMembers = memberData.concat().sort(function(a, b) { return a.cuUser.toLowerCase().localeCompare(b.cuUser.toLowerCase()) });
    var userList = "The following users are members of the Mod Squad:";
    sortedMembers.forEach(function(member, index) {
      cName = member.cuUser;
      gName = member.githubUser;
      tName = member.trelloUser;
      tFullName = member.trelloName;
      userList += "\n #" + (index + 1) + ") " + cName + " is known as " + gName + " on GitHub and " + tFullName + " (@" + tName + ") on Trello.";
    });
    sendReply(server, room, sender, userList);
  }
},
{ // #### WHOIS COMMAND ####
  command: 'whois',
  help: "The command " + commandChar + "whois displays information about a particular Mod Squad member.\n" +
    "\nUsage: " + commandChar + "whois <username>",
  exec: function(server, room, sender, message, extras) {
    var params = getParams(this.command, message);
    if (! params.length > 0) {
      return sendReply(server, room, sender, "You must supply a user name.");
    }
    var sName = params.split(' ')[0].toLowerCase();
    var existingMember = false;
    memberData.forEach(function(member) {
      cName = member.cuUser;
      gName = member.githubUser;
      tName = member.trelloUser;
      tFullName = member.trelloName;
      if (cName.toLowerCase().search(sName) > -1 || gName.toLowerCase().search(sName) > -1 || tName.toLowerCase().search(sName) > -1 || tFullName.toLowerCase().search(sName) > -1) {
        existingMember = true;
        return sendReply(server, room, sender, cName + " is known as " + gName + " on GitHub and " + tFullName + " (@" + tName + ") on Trello.");
      }
    });
    if (! existingMember) sendReply(server, room, sender, "No user named '" + sName + "' exists in the Mod Squad member list.");
  }
},
];

// Add list of available commands to the output of !help
var commandList = "";
chatCommands.forEach(function(cmd) {
  if (commandList.length > 0) commandList = commandList + ", ";
  commandList = commandList + cmd.command;
});
chatCommands[0].help = chatCommands[0].help.replace("##HELPCOMMANDS##", commandList);

/*****************************************************************************/
/*****************************************************************************/

// function to check internet connectivity
function checkInternet(server, callback) {
  require('dns').lookup(server.address, function(err) {
    if (err && err.code == "ENOTFOUND") {
      callback(false);
    } else {
      callback(true);
    }
  })
}

// function to read in the saved chatlog
function getChatlog(server) {
  fs.readFile(server.chatlogFile, function(err, data) {
    if (err && err.code === 'ENOENT') {
      server.chatlog = {};
      fs.writeFile(server.chatlogFile, JSON.stringify(server.chatlog), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to create chatlog file.");
        }
        util.log("[STATUS] Chatlog file did not exist. Empty file created.");
      });
    } else {
      server.chatlog = JSON.parse(data);
    }
  });
}

// function to read in the saved member data
function getMemberData() {
  fs.readFile(config.memberFile, function(err, data) {
    if (err && err.code === 'ENOENT') {
      memberData = [];
      fs.writeFile(config.memberFile, JSON.stringify(memberData), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to create member data file.");
        }
        util.log("[STATUS] Member data file did not exist. Empty file created.");
      });
    } else {
      memberData = JSON.parse(data);
    }
  });
}

// function to read in the MOTD file
function getMOTD(server) {
  fs.readFile(server.motdFile, function(err, data) {
    if (err && err.code === 'ENOENT') {
      fs.writeFile(server.motdFile, "MOTD: ", function(err) {
        if (err) {
          return util.log("[ERROR] Unable to create MOTD file.");
        }
        util.log("[STATUS] MOTD file did not exist. Empty file created.");
      });
      server.motd = "MOTD: ";
    } else {
      server.motd = data;
    }
  });
}

// function to read in the MOTD ignore list
function getMOTDIgnore(server) {
  fs.readFile(server.nomotdFile, function(err, data) {
    if (err && err.code === 'ENOENT') {
      server.motdIgnore = [];
      fs.writeFile(server.nomotdFile, JSON.stringify(server.motdIgnore), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to create MOTD Ignore file.");
        }
        util.log("[STATUS] MOTD Ignore file did not exist. Empty file created.");
      });
    } else {
      server.motdIgnore = JSON.parse(data);
    }
  });
}

// function to get parameters from a message
function getParams(command, message, index) {
  re = new RegExp('^' + commandChar + command +'[\ ]*', 'i');
  params = message.replace(re, '');
  if (params.length > 0) {
    if (index === undefined) {
      return params;
    } else {
      return params.split(' ')[index];
    }
  } else {
    return -1;
  }
}

// function to authenticate with GitHub API
function githubAuth() {
  github.authenticate({
    type: "basic",
    username: config.githubUsername,
    password: config.githubAPIToken
  });
}

// function to read in the saved GitHub data
function getGitHubData() {
  fs.readFile(config.githubFile, function(err, data) {
    if (err && err.code === 'ENOENT') {
      githubData = {
        lastCommit: "2007-10-01T00:00:00.000Z",
        lastIssue: "2007-10-01T00:00:00.000Z",
        lastPR: "2007-10-01T00:00:00.000Z"
      };
      fs.writeFile(config.githubFile, JSON.stringify(githubData), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to create GitHub data file.");
        }
        util.log("[STATUS] GitHub data file did not exist. Empty file created.");
      });
    } else {
      githubData = JSON.parse(data);
    }
  });
}

// function to get user information from the GitHub API
function getGitHubUser(user) {
  return new Promise(function (fulfill, reject) {
    if (! user) {
      reject('No username specified.');
    } else if (user === 'none') {
      fulfill({});
    } else {
      githubAuth();
      github.user.getFrom({
        user: user
      }, function(err, res) {
        if (! err) {
          fulfill(res);
        } else {
          util.log("[ERROR] Unable to get user information from GitHub API.");
          reject("The name '" + user + "' is not a valid GitHub user name.");
        }
      });
    }
  });
}

// function to obtain all contributors for every GitHub repo owned by all monitored organizations
function githubAllContribs() {
  return new Promise(function (fulfill, reject) {
    var allContribs = [];
    githubAllRepos().then(function(repos) {
      var repoCount = repos.length;
      repos.forEach(function(repo) {
        githubAuth();
        github.repos.getContributors({
          user: repo.owner.login,
          repo: repo.name
        }, function(err, res) {
          repoCount--;
          if (! err) {
            allContribs = allContribs.concat(res);
          } else {
            util.log("[ERROR] Error pulling list of contributors for '" + repo.owner.login + "/" + repo.name + "'.");
          }
          if (repoCount === 0) fulfill(allContribs);
        });
      });
    });
  });
}

// function to obtain all events for every repo owned by all monitored organizations
function githubAllEvents() {
  return new Promise(function (fulfill, reject) {
    var allEvents = [];
    var orgCount = config.githubOrgs.length;
    config.githubOrgs.forEach(function(ghUser, index, array) {
      githubAuth();
      github.events.getFromOrg({
        org: ghUser
      }, function(err, res) {
        orgCount--;
        if (! err) {
          allEvents = allEvents.concat(res);
        } else {
          util.log("[ERROR] Error pulling list of events for '" + ghUser + "'.");
        }
        if (orgCount === 0) fulfill(allEvents);
      });
    });
  });
}

// function to obtain all issues for every repo owned by all monitored organizations
function githubAllIssues(filter) {
  return new Promise(function (fulfill, reject) {
    var allIssues = [];
    var orgName = null;
    var repoName = null;

    if (filter) {
      if (filter.indexOf('/') > -1) {
        orgName = filter.split('/')[0];
        repoName = filter.split('/')[1];
        var validOrg = false;
        for (var i = 0; i < config.githubOrgs.length; i++) {
          if (config.githubOrgs[i].toLowerCase() === orgName.toLowerCase()) validOrg = true;
        }
        if (! validOrg) return reject("The organization named '" + orgName + "' is not a monitored GitHub organization.");
      } else {
        var validOrg = false;
        for (var i = 0; i < config.githubOrgs.length; i++) {
          if (config.githubOrgs[i].toLowerCase() === filter.toLowerCase()) validOrg = true;
        }
        if (validOrg) {
          orgName = filter;
        } else {
          repoName = filter;
        }
      }
    }

    githubAllRepos(orgName).then(function(repos) {
      if (repoName) {
        for (var i = 0; i < repos.length; i++) {
          if (repos[i].name.toLowerCase() !== repoName.toLowerCase()) {
            repos.splice(i, 1);
            i--;
          }
        }
        if (repos.length < 1) fulfill(allIssues);
      }

      var repoCount = repos.length;
      repos.forEach(function(repo) {
        githubAuth();
        github.issues.repoIssues({
          user: repo.owner.login,
          repo: repo.name,
          state: 'open'
        }, function(err, res) {
          repoCount--;
          if (! err) {
            allIssues = allIssues.concat(res);
          } else {
            util.log("[ERROR] Error pulling list of issues for '" + repo.owner.login + "/" + repo.name + "'.");
          }
          if (repoCount === 0) fulfill(allIssues);
        });
      });
    });
  });
}

// function to obtain all pull reqeusts for every repo owned by all monitored users
function githubAllPullRequests(filter) {
  return new Promise(function (fulfill, reject) {
    var allPullRequests = [];
    var orgName = null;
    var repoName = null;

    if (filter) {
      if (filter.indexOf('/') > -1) {
        orgName = filter.split('/')[0];
        repoName = filter.split('/')[1];
        var validOrg = false;
        for (var i = 0; i < config.githubOrgs.length; i++) {
          if (config.githubOrgs[i].toLowerCase() === orgName.toLowerCase()) validOrg = true;
        }
        if (! validOrg) return reject("The organization named '" + orgName + "' is not a monitored GitHub organization.");
      } else {
        var validOrg = false;
        for (var i = 0; i < config.githubOrgs.length; i++) {
          if (config.githubOrgs[i].toLowerCase() === filter.toLowerCase()) validOrg = true;
        }
        if (validOrg) {
          orgName = filter;
        } else {
          repoName = filter;
        }
      }
    }

    githubAllRepos(orgName).then(function(repos) {
      if (repoName) {
        for (var i = 0; i < repos.length; i++) {
          if (repos[i].name.toLowerCase() !== repoName.toLowerCase()) {
            repos.splice(i, 1);
            i--;
          }
        }
        if (repos.length < 1) fulfill(allPullRequests);
      }

      var repoCount = repos.length;
      repos.forEach(function(repo, index, array) {
        githubAuth();
        github.pullRequests.getAll({
          user: repo.owner.login,
          repo: repo.name
        }, function(err, res) {
          repoCount--;
          if (! err) {
            allPullRequests = allPullRequests.concat(res);
          } else {
            util.log("[ERROR] Error pulling list of pull requests for '" + repo.owner.login + "/" + repo.name + "'.");
          }
          if (repoCount === 0) fulfill(allPullRequests);
        });
      });
    });
  });
}

// function to obtain all repos owned by all monitored organizations
function githubAllRepos(org) {
  return new Promise(function (fulfill, reject) {
    var allRepos = [];
    if (org) {
      var orgsToSearch = [org];
    } else {
      var orgsToSearch = config.githubOrgs;
    }
    var orgCount = orgsToSearch.length;

    orgsToSearch.forEach(function(ghUser, index, array) {
      githubAuth();
      github.repos.getFromOrg({
        org: ghUser
      }, function(err, res) {
        orgCount--;
        if (! err) {
          allRepos = allRepos.concat(res);
        } else {
          util.log("[ERROR] Error pulling list of repositories for '" + ghUser + "'.");
        }
        if (orgCount === 0) fulfill(allRepos);
      });
    });
  });
}

// function to read in the saved Trello data
function getTrelloData() {
  fs.readFile(config.trelloFile, function(err, data) {
    if (err && err.code === 'ENOENT') {
      trelloData = {
        lastAction: "2011-09-01T00:00:00.000Z",
      };
      fs.writeFile(config.trelloFile, JSON.stringify(trelloData), function(err) {
        if (err) {
          return util.log("[ERROR] Unable to create Trello data file.");
        }
        util.log("[STATUS] Trello data file did not exist. Empty file created.");
      });
    } else {
      trelloData = JSON.parse(data);
    }
  });
}

// function to get user information from the Trello API
function getTrelloUser(user) {
  return new Promise(function (fulfill, reject) {
    if (! user) {
      reject('No username specified.');
    } else if (user === 'none') {
      fulfill({fullName: 'None'});
    } else {
      trello.get("/1/members/" + user, function(err, data) {
        if (! err) {
          fulfill(data);
        } else {
          util.log("[ERROR] Unable to get user information from Trello API.");
          reject("The name '" + user + "' is not a valid Trello user name.");
        }
      });
    }
  });
}

// function to obtain all actions on all monitored Trello boards
function trelloAllActions() {
  return new Promise(function (fulfill, reject) {
    var allActions = [];
    var boardCount = config.trelloBoards.length;
    config.trelloBoards.forEach(function(boardID, index, array) {
      trello.get('/1/boards/' + boardID + '/actions', function(err, data) {
        boardCount--;
        if (! err) {
          allActions = allActions.concat(data);
        } else {
          util.log("[ERROR] Error pulling list of actions for board '" + boardID + "'.");
        }
        if (boardCount === 0) fulfill(allActions);
      });
    });
  });
}

// function to obtain all cards in the 'Need Assistance' Trello list
function trelloAllAssists() {
  return new Promise(function (fulfill, reject) {
    trello.get('/1/lists/' + config.trelloAssistList + '/cards', function(err, data) {
      if (! err) {
        fulfill(data);
      } else {
        util.log("[ERROR] Error pulling assist list from Trello API");
        reject("Error pulling assist list from Trello API");
      }
    });
  });
}

// function to find the index of a room
var indexOfRoom = function(server, room) {
  for (var i = 0; i < server.rooms.length; i++) {
    if (server.rooms[i].name === room) return i;
  }
  return -1;
};

// function to find the index of a server
var indexOfServer = function(server) {
  for (var i = 0; i < config.servers.length; i++) {
    if (config.servers[i].name === server) return i;
  }
  return -1;
};

// function to check if game server is up
function isGameServerUp(server, attempt, callback) {
  server.cuRest.getServers().then(function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase() === server.name.toLowerCase()) {
        callback(true);
        return;
      }
    }
    callback(false);
  }, function(error) {
    // Retry twice before giving up.
    if (attempt < 2) {
      isGameServerUp(server, attempt+1, callback);
    } else {
      util.log("[ERROR] Unable to query servers API.");
      callback(false);
    }
  });
}

// function to check if user is an MOTD admin
var isMOTDAdmin = function(name) {
  for (var i = 0; i < config.motdAdmins.length; i++) {
    if (config.motdAdmins[i].toLowerCase() === name.toLowerCase()) return true;
  }
  for (var i = 0; i < memberData.length; i++) {
    if (memberData[i].cuUser.toLowerCase() === name.toLowerCase()) return true;
  }
  return false;
};

// function to check if a message matches test keywords
var isTestMessage = function(message) {
  for (var i = 0; i < config.testKeywords.length; i++) {
    re = new RegExp(config.testKeywords[i], 'i');
    if (message.search(re) != -1) return true;
  }
  return false;
};

function random(howMany) {
  chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  var rnd = require('crypto').randomBytes(howMany)
    , value = new Array(howMany)
    , len = chars.length;

  for (var i = 0; i < howMany; i++) {
    value[i] = chars[rnd[i] % len]
  };

  return value.join('');
}

// function to send a message to a group chat
function sendChat(server, message, room) {
  client[server.name].xmpp.send(new xmpp.Element('message', { to: room + '/' + server.nickname, type: 'groupchat' }).c('body').t(message));
}

// function to send a private message
function sendPM(server, message, user) {
  client[server.name].xmpp.send(new xmpp.Element('message', { to: user, type: 'chat' }).c('body').t(message));
}

// function to send Pushover notification
function sendPushover(user, title, message) {
  var pushover = require('node-pushover');
  var push = new pushover({token: config.poAppToken});
  push.send(user, title, message);
}

// function to send a reply message
function sendReply(server, room, sender, message) {
  if (room === 'pm') {
    sendPM(server, message, sender);
  } else {
    sendChat(server, message, room);
  }
}

// function to send SMS notification
function sendSMS(phone, message) {
  var url = "http://textbelt.com/text?number=" + phone + "&message=" + message;
  var req = {
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url: 'http://textbelt.com/text',
    body: 'number=' + phone + '&message=' + message
  };
  request.post(req, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (! JSON.parse(body).success) {
        util.log("[ERROR] Error sending SMS: " + JSON.parse(body).message);
      }
    }
  });
}

// function to send AWS SNS notification
function sendSNS(arn, message, subject) {
  var AWS = require('aws-sdk');
  AWS.config.region = 'us-east-1';
  var sns = new AWS.SNS();

  var params = {
    Message: message,
    Subject: subject,
    TopicArn: arn
  };

  sns.publish(params, function(err, data) {
    if (err) util.log("[ERROR] Error sending SNS: " + err);
  });
}

// function to send a server notification to Alpha players
function sendToAlpha(message) {
  config.poAlphaNotices.forEach(function(poID) {
    sendPushover(poID, "[CU]", message);
  });
  config.snsAlphaNotices.forEach(function(arn) {
    sendSNS(arn, message, message);
  });
}

// function to send a server notification to Beta1 players
function sendToBeta1(message) {
  config.poBeta1Notices.forEach(function(poID) {
    sendPushover(poID, "[CU]", message);
  });
  config.snsBeta1Notices.forEach(function(arn) {
    sendSNS(arn, message, message);
  });
}

// function to send a server notification to Beta2 players
function sendToBeta2(message) {
  config.poBeta2Notices.forEach(function(poID) {
    sendPushover(poID, "[CU]", message);
  });
  config.snsBeta2Notices.forEach(function(arn) {
    sendSNS(arn, message, message);
  });
}

// function to send a server notification to Beta3 players
function sendToBeta3(message) {
  config.poBeta3Notices.forEach(function(poID) {
    sendPushover(poID, "[CU]", message);
  });
  config.snsBeta3Notices.forEach(function(arn) {
    sendSNS(arn, message, message);
  });
}

// function to send a server notification to IT players
function sendToIT(message) {
  config.poITNotices.forEach(function(poID) {
    sendPushover(poID, "[CU]", message);
  });
  config.snsITNotices.forEach(function(arn) {
    sendSNS(arn, message, message);
  });
}

// function to add message to chat log and expire old messages
function updateChatlog(server, room, message) {
  var curISODate = new Date().toISOString();
  server.chatlog[room].push(message);

  // Remove expired messages
  for (var roomName in server.chatlog) {
    for (var i = 0; i < server.chatlog[roomName].length; i++) {
      if (moment(curISODate).diff(server.chatlog[roomName][i].timestamp, "hours") > config.chatlogLimit) {
        server.chatlog[roomName].splice(i, 1);
        i--;
      }
    }
  }

  fs.writeFile(server.chatlogFile, JSON.stringify(server.chatlog), function(err) {
    if (err) {
      util.log("[ERROR] Unable to write chatlog file (" + server.name + ").");
    }
  });
}


// Timer to verify client is still connected
var timerConnected = function(server) { return setInterval(function() { checkLastStanza(server); }, 1000); };
function checkLastStanza(server) {
  var epochTime = Math.floor((new Date).getTime() / 1000);
  if (epochTime - server.lastStanza > 65) {
    util.log("[ERROR] No stanza for 65 seconds on " + server.name + ". Reconnecting...");
    server.lastStanza = epochTime;
    restartClient(server);
  }
}

// Timer to monitor GitHub and announce updates
var timerGitHub = function(server) { return setInterval(function() { checkGitHub(server); }, 30000); };
function checkGitHub(server) {
  var curISODate = new Date().toISOString();
  var newIssueData = false;
  var newPRData = false;
  var tempLastIssue = githubData.lastIssue;
  var tempLastPR = githubData.lastPR;

  // Poll for all events
  githubAllEvents().then(function(events) {
    events.reverse();
    for (var i = 0; i < events.length; i++) {
      var event = events[i];

      // Skip event if the user is ignored
      var ignoredEvent = false;
      config.githubIgnores.forEach(function(igUser) {
        if (igUser === event.actor.login) ignoredEvent = true;
      });
      if (! ignoredEvent) {
        // Handle Issue Events
        if (event.type === 'IssuesEvent') {
          var diff = moment(event.payload.issue.updated_at).diff(githubData.lastIssue);
          if (diff > 0) {
            // Save new issue date
            if (moment(event.payload.issue.updated_at).diff(tempLastIssue) > 0) tempLastIssue = event.payload.issue.updated_at;
            newIssueData = true;

            // Announce new information to chat room
            if (event.payload.issue.created_at !== event.payload.issue.updated_at) {
              if (event.payload.action === 'closed') {
                var chatMessage = "An existing issue for '" + event.repo.name + "' has been closed by " + event.actor.login + ":" +
                "\n" + event.payload.issue.html_url;
              } else {
                var chatMessage = "An existing issue for '" + event.repo.name + "' has been updated by " + event.actor.login + ":" +
                "\n" + event.payload.issue.html_url;
              }
            } else {
              var chatMessage = "A new issue for '" + event.repo.name + "' has been opened by " + event.actor.login + ":" +
              "\n" + event.payload.issue.html_url;
            }
            server.rooms.forEach(function(room) {
              if (room.announce && githubData.lastIssue !== '2007-10-01T00:00:00.000Z') sendChat(server, chatMessage, room.name + "@" + server.service + "." + server.address);
            });
          }
        }

        if (event.type === 'PullRequestEvent') {
          var diff = moment(event.payload.pull_request.updated_at).diff(githubData.lastPR);
          if (diff > 0) {
            // Save new PR date
            if (moment(event.payload.pull_request.updated_at).diff(tempLastPR) > 0) tempLastPR = event.payload.pull_request.updated_at;
            newPRData = true;

            // Announce new information to chat room
            if (event.payload.pull_request.created_at !== event.payload.pull_request.updated_at) {
              if (event.payload.action === 'closed') {
                var chatMessage = "An existing pull request for '" + event.repo.name + "' has been closed by " + event.actor.login + ":" +
                "\n" + event.payload.pull_request.html_url;
              } else {
                var chatMessage = "An existing pull request for '" + event.repo.name + "' has been updated by " + event.actor.login + ":" +
                "\n" + event.payload.pull_request.html_url;
              }
            } else {
              var chatMessage = "A new pull request for '" + event.repo.name + "' has been opened by " + event.actor.login + ":" +
              "\n" + event.payload.pull_request.html_url;
            }
            server.rooms.forEach(function(room) {
              if (room.announce && githubData.lastPR !== '2007-10-01T00:00:00.000Z') sendChat(server, chatMessage, room.name + "@" + server.service + "." + server.address);
            });
          }
        }

        if (event.type === 'IssueCommentEvent') {
          if (event.payload.issue.pull_request) {
            // Comment is for a pull request
            var diff = moment(event.payload.issue.updated_at).diff(githubData.lastPR);
            if (diff > 0) {
              // Save new PR date
              if (moment(event.payload.issue.updated_at).diff(tempLastPR) > 0) tempLastPR = event.payload.issue.updated_at;
              newPRData = true;

              // Announce new information to chat room
              if (event.payload.issue.created_at !== event.payload.issue.updated_at) {
                var chatMessage = "An existing pull request for '" + event.repo.name + "' has been commented on by " + event.actor.login + ":" +
                "\n" + event.payload.issue.html_url;
              } else {
                var chatMessage = "A new pull request for '" + event.repo.name + "' has been commented on by " + event.actor.login + ":" +
                "\n" + event.payload.issue.html_url;
              }
              server.rooms.forEach(function(room) {
                if (room.announce && githubData.lastPR !== '2007-10-01T00:00:00.000Z') sendChat(server, chatMessage, room.name + "@" + server.service + "." + server.address);
              });
            }
          } else {
            // Comment is for an issue
            var diff = moment(event.payload.issue.updated_at).diff(githubData.lastIssue);
            if (diff > 0) {
              // Save new issue date
              if (moment(event.payload.issue.updated_at).diff(tempLastIssue) > 0) tempLastIssue = event.payload.issue.updated_at;
              newIssueData = true;

              // Announce new information to chat room
              if (event.payload.issue.created_at !== event.payload.issue.updated_at) {
                var chatMessage = "An existing issue for '" + event.repo.name + "' has been commented on by " + event.actor.login + ":" +
                "\n" + event.payload.issue.html_url;
              } else {
                var chatMessage = "A new issue for '" + event.repo.name + "' has been commented on by " + event.actor.login + ":" +
                "\n" + event.payload.issue.html_url;
              }
              server.rooms.forEach(function(room) {
                if (room.announce && githubData.lastIssue !== '2007-10-01T00:00:00.000Z') sendChat(server, chatMessage, room.name + "@" + server.service + "." + server.address);
              });
            }
          }
        }
      }
    }
    if (newIssueData || newPRData) {
      githubData.lastIssue = tempLastIssue;
      githubData.lastPR = tempLastPR;
      fs.writeFile(config.githubFile, JSON.stringify(githubData), function(err) {
        if (err) {
          util.log("[ERROR] Unable to write GitHub data file.");
        }
        util.log("[STATUS] GitHub data file updated with new information.");
      });
    }
  });
}

// Timer to monitor GitHub and announce updates
var timerTrello = function(server) { return setInterval(function() { checkTrello(server); }, 30000); };
function checkTrello(server) {
  var curISODate = new Date().toISOString();
  var newActionData = false;
  var tempLastAction = trelloData.lastAction;

  // Poll for all actions
  trelloAllActions().then(function(actions) {
    actions.reverse();
    for (var i = 0; i < actions.length; i++) {
      var action = actions[i];

      // Handle Actions
      var diff = moment(action.date).diff(trelloData.lastAction);
      if (diff > 0) {
        // Save new issue date
        if (moment(action.date).diff(tempLastAction) > 0) tempLastAction = action.date;
        newActionData = true;
        var chatMessage = null;

        // Announce new information to chat room
        switch(action.type) {
          case 'createCard':
            chatMessage = action.memberCreator.username + " created the card '" + action.data.card.name + "' on the Trello board '" + action.data.board.name + "':" +
              "\nhttps://trello.com/c/" + action.data.card.shortLink;
            break;
          case 'updateCard':
            if (action.data.listAfter && action.data.listBefore) {
              // Card was moved.
              chatMessage = action.memberCreator.username + " moved the card '" + action.data.card.name + "' from '" + action.data.listBefore.name + "' to '" + action.data.listAfter.name + "' on the Trello board '" + action.data.board.name + "':" +
                "\nhttps://trello.com/c/" + action.data.card.shortLink;
            } else {
              // Card was modified.
              // chatMessage = action.memberCreator.username + " modified the card '" + action.data.card.name + "' on the Trello board '" + action.data.board.name + "':" +
              //   "\nhttps://trello.com/c/" + action.data.card.shortLink;
            }
            break;
          case 'addChecklistToCard':
          case 'removeChecklistFromCard':
          case 'addAttachmentToCard':
          case 'deleteAttachmentFromCard':
            chatMessage = action.memberCreator.username + " modified the card '" + action.data.card.name + "' on the Trello board '" + action.data.board.name + "':" +
              "\nhttps://trello.com/c/" + action.data.card.shortLink;
            break;
          case 'commentCard':
            chatMessage = action.memberCreator.username + " commented on the card '" + action.data.card.name + "' on the Trello board '" + action.data.board.name + "':" +
              "\nhttps://trello.com/c/" + action.data.card.shortLink;
            break;
          case 'addMemberToCard':
            chatMessage = action.member.username + " was added to the card '" + action.data.card.name + "' on the Trello board '" + action.data.board.name + "':" +
              "\nhttps://trello.com/c/" + action.data.card.shortLink;
            break;
          case 'removeMemberFromCard':
            chatMessage = action.member.username + " was removed from the card '" + action.data.card.name + "' on the Trello board '" + action.data.board.name + "':" +
              "\nhttps://trello.com/c/" + action.data.card.shortLink;
            break;
          case 'moveCardToBoard':
            chatMessage = action.memberCreator.username + " moved the card '" + action.data.card.name + "' from the board '" + action.data.boardSource.name + "' to '" + action.data.list.name + "' on the Trello board '" + action.data.board.name + "':" +
              "\nhttps://trello.com/c/" + action.data.card.shortLink;
            break;
        }
        server.rooms.forEach(function(room) {
          if (room.announce && trelloData.lastAction !== '2011-09-01T00:00:00.000Z' && chatMessage) sendChat(server, chatMessage, room.name + "@" + server.service + "." + server.address);
        });
      }
    }

    if (newActionData) {
      trelloData.lastAction = tempLastAction;
      fs.writeFile(config.trelloFile, JSON.stringify(trelloData), function(err) {
        if (err) {
          util.log("[ERROR] Unable to write Trello data file.");
        }
        util.log("[STATUS] Trello data file updated with new information.");
      });
    }
  });
}

// Timer to send MOTD messages to joining users.
var timerMOTD = function(server) { return setInterval(function() { sendMOTD(server); }, 500); };
function sendMOTD(server) {
  server.motdReceivers.forEach(function(receiver) {
    var epochTime = Math.floor((new Date).getTime() / 1000);
    if ((epochTime - receiver.joinTime > 2) && receiver.sendTime === 0) {
      // User joined 2 seconds ago, send the MOTD.
      receiver.sendTime = epochTime;
      var user = receiver.name + '@' + server.address;
      sendPM(server, server.motd.toString(), user);
      util.log("[MOTD] MOTD sent to user '" + receiver.name + "' on " + server.name + ".");
    } else if ((receiver.sendTime > 0) && (epochTime - receiver.sendTime > 300)) {
      // User was sent MOTD 5 minutes ago, remove from receiver list so they can get it again.
      for (var i = 0; i < server.motdReceivers.length; i++) {
        if (server.motdReceivers[i].name === receiver.name) {
          index = i;
          break;
        }
      }
      server.motdReceivers.splice(index, 1);
    }
  });
}

// function to start a new client for a particular server
function startClient(server) {
  // Verify internet connectivity or node-xmpp will barf
  checkInternet(server, function(isConnected) {
    if (! isConnected) {
      util.log("[ERROR] No network connectivity. Retrying in 2 seconds...");
      setTimeout(function() { startClient(server); }, 2000);
      return;
    } else {
      // Start to XMPP client
      client[server.name] = {
        xmpp: new xmpp.Client({
          jid: server.username + '/bot-' + random(6),
          password: server.password,
          reconnect: true
        })
      };

      // client[server.name].xmpp.connection.socket.setTimeout(0);
      // client[server.name].xmpp.connection.socket.setKeepAlive(true, 10000);

      // Handle client errors
      client[server.name].xmpp.on('error', function(err) {
        if (err.code === "EADDRNOTAVAIL" || err.code === "ENOTFOUND") {
          util.log("[ERROR] Unable to resolve the server's DNS address (" + server.name + ").");
        } else if (err.code === "ETIMEDOUT") {
          util.log("[ERROR] Connection timed out (" + server.name + ").")
        } else {
          util.log("[ERROR] Unknown " + err);
        }
      });

      // Handle disconnect
      client[server.name].xmpp.on('disconnect', function() {
        server.rooms.forEach(function(room) {
          room.joined = false;
        });
        util.log("[STATUS] Client disconnected from " + server.name + ". Reconnecting...");
      });

      // Once connected, set available presence and join rooms
      client[server.name].xmpp.on('online', function() {
        util.log("[STATUS] Client connected to " + server.name + ".");

        // Set ourselves as online
        client[server.name].xmpp.send(new xmpp.Element('presence', { type: 'available' }).c('show').t('chat'));

        // Join rooms (and request no chat history)
        server.rooms.forEach(function(room) {
          var roomJID = room.name + '@' + server.service + '.' + server.address;
          client[server.name].xmpp.send(new xmpp.Element('presence', { to: roomJID + '/' + server.nickname }).
            c('x', { xmlns: 'http://jabber.org/protocol/muc' })
          );
          util.log("[STATUS] Client joined '" + room.name + "' on " + server.name + ".");

          // Chatlog initialization
          if (room.log) {
            if (! server.chatlog[room.name]) server.chatlog[room.name] = [];
          }
        });

        // Start sending MOTDs
        client[server.name].motdTimer = timerMOTD(server);

        // Start monitoring GitHub activity
        client[server.name].githubTimer = timerGitHub(server);

        // Start monitoring Trello activity
        client[server.name].githubTimer = timerTrello(server);

        // Start verifying client is still receiving stanzas
        server.lastStanza = Math.floor((new Date).getTime() / 1000);
        client[server.name].connTimer = timerConnected(server);

      });

      // Parse each stanza from the XMPP server
      client[server.name].xmpp.on('stanza', function(stanza) {

         // util.log('***** ' + stanza + ' *****');

        // Store time of last received stanza for checking connection status
        server.lastStanza = Math.floor((new Date).getTime() / 1000);

        // Always log error stanzas
        if (stanza.attrs.type === 'error') {
          util.log("[ERROR] " + stanza);
          return;
        }

        if (stanza.is('presence')) {
/*****************************************************************************/
// Handle channel joins/parts
/*****************************************************************************/
          if (stanza.getChild('x') !== undefined) {
            var status = stanza.getChild('x').getChild('status');
            var role = stanza.getChild('x').getChild('item').attrs.role;
            var sender = stanza.attrs.from;
            var senderName = stanza.attrs.from.split('/')[1];
            var room = stanza.attrs.from.split('@')[0];
            var roomIndex = indexOfRoom(server, room);

            if (server.rooms[roomIndex].joined && server.rooms[roomIndex].motd && role !== 'none') {
              // Check to see if user is already on list to receive the MOTD.
              var existingReceiver = false;
              server.motdReceivers.forEach(function(receiver) {
                if (receiver.name == senderName) existingReceiver = true;
              });

              // Check to see if user is on the ignore list.
              var ignoredReceiver = false;
              server.motdIgnore.forEach(function(receiver) {
                if (receiver == senderName) ignoredReceiver = true;
              });

              // If new user and not on ignore list, add to MOTD receiver list.
              if (! existingReceiver && ! ignoredReceiver) {
                server.motdReceivers.push({ name: senderName, joinTime: Math.floor((new Date).getTime() / 1000), sendTime: 0 });
              }
              util.log("[STATUS] User '" + senderName + "' joined '" + room + "' on " + server.name + ".");
            }

            // Status code 110 means initial nicklist on room join is complete
            if (status == "<status code=\"110\"/>") {
              server.rooms[roomIndex].joined = true;
            }
          }
        } else if (stanza.is('message') && stanza.attrs.type === 'groupchat') {
/*****************************************************************************/
// Handle group chat messages
/*****************************************************************************/
          var body = stanza.getChild('body');
          // message without body is probably a topic change
          if (! body) {
            return;
          }

          var curISODate = new Date().toISOString();
          var message = body.getText();
          var sender = stanza.attrs.from.split('/')[1];
          var senderName = sender.split('@')[0];
          var room = stanza.attrs.from.split('/')[0];
          var roomName = room.split('@')[0];
          if (stanza.getChild('cseflags')) {
            var cse = stanza.getChild('cseflags').attrs.cse;
          }
          var roomIsMonitored = server.rooms[indexOfRoom(server, roomName)].monitor;
          var roomIsLogged = server.rooms[indexOfRoom(server, roomName)].log;

          if (cse === "cse" || isMOTDAdmin(senderName)) {
            motdadmin = true;
          } else motdadmin = false;

          // Store message for logged rooms and clean up existing logs
          if (roomIsLogged) {
            var newLogMsg = {
              timestamp: curISODate,
              sender: senderName,
              message: message
            }
            updateChatlog(server, roomName, newLogMsg);
          }

          // If message matches a defined command, run it
          if (message[0] === commandChar) {
            var userCommand = message.split(' ')[0].split(commandChar)[1].toLowerCase();
            chatCommands.forEach(function(cmd) {
              if (userCommand === cmd.command.toLowerCase()) {
                cmd.exec(server, room, sender, message, {motdadmin: motdadmin});
              }
            });
          }
        } else if (stanza.is('message') && stanza.attrs.type === 'chat') {
/*****************************************************************************/
// Handle private messages
/*****************************************************************************/
          var body = stanza.getChild('body');
          // message without body is probably a topic change
          if (! body) {
            return;
          }

          var message = body.getText();
          var sender = stanza.attrs.from;
          var senderName = sender.split('@')[0];
          if (stanza.getChild('cseflags')) {
            var cse = stanza.getChild('cseflags').attrs.cse;
          }

          if (cse === "cse" || isMOTDAdmin(senderName)) {
            motdadmin = true;
          } else motdadmin = false;

          // If message matches a defined command, run it
          if (message[0] === commandChar && server.allowPMCommands) {
            var userCommand = message.split(' ')[0].split(commandChar)[1];
            chatCommands.forEach(function(cmd) {
              if (userCommand === cmd.command) {
                cmd.exec(server, 'pm', sender, message, {motdadmin: motdadmin});
              }
            });
          }
        } else {
/*****************************************************************************/
// Ignore everything else
/*****************************************************************************/
          return;
        }
      });
    }
  });
}

// function to stop a client for a particular server
function stopClient(server) {
  if (typeof client[server.name] !== 'undefined' && typeof client[server.name].xmpp !== 'undefined') {
    client[server.name].xmpp.connection.reconnect = false;
    // client[server.name].xmpp.removeAllListeners('error');
    client[server.name].xmpp.removeAllListeners('disconnect');
    client[server.name].xmpp.removeAllListeners('online');
    client[server.name].xmpp.removeAllListeners('stanza');
    client[server.name].xmpp.end();
    client[server.name].xmpp = undefined;
    server.rooms.forEach(function(room) {
      room.joined = false;
    });
    clearInterval(client[server.name].motdTimer);
    clearInterval(client[server.name].githubTimer);
    clearInterval(client[server.name].trelloTimer);
    clearInterval(client[server.name].connTimer);
    client[server.name] = undefined;
  }
}

// function to restart a client for a particular server
function restartClient(server) {
  stopClient(server);
  startClient(server);
}

// Initial startup
var memberData = [];
getMemberData();

var githubData = {};
getGitHubData();
var github = new githubAPI({
  version: "3.0.0",
  debug: false,
  protocol: "https",
  host: "api.github.com",
  timeout: 5000,
  headers: {
    "user-agent": "CU-SquadBot"
  }
});

var trelloData = {};
var trello = new trelloAPI(config.trelloAPIKey);
getTrelloData();

var client = [];
config.servers.forEach(function(server) {
  // Connect to REST API
  server.cuRest = new cuRestAPI(server.name);

  // Server initialization
  getChatlog(server);
  getMOTD(server);
  getMOTDIgnore(server);
  server.motdReceivers = [];

  // Start XMPP client
  startClient(server);
});