import React, { useState } from 'react';
import './App.css';
import { Generator } from './Generator';
import { config } from './random-tables';


function App() {
  const generators = Object.keys(config.generators);
  const [generator, setGenerator] = useState(generators[0]);

  function updateGenerator(generator: string) {
    setGenerator(generator);
  }

  return (
    <div className="App">
      <div>{
        generators.map((g) =>
          <button className="generatorButton" id={g} key={g} onClick={() => updateGenerator(g)}>{g}</button>
        )
      }</div>
      <header className="App-content">
        <Generator generator={generator} />
      </header>
    </div>
  );
}

export default App;
