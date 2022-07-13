import axios from "axios";
import UserActionTypes from "./user.types";
import configData from "../../config.json";

let PORT = configData.PORT;

export const fetchLoginStart = () => ({
    type: UserActionTypes.FETCH_LOGIN_START
})

export const fetchLoginSuccess = (user) => ({
    type: UserActionTypes.FETCH_LOGIN_SUCCESS,
    payload: user
})

export const fetchLoginFailure = (message) => ({
    type: UserActionTypes.FETCH_LOGIN_FAILURE,
    payload: message
})

export const fetchLogin = (form) => {
    return dispatch => {
        console.log(form);
        dispatch(fetchLoginStart());
        axios.post(PORT + '/login', form, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            dispatch(fetchLoginSuccess(response.data));
            localStorage.setItem('user', JSON.stringify(response.data));
        }).catch((error) => {
            console.log(error);
            try{
                dispatch(fetchLoginFailure(error.response.data.message))
            }
            catch{
                dispatch(fetchLoginFailure("The server is down. Please try again after some time."))
            };
        })
    }
}

export const logout_dispatch = () => ({
    type: UserActionTypes.LOGOUT
})

export const logout = () => {
    return dispatch => {
        localStorage.removeItem('user');
        dispatch(logout_dispatch());
    }
}

export const fetchRegisterStart = () => ({
    type: UserActionTypes.FETCH_REGISTER_START
})

export const fetchRegisterSuccess = (message) => ({
    type: UserActionTypes.FETCH_REGISTER_SUCCESS,
    payload: message
})

export const fetchRegisterFailure = (message) => ({
    type: UserActionTypes.FETCH_REGISTER_FAILURE,
    payload: message
})

export const fetchRegister = (form) => {
    return dispatch => {
        dispatch(fetchRegisterStart())
        axios.post(PORT + '/register', form,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => dispatch(fetchRegisterSuccess("Registration Successful. Please login now..")))
            .catch((error) => {
                try{
                    dispatch(fetchLoginFailure(error.response.data.message))
                }
                catch{
                    dispatch(fetchLoginFailure("The server is down. Please try again after some time."))
                };
            })
    }
}

export const clearSuccessFailure_dispatch=()=>({
    type:UserActionTypes.CLEAR_SUCCESS_FAILURE
})

export const clearSuccessFailure=()=>{
    return dispatch=>{
        dispatch(clearSuccessFailure_dispatch())
    }
}
