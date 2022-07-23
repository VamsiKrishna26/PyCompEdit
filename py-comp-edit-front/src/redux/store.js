import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./root-reducer";
import logger from 'redux-logger'

const middlewares = [thunk]
const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;