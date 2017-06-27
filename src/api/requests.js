import { AsyncStorage } from "react-native";
const base = "https://api.dubtrack.fm/";

/******************/
/* USER API CALLS */
/******************/

export function token() {
  return fetch(base + "auth/token", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      return json.data.token;
    });
}

export function session() {
  return fetch(base + "auth/session", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      return json;
    });
}

export function logout() {
  return fetch(base + "auth/logout", {
    method: "GET",
    credentials: "include"
  }).then(() => {
    AsyncStorage.removeItem("user");
  });
}

export function signup(email, username) {
  let signup = {
    method: "POST",
    credentials: "include",
    body: `email=${email}&username=${username}`,
    headers: {
      origin: "",
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  return fetch(base + "auth/signup", signup)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.code == 200) {
        console.log(res);
        console.log("check your email to verify account");
      } else {
        console.log(res);
        //handle username/email taken errors
      }
    });
}

export function login(username, password) {
  let login = {
    method: "POST",
    credentials: "include",
    body: `username=${username}&password=${password}`,
    headers: {
      origin: "",
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  return fetch(base + "auth/dubtrack", login)
    .then(res => res.json())
    .then(res => {
      if (res.code == 200) {
        return this.userInfo(username).then(user => {
          return AsyncStorage.setItem("user", JSON.stringify(user)).then(() => {
            return user;
          });
        });
      } else {
        return AsyncStorage.removeItem("user").then(() => {
          return res;
        });
      }
    });
}

// export function getUserInfo(user) {
userInfo = function(user) {
  return fetch(base + "user/" + user)
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
};

export function getUserInfo(user) {
  return fetch(base + "user/" + user)
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function getUserAvatar(id) {
  return fetch(base + "user/" + id + "/image", {
    credentials: "include"
  })
    .then(res => res.text())
    .then(text => {
      console.log(text);
    });
}

/******************/
/* LOBBY API CALLS */
/******************/

export function getLobby(room = null) {
  if (room) {
    return fetch("https://api.dubtrack.fm/room/term/" + room, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    return fetch("https://api.dubtrack.fm/room", { credentials: "include" })
      .then(res => res.json())
      .then(json => {
        return json.data;
      })
      .catch(e => {
        console.log(e);
      });
  }
}

/**********************/
/* PLAYLIST API CALLS */
/**********************/

export function playlists() {
  return fetch(base + "playlist", { method: "GET", credentials: "include" })
    .then(res => res.json())
    .then(json => {
      return json.data;
    });
}

export function playlist(id) {
  return fetch(base + "playlist/" + id, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      return json.data;
    });
}

/******************/
/* ROOM API CALLS */
/******************/

export function getRoomInfo(room) {
  return fetch(base + "room/" + room, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function getRoomUsers(room) {
  return fetch(base + "room/" + room + "/users", {
    method: "GET",
    credentials: "include"
  })
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
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: ""
    },
    body: JSON.stringify({
      message: message,
      realTimeChannel: realTimeChannel,
      time: Date.now(),
      type: "chat-message"
    })
  };

  return fetch(base + "chat/" + room, obj);
}

export function joinRoom(id) {
  let obj = {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: ""
    }
  };
  return fetch(base + "room/" + id + "/users", obj);
}

export function currentSong(id) {
  return fetch("https://api.dubtrack.fm/room/" + id + "/playlist/active", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      if (json.data.err) {
        return null;
      }
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
  return fetch(base + "message", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function getConversation(id) {
  return fetch(base + "message/" + id, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}

export function markAsRead(id) {
  let obj = {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: ""
    }
  };

  return fetch(base + "message/" + id + "/read", obj);
}

export function checkNew() {
  return fetch(base + "message/new", {
    credentials: "include"
  })
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
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: ""
    },
    body: JSON.stringify({
      message: message,
      time: Date.now()
    })
  };

  return fetch(base + "message/" + id, obj)
    .then(res => res.json())
    .then(json => {
      return json.data;
    })
    .catch(e => {
      console.log(e);
    });
}
