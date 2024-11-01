import { create } from 'zustand'
import { v4 as uuidV4 } from 'uuid'
import { FileStatus, StatusColor } from '@/lib/status-color'
import { OpenAIEnum } from '@/types/openai'

interface FileItem {
  id: string
  fullSource: string
  source: string
  fullTarget: string
  target: string
  status: FileStatus
  statusColor: StatusColor
  selected: boolean
}

export type TextOutputType = 'srt' | 'txt' | 'json'
export type AudioOutputType = 'mp3' | 'wav' | 'aac' | 'flac'
export type OutputType = TextOutputType | AudioOutputType
export const TEXT_OUTPUT_TYPES: TextOutputType[] = ['srt', 'txt', 'json']
export const AUDIO_OUTPUT_TYPES: AudioOutputType[] = ['mp3', 'wav', 'aac', 'flac']

interface FileState {
  files: FileItem[]
  outputType: OutputType
  addFiles: (newFiles: string[]) => void
  updateFileStatus: (id: string, status: FileItem['status']) => void
  toggleFileSelection: (id: string) => void
  toggleAllFilesSelection: (selected: boolean) => void
  setOutputType: (type: OutputType) => void
  convertSelectedFiles: () => Promise<void>
  clearFiles: () => void
  deleteFiles: () => void
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  outputType: AUDIO_OUTPUT_TYPES[0],
  addFiles: (newFiles) => set((state) => {
    const existingFiles = new Set(state.files.map(f => f.fullSource))
    const filesToAdd = newFiles.filter(f => !existingFiles.has(f)).map(f => ({
      id: uuidV4(),
      fullSource: f,
      source: f.split('\\').pop()!,
      fullTarget: f.replace(/\.[^/.]+$/, `.${state.outputType}`),
      target: f.replace(/\.[^/.]+$/, `.${state.outputType}`).split('\\').pop()!,
      status: FileStatus.Waiting,
      statusColor: StatusColor.Pending,
      selected: true
    }))
    return { files: [...state.files, ...filesToAdd] }
  }),
  setOutputType: (type) => set((state) => {
    return {
      files: state.files.map(f => {
        return { 
          ...f, 
          fullTarget: f.fullTarget.replace(/\.[^/.]+$/, `.${type}`),
          target: f.target.replace(/\.[^/.]+$/, `.${type}`),
        }
      }),
      outputType: type
    }
  }),
  updateFileStatus: (id, status) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, status } : f)
  })),
  toggleFileSelection: (id) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, selected: !f.selected } : f)
  })),
  toggleAllFilesSelection: (selected) => set((state) => ({
    files: state.files.map(f => ({ ...f, selected }))
  })),
  convertSelectedFiles: async () => {
    const { files, updateFileStatus } = get()
    const selectedFiles = files.filter(f => f.selected)

    for (const file of selectedFiles) {
      updateFileStatus(file.id, FileStatus.Converting)

      try {
        const apiKey = JSON.parse(localStorage.getItem(OpenAIEnum.API_KEY) || '')
        const baseURL = JSON.parse(localStorage.getItem(OpenAIEnum.BASE_URL) || '')
        await window.ipcRenderer.invoke('convert-file', file.fullSource, file.fullTarget, apiKey, baseURL)
        updateFileStatus(file.id, FileStatus.Completed)
      } catch (error) {
        console.error(`处理文件 ${file.source} 时发生错误:`, error)
        updateFileStatus(file.id, FileStatus.Failed)
      }
    }
  },
  clearFiles: () => set({ files: [] }),
  deleteFiles: () => set((state) => ({
    files: state.files.filter(f => !f.selected)
  }))
}))
