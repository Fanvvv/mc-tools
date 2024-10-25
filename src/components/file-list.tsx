import { useFileStore } from "@/hooks/file-store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getColorForStatus } from "@/lib/status-color"
function FileTable() {
  const { files, toggleFileSelection, toggleAllFilesSelection, clearFiles, deleteFiles } = useFileStore()

  return (
    <div className="mt-4 px-5">
      <div className="flex items-center justify-end gap-2 p-2">
        <Button variant="destructive" onClick={clearFiles}>清空列表</Button>
        <Button variant="destructive" onClick={deleteFiles}>删除</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={files.length > 0 && files.every(f => f.selected)}
                onCheckedChange={(checked) => toggleAllFilesSelection(!!checked)}
              />
            </TableHead>
            <TableHead>源文件</TableHead>
            <TableHead>目标文件</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <Checkbox
                  checked={file.selected}
                  onCheckedChange={() => toggleFileSelection(file.id)}
                />
              </TableCell>
              <TableCell>{file.source}</TableCell>
              <TableCell className="text-blue-500">{file.target}</TableCell>
              <TableCell>
                <Badge style={{ background: getColorForStatus(file.status) }}>{file.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default FileTable
