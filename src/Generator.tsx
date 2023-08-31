import { useEffect, useState } from "react";
import md5 from 'md5';
import { TableConfig } from "./tableConfig";
import dieIcon from './static/icons/die.png';
import exitIcon from './static/icons/exit.png';

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
    <button className="randomItem" onClick={() => onClickRandomItem(content.tableKey)}>{content.text.toLowerCase()}</button>
  );
}

function GeneratorLine({ content, onClickRandomItem }: {
  content: Segment[],
  onClickRandomItem: (index: number, tableKey: string) => void
}
) {
  const selections = content.map((selection, index) => {
    if (selection.tableKey) {
      return <RandomItem key={index} content={selection as TableSelection} onClickRandomItem={(tableKey: string) => onClickRandomItem(index, tableKey)} />
    }
    return <span key={index}>{selection.text}</span>;
  })
  return <p className="generatorLine">
    {selections}
  </p>
}

function Generator({ content, onClickRandomItem }: {
  content: { [key: string]: Segment[] },
  onClickRandomItem: (line: string, index: number, tableKey: string) => void
}) {
  return (
    <div>
      {Object.keys(content).map((line) => <GeneratorLine key={line} content={content[line]} onClickRandomItem={(index: number, tableKey: string) => onClickRandomItem(line, index, tableKey)} />)}
    </div>
  )
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
  )
}
export function GeneratorLayout({ config, generator, setGenerator, closeButtonCallback }: {
  config: TableConfig,
  generator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>,
  closeButtonCallback: () => void
}) {
  const textTreeStorageLabel = `textTree/${md5(JSON.stringify(config))}`;
  const [textTree, setTextTree] = useState(storedTreeIfAvailable());

  useEffect(() => {
    localStorage.setItem(textTreeStorageLabel, JSON.stringify(textTree));
  }, [textTree, textTreeStorageLabel])

  function storedTreeIfAvailable() {
    const storedConfig = localStorage.getItem(textTreeStorageLabel);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
    return buildTextTree();
  }

  function tableChoice(tableKey: string) {
    const table = config.tables[tableKey];
    return table[Math.floor(Math.random() * table.length)]
  }

  function buildTextTree() {
    const textTree: TextTree = {};
    for (const generator of Object.keys(config.generators)) {
      textTree[generator] = {};
      for (const line of config.generators[generator]) {
        textTree[generator][line] = line.split(pointyBracketsRe).map((segment) => {
          if (pointyBracketsRe.test(segment)) {
            const tableKey = segment.slice(1, -1);
            // check for pins here, later
            return { text: tableChoice(tableKey) || segment, tableKey } as Segment;
          }
          return { text: segment } as Segment;
        })
      }
    }
    return textTree;
  }

  function onClickRandomItem(generator: string, line: string, index: number, tableKey: string) {
    const newTextTree: TextTree = {};
    for (const g of Object.keys(textTree)) {
      if (g !== generator) {
        newTextTree[g] = textTree[g];
      } else {
        newTextTree[generator] = {};
        for (const l of Object.keys(textTree[generator])) {
          if (l !== line) {
            newTextTree[generator][l] = textTree[generator][l];
          } else {
            newTextTree[generator][line] = [];
            for (let i = 0; i < textTree[generator][line].length; i++) {
              if (i !== index) {
                newTextTree[generator][line].push(textTree[generator][line][i])
              } else {
                newTextTree[generator][line].push({ text: tableChoice(tableKey), tableKey });
              }
            }
          }
        }
      }
    }
    setTextTree(newTextTree);
  }

  return (
    <>
      <header>
        <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} setGenerator={setGenerator} />
        <CloseButton closeButtonCallback={closeButtonCallback} />
      </header>
      <Generator content={textTree[generator]} onClickRandomItem={(line, index, tableKey) => onClickRandomItem(generator, line, index, tableKey)} />
      <RerollButton onReroll={() => setTextTree(buildTextTree())} />
    </>
  );
}
