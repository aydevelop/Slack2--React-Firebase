import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
  apiKey: 'AIzaSyCCWm2lfgiSc9Vi_eqWMsnQ8Dnc7USl6Kc',
  authDomain: 'react-slack-32def.firebaseapp.com',
  databaseURL: 'https://react-slack-32def.firebaseio.com',
  projectId: 'react-slack-32def',
  storageBucket: 'react-slack-32def.appspot.com',
  messagingSenderId: '830613236192',
  appId: '1:830613236192:web:24f48ce963c7e1bc70e385',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
