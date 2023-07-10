/* eslint no-console: off */

import axios from 'axios';

export default class TogglTrack {
  authenticated = false;

  error = '';

  cookie = '';

  req = axios.create({
    baseURL: 'https://api.track.toggl.com/api/v9',
    timeout: 10000,
  });

  async startSession(apiKey: string) {
    // https://developers.track.toggl.com/docs/authentication
    // curl -u apiKey:api_token -X POST https://api.track.toggl.com/api/v9/me/sessions
    const url = '/me/sessions';
    const auth = {
      username: apiKey,
      password: 'api_token',
    };

    return this.req
      .post(url, {}, { auth })
      .then((res) => {
        // Set cookie
        const resCookies = res.headers['set-cookie'];
        if (!resCookies) {
          throw new Error('Toggl Track API did not return a cookie');
        }
        this.req.defaults.headers.Cookie = resCookies;
        this.authenticated = true;
        return true;
      })
      .catch((e) => {
        console.error(e);
        this.error = e;
        return false;
      });
  }

  async destroySession() {
    if (!this.authenticated) {
      return false;
    }

    // https://developers.track.toggl.com/docs/authentication#destroy-the-session
    // curl --cookie __Host-timer-session=session_cookie -X DELETE https://api.track.toggl.com/api/v9/me/sessions
    const url = '/me/sessions';
    return this.req
      .delete(url)
      .then(() => {
        this.authenticated = false;
        return true;
      })
      .catch(() => {
        throw new Error('Failed to destroy Toggl Track session');
      });
  }

  async getCurrentTimeEntry() {
    if (!this.authenticated) {
      return null;
    }

    // https://developers.track.toggl.com/docs/api/time_entries#get-get-current-time-entry
    // curl https://api.track.toggl.com/api/v9/me/time_entries/current -H "Content-Type: application/json"
    const url = '/me/time_entries/current';

    return this.req.get(url).then((res) => res.data);
  }
}
