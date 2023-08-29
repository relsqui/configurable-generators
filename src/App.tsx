import React, { useEffect, useState } from 'react';
import './App.css';
import { Generator } from './Generator';
import { ConfigDropZone, tableConfig } from './ConfigDropZone';


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

function GeneratorHeader({ generators, selectedGenerator, setGenerator }: {
  generators: string[],
  selectedGenerator: string,
  setGenerator: React.Dispatch<React.SetStateAction<string>>
}) {
  return <header>{
    generators.map((g) =>
      <GeneratorButton generator={g} selected={g === selectedGenerator} selectGenerator={() => setGenerator(g)} />
    )
  }</header>
}

function App() {
  const generators = Object.keys(tableConfig.generators);
  const [generator, setGenerator] = useState(generators[0]);
  useEffect(() => {
    document.title = `${tableConfig.title} Generators`
  })
  const configIsEmpty = Object.keys(tableConfig.generators).length + Object.keys(tableConfig.tables).length === 0;

  return (
    <div className="App">
      <GeneratorHeader generators={generators} selectedGenerator={generator} setGenerator={setGenerator} />
      {
        configIsEmpty ?
        <ConfigDropZone /> :
        <Generator generator={generator} />
      }
      <footer><a target="_blank" rel="noreferrer" href="https://icons8.com/icon/dBZiqj6QUc4V/die">Die</a> icon by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a></footer>
    </div>
  );
}

export default App;
