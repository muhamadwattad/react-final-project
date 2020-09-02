import firebase from 'firebase'; // 4.8.1

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDn8xQwMzQd3XSFeIK2s8zK3vZzavnoB1g",
        authDomain: "reactfinalproject-db423.firebaseapp.com",
        databaseURL: "https://reactfinalproject-db423.firebaseio.com",
        projectId: "reactfinalproject-db423",
        storageBucket: "reactfinalproject-db423.appspot.com",
        messagingSenderId: "451045405713",
        appId: "1:451045405713:web:2c5f9a7a9530ff4e0b6db0",
        measurementId: "G-MVGQ9GMLGR"
      });
    }
  };

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    // if (!user) {
    //   try {
    //     firebase.auth().signInAnonymously();
    //   } catch ({ message }) {
    //     alert(message);
    //   }
    // }
    firebase.auth().signInAnonymously();
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
 get getnewuid(){
     firebase.auth().signOut();
     firebase.auth().signInAnonymously();
     return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(1)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;
