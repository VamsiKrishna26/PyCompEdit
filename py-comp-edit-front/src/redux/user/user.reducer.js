import UserActionTypes from "./user.types";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isFetchingLogin: false,
    isFetching: false,
    successMessage: null,
    failureMessage: null
}

const UserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.FETCH_LOGIN_START:
            return {
                ...state,
                isFetchingLogin: true
            }
            case UserActionTypes.FETCH_LOGIN_SUCCESS:
                return {
                    ...state,
                    isFetchingLogin: false,
                        user: action.payload,
                        successMessage: 'Success',
                        failureMessage: null
                }
                case UserActionTypes.FETCH_LOGIN_FAILURE:
                    return {
                        ...state,
                        isFetchingLogin: false,
                            failureMessage: action.payload,
                            successMessage: null,
                            user: null
                    }
                    case UserActionTypes.LOGOUT:
                        return {
                            user: null,
                                isFetchingLogin: false,
                                isFetching: false,
                                successMessage: null,
                                failureMessage: null
                        }

                        case UserActionTypes.FETCH_REGISTER_START:
                            return {
                                ...state,
                                isFetching: true
                            }

                            case UserActionTypes.FETCH_REGISTER_SUCCESS:
                                return {
                                    ...state,
                                    isFetching: false,
                                        successMessage: action.payload,
                                        failureMessage: null,
                                        user: null
                                }
                                case UserActionTypes.FETCH_REGISTER_FAILURE:
                                    return {
                                        ...state,
                                        isFetching: false,
                                            failureMessage: action.payload,
                                            successMessage: null,
                                            user: null
                                    }
                                    case UserActionTypes.CLEAR_SUCCESS_FAILURE:
                                        return {
                                            ...state,
                                            successMessage: null,
                                                failureMessage: null
                                        }
                                        default:
                                            return {
                                                ...state,
                                            };
    }
}

export default UserReducer;