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
    try {
      // Configure axios instance with Basic Auth
      this.req.defaults.auth = {
        username: apiKey,
        password: 'api_token',
      };
      // TODO: Check /me, return error in UI if not authenticated
      this.authenticated = true;
      return true;
    } catch (e) {
      console.error(e);
      this.error = e as string;
      return false;
    }
  }

  static async destroySession() {
    // No need to destroy session since we're using Basic Auth
    return true;
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
