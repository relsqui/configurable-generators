import { useEffect, useState } from "react";
import { TableConfig, StringListMap } from "./tableConfig";
import die from './static/icons/die.png';

function GeneratorButton({ generator, selected, selectGenerator }: {
  generator: string,
  selected: boolean,
  selectGenerator: () => void
}) {
  const className = `generatorButton${selected ? ' selectedGenerator' : ''}`;
  return <button className={className} key={generator} onClick={selectGenerator}>{generator}</button>;
}

export function GeneratorHeader({ generators, selectedGenerator, setGenerator }: {
  generators: string[],
  selectedGenerator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>
}) {
  return <>{
    generators.map((g) =>
      <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} selectGenerator={() => setGenerator(g)} />
    )
  }</>;
}

function RandomItem({ choices, fallback, storageKey }: { choices: string[], fallback: string, storageKey: string }) {
  const [randomItem, setRandomItem] = useState(storedItemIfAvailable());

  useEffect(() => {
    localStorage.setItem(storageKey, randomItem);
  }, [storageKey, randomItem])

  function storedItemIfAvailable() {
    const storedItem = localStorage.getItem(storageKey);
    return storedItem || chooseItem();
  }

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

function GeneratorLine({ line, tables, storageKey }: { line: string, tables: StringListMap, storageKey: string }) {
  const re = /(<[^>]*>)/;
  const segments = line.split(re).map((segment, index) => {
    if (re.test(segment)) {
      const pattern = segment.slice(1, -1);
      return <RandomItem key={index} storageKey={`${storageKey}/${index}`} choices={tables[pattern] || []} fallback={segment} />
    }
    return <span key={index}>{segment}</span>;
  })
  return <p className="generatorLine">
    {segments}
  </p>
}

function Generator({ generator, config }: { generator: string, config: TableConfig }) {
  return (
    <div>
      {config.generators[generator].map((line) => <GeneratorLine line={line} key={line} storageKey={`${generator}/${line}`} tables={config.tables} />)}
    </div>
  )
}

function CloseButton({ closeButtonCallback }: { closeButtonCallback: () => void }) {
  return <button className="closeButton" onClick={closeButtonCallback}>X</button>
}

function RerollButton() {
  return <button className='reroll'><img src={die} alt="Reroll" /></button>
}

export function GeneratorLayout({ config, generator, setGenerator, closeButtonCallback }: {
  config: TableConfig,
  generator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>,
  closeButtonCallback: () => void
}) {
  return (
    <>
      <header>
        <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} setGenerator={setGenerator} />
        <CloseButton closeButtonCallback={closeButtonCallback} />
      </header>
      <Generator generator={generator} config={config} />
      <RerollButton />
    </>
  );
}
