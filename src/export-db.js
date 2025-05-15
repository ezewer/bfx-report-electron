'use strict'

const path = require('path')
const { dialog, BrowserWindow } = require('electron')
const i18next = require('i18next')

const { InvalidFilePathError } = require('./errors')
const { zip } = require('./archiver')
const showErrorModalDialog = require('./show-error-modal-dialog')
const showMessageModalDialog = require('./show-message-modal-dialog')
const {
  showLoadingWindow,
  hideLoadingWindow,
  setLoadingDescription
} = require('./window-creators/change-loading-win-visibility-state')
const wins = require('./window-creators/windows')
const WINDOW_NAMES = require('./window-creators/window.names')
const isMainWinAvailable = require('./helpers/is-main-win-available')
const {
  DEFAULT_ARCHIVE_DB_FILE_NAME,
  DB_FILE_NAME,
  DB_SHM_FILE_NAME,
  DB_WAL_FILE_NAME,
  SECRET_KEY_FILE_NAME
} = require('./const')

module.exports = ({
  pathToUserData,
  pathToUserDocuments
}) => {
  const _timestamp = (new Date()).toISOString().split('.')[0]
  const timestamp = _timestamp.replace(/[:]/g, '-')
  const defaultPath = path.join(
    pathToUserDocuments,
    `${DEFAULT_ARCHIVE_DB_FILE_NAME}-${timestamp}.zip`
  )
  const dbPath = path.join(pathToUserData, DB_FILE_NAME)
  const dbShmPath = path.join(pathToUserData, DB_SHM_FILE_NAME)
  const dbWalPath = path.join(pathToUserData, DB_WAL_FILE_NAME)
  const secretKeyPath = path.join(pathToUserData, SECRET_KEY_FILE_NAME)

  return async () => {
    const win = isMainWinAvailable(wins[WINDOW_NAMES.MAIN_WINDOW])
      ? wins[WINDOW_NAMES.MAIN_WINDOW]
      : BrowserWindow.getFocusedWindow()

    try {
      const {
        canceled,
        filePath
      } = await dialog.showSaveDialog(
        win,
        {
          title: i18next.t('exportDB.saveDialog.title'),
          defaultPath,
          buttonLabel: i18next
            .t('exportDB.saveDialog.buttonLabel'),
          filters: [{ name: 'ZIP', extensions: ['zip'] }]
        }
      )

      if (
        canceled ||
        !filePath
      ) {
        return
      }
      if (typeof filePath !== 'string') {
        throw new InvalidFilePathError()
      }

      await showLoadingWindow({
        windowName: WINDOW_NAMES.LOADING_WINDOW,
        description: i18next
          .t('exportDB.loadingWindow.description')
      })

      const progressHandler = async (args) => {
        const {
          progress,
          prettyArchiveSize
        } = args ?? {}

        const _description = i18next.t('exportDB.loadingWindow.description')
        const _archived = i18next.t(
          'exportDB.loadingWindow.archiveSize',
          { prettyArchiveSize }
        )

        const archived = prettyArchiveSize
          ? `<br><small>${_archived}</small>`
          : ''
        const description = `${_description}${archived}`

        await setLoadingDescription({
          windowName: WINDOW_NAMES.LOADING_WINDOW,
          progress,
          description
        })
      }

      await zip(filePath, [
        dbPath,
        dbShmPath,
        dbWalPath,
        secretKeyPath
      ], { progressHandler })
      await hideLoadingWindow({
        windowName: WINDOW_NAMES.LOADING_WINDOW
      })

      await showMessageModalDialog(win, {
        buttons: [
          i18next.t('common.confirmButtonText')
        ],
        defaultId: 0,
        title: i18next.t('exportDB.modalDialog.title'),
        message: i18next.t('exportDB.modalDialog.message')
      })
    } catch (err) {
      try {
        await hideLoadingWindow({
          windowName: WINDOW_NAMES.LOADING_WINDOW
        })
        await showErrorModalDialog(
          win,
          i18next.t('exportDB.modalDialog.title'),
          err
        )
      } catch (err) {
        console.error(err)
      }

      console.error(err)
    }
  }
}
