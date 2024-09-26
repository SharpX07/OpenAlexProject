import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from './App.tsx'
import { Other } from './InputSearcher.tsx'
import './index.css'


const root = ReactDOM.createRoot(document.getElementById('root')!)

const route = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <NotFoundPage/>
  },
  {
    path: '/input',
    element: <Other/>
  }
])

root.render(
  <StrictMode>
    <RouterProvider router={route} />
  </StrictMode>
)