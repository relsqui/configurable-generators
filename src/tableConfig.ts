export type StringListMap = {
  [key: string]: string[]
}

export type TableConfig = {
  title: string,
  description?: string,
  link?: string,
  schemaVersion: string,
  contentVersion?: string,
  generators: StringListMap,
  tables: StringListMap
  isDefault?: boolean
}
