import { render, fireEvent, cleanup } from "@testing-library/react";
import Login from "./Login";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import UserActionTypes from "../../redux/user/user.types";

afterEach(cleanup);

const initialState = {
  user: null,
  isFetchingLogin: false,
  isFetching: false,
  successMessage: null,
  failureMessage: null,
};

function reducer(state = initialState,action) {
    switch (action.type) {
        case UserActionTypes.FETCH_LOGIN_START:
      return {
        ...state,
        isFetchingLogin: true,
      };
    case UserActionTypes.FETCH_LOGIN_SUCCESS:
      return {
        ...state,
        isFetchingLogin: false,
        user: action.payload,
        successMessage: "Success",
        failureMessage: null,
      };
    case UserActionTypes.FETCH_LOGIN_FAILURE:
      return {
        ...state,
        isFetchingLogin: false,
        failureMessage: action.payload,
        successMessage: null,
        user: null,
      };
    }
}

function renderWithRedux(component, { initialState, store = createStore(reducer, initialState) }={}) {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
  };
}

test("on initial render with redux", () => {
    // renderWithRedux(<Login/>)
});


