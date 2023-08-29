import { useState } from "react";
import { lookupTable, tableConfig } from './ConfigDropZone';

export function RandomItem({ pattern }: { pattern: string }) {
  const [randomItem, setRandomItem] = useState(lookupTable(pattern));

  function regenerate() {
    let newItem = randomItem;
    while (newItem === randomItem) {
      newItem = lookupTable(pattern);
    }
    setRandomItem(newItem);
  }

  return (
    <button onClick={regenerate} className="randomItemButton">{randomItem.toLowerCase()}</button>
  );
}

function GeneratorLine({ line }: { line: string }) {
  const re = /(<[^>]*>)/;
  const segments = line.split(re).map((segment) => {
    if (re.test(segment)) {
      const pattern = segment.slice(1, -1);
      return <RandomItem pattern={pattern} />
    }
    return segment;
  })
  return <p className="generatorLine">
    {segments}
  </p>
}

export function Generator({ generator }: { generator: string }) {
  return (
    <p>
      {tableConfig.generators[generator].map((line) => <GeneratorLine line={line} key={line} />)}
    </p>
  )
}