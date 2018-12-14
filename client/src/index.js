import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App-new.jsx';
import * as serviceWorker from './serviceWorker';
import './assets/css/normalise.css'
import './assets/css/skeleton.css'
import {BrowserRouter as Router, Route} from "react-router-dom";
import LandingPage from "./components/LandingPage";

ReactDOM.render(
    <Router>
        <div>
            <Route path={'/'} exact component={LandingPage}/>
            <Route path={'/app'} exact component={App}/>
        </div>
    </Router>
    ,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
