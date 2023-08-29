import { useState } from "react";
import { TableConfig, StringListMap } from "./ConfigDropZone";

function GeneratorButton({ generator, selected, selectGenerator }: {
  generator: string,
  selected: boolean,
  selectGenerator: () => void
}) {
  const className = `generatorButton${selected ? ' selectedGenerator' : ''}`
  return (
    <button className={className} key={generator} onClick={selectGenerator}>{generator}</button>
  )
}

export function GeneratorHeader({ generators, selectedGenerator, setGenerator }: {
  generators: string[],
  selectedGenerator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>
}) {
  return <header>{
    generators.map((g) =>
      <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} selectGenerator={() => setGenerator(g)} />
    )
  }</header>
}

function RandomItem({ choices, fallback }: { choices: string[], fallback: string }) {
  const [randomItem, setRandomItem] = useState(chooseItem());

  function chooseItem() {
    return choices[Math.floor(Math.random() * choices.length)] || fallback;
  }

  function regenerate() {
    let newItem = randomItem;
    // if we choose the same one we just had, try again
    while (newItem === randomItem) {
      newItem = chooseItem();
    }
    setRandomItem(newItem);
  }

  return (
    <button onClick={choices ? regenerate : () => null} className="randomItem">{randomItem.toLowerCase()}</button>
  );
}

function GeneratorLine({ line, tables }: { line: string, tables: StringListMap }) {
  const re = /(<[^>]*>)/;
  const segments = line.split(re).map((segment, index) => {
    if (re.test(segment)) {
      const pattern = segment.slice(1, -1);
      return <RandomItem key={index} choices={tables[pattern] || []} fallback={segment} />
    }
    return segment;
  })
  return <p className="generatorLine">
    {segments}
  </p>
}

export function Generator({ generator, config }: { generator: string, config: TableConfig }) {
  return (
    <div>
      {config.generators[generator].map((line) => <GeneratorLine line={line} key={line} tables={config.tables} />)}
    </div>
  )
}
