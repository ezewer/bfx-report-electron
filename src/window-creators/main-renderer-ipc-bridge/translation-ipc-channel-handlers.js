'use strict'

const i18next = require('i18next')

const IpcChannelHandlers = require('./ipc.channel.handlers')
const { getConfigsKeeperByName } = require('../../configs-keeper')
const { getAvailableLanguages } = require('../../i18next')
const createMenu = require('../../create-menu')

class TranslationIpcChannelHandlers extends IpcChannelHandlers {
  constructor () {
    super('translations')

    this.configsKeeper = getConfigsKeeperByName('main')
  }

  async setLanguageHandler (event, args) {
    const lng = args?.language

    if (
      !lng ||
      typeof lng !== 'string'
    ) {
      return false
    }

    const prevLanguage = i18next.resolvedLanguage
    await i18next.changeLanguage(lng)
    const language = i18next.resolvedLanguage

    if (prevLanguage !== language) {
      createMenu()
    }

    const isSaved = await this.configsKeeper
      .saveConfigs({ language })

    if (isSaved) {
      return language
    }

    return false
  }

  async getLanguageHandler (event, args) {
    return i18next.resolvedLanguage
  }

  async getAvailableLanguagesHandler (event, args) {
    return getAvailableLanguages()
  }
}

module.exports = TranslationIpcChannelHandlers
