import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App-new.jsx';
import {BrowserRouter as Router, Route} from "react-router-dom";
import LandingPage from "./components/LandingPage";

export function Rotues(){
	return (
		<Router>
			<div>
				<Route path={'/'} exact component={LandingPage}/>
				<Route path={'/app'} exact component={App}/>
			</div>
		</Router>
	)
}
