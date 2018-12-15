// @flow

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import {Rotues} from './app'
import { APP_CONTAINER_SELECTOR } from '../shared/config'

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR)

const wrapApp = AppComponent =>
  <AppContainer>
    <AppComponent />
  </AppContainer>

// flow-disable-next-line
ReactDOM.render(wrapApp(Rotues), rootEl)

// flow-disable-next-line
if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('./app', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./app').default
    // flow-disable-next-line
    ReactDOM.render(wrapApp(NextApp), rootEl)
  })
}
