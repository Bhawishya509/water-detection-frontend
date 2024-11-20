import { render } from 'preact'
import App  from "./App.jsx"
import { store } from "./store_redux/store.js";
import { Provider } from "react-redux";
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
