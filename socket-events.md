# Socket Events
Documentation for real-time event emits via Socket.io

## Client Emits
Event Name | Event Data | Description
-- | -- | --
`authenticate_storyteller` | `"JWT_TOKEN"` | Authenticate a Storyteller.
`authenticate_team` | `"LINK_CODE"` | Authenticate a Team.
`start_game` | `{ "id": GAME_ID }` | Start a configured game the Storyteller has access to.
`join_game_room` | `GAME_ID` | Joins the Storyteller socket to the Game ID's room.
`next_round` | `GAME_ID` | Proceed to the next round of the Game, updating models accordingly. Storyteller only.
`update_games_list` | _None_ | Force update of redis cache with Storyteller's games from DB. Server emits `games_list` event with updated data.
`select_action` | `ACTION_ID` | Add an action to the pending actions list for the Team.
`deselect_action` | `ACTION_ID` | Remove an action from the pending actions list for the Team.
`update_rumor_queue` | `{ "game_id": GAME_ID, "rumor_queue": [RUMOR_ID, ...] }` | Client emits the entire collection any time the Storyteller updates the `RumorQueue`. Server should store this in redis.
`get_rumor_queue` | `GAME_ID` | Force the Server to emit the `RumorQueue`. Clients may use this if they lose connection / state.

## Server Emits
Event Name | Event Data | Description
-- | -- | --
`info` | `{ "event": "EVENT_NAME", "message": "HUMAN_READABLE_MESSAGE", "didSucceed": BOOLEAN }` | Emitted privately to the requesting socket after their request has been completed. Client may use this for debugging as well as to trigger additional events based on the value of `didSucceed`.
`game_info` | JSON representation of `Game` model with related `teams` and `storyteller` data... _See API docs_ | Broadcasted to the relevant Game room whenever game state changes and when a `Team` or `Storyteller` client joins. Clients should use this to manage their Game and Team state/views.
`selected_actions_update` | `{ TEAM_ID: [ACTION_ID, ...], ... }` | Used to maintain the state of Team selections during the Action Selection phase. All Clients should use this to maintain state/update their views as needed.
`rumor_queue` | `{ "game_id": GAME_ID, "rumor_queue": [RUMOR_ID, ...] }` | Server emits the `RumorQueue` anytime it is updated, or in response to the `get_rumor_queue` event.
