// 定义状态枚举
export enum FileStatus {
  Waiting = '等待转换',
  Converting = '转换中',
  Completed = '转换完成',
  Failed = '转换失败'
}

// 定义颜色枚举
export enum StatusColor {
  Pending = '#000000',
  Converting = '#4096ff',
  Completed = '#73d13d',
  Failed = '#ff4d4f'
}

// 创建状态到颜色的映射
const statusToColorMap: Record<FileStatus, StatusColor> = {
  [FileStatus.Waiting]: StatusColor.Pending,
  [FileStatus.Converting]: StatusColor.Converting,
  [FileStatus.Completed]: StatusColor.Completed,
  [FileStatus.Failed]: StatusColor.Failed
}

// 创建一个函数来获取状态对应的颜色
export function getColorForStatus(status: FileStatus): StatusColor {
  return statusToColorMap[status]
}

/**
 * 使用示例
 * const currentStatus: FileStatus = FileStatus.Converting
 * const statusColor: StatusColor = getColorForStatus(currentStatus)
 */
