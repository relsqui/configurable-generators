import '../App.css';
import { Outlet } from 'react-router-dom';
import { PresetDropdown } from '../refactored/PresetDropdown';


function Header() {
  return <header className="navigation">
    <PresetDropdown />
    <button>Upload</button>
    <button>Create</button>
    <button>Download</button>
    <button>Preview/Edit</button>
  </header>
}

function Footer() {
  const description = "What is this?";
  const link = "https://github.com/relsqui/configurable-generators";
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
  // to do: get the footer data from the loaded config if applicable
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Root;
