export type FolderPermissionType = Record<
  string,
  {
    id: number
    path: string
  }[]
>

export type FolderMessageSSE = {
  folders: {
    name: string
    path: string
  }[]
}
export type FolderPermissionSSE = {
  name: string
  path: string
}[]
