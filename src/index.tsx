import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './routes/Root';
import Preset, { loader as presetLoader } from './routes/Preset';
import { loader as localLoader } from './routes/Local';
import Landing from './routes/Landing';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "p/:slug",
        element: <Preset />,
        loader: presetLoader,
      },
      {
        path: "local/:slug",
        element: <Preset />,
        loader: localLoader
      }
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
