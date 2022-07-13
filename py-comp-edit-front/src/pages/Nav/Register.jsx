import React from "react";
import { Table, Popover, OverlayTrigger } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import { selectFailureMessage, selectSuccessMessage } from "../../redux/user/user.selecter";

const RegisterDiv = styled.div`
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
  }

  .success-message{
    color: green;
  }

  .failure-message{
    color: red;
  }
`;

const popover = (value) => (
  <Popover id="popover-basic">
    <Popover.Body>{value}</Popover.Body>
  </Popover>
);

const Register = (props) => {
  const { registerForm, setRegisterForm,successMessage,failureMessage } = props;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setRegisterForm((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleValidation = (e) => {
    const { id, value } = e.target;
    const email_regex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const password_regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (id === "email") {
      !email_regex.test(value)
        ? setRegisterForm((prevState) => ({
            ...prevState,
            emailError: "Please enter correct Email address",
          }))
        : setRegisterForm((prevState) => ({
            ...prevState,
            emailError: "",
          }));
    } else if (id === "password") {
      !password_regex.test(value)
        ? setRegisterForm((prevState) => ({
            ...prevState,
            passwordError:
              "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character(@$!%*?&)",
          }))
        : setRegisterForm((prevState) => ({
            ...prevState,
            passwordError: "",
          }));
    }
  };

  return (
    <RegisterDiv {...props}>
      <Table>
        <tbody>
          <tr>
            <td>
              <label>Email:</label>
            </td>
            <td>
              <OverlayTrigger
                show={registerForm.emailError !== ""}
                placement="bottom"
                overlay={popover(registerForm.emailError)}
              >
                <input
                  type="text"
                  spellCheck="false"
                  id="email"
                  placeholder="Email..."
                  onChange={handleChange}
                  onBlur={handleValidation}
                  value={registerForm.email}
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
                show={registerForm.passwordError !== ""}
                placement="bottom"
                overlay={popover(registerForm.passwordError)}
              >
                <input
                  type="password"
                  spellCheck="false"
                  id="password"
                  placeholder="Password..."
                  onChange={handleChange}
                  onBlur={handleValidation}
                  value={registerForm.password}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <OverlayTrigger
                show={registerForm.nameError !== ""}
                placement="bottom"
                overlay={popover(registerForm.nameError)}
              >
                <input
                  type="text"
                  spellCheck="false"
                  id="name"
                  placeholder="Name..."
                  onChange={handleChange}
                  onBlur={handleValidation}
                  value={registerForm.name}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td>
              <label>Date of Birth:</label>
            </td>

            <td>
              <OverlayTrigger
                show={registerForm.dobError !== ""}
                placement="bottom"
                overlay={popover(registerForm.dobError)}
              >
                <input
                  type="date"
                  id="dob"
                  onChange={handleChange}
                  onBlur={handleValidation}
                />
              </OverlayTrigger>
            </td>
          </tr>
        </tbody>
      </Table>
      {
        successMessage?<span className="success-message">{successMessage}</span>:null
      }
      {
        failureMessage?<span className="failure-message">{failureMessage}</span>:null
      }
    </RegisterDiv>
  );
};

const mapStateToProps=createStructuredSelector({
  successMessage:selectSuccessMessage,
  failureMessage:selectFailureMessage
})

export default connect(mapStateToProps)(Register);
