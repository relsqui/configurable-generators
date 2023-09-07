import '../App.css';
import { Outlet } from 'react-router-dom';

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
      <Outlet />
      <Footer />
    </div>
  );
}

export default Root;
