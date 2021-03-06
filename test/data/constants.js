const BASE_URL = 'http://localhost:3000';

const API_USER_LOGIN_URL = '/api/user/login';
const API_USER_REGISTER_URL = '/api/user';
const API_USER_GET_USER_BY_ID = '/api/user';

const API_TEAM_GET_TEAM_BY_ID_URL = '/api/team/';
const API_TEAM_UPDATE_URL = '/api/team/';
const API_TEAM_GET_TEAMS_URL = '/api/team';
const API_TEAM_CREATE_URL = '/api/team';
const API_TEAM_LOGIN_URL = '/api/team/login/';

const API_GAME_GET_GAME_BY_ID_URL = '/api/game/';
const API_GAME_GET_GAMES_URL = '/api/game';

const API_ACTION_GET_ACTIONS_URL = '/api/action';
const API_ACTION_GET_ACTION_BY_ID_URL = '/api/action/';

const API_MITIGATION_GET_MITIGATIONS_URL = '/api/mitigation';
const API_MITIGATION_GET_MITIGATION_BY_ID_URL = '/api/mitigation/';

const SOCKET_URL = `${BASE_URL}/socket.io`;

// Milliseconds – How long each test should wait before checking response values.
const TIMEOUT = 100;

module.exports = {
  API_USER_LOGIN_URL,
  API_USER_REGISTER_URL,
  API_USER_GET_USER_BY_ID,
  API_TEAM_GET_TEAM_BY_ID_URL,
  API_TEAM_UPDATE_URL,
  API_TEAM_GET_TEAMS_URL,
  API_TEAM_CREATE_URL,
  API_TEAM_LOGIN_URL,
  API_GAME_GET_GAME_BY_ID_URL,
  API_GAME_GET_GAMES_URL,
  API_ACTION_GET_ACTIONS_URL,
  API_ACTION_GET_ACTION_BY_ID_URL,
  API_MITIGATION_GET_MITIGATIONS_URL,
  API_MITIGATION_GET_MITIGATION_BY_ID_URL,
  SOCKET_URL,
  TIMEOUT,
};
