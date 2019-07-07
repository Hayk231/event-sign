import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyChwpRV3NWFkC2r1IsVOrnOAYOyfvZPVhw",
    // authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://event-tick.firebaseio.com/",
    // storageBucket: "bucket.appspot.com"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
