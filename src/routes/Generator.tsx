import md5 from 'md5';
import { useEffect, useState } from "react";
import { TableConfig } from "../tableConfig";
import { ReactComponent as DieIcon } from '../static/icons/materialDie.svg';
import { ReactComponent as ExitIcon } from '../static/icons/materialExit.svg';
import { PresetDropdown } from '../components/PresetDropdown';
import { NavButton } from '../components/NavButton';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { presetsBySlug, titleToSlug } from '../presets';
import { matchSlug } from '../matchSlug';

const pointyBracketsRe = /(<[^>]*>)/;

type Segment = { text: string, tableKey?: string };

type TableSelection = Segment & { tableKey: string };

type TextTree = {
  // "generator": lines[segments[]]
  [key: string]: Segment[][]
}

export async function loader({ params }: any) {
  const config = presetsBySlug[params.slug] as TableConfig;
  if (!config) throw Error(`Slug ${params.slug} not found.`);
  return { config };
}

export function GeneratorButton({ generator, selected }: {
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
    <li>
      <button onClick={() => navigate("/")} className="icon">
        <ExitIcon className="icon" title="Exit" />
      </button>
    </li>
  </ul></nav>;
}

function RandomItem({ content, onClickRandomItem }: { content: TableSelection, onClickRandomItem: (tableKey: string) => void }) {
  return (
    <button className="randomItem" onClick={() => onClickRandomItem(content.tableKey)}>{content.text}</button>
  );
}

function GeneratorLine({ segments, onClickRandomItem }: {
  segments: Segment[],
  onClickRandomItem: (index: number, tableKey: string) => void
}
) {
  const renderedSegments = Array.from(segments.entries(), ([segmentIndex, segment]) => {
    if (segment.tableKey) {
      return <RandomItem key={segmentIndex} content={segment as TableSelection} onClickRandomItem={(tableKey: string) => onClickRandomItem(segmentIndex, tableKey)} />;
    }
    return <span key={segmentIndex}>{segment.text}</span>;
  });
  return <p className="generatorLine">
    {renderedSegments}
  </p>;
}

function tableChoice(table: string[]) {
  return table[Math.floor(Math.random() * table.length)];
}

function buildTextTree(config: TableConfig, base: TextTree = {}, generatorFilter: string[] = []) {
  const { generators, tables } = config;
  const newTree: TextTree = { ...base };
  for (const generator of (generatorFilter.length ? generatorFilter : Object.keys(generators))) {
    newTree[generator] = [];
    for (const [index, line] of generators[generator].entries()) {
      newTree[generator][index] = line.split(pointyBracketsRe).map((segment) => {
        if (pointyBracketsRe.test(segment)) {
          const tableKey = segment.slice(1, -1);
          // table might not exist yet if we're in the editor
          return { text: tables[tableKey] ? tableChoice(tables[tableKey]) : segment, tableKey } as Segment;
        }
        return { text: segment } as Segment;
      });
    }
  }
  return newTree;
}

function getStorageLabel(config: TableConfig) {
  return 'textTree/' + md5(JSON.stringify(config));
}

function storedTreeIfAvailable(config: TableConfig): TextTree {
  const textTreeStorageLabel = getStorageLabel(config);
  const storedTree = localStorage.getItem(textTreeStorageLabel);
  if (storedTree) {
    return JSON.parse(storedTree);
  }
  return buildTextTree(config);
}

export function Generator({ config, generator }: { config: TableConfig, generator: string }) {
  const textTreeStorageLabel = getStorageLabel(config);
  const [textTree, setTextTree] = useState(() => storedTreeIfAvailable(config));
  const [lastConfigHash, setLastConfigHash] = useState(() => md5(JSON.stringify(config)));

  useEffect(() => {
    localStorage.setItem(textTreeStorageLabel, JSON.stringify(textTree));
  }, [textTree, textTreeStorageLabel]);

  const configHash = md5(JSON.stringify(config));
  let segments = textTree[generator];
  if (configHash !== lastConfigHash) {
    const newTree = buildTextTree(config);
    setTextTree(newTree);
    setLastConfigHash(configHash);
    // update this synchronously so we can use it this render
    segments = newTree[generator];
  }

  function onClickRandomItem(generator: string, lineIndex: number, segmentIndex: number, tableKey: string) {
    if (!config.tables[tableKey]) return; // might not exist yet if we're in the editor
    const newTextTree: TextTree = { ...textTree };
    newTextTree[generator][lineIndex][segmentIndex] = { text: tableChoice(config.tables[tableKey]), tableKey };
    setTextTree(newTextTree);
  }

  return <>
    <div>
      {Array.from(segments.entries(), ([lineIndex, segments]) =>
        <GeneratorLine key={lineIndex} segments={segments} onClickRandomItem={(segmentIndex: number, tableKey: string) => onClickRandomItem(generator, lineIndex, segmentIndex, tableKey)} />
      )}
    </div>
    <button className='icon' onClick={() => setTextTree(buildTextTree(config, textTree, [generator]))}>
      <DieIcon className='icon reroll' title="Reroll" />
    </button>
  </>;
}

export function GeneratorLayout() {
  const { config } = useLoaderData() as { config: TableConfig };
  const generator = matchSlug(Object.keys(config.generators), Object.keys(config.generators)[0]);

  return <>
    <GeneratorHeader generators={Object.keys(config.generators)} selectedGenerator={generator} title={config.title} />
    <main className="generatorContent">
      <h1 className="invisible">{config.title}</h1>
      <Generator config={config} generator={generator} />
    </main>
    <footer>
      {config.description} {config.link ? <a href={config.link}>Link</a> : ''}
    </footer>
  </>;
}
