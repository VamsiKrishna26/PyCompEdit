import { createSelector } from "reselect";

const user=state=>state.user;

export const selectUser = createSelector(
    [user],
    user => user.user
)

export const selectSuccessMessage = createSelector(
    [user],
    user => user.successMessage
)

export const selectFailureMessage = createSelector(
    [user],
    user => user.failureMessage
)

export const selectIsFetchingLogin = createSelector(
    [user],
    user => user.isFetchingLogin
)

export const selectIsFetching = createSelector(
    [user],
    user => user.isFetching
)