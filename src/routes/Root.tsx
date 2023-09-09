import '../App.css';
import { Outlet } from 'react-router-dom';
import { ConfigDropZone } from '../refactored/ConfigDropZone';

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
