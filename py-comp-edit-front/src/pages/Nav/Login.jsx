import React, { useEffect } from "react";
import { Table, Popover, OverlayTrigger } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import { selectFailureMessage, selectSuccessMessage } from "../../redux/user/user.selecter";

const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};

  tr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.black};

    input {
      border-radius: 15px 15px 15px 15px;
      padding: 0.5em;
    }

    .checkbox-label {
      margin-left: 0.5em;
    }
  }

  .failure-message{
    color: red;
  }
`;

const InputDiv = styled.input``;

const popover = (value) => (
  <Popover id="popover-basic">
    <Popover.Body>{value}</Popover.Body>
  </Popover>
);

const Login = (props) => {
  const { loginForm, setLoginForm,successMessage,failureMessage } = props;

  

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "login_email")
      setLoginForm((prevState) => ({ ...prevState, email: value }));
    if (id === "login_password")
      setLoginForm((prevState) => ({ ...prevState, password: value }));
  };

  const handleValidation = (e) => {
    const { id, value } = e.target;
    const email_regex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const password_regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (id === "login_email") {
      !email_regex.test(value)
        ? setLoginForm((prevState) => ({
            ...prevState,
            emailError: "Please enter correct Email address",
          }))
        : setLoginForm((prevState) => ({
            ...prevState,
            emailError: "",
          }));
    } else if (id === "login_password") {
      !password_regex.test(value)
        ? setLoginForm((prevState) => ({
            ...prevState,
            passwordError:
              "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character(@$!%*?&)",
          }))
        : setLoginForm((prevState) => ({
            ...prevState,
            passwordError: "",
          }));
    }
  };

  return (
    <LoginDiv {...props}>
      <Table>
        <tbody>
          <tr>
            <td>
              <label>Email:</label>
            </td>
            <td>
              <OverlayTrigger
                show={loginForm.emailError !== ""}
                placement="bottom"
                overlay={popover(loginForm.emailError)}
              >
                <InputDiv
                  type="text"
                  spellCheck="false"
                  name="email"
                  placeholder="Email..."
                  id="login_email"
                  value={loginForm.email}
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td>
              <label>Password:</label>
            </td>
            <td>
              <OverlayTrigger
                show={loginForm.passwordError !== ""}
                placement="bottom"
                overlay={popover(loginForm.passwordError)}
              >
                <InputDiv
                  type="password"
                  spellCheck="false"
                  name="password"
                  placeholder="Password..."
                  id="login_password"
                  value={loginForm.password}
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td>
              <InputDiv type="checkbox" id="remember" />
              <label className="checkbox-label">Remember Me</label>
            </td>
          </tr>
        </tbody>
      </Table>
      {
        failureMessage?<span className="failure-message">{failureMessage}</span>:null
      }
    </LoginDiv>
  );
};

const mapStateToProps=createStructuredSelector({
  successMessage:selectSuccessMessage,
  failureMessage:selectFailureMessage
})

export default connect(mapStateToProps)(Login);
