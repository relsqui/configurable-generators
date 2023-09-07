import React, { useEffect, useState } from 'react';
import '../App.css';
import { TableConfig } from '../tableConfig';
import { Outlet } from 'react-router-dom';

const defaultConfig: TableConfig = {
  schemaVersion: "0.1.0",
  title: "Select Configuration",
  description: "What is this?",
  link: "https://github.com/relsqui/configurable-generators",
  generators: {},
  tables: {},
  isDefault: true
};

function Footer({ description, link }: { description: string | undefined, link: string | undefined }) {
  return <footer>
    <div className="configDescription">
      {description} {link ? <a href={link}>Link</a> : ''}
    </div>
    <div className="iconCredit">
      Icons by <a target="_blank" rel="noreferrer" href="https://icons8.com">Icons8</a>
    </div>
  </footer>;
}

function Root() {
  const configStorageLabel = 'generatorConfig';
  const { config: initialConfig, generator: initialGenerator } = storedConfigIfAvailable();
  const [config, ] = useState(initialConfig);
  const [generator, ] = useState(initialGenerator);

  useEffect(() => {
    document.title = `${config.title} | Configurable Generators`;
    if (!config.isDefault) {
      localStorage.setItem(configStorageLabel, JSON.stringify({ config, generator }));
    }
  }, [config, generator]);

  function storedConfigIfAvailable() {
    const returnConfig = { config: defaultConfig, generator: '' };
    const storedConfig = localStorage.getItem(configStorageLabel);
    if (storedConfig) {
      const { config: savedConfig, generator: savedGenerator } = JSON.parse(storedConfig);
      if (savedConfig) {
        returnConfig.config = savedConfig;
        returnConfig.generator = savedGenerator || savedConfig.generators[0];
      }
    }
    return returnConfig;
  }

  return (
    <div className="App">
      <Outlet />
      <Footer description={config.description} link={config.link} />
    </div>
  );
}

export default Root;
