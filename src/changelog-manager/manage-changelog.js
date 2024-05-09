'use strict'

const { compare } = require('compare-versions')

const {
  getConfigsKeeperByName
} = require('../configs-keeper')
const getDebugInfo = require('../helpers/get-debug-info')
const {
  ShowingChangelogError
} = require('../errors')

const showChangelog = require('./show-changelog')

module.exports = async () => {
  try {
    const { version } = getDebugInfo()
    const configsKeeper = getConfigsKeeperByName('main')
    const shownChangelogVer = await configsKeeper
      .getConfigByName('shownChangelogVer')

    if (compare(version, shownChangelogVer, '<=')) {
      return
    }

    const {
      error,
      isShown
    } = await showChangelog({ version })

    if (!isShown) {
      return
    }

    const isSaved = await configsKeeper
      .saveConfigs({ shownChangelogVer: version })

    if (
      isSaved &&
      !error
    ) {
      return
    }

    throw new ShowingChangelogError()
  } catch (err) {
    console.error(err)
  }
}
