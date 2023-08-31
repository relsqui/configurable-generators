import { useState } from "react";
import { TableConfig, StringListMap } from "./tableConfig";
import die from './static/icons/die.png';

const pointyBracketsRe = /(<[^>]*>)/;

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

function RandomItem({ content }: { content: string }) {
  return (
    <button className="randomItem">{content.toLowerCase()}</button>
  );
}

function GeneratorLine({ content }: { content: string[] }) {
  const segments = content.map((segment, index) => {
    if (pointyBracketsRe.test(segment)) {
      return <RandomItem key={index} content={segment.slice(1, -1)} />
    }
    return <span key={index}>{segment}</span>;
  })
  return <p className="generatorLine">
    {segments}
  </p>
}

function Generator({ content }: { content: StringListMap }) {
  return (
    <div>
      {Object.keys(content).map((line) => <GeneratorLine key={line} content={content[line]} />)}
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
  const [textTree, setTextTree] = useState(buildTextTree());

  function tableChoice(tableKey: string) {
    const table = config.tables[tableKey];
    return table[Math.floor(Math.random() * table.length)]
  }

  function buildTextTree() {
    const textTree: { [key: string]: StringListMap } = {}
    for (const generator of Object.keys(config.generators)) {
      textTree[generator] = {};
      for (const line of config.generators[generator]) {
        textTree[generator][line] = line.split(pointyBracketsRe).map((segment, index) => {
          if (pointyBracketsRe.test(segment)) {
            const tableKey = segment.slice(1, -1);
            // check for pins here, later
            const generatedValue = tableChoice(tableKey) || segment;
            return `<${generatedValue}>`;
          }
          return segment;
        })
      }
    }
    return textTree;
  }

  function onClickRandomItem(generator: string, line: string, index: number, tableKey: string) {
    const newTextTree: { [key: string]: StringListMap } = {};
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
                newTextTree[generator][line].push(tableChoice(tableKey));
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
      <Generator content={textTree[generator]} />
      <RerollButton />
    </>
  );
}
