import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isVideo(path: string) {
  return path.endsWith('.mp4') || path.endsWith('.avi') || path.endsWith('.mov')
}

export function isAudio(path: string) {
  return path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.m4a')
}
