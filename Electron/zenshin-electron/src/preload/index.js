import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// const { exec } = require('child_process')

// Custom APIs for renderer
const api = {
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),
  oauth: (url) => ipcRenderer.send('oauth-login', url),
  openVlc: (url) => ipcRenderer.send('open-vlc', url),
  openAnimePahe: (url) => ipcRenderer.send('open-animepahe', url)
}

const deeplinks = {
  receiveDeeplink: (callback) =>
    ipcRenderer.on('deeplink-received', (event, link) => callback(link))
}

const combinedAPI = {
  ...electronAPI, // Include the toolkit API if needed
  ...deeplinks,
  ...api // Include your custom APIs
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', combinedAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
