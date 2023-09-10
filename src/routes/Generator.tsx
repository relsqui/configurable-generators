import md5 from 'md5';
import { useEffect, useState } from "react";
import { TableConfig } from "../tableConfig";
import dieIcon from '../static/icons/die.png';
import { PresetDropdown } from '../refactored/PresetDropdown';
import { NavButton } from '../refactored/NavButton';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { presetsBySlug, titleToSlug } from '../refactored/presets';

const pointyBracketsRe = /(<[^>]*>)/;

type Segment = { text: string, tableKey?: string };

type TableSelection = Segment & { tableKey: string };

type TextTree = {
  [key: string]: {
    [key: string]: Segment[]
  }
}

export const loader = async ({ params }: any) => {
  const config = presetsBySlug[params.slug] as TableConfig;
  if (!config) throw Error(`Slug ${params.slug} not found.`);
  return { config };
}

function GeneratorButton({ generator, selected }: {
  generator: string,
  selected: boolean,
}) {
  const navigate = useNavigate();
  const classNames = selected ? ['selectedTextButton'] : [];
  const buttonProps = {
    onClick: () => navigate(`#${titleToSlug(generator)}`)
  }
  return <NavButton classNames={classNames} key={generator} buttonProps={buttonProps}>{generator}</NavButton>;
}

export function GeneratorHeader({ generators, selectedGenerator, title }: {
  generators: string[],
  selectedGenerator: string,
  title: string
}) {
  const navigate = useNavigate();
  return <nav><ul className='navigation'>
    {generators.length < 2 ? '' : generators.map((g) => <GeneratorButton key={g} generator={g} selected={g === selectedGenerator} />)}
    <li className="pushRight"><PresetDropdown selected={title} /></li>&nbsp;
    <NavButton buttonProps={{ onClick: () => navigate("/") }}>Close</NavButton>
  </ul></nav>;
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
  return (
    <div>
      {Object.keys(content).map((line) => <GeneratorLine key={line} content={content[line]} onClickRandomItem={(index: number, tableKey: string) => onClickRandomItem(line, index, tableKey)} />)}
    </div>
  );
}

export function GeneratorLayout() {
  const { config } = useLoaderData() as { config: TableConfig };
  const textTreeStorageLabel = `textTree/${md5(JSON.stringify(config))}`;
  const [textTree, setTextTree] = useState(storedTreeIfAvailable());

  useEffect(() => {
    localStorage.setItem(textTreeStorageLabel, JSON.stringify(textTree));
  }, [textTree, textTreeStorageLabel]);

  let generator = Object.keys(config.generators)[0];
  if (window.location.hash) {
    for (const title of Object.keys(config.generators)) {
      if (window.location.hash === `#${titleToSlug(title)}`) {
        generator = title;
      }
    }
  }

  function storedTreeIfAvailable() {
    const storedConfig = localStorage.getItem(textTreeStorageLabel);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
    return buildTextTree();
  }

  function tableChoice(tableKey: string) {
    const table = config.tables[tableKey];
    return table[Math.floor(Math.random() * table.length)];
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
        });
      }
    }
    return textTree;
  }

  function onClickRandomItem(generator: string, line: string, index: number, tableKey: string) {
    const newTextTree: TextTree = {};
    Object.assign(newTextTree, textTree);
    newTextTree[generator][line][index] = { text: tableChoice(tableKey), tableKey };
    setTextTree(newTextTree);
  }

  return (
    <>
      <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} title={config.title} />
      <div className="generatorContent">
        <Generator content={textTree[generator]} onClickRandomItem={(line, index, tableKey) => onClickRandomItem(generator, line, index, tableKey)} />
        <button className='reroll' onClick={() => setTextTree(buildTextTree())}>
          <img src={dieIcon} alt="Reroll" />
        </button>
      </div>
      <footer>
        {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
      </footer>
    </>
  );
}
