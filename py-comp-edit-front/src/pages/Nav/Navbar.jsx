import React, { useEffect, useState } from "react";
import { Button, Modal, Tab, Tabs, Offcanvas, Popover, OverlayTrigger } from "react-bootstrap";
import styled from "styled-components";
import Login from "./Login";
import Register from "./Register";
import { createStructuredSelector } from "reselect";
import { selectFailureMessage, selectIsFetching, selectIsFetchingLogin, selectSuccessMessage, selectUser } from "../../redux/user/user.selecter";
import { clearSuccessFailure, fetchLogin, fetchRegister, logout } from "../../redux/user/user.actions";
import { connect } from "react-redux";
import { FiSettings } from "react-icons/fi";
import "./Navbar.scss";
import { useNavigate } from "react-router";
import { BiMenu } from "react-icons/bi";
import { TwitterPicker } from "react-color";

const StyledModal = styled(Modal)`
  .close {
    background-color: red !important;
  }

  .button {
    background-color: green;
  }
`;

const StyledModalHeader = styled(Modal.Header)`
  border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
`;

const StyledModalTitle = styled(Modal.Title)`
  font-family: ${(props) => props.font} !important;
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)};
`;

const StyledModalBody = styled(Modal.Body)`
  border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
  font-family: ${(props) => props.font} !important;
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)};

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
  border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
`;

const StyledModalButton = styled(Button)``;

const StyledTabs = styled(Tabs)`
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)} !important;
  font-size: ${(props) => props.font_sizes.heading3} !important;

  .nav-link {
    text-decoration-color: none !important;
    color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)} !important;
  }

  .nav-link.active {
    color: black !important;
  }
`;

const StyledTab = styled(Tab)``;

const NavbarDiv = styled.div`
  .title-heading {
    font-family: 'Rock Salt', cursive;
    font-size: 25px;
    margin: 0.25em;
    cursor: pointer;
  }

  .navbar-div {
    min-height: 60px;
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.theme)};
    font-family: ${(props) => props.font} !important;
    color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.white)};
    padding: 0.5em;

    .navbar-div-div {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .navbar-item {
        margin: 0.5em;
        cursor: pointer;
        font-size: ${(props) => props.font_sizes.heading3};
      }
    }
  }

  .icon {
    font-size: larger;
    margin: 0.5em;
    cursor: pointer;
    transition: transform 0.5s ease-in-out;

    :hover {
      transform: rotate(360deg);
    }
  }

  @media only screen and (max-width: 768px) {
    .title-heading{
      font-size: 20px;
    }
  }
`;

