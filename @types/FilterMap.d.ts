export interface FilterMap {
  [key: string]: FilterMapEntry
}

export interface FilterMapEntry {
  fields: string[],
  query?: (value) => any
  key?: (key, value) => string
}
