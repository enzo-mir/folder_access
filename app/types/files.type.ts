export type FilesType = {
  name: string
  modified_at: Date | null
  size: number | null
  type: 'file' | 'folder'
}[]
