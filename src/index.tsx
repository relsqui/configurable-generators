import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Landing from './routes/Landing';
import { loader as localLoader } from './routes/Local';
import Editor, { loader as editorLoader } from './routes/Editor';
import { GeneratorLayout, loader as generatorLoader } from './routes/Generator';
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
        element: <GeneratorLayout />,
        loader: generatorLoader,
      },
      {
        path: "local/:slug",
        element: <GeneratorLayout />,
        loader: localLoader
      },
      {
        path: "edit/:slug?",
        element: <Editor />,
        loader: editorLoader
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
