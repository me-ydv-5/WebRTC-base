// @flow

import { APP_CONTAINER_CLASS, STATIC_PATH, WDS_PORT } from '../shared/config'
import { isProd } from '../shared/util'

const renderApp = (title: string) =>
  `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="${STATIC_PATH}/css/styles.css">
    <link rel="stylesheet" href="${STATIC_PATH}/css/app.css">
    <link rel="stylesheet" href="${STATIC_PATH}/css/canvas.css">
    <link rel="stylesheet" href="${STATIC_PATH}/css/normalise.css">
    <link rel="stylesheet" href="${STATIC_PATH}/css/skeleton.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <script src="https://www.google.com/recaptcha/api.js"></script>
    <script src="${STATIC_PATH}/js/agora.js"></script>
  </head>
  <body>
    <div class="${APP_CONTAINER_CLASS}" id="root"></div>
    <script src="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/js/bundle.js"></script>
  </body>
</html>
`
export default renderApp
