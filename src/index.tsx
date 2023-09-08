import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Landing from './routes/Landing';
import { loader as localLoader } from './routes/Local';
import Preset, { loader as presetLoader } from './routes/Preset';
import Editor, { loader as editLoader } from './routes/Editor';
import './index.css';

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
      },
      {
        path: "edit/:slug?",
        element: <Editor />,
        loader: editLoader
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
