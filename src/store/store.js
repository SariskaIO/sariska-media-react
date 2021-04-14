import { applyMiddleware, compose, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers/rootReducer";


const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(promiseMiddleware ,thunk),
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)

export default store;