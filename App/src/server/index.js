// @flow

import compression from 'compression'
import express from 'express'
import axios from 'axios'
import {APP_NAME, STATIC_PATH, WEB_PORT} from '../shared/config'
import {isProd} from '../shared/util'
import renderApp from './render-app'

const app = express()

/**
 * @name handleFail
 * @param err Error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function (err, code) {
	console.log("Error : ", err);
};

const KEYS = {
	CAPTCHA_SECRET: '6LdSmH8UAAAAAH7Gcm5hDTWD2dqLVR95WEVqoS75',
	AGORA_API_KEY: '4f1b6ead372f4e75bb25ba4ffa5d5beb',
	GOOGLE_CAPTCHA_URL: ' https://www.google.com/recaptcha/api/siteverify',
}

app.use(compression())
app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
	res.send(renderApp())
})

// app.post('/sendChannel', (req, res) => {
// 	var options = {
// 		url: KEYS.GOOGLE_CAPTCHA_URL,
// 		headers: {
// 			'content-type': 'application/x-www-form-urlencoded'
// 		},
// 		data: require('querystring').stringify({
//
// 		})
// 	};
// 	const data = {
// 		secret: KEYS.CAPTCHA_SECRET,
// 		response: req.headers.response
// 	}
//
// 	axios.post(KEYS.GOOGLE_CAPTCHA_URL, data)
// 		.then(res=> JSON.parse(res))
// 		.then(data=>{
// 			res.send(data.success)
// 		})
// 		.catch(err => console.log(err))
//
// })




app.listen(WEB_PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on port ${WEB_PORT} ${isProd ? '(production)' :
		'(development). Keep "yarn dev:wds" running in an other terminal'}.`)
})
