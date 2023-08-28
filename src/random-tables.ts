import tableConfig from './static/config.json';

type StringListMap = {
  [key: string]: string[]
}

type TableConfig = {
  title: string,
  generators: StringListMap,
  categories: {[key: string]: StringListMap},
  tables: StringListMap
}

function loadCategories() {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireCategory = require.context('./static/table-categories/', true, /\.json$/);
  const categories: {[key: string]: StringListMap} = {};
  for (const file of requireCategory.keys()) {
    const category = requireCategory(file);
    categories[category.title] = category.tables;
  }
  return categories;
}

function loadTables(): TableConfig {
  const tables: StringListMap = {};
  const categories = loadCategories();
  for (const categoryTitle in categories) {
    for (const tableTitle in categories[categoryTitle]) {
      tables[`${categoryTitle}|${tableTitle}`] = categories[categoryTitle][tableTitle];
    }
  }
  return { ...tableConfig, categories, tables }
}

export function lookupTable(pattern: string) {
  const table = config.tables[pattern];
  return table ? table[Math.floor(Math.random()*table.length)] : JSON.stringify(Object.keys(config.tables)) // `<${pattern}>`;
}

export const config = loadTables();
