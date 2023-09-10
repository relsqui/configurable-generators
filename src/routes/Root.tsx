import '../App.css';
import { Outlet } from 'react-router-dom';
import { ConfigDropZone } from '../components/ConfigDropZone';

function Root() {
  return (
    <ConfigDropZone>
      <div className="App">
        <Outlet />
      </div>
    </ConfigDropZone>
  );
}

export default Root;
