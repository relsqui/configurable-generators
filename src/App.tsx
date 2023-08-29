import React, { useEffect, useState } from 'react';
import './App.css';
import { Generator } from './Generator';
import { tableConfig } from './tableConfig';


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
  return <header className="Generators">{
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

  return (
    <div className="App">
      <GeneratorHeader generators={generators} selectedGenerator={generator} setGenerator={setGenerator} />
      <Generator generator={generator} />
    </div>
  );
}

export default App;
