import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import styled from "styled-components";
import Login from "./Login";
import Register from "./Register";
import { createStructuredSelector } from "reselect";
import {
  selectFailureMessage,
  selectIsFetching,
  selectIsFetchingLogin,
  selectSuccessMessage,
  selectUser,
} from "../../redux/user/user.selecter";
import {
  clearSuccessFailure,
  fetchLogin,
  fetchRegister,
  logout,
} from "../../redux/user/user.actions";
import { connect } from "react-redux";

const StyledModal = styled(Modal)`
  .close {
    background-color: red !important;
  }

  .button {
    background-color: green;
  }
`;

const StyledModalHeader = styled(Modal.Header)`
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
`;

const StyledModalTitle = styled(Modal.Title)`
  font-family: ${(props) => props.font} !important;
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
`;

const StyledModalBody = styled(Modal.Body)`
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};

  .nav-tabs {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .tab-content {
    background-color: white;
  }
`;

const StyledModalFooter = styled(Modal.Footer)`
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
`;

const StyledModalButton = styled(Button)``;

const StyledTabs = styled(Tabs)`
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white} !important;
  font-size: ${(props) => props.font_sizes.heading3} !important;

  .nav-link {
    text-decoration-color: none !important;
    color: ${(props) =>
      props.$darkThemeHome
        ? props.colors.white
        : props.colors.black} !important;
  }

  .nav-link.active {
    color: black !important;
  }
`;

const StyledTab = styled(Tab)``;

const NavbarDiv = styled.div`
  .navbar-div {
    min-height: 60px;
    background-color: ${(props) =>
      props.$darkThemeHome ? props.colors.dark : props.colors.theme};
    font-family: ${(props) => props.font} !important;
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.white};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5em;

    .navbar-item {
      margin: 0.5em;
      cursor: pointer;
      font-size: ${(props) => props.font_sizes.heading3};
    }
  }
`;

const LogRegModal = ({
  loginForm,
  setLoginForm,
  tabKey,
  setTabKey,
  onHide,
  registerForm,
  setRegisterForm,
  fetchLogin,
  fetchRegister,
  successMessage,
  ...props
}) => {
  return (
    <StyledModal {...props} onHide={onHide} centered>
      <StyledModalHeader {...props} closeButton>
        <StyledModalTitle {...props}>Login/Register</StyledModalTitle>
      </StyledModalHeader>
      <StyledModalBody {...props}>
        <LogRegTabs
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          {...props}
          tabKey={tabKey}
          setTabKey={setTabKey}
        />
      </StyledModalBody>
      <StyledModalFooter {...props}>
        <StyledModalButton className="button close" onClick={onHide}>
          Close
        </StyledModalButton>
        {tabKey !== "register" ? (
          <StyledModalButton
            className="button"
            {...props}
            disabled={
              loginForm.email === "" ||
              loginForm.password === "" ||
              loginForm.emailError !== "" ||
              loginForm.passwordError !== ""
            }
            onClick={() => fetchLogin(loginForm)}
          >
            Login
          </StyledModalButton>
        ) : (
          <StyledModalButton
            className="button"
            {...props}
            disabled={
              registerForm.email === "" ||
              registerForm.password === "" ||
              registerForm.dob === "" ||
              registerForm.name === "" ||
              registerForm.emailError !== "" ||
              registerForm.passwordError !== "" ||
              registerForm.dobError !== "" ||
              registerForm.nameError !== ""
            }
            onClick={async () => {
              await fetchRegister(registerForm);
            }}
          >
            Register
          </StyledModalButton>
        )}
      </StyledModalFooter>
    </StyledModal>
  );
};

const LogRegTabs = ({
  tabKey,
  setTabKey,
  loginForm,
  setLoginForm,
  $darkThemeHome,
  registerForm,
  setRegisterForm,
  ...props
}) => {
  return (
    <StyledTabs
      {...props}
      $darkThemeHome={$darkThemeHome}
      accessKey={tabKey}
      onSelect={(k) => setTabKey(k)}
      activeKey={tabKey}
    >
      <StyledTab eventKey="login" title="Login">
        <Login
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          $darkThemeHome={$darkThemeHome}
          {...props}
        />
      </StyledTab>
      <StyledTab eventKey="register" title="Register">
        <Register
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          $darkThemeHome={$darkThemeHome}
          {...props}
        />
      </StyledTab>
    </StyledTabs>
  );
};

const defaultLoginForm = {
  email: "",
  password: "",
  emailError: "",
  passwordError: "",
};

const defaultRegisterForm = {
  email: "",
  password: "",
  dob: null,
  name: "",
  emailError: "",
  passwordError: "",
  dobError: "",
  nameError: "",
};

const Navbar = (props) => {
  const [showLogReg, setShowLogReg] = useState(false);

  const [tabKey, setTabKey] = useState("login");

  const [loginForm, setLoginForm] = useState(defaultLoginForm);

  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);

  const {
    user,
    successMessage,
    failureMessage,
    isFetchingLogin,
    fetchLogin,
    isFetching,
    fetchRegister,
    clearSuccessFailure,
    logout
  } = props;

  // useEffect(() => {
  //   console.log(user, successMessage, failureMessage, isFetchingLogin);
  // }, [user, successMessage, failureMessage, isFetchingLogin]);

  useEffect(() => {
    if (tabKey === "register" && successMessage) {
      console.log(successMessage);
      if (successMessage) {
        setTimeout(() => {
          setTabKey("login")
        }, 5000);
      }
    }
  }, [successMessage]);

  useEffect(()=>{
    if(user) setShowLogReg(false);
  },[user])

  useEffect(() => {
    clearSuccessFailure();
    setLoginForm(defaultLoginForm);
    setRegisterForm(defaultRegisterForm);
  }, [tabKey]);

  // useEffect(() => {
  //   console.log(tabKey);
  // }, [tabKey]);

  return (
    <NavbarDiv {...props}>
      <div className="navbar-div">
        {!user ? (
          <span className="navbar-item" onClick={() => setShowLogReg(true)}>
            Login/Register
          </span>
        ) : null}
        {user ? (
          <span className="navbar-item">
            Welcome {user.name}
          </span>
        ) : null}
        {user ? (
          <span className="navbar-item" onClick={() => logout()}>
            Logout
          </span>
        ) : null}
        {!user? (
          <LogRegModal
            colors={props.colors}
            font_sizes={props.font_sizes}
            show={showLogReg ? 1 : 0}
            $darkThemeHome={props.$darkThemeHome}
            onHide={() => setShowLogReg(false)}
            tabKey={tabKey}
            setTabKey={setTabKey}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            fetchLogin={fetchLogin}
            fetchRegister={fetchRegister}
            successMessage={successMessage}
          />
        ) : null}
      </div>
    </NavbarDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  successMessage: selectSuccessMessage,
  failureMessage: selectFailureMessage,
  isFetchingLogin: selectIsFetchingLogin,
  isFetching: selectIsFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLogin: (state) => dispatch(fetchLogin(state)),
  fetchRegister: (state) => dispatch(fetchRegister(state)),
  clearSuccessFailure: () => dispatch(clearSuccessFailure()),
  logout:()=>dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
