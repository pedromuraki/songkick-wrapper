class SongkickWrapper {
  constructor(key) {
    this._APIKEY = key;
    /*
    this._APIKEY *
    this._data (defined after a request)
    this._requestUrl (defined after a request)
    */
  }

  // UPCOMING EVENTS
  getUpcomingEvents(options) {
    /*
    options: {
      from *
        artists, venues, metro_areas, users
      id *
        obs: for users, set username as id
      reason (required if from === user)
        tracked_artist, attendance
      optionalParams: {
        min_date
        max_date
        page
        per_page
        order
      }
      onloadstart
      onsuccess
      on404
    }
    */
    const reason = options.reason ? `reason=${options.reason}&` : '';
    this._makeRequest(`http://api.songkick.com/api/3.0/${options.from}/${options.id}/calendar.json?${reason}apikey=${this._APIKEY}${this._optionalParamsMarkup(options.optionalParams)}`, options);
  }

  // PAST EVENTS
  getPastEvents(options) {
    /*
    options: {
      from *
        artists, users
      id *
        obs: for users, set username as id
      optionalParams: {
        min_date
        max_date
        page
        per_page
        order
      }
      onloadstart
      onsuccess
      on404
    }
    */
    this._makeRequest(`http://api.songkick.com/api/3.0/${options.from}/${options.id}/gigography.json?apikey=${this._APIKEY}${this._optionalParamsMarkup(options.optionalParams)}`, options);
  }

  // DETAILS (FROM ARTISTS, EVENTS OR VENUES)
  getDetails(options) {
    /*
    options: {
      from *
        artists, events, venues
      id *
      onloadstart
      onsuccess
      on404
    }
    */
    this._makeRequest(`https://api.songkick.com/api/3.0/${options.from}/${options.id}.json?apikey=${this._APIKEY}`, options);
  }

  // USER TRACKINGS (OF METROS AREAS OR ARTISTS)
  getUserTrackings(options) {
    /*
    options: {
      username *
      trackingObject *
        metro_areas, artists
      optionalParams: {
        page
        per_page
        fields
        created_after
      }
      onloadstart
      onsuccess
      on404
    }
    */
    this._makeRequest(`https://api.songkick.com/api/3.0/users/${options.username}/${options.trackingObject}/tracked.json?apikey=${this._APIKEY}${this._optionalParamsMarkup(options.optionalParams)}`, options);
  }

  // USER MUTED ARTISTS
  getUserMutedArtists(options) {
    /*
    options: {
      username *
      optionalParams: {
        page
        per_page
        fields
        created_after
      }
      onloadstart
      onsuccess
      on404
    }
    */
    this._makeRequest(`https://api.songkick.com/api/3.0/users/${options.username}/artists/muted.json?apikey=${this._APIKEY}${this._optionalParamsMarkup(options.optionalParams)}`, options);
  }

  // IS USER TRACKING
  isUserTracking(options) {
    /*
    options: {
      username *
      trackingObject *
        metro_area, artist, event
      id *
      onloadstart
      onsuccess
      on404
    }
    */
    this._makeRequest(`https://api.songkick.com/api/3.0/users/${options.username}/trackings/${options.trackingObject}:${options.id}.json?apikey=${this._APIKEY}`, options);
  }


  // HELPERS
  _optionalParamsMarkup(optionalParams) {
    let optionalparamsMarkup = '';
    if (optionalParams)
      Object.entries(optionalParams).forEach(([key, value]) => optionalparamsMarkup += `&${key}=${value}`);
    return optionalparamsMarkup;
  }

  _makeRequest(url, options) {
    /*
    url *
    options: {
      onloadstart
      onsuccess
      on404
    }
    */
    /* make the request */
    const request = new XMLHttpRequest();
    request.open('GET', url);

    /* callbacks */
    if (options.onloadstart) request.onloadstart = () => options.onloadstart();

    request.onload = () => {
      const status = request.status;
      this._data = JSON.parse(request.responseText);
      this._requestUrl = url;

      if (status === 200 && options.onsuccess) options.onsuccess();
      if (status === 404) {
        console.log(`Error: ${this._data.resultsPage.error.message}`);
        if (options.on404) options.on404();
      }
    };

    /* send the request */
    request.send();
  }


  // GETTERS
  get data() {
    return this._data;
  }

  get requestUrl() {
    return this._requestUrl;
  }
}

export default SongkickWrapper;
