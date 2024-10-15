'use strict'

const {
  getFreePort
} = require('./ports')
const {
  serializeError,
  deserializeError,
  rm,
  getServerPromise
} = require('./utils')
const isMainWinAvailable = require(
  './is-main-win-available'
)
const productName = require('./product-name')
const getAlertCustomClassObj = require('./get-alert-custom-class-obj')
const parseEnvValToBool = require('./parse-env-val-to-bool')
const isBfxApiStaging = require('./is-bfx-api-staging')
const waitPort = require('./wait-port')

module.exports = {
  getFreePort,
  serializeError,
  deserializeError,
  rm,
  getServerPromise,
  isMainWinAvailable,
  productName,
  getAlertCustomClassObj,
  parseEnvValToBool,
  isBfxApiStaging,
  waitPort
}
