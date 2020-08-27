firebase.js need to put in a folder src:


import * as firebase from 'firebase/app'

import 'firebase/auth'

import 'firebase/database'

import 'firebase/storage'

var firebaseConfig = {

  apiKey: 'apiKey',
	
  authDomain: 'authDomain',
	
  databaseURL: 'databaseURL',
	
  projectId: 'projectId',
	
  storageBucket: 'storageBucket',
	
  messagingSenderId: 'messagingSenderId',
	
  appId: 'appId',
	
}


// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
