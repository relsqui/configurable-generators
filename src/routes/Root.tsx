import '../App.css';
import { Outlet } from 'react-router-dom';

function Root() {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default Root;