const StyledOffcanvas = styled(Offcanvas)`
  max-height: 380px;
  max-width: 250px;
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.theme)};
  font-family: ${(props) => props.font} !important;
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.white)};
  .offcanvas-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    .navbar-item {
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
  showMessage,
  ...props
}) => {
  return (
    <StyledModal {...props} onHide={onHide} centered>
      <StyledModalHeader {...props} closeButton>
        <StyledModalTitle {...props}>Login/Register</StyledModalTitle>
      </StyledModalHeader>
      <StyledModalBody {...props}>
        {showMessage ? <p>Please login or register before you access the page</p> : null}
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
            disabled={loginForm.email === "" || loginForm.password === "" || loginForm.emailError !== "" || loginForm.passwordError !== ""}
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

const LogRegTabs = ({ tabKey, setTabKey, loginForm, setLoginForm, $darkThemeHome, registerForm, setRegisterForm, ...props }) => {
  return (
    <StyledTabs {...props} $darkThemeHome={$darkThemeHome} accessKey={tabKey} onSelect={(k) => setTabKey(k)} activeKey={tabKey}>
      <StyledTab eventKey="login" title="Login">
        <Login loginForm={loginForm} setLoginForm={setLoginForm} $darkThemeHome={$darkThemeHome} {...props} />
      </StyledTab>
      <StyledTab eventKey="register" title="Register">
        <Register registerForm={registerForm} setRegisterForm={setRegisterForm} $darkThemeHome={$darkThemeHome} {...props} />
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
  const { user, successMessage, fetchLogin, fetchRegister, clearSuccessFailure, hideNavbar, showModal, showMessage, logout, setDarkThemeHome, setThemeColor } =
    props;

  const [showLogReg, setShowLogReg] = useState(showModal);

  const [tabKey, setTabKey] = useState("login");

  const [loginForm, setLoginForm] = useState(JSON.parse(localStorage.getItem("login_form")) || defaultLoginForm);

  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);

  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();

  const closeSettings = () => {
    setShowSettings(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  // useEffect(() => {
  //   console.log(user, successMessage, failureMessage, isFetchingLogin);
  // }, [user, successMessage, failureMessage, isFetchingLogin]);

  useEffect(() => {
    if (tabKey === "register" && successMessage) {
      console.log(successMessage);
      if (successMessage) {
        setTimeout(() => {
          setTabKey("login");
        }, 5000);
      }
    }
  }, [successMessage]);

  useEffect(() => {
    if (user) setShowLogReg(false);
  }, [user]);

  useEffect(() => {
    clearSuccessFailure();
    setLoginForm(JSON.parse(localStorage.getItem("login_form")) || defaultLoginForm);
    setRegisterForm(defaultRegisterForm);
  }, [tabKey]);

  // useEffect(() => {
  //   console.log(tabKey);
  // }, [tabKey]);

  return (
    <NavbarDiv {...props}>
      {!hideNavbar ? (
        <div className="navbar-div">
          {window.screen.width >= 768 ? (
            <div className="navbar-div-div">
              <div className="title-heading" onClick={()=>navigate('/')}>PyCompEdit</div>
              <div>
                {!user ? (
                  <span className="navbar-item" onClick={() => setShowLogReg(true)}>
                    Login/Register
                  </span>
                ) : null}
                {user ? <span className="navbar-item">Welcome {user.name}</span> : null}
                <span className="navbar-item" onClick={() => navigate("/editor")}>
                  Editor
                </span>
                <span className="navbar-item" onClick={() => navigate("/discussions")}>
                  Discussions
                </span>
                {user ? (
                  <span className="navbar-item" onClick={() => navigate("/submissions")}>
                    Submissions
                  </span>
                ) : null}
                {user ? (
                  <span className="navbar-item" onClick={() => logout()}>
                    Logout
                  </span>
                ) : null}
                <FiSettings className="icon" onClick={openSettings} />
                <StyledOffcanvas
                  show={showSettings}
                  onHide={closeSettings}
                  colors={props.colors}
                  font_sizes={props.font_sizes}
                  $darkThemeHome={props.$darkThemeHome}
                  placement="end"
                >
                  <StyledOffcanvas.Header closeButton>
                    <StyledOffcanvas.Title>Settings</StyledOffcanvas.Title>
                  </StyledOffcanvas.Header>
                  <StyledOffcanvas.Body>
                    <div>
                      <label>Dark Mode:</label>
                      <label className="switch-wrap">
                        <input
                          checked={props.$darkThemeHome}
                          onChange={() => {
                            localStorage.setItem("dark_theme_home", JSON.stringify(!props.$darkThemeHome));
                            setDarkThemeHome(!props.$darkThemeHome);
                          }}
                          type="checkbox"
                        />
                        <div className="switch"></div>
                      </label>
                    </div>
                    <br />
                    {!props.$darkThemeHome ? (
                      <div>
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          overlay={
                            <Popover>
                              <TwitterPicker
                                colors={["#4b0082", "#800020", "#Ff4500", "#808000", "#355e3b", "#002147", "#A0522d", "#36454f"]}
                                color={props.themeColor}
                                onChange={(color) => {
                                  setThemeColor(color.hex);
                                }}
                              />
                            </Popover>
                          }
                        >
                          <label className="navbar-item">Pick a theme</label>
                        </OverlayTrigger>
                      </div>
                    ) : null}
                  </StyledOffcanvas.Body>
                </StyledOffcanvas>
              </div>
            </div>
          ) : (
            <div className="navbar-div-div">
              <div className="title-heading" onClick={()=>navigate('/')}>PyCompEdit</div>
              <BiMenu className="icon" onClick={openSettings} />
              
              <StyledOffcanvas
                show={showSettings}
                onHide={closeSettings}
                colors={props.colors}
                font_sizes={props.font_sizes}
                $darkThemeHome={props.$darkThemeHome}
                placement="end"
              >
                <StyledOffcanvas.Header closeButton>
                  <StyledOffcanvas.Title>Menu</StyledOffcanvas.Title>
                </StyledOffcanvas.Header>
                <StyledOffcanvas.Body>
                  <div className="offcanvas-body">
                    <div>
                      <label className="navbar-item">Dark Mode:</label>
                      <label className="switch-wrap">
                        <input
                          checked={props.$darkThemeHome}
                          onChange={() => {
                            localStorage.setItem("dark_theme_home", JSON.stringify(!props.$darkThemeHome));
                            setDarkThemeHome(!props.$darkThemeHome);
                          }}
                          type="checkbox"
                        />
                        <div className="switch"></div>
                      </label>
                    </div>
                    {!props.$darkThemeHome ? (
                      <div>
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          overlay={
                            <Popover>
                              <TwitterPicker
                                colors={["#4b0082", "#800020", "#Ff4500", "#808000", "#355e3b", "#002147", "#A0522d", "#36454f"]}
                                color={props.themeColor}
                                onChange={(color) => {
                                  setThemeColor(color.hex);
                                }}
                              />
                            </Popover>
                          }
                        >
                          <label className="navbar-item">Pick a theme</label>
                        </OverlayTrigger>
                      </div>
                    ) : null}
                    {!user ? (
                      <span
                        className="navbar-item"
                        onClick={() => {
                          setShowLogReg(true);
                          closeSettings();
                        }}
                      >
                        Login/Register
                      </span>
                    ) : null}

                    <span
                      className="navbar-item"
                      onClick={() => {
                        navigate("/editor");
                        closeSettings();
                      }}
                    >
                      Editor
                    </span>
                    <span
                      className="navbar-item"
                      onClick={() => {
                        navigate("/discussions");
                        closeSettings();
                      }}
                    >
                      Discussions
                    </span>
                    {user ? (
                      <span
                        className="navbar-item"
                        onClick={() => {
                          navigate("/submissions");
                          closeSettings();
                        }}
                      >
                        Submissions
                      </span>
                    ) : null}
                    {user ? (
                      <span
                        className="navbar-item"
                        onClick={() => {
                          logout();
                          closeSettings();
                        }}
                      >
                        Logout
                      </span>
                    ) : null}
                  </div>
                </StyledOffcanvas.Body>
              </StyledOffcanvas>
            </div>
          )}
        </div>
      ) : null}
      {!user ? (
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
          showMessage={showMessage}
        />
      ) : null}
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
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
