import React, { useEffect, useState } from 'react';
import './App.css';
import { Generator } from './Generator';
import { config } from './random-tables';


function GeneratorButton({ generator, selected, updateGenerator }: {generator: string, selected: boolean, updateGenerator: (generator: string) => void}) {
  const className = `generatorButton${selected ? ' selectedGenerator' : ''}`
  return (
    <button className={className} key={generator} onClick={() => updateGenerator(generator)}>{generator}</button>
  )
}

function App() {
  const [generator, setGenerator] = useState("");
  useEffect(() => {
    document.title = `${config.title} Generators`
  })
  const generators = Object.keys(config.generators);

  function updateGenerator(generator: string) {
    setGenerator(generator);
  }

  if (!generator) {
    updateGenerator(generators[0]);
  }

  return (
    <div className="App">
      <header className="Generators">{
        generators.map((g) =>
          <GeneratorButton generator={g} selected={g === generator} updateGenerator={updateGenerator} />
        )
      }</header>
      <Generator generator={generator} />
    </div>
  );
}

export default App;
