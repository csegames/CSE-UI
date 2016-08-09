# SquadBot
An XMPP Chat bot for the Camelot Unchained Mod Squad

### Command Syntax:
```
!assist               - Shows all Trello cards currently marked as needing assistance.

!chatlog <parameters> - Sends a private message containing all chat logs from the conference room. The
                        following parameters are available:
                           -h <number> = Specify the number of hours to include in displayed results
                           -m <number> = Specify the number of minutes to include in displayed results
                           -r <room> = Specify the chat room to include in displayed results
                           -u <user> = Specify the user name to include in displayed results
                           -t <text> = Specify the message text to include in displayed results (regular
                                       expressions allowed)
                           <number>H = Specify the number of hours to include in displayed results
                           <number>M = Specify the number of minutes to include in displayed results

!contribs             - Shows all contributors to any of the monitored GitHub groups.

!issues [filter]      - Shows all open issues for any of the repos owned by the monitored GitHub
                        organizations. If the [filter] parameter is supplied, results will be filtered.
                        The filter can be formatted as 'organization', 'repo', or 'organization/repo'.

!motd [message]       - Shows a Mod Squad Message Of The Day (MOTD). If user is an admin and [message]
                        is supplied, a new MOTD will be saved.

!motdon               - Subscribes user to MOTD notices when joining the room.

!motdoff              - Unsubscribes user from MOTD notices when joining the room.

!prs [filter]         - Shows all open pull requests for any of the repos owned by the monitored GitHub
                        organizations. If the [filter] parameter is supplied, results will be filtered.
                        The filter can be formatted as 'organization', 'repo', or 'organization/repo'.

!repos [org]          - Shows all repositories for the monitored GitHub organizations. If the [org]
                        parameter is supplied, only repositories for that organization will be shown.

!tips                 - Shows tips related to Mod Squad activities.

!useradd <CU user name> <GitHub user name> <Trello user name>
                      - Adds a user to the Mod Squad member list. All three parameters must be
                        supplied. If a GitHub or Trello user name is not available, enter 'none'.

!userdel <user>       - Deletes a user from the Mod Squad member list.

!usermod <parameters> - Modifies a user in the Mod Squad member list. The first parameter must be the
                        user name. The following additional parameters are available:
                           -g <name> = Specify a new GitHub user name
                           -t <name> = Specify a new Trello user name

!userlist             - Sends a private message containing the full Mod Squad member list.

!whois <name>         - Searches the Mod Squad member list for a particular user and display their
                        information.
```

### Current Features:
 * The bot will monitor the Mod Squad conference room for new joins. It will send a Mod Squad MOTD to those users. This is currently disabled.
 * The bot will monitor the GitHub API and automatically announce new or updated pull requests to the Mod Squad conference room.
 * The bot will monitor the GitHub API and automatically announce new or updated issues to the Mod Squad conference room.
 * The bot will monitor the Trello API and automatically announce new or updated cards.
