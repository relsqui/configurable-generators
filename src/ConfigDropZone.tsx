type StringListMap = {
  [key: string]: string[]
}

export const tableConfig: {
  title: string,
  generators: StringListMap,
  tables: StringListMap
} = {
  title: "Default",
  generators: {},
  tables: {}
};

export function lookupTable(pattern: string) {
  const table = tableConfig.tables[pattern];
  return table ? table[Math.floor(Math.random() * table.length)] : `<${pattern}>`;
}

export function ConfigDropZone() {
  return <div className='ConfigDropZone'>Drop config file here.</div>;
}
