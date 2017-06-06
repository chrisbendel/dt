import EventEmitter from 'react-native-eventemitter';
import { AsyncStorage } from 'react-native';
const base = 'https://api.dubtrack.fm/';

/******************/
/* USER API CALLS */
/******************/

export function logout() {
  return fetch(base + 'auth/logout').then(() => {
    AsyncStorage.removeItem('user').then(() => {
      EventEmitter.emit('logout');
    });
  });
}

export function login(username, password) {
  let login = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: ''
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  };

  return fetch(base + 'auth/dubtrack', login)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.code == 200) {
        return getUserInfo(username).then(user => {
          AsyncStorage.setItem('user', JSON.stringify(user)).then(() => {
            EventEmitter.emit('login', user);
          });
        });
      } else {
        AsyncStorage.removeItem('user').then(() => {
          if (res.data.details.message.message) {
            EventEmitter.emit('loginError', res.data.details.message.message);
          } else {
            EventEmitter.emit('loginError', res.data.details.message);
          }
        });
      }
    });
}

export function getUserInfo(user) {
  return fetch(base + 'user/' + user)
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function getUserAvatar(id) {
  return fetch(base + 'user/' + id + '/image').then(res => {
    return res.url;
  });
}

/******************/
/* LOBBY API CALLS */
/******************/

export function getLobby(room = null) {
  if (room) {
    return fetch('https://api.dubtrack.fm/room/term/' + room)
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    return fetch('https://api.dubtrack.fm/room')
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  }
}

/******************/
/* ROOM API CALLS */
/******************/

export function getRoomInfo(room) {
  return fetch(base + 'room/' + room)
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function getRoomUsers(room) {
  return fetch(base + 'room/' + room + '/users')
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function chat(message, room, realTimeChannel) {
  let obj = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: ''
    },
    body: JSON.stringify({
      message: message,
      realTimeChannel: realTimeChannel,
      time: Date.now(),
      type: 'chat-message'
    })
  };

  return fetch(base + 'chat/' + room, obj).catch(e => {
    console.log(e);
  });
}

export function joinRoom(id) {
  let obj = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: ''
    }
  };
  return fetch('https://api.dubtrack.fm/room/' + id + '/users', obj);
}

export function currentSong(id) {
  return fetch('https://api.dubtrack.fm/room/' + id + '/playlist/active')
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

/******************/
/* PRIVATE MESSAGE API CALLS */
/******************/

export function getMessages() {
  return fetch(base + 'message')
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function getConversation(id) {
  return fetch(base + 'message/' + id)
    .then(res => res.json())
    .then(json => {
      return json;
    })
    .catch(e => {
      console.log(e);
    });
}

export function markAsRead(id) {
  let obj = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: ''
    }
  };

  return fetch(base + 'message/' + id + '/read', obj);
}

export function newPM(usersid) {
  if (usersid.length > 10) {
    console.log('conversations are up to 10 people.');
    return;
  }

  let obj = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: ''
    },
    body: JSON.stringify({
      usersid: usersid
    })
  };

  return fetch(base + 'message', obj)
    .then(res => res.json())
    .then(json => {
      console.log('json inside pm.get()');
      console.log(json);
      return json;
    })
    .catch(e => {
      console.log(e);
    });
}

export function checkNew() {
  return fetch(base + 'message/new')
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function sendPM(id, message) {
  let obj = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: ''
    },
    body: JSON.stringify({
      message: message,
      time: Date.now()
    })
  };

  return fetch(base + 'message/' + id, obj)
    .then(res => res.json())
    .then(json => {
      return json;
    })
    .catch(e => {
      console.log(e);
    });
}
