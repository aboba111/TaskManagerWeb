import React from 'react';
import '../App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {routes} from "./routes/routes";
import store from "../store";
import {Provider} from "react-redux";






function App() {
  const router = createBrowserRouter(routes);
  return (
    <div className="App">
        <Provider store={store}>
      <RouterProvider router={router} />
        </Provider>
    </div>
  );
}

export default App;
