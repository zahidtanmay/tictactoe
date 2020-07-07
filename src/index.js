import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from 'redux'
import app from './redux/reducers'
import TicTacToe from "./TicTacToe";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    app,
    composeWithDevTools()
)

console.log(store.getState())

const rootElement = document.getElementById("root");
ReactDOM.render(
    <Provider store={store}>
      <TicTacToe/>
    </Provider>,
    rootElement
);
