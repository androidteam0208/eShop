import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import 'bootstrap/dist/css/bootstrap.css';


import rootStore from "./Redux/Store";
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk'; //dùng cho ajax redux
const store = createStore(rootStore,applyMiddleware(thunk));

let app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

ReactDOM.render(app, document.getElementById("root"));
