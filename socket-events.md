Socket events
======

* Client Emit
	* `authenticate_team`
		* `"token"`
	* `authenticate_storyteller`
		* `"token"`
		* Authenticates and sets handlers for user socket
	* `join_game`

		```
		{
			"id": 5
		}
		```
		* Team should only be able to join room once game is started (e.g. has representation in redis)
		* specify game id for storyteller
	* `start_game`

		```
		{
			"id": 5
		}
		```
		* Storyteller Only event
* Client Receive
	* `current_games`
		* `5`
		* Emits every time a game starts or ends and when team authenticates. Be sure to listen before authenticatin.
	* `info`

		```
		{
			"event": "event_name",
			"message": "human readable message",
			"didSucceed": true
		}
		```
		
		* emits info about an event
	* `game_info`
		* `WIP`
		* broadcasted to room whenever game state changes

	* `team_info`
		* `WIP`
		* emitted to socket when team model updates (team name, current devcaps, etc.)
