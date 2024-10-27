import { Button } from '@/components/ui/button'
import { ArrowBigRight } from 'lucide-react'
import { useFileStore } from '@/hooks/file-store'

function Tools() {
  const { addFiles, convertSelectedFiles } = useFileStore()

  const updateAllFiles = async (paths: string[]) => {
    const allFiles = await window.ipcRenderer.invoke('get-files', paths)
    addFiles(allFiles)
  }

  const handleSelectFile = async () => {
    const filePaths = await window.ipcRenderer.invoke('select-file')
    updateAllFiles(filePaths)
  }

  const handleSelectFolder = async () => {
    const folderPaths = await window.ipcRenderer.invoke('select-folder')
    updateAllFiles(folderPaths)
  }
  return (
    <>
      <div className="flex items-center gap-2 mx-5 py-5 border-b-2 border-gray-700">
        <Button onClick={handleSelectFile}>添加文件</Button>
        <Button onClick={handleSelectFolder}>添加文件夹</Button>
        <ArrowBigRight className="flex-shrink-0" />
        <div className="text-sm whitespace-nowrap">选择转换规则</div>
        <ArrowBigRight className="flex-shrink-0"  />
        <Button onClick={convertSelectedFiles}>开始转换</Button>
      </div>
    </>
  )
}

export default Tools
