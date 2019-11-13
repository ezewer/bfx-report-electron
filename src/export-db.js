'use strict'

const path = require('path')
const electron = require('electron')

const { InvalidFilePathError } = require('./errors')
const { zip } = require('./archiver')
const showErrorModalDialog = require('./show-error-modal-dialog')
const showMessageModalDialog = require('./show-message-modal-dialog')
const {
  showLoadingWindow,
  hideLoadingWindow
} = require('./change-loading-win-visibility-state')

const DEFAULT_FILE_NAME = 'bfx-report-db-archive'

module.exports = ({ dbPath }) => {
  const dialog = electron.dialog || electron.remote.dialog
  const app = electron.app || electron.remote.app
  const timestamp = (new Date()).toISOString().split('.')[0]
  const defaultPath = path.join(
    app.getPath('documents'),
    `${DEFAULT_FILE_NAME}-${timestamp}`
  )

  return () => {
    const win = electron.BrowserWindow.getFocusedWindow()

    dialog.showSaveDialog(
      win,
      {
        title: 'ZIP file with DB',
        defaultPath,
        filters: [{ name: 'ZIP', extensions: ['zip'] }]
      },
      async (file) => {
        try {
          if (!file) {
            return
          }
          if (typeof file !== 'string') {
            throw new InvalidFilePathError()
          }

          await showLoadingWindow()
          await zip(file, dbPath)
          await hideLoadingWindow()

          await showMessageModalDialog(win, {
            buttons: ['OK'],
            defaultId: 0,
            title: 'Database export',
            message: 'Exported successfully'
          })
        } catch (err) {
          await hideLoadingWindow()
          await showErrorModalDialog(win, 'Database export', err)

          console.error(err)
        }
      }
    )
  }
}