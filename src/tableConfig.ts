import tableConfigJson from './config.json';

type StringListMap = {
  [key: string]: string[]
}

export const tableConfig: {
  title: string,
  generators: StringListMap,
  tables: StringListMap
} = tableConfigJson;

export function lookupTable(pattern: string) {
  const table = tableConfig.tables[pattern];
  return table ? table[Math.floor(Math.random() * table.length)] : `<${pattern}>`;
}
