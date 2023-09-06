import { useEffect, useState } from "react";
import md5 from 'md5';
import { TableConfig } from "./tableConfig";
import dieIcon from './static/icons/die.png';
import exitIcon from './static/icons/exit.png';
import { titleToSlug } from "./presets";
import { useHash } from "./useHash";

const pointyBracketsRe = /(<[^>]*>)/;

type Segment = { text: string, tableKey?: string };

type TableSelection = Segment & { tableKey: string };

type TextTree = {
  [key: string]: {
    [key: string]: Segment[]
  }
}

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

function RandomItem({ content, onClickRandomItem }: { content: TableSelection, onClickRandomItem: (tableKey: string) => void }) {
  return (
    <button className="randomItem" onClick={() => onClickRandomItem(content.tableKey)}>{content.text}</button>
  );
}

function GeneratorLine({ content, onClickRandomItem }: {
  content: Segment[],
  onClickRandomItem: (index: number, tableKey: string) => void
}
) {
  const selections = content.map((selection, index) => {
    if (selection.tableKey) {
      return <RandomItem key={index} content={selection as TableSelection} onClickRandomItem={(tableKey: string) => onClickRandomItem(index, tableKey)} />;
    }
    return <span key={index}>{selection.text}</span>;
  });
  return <p className="generatorLine">
    {selections}
  </p>;
}

function Generator({ content, onClickRandomItem }: {
  content: { [key: string]: Segment[] },
  onClickRandomItem: (line: string, index: number, tableKey: string) => void
}) {
  if (!content) return null;
  return (
    <div>
      {Object.keys(content).map((line) => <GeneratorLine key={line} content={content[line]} onClickRandomItem={(index: number, tableKey: string) => onClickRandomItem(line, index, tableKey)} />)}
    </div>
  );
}

function CloseButton({ closeButtonCallback }: { closeButtonCallback: () => void }) {
  return (
    <button className="closeButton" onClick={closeButtonCallback}>
      <img src={exitIcon} alt="Close" />
    </button>
  );
}

function RerollButton({ onReroll }: { onReroll: () => void }) {
  return (
    <button className='reroll' onClick={onReroll}>
      <img src={dieIcon} alt="Reroll" />
    </button>
  );
}

function arrayRand(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildTextTree(config: TableConfig, base:TextTree = {}, generator?: string) {
  const textTree: TextTree = {...base};
  for (const gen of generator ? [generator] : Object.keys(config.generators)) {
    textTree[gen] = {};
    for (const line of config.generators[gen]) {
      textTree[gen][line] = line.split(pointyBracketsRe).map((segment) => {
        if (pointyBracketsRe.test(segment)) {
          const tableKey = segment.slice(1, -1);
          // check for pins here, later
          return { text: arrayRand(config.tables[tableKey]) || segment, tableKey } as Segment;
        }
        return { text: segment } as Segment;
      });
    }
  }
  return textTree;
}

function getStorageLabel(config: TableConfig) {
  return `textTree/${md5(JSON.stringify(config))}`;
}

function storedTreeIfAvailable(config: TableConfig): TextTree {
  const storedTextTree = localStorage.getItem(getStorageLabel(config));
  if (storedTextTree) {
    return JSON.parse(storedTextTree);
  }
  return buildTextTree(config);
}

export function GeneratorLayout({ config, generator, setGenerator, closeButtonCallback }: {
  config: TableConfig,
  generator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>,
  closeButtonCallback: () => void
}) {
  const [textTree, setTextTree] = useState(storedTreeIfAvailable(config));
  const [, setHash] = useHash();

  useEffect(() => {
    const newTree = storedTreeIfAvailable(config);
    setTextTree(newTree);
  }, [config]);

  useEffect(() => {
    localStorage.setItem(getStorageLabel(config), JSON.stringify(textTree));
  }, [config, textTree]);

  useEffect(() => {
    setHash(titleToSlug(config.title));
  }, [config.title, setHash, generator, textTree]);

  function onClickRandomItem(generator: string, line: string, index: number, tableKey: string) {
    const newTextTree: TextTree = {...textTree};
    newTextTree[generator][line][index] = {text: arrayRand(config.tables[tableKey]), tableKey};
    setTextTree(newTextTree);
  }

  return (
    <>
      <header>
        <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} setGenerator={setGenerator} />
        <CloseButton closeButtonCallback={closeButtonCallback} />
      </header>
      <Generator content={textTree[generator]} onClickRandomItem={(line, index, tableKey) => onClickRandomItem(generator, line, index, tableKey)} />
      <RerollButton onReroll={() => setTextTree(buildTextTree(config, textTree, generator))} />
    </>
  );
}
