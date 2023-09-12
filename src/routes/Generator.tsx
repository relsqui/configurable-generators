import md5 from 'md5';
import { useEffect, useState } from "react";
import { TableConfig } from "../tableConfig";
import dieIcon from '../static/icons/die.png';
import { PresetDropdown } from '../components/PresetDropdown';
import { NavButton } from '../components/NavButton';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { presetsBySlug, titleToSlug } from '../presets';
import { matchSlug } from '../matchSlug';

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

export function Generator({ config, generator, textTreeStorageLabel }: { config: TableConfig, generator: string, textTreeStorageLabel: string }) {
  const [lastStorageLabel, setLastStorageLabel] = useState(textTreeStorageLabel);
  const [textTree, setTextTree] = useState(storedTreeIfAvailable);
  const content = textTree[generator]

  useEffect(() => {
    localStorage.setItem(textTreeStorageLabel, JSON.stringify(textTree));
  }, [textTree, textTreeStorageLabel]);

  if (textTreeStorageLabel !== lastStorageLabel) {
    // new label = config hash has changed = config has changed
    // so don't trust text tree state, reinitialize it
    setTextTree(storedTreeIfAvailable());
    setLastStorageLabel(textTreeStorageLabel);
  }

  function storedTreeIfAvailable() {
    const storedTree = localStorage.getItem(textTreeStorageLabel);
    if (storedTree) {
      return JSON.parse(storedTree);
    }
    return buildTextTree();
  }

  function tableChoice(tableKey: string) {
    const table = config.tables[tableKey];
    return table[Math.floor(Math.random() * table.length)];
  }

  function buildTextTree(generators: string[] = Object.keys(config.generators), base: TextTree = {}) {
    const newTree: TextTree = { ...base };
    for (const generator of generators) {
      newTree[generator] = {};
      for (const line of config.generators[generator]) {
        newTree[generator][line] = line.split(pointyBracketsRe).map((segment) => {
          if (pointyBracketsRe.test(segment)) {
            const tableKey = segment.slice(1, -1);
            // check for pins here, later
            return { text: tableChoice(tableKey) || segment, tableKey } as Segment;
          }
          return { text: segment } as Segment;
        });
      }
    }
    return newTree;
  }

  function onClickRandomItem(generator: string, line: string, index: number, tableKey: string) {
    const newTextTree: TextTree = {};
    Object.assign(newTextTree, textTree);
    newTextTree[generator][line][index] = { text: tableChoice(tableKey), tableKey };
    setTextTree(newTextTree);
  }

  return (
    <div className="generatorContent">
      <div>
        {Object.keys(content).map((line) => <GeneratorLine key={line} content={content[line]} onClickRandomItem={(index: number, tableKey: string) => onClickRandomItem(generator, line, index, tableKey)} />)}
      </div>
      <button className='reroll' onClick={() => setTextTree(buildTextTree([generator], textTree))}>
        <img src={dieIcon} alt="Reroll" />
      </button>
    </div>
  );
}

export function GeneratorLayout() {
  const { config } = useLoaderData() as { config: TableConfig };
  const generator = matchSlug(Object.keys(config.generators), Object.keys(config.generators)[0]);
  const textTreeStorageLabel = `textTree/${md5(JSON.stringify(config))}`;

  return <>
    <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} title={config.title} />
    <Generator config={config} generator={generator} textTreeStorageLabel={textTreeStorageLabel} />
    <footer>
      {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
    </footer>
  </>;
}
