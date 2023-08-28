import tableConfig from './config.json';

type StringListMap = {
  [key: string]: string[]
}

type TableConfig = {
  title: string,
  generators: StringListMap,
  tables: StringListMap
}

export function lookupTable(pattern: string) {
  const table = config.tables[pattern];
  return table ? table[Math.floor(Math.random()*table.length)] : `<${pattern}>`;
}

export const config: TableConfig = tableConfig;
