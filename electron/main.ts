import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import OpenAI from 'openai'
import { OpenAIEnum } from '../src/types/openai'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    // 隐藏工具栏
    autoHideMenuBar: true
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 选择文件
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    /**
     * openFile 打开文件
     * multiSelections 多选
     */
    properties: ['openFile', 'multiSelections']
  })
  return result.filePaths
})

// 选择文件夹
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.filePaths
})

// 获取所有文件
function getAllFiles(dir: string): string[] {
  const files = fs.readdirSync(dir)
  let allFiles: string[] = []
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      allFiles = allFiles.concat(getAllFiles(filePath))
    } else {
      allFiles.push(filePath)
    }
  })
  
  return allFiles
}

// 获取文件
ipcMain.handle('get-files', async (_, paths: string[]) => {
  let allFiles: string[] = []
  
  for (const path of paths) {
    if (fs.statSync(path).isDirectory()) {
      allFiles = allFiles.concat(getAllFiles(path))
    } else {
      allFiles.push(path)
    }
  }
  
  return allFiles
})

// 转换文件
ipcMain.handle('convert-file', async (_, inputPath, outputPath) => {
  console.log(inputPath, outputPath);
  // 判断inputPath是否为视频
  const isVideo = inputPath.endsWith('.mp4') || inputPath.endsWith('.avi') || inputPath.endsWith('.mov')
  const isAudio = inputPath.endsWith('.mp3') || inputPath.endsWith('.wav') || inputPath.endsWith('.m4a')
  console.log(isVideo, isAudio);
  if (isVideo) {
    // 将 视频 转换为 音频
    const FfmpegCommand  = require('fluent-ffmpeg')
    const ffmpeg = new FfmpegCommand()
    return new Promise((resolve, reject) => {
      ffmpeg.setFfmpegPath(require('ffmpeg-static'))
        .addInput(inputPath)
        .output(outputPath)
        .on('end', () => resolve('转换完成'))
        .on('error', (err: Error) => reject(err))
        .run()
    })
  } else if (isAudio) {
    // 将 音频 转换为 文字
    // const apiKey = 'sk-7DYgNAYx145IBacrEeCc630bF63c4138AbFf7b9bBa76F025'
    
    const apiKey = localStorage.getItem(OpenAIEnum.API_KEY)
    const baseURL = localStorage.getItem(OpenAIEnum.BASE_URL)
    const openai = new OpenAI({
      apiKey: apiKey ?? '',
      baseURL: baseURL,
      // baseURL: 'https://free.gpt.ge/v1'
    })
    return new Promise((resolve, reject) => {
      openai.audio.transcriptions.create({
        file: fs.createReadStream(inputPath),
        model: "whisper-1",
        response_format: outputPath.includes('.srt') ? 'srt' : 'text',
        language: 'zh'
      }).then(res => {
        console.log(res);
        fs.writeFileSync(outputPath, res)
        resolve('转换完成')
      }).catch(err => {
        console.log(err);
        reject(err)
      })
    })
  }
})

app.whenReady().then(() => createWindow())
