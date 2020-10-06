import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Input, Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";
import { register } from "../../crud/auth.crud";
import URL from "../../helpers/url";

import styled, { css } from 'styled-components';

import Form from '../../components/Landing/FormModal';

const Button = styled.button`
    color: white;
    cursor: pointer;
    background-color: #e50914;
    line-height: normal;
    margin: 18px 3% 0 0;
    padding: 7px 17px;
    font-weight: 100;
    border: transparent;
    border-radius: 3px;
    font-size: 12px;
    text-decoration: one;

    ${props => props.right && css`
        float: right;
    `}
    ${props => props.color && css`
      background-color: ${props.color};
    `}
    ${props => props.disabled && css`
      background-color: #dddddd;
    `}
    &:hover {
        background-color: #E53935;
    }
`;

const styles = {
  loginTitle: {
    width: 400,
    height: 'auto',
    padding: 50,
    marginLeft: '40%',
    textAlign: 'center',
    backgroundColor: 'black',
    opacity: 0.5,
    fontSize: 20,
    borderRadius: 3
  },
  inputBox: {
    backgroundColor: 'white',
    width: '90%',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10
  },
  welcomeTitle: {
    color: 'white',
    marginBott: 20,
  },
};

function Registration(props) {
  const { intl } = props;
  
  const formContent = (
    <Formik
      initialValues={{
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        acceptTerms: true,
        newsletter: true,
      }}
      validate={values => {
        const errors = {};

        if (!values.email) {
          errors.email = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = intl.formatMessage({
            id: "AUTH.VALIDATION.INVALID_FIELD"
          });
        }

        if (!values.firstname) {
          errors.firstname = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.lastname) {
          errors.lastname = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.lastname) {
          errors.lastname = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.password) {
          errors.password = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.acceptTerms) {
          errors.acceptTerms = "Accept Terms";
        }

        return errors;
      }}
      onSubmit={(values, { setStatus, setSubmitting }) => {
        register(
          values.email,
          values.firstname,
          values.lastname,
          values.password,
          )
          .then(({ data: { accessToken } }) => {
            props.history.push('/auth/login');
            // props.register(accessToken);
          })
          .catch(() => {
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_REGISTER"
              })
            );
          });
      }}
    >
      {({
        values,
        status,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
          <form onSubmit={handleSubmit} noValidate autoComplete="off" className="kt-form-auth">
            <p className="auth-form-header">
              <FormattedMessage id="AUTH.REGISTER.TITLE" />
            </p>

            {status && (
              <div role="alert" className="alert alert-danger">
                <div className="alert-text">{status}</div>
              </div>
            )}

            <div className="form-group mb-0  auth-form-field-compact">
              <Input
                margin="dense"
                label="First Name"
                className="kt-width-full"
                name="firstname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstname}
                placeholder="First Name"
                helperText={touched.firstname && errors.firstname}
                error={Boolean(touched.firstname && errors.firstname)}
                style={styles.inputBox}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <Input
                margin="dense"
                label="Last Name"
                className="kt-width-full"
                name="lastname"
                placeholder="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastname}
                helperText={touched.lastname && errors.lastname}
                error={Boolean(touched.lastname && errors.lastname)}
                style={styles.inputBox}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <Input
                label="Email"
                margin="dense"
                className="kt-width-full"
                name="email"
                placeholder="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
                style={styles.inputBox}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <Input
                type="password"
                margin="dense"
                label="Password"
                className="kt-width-full"
                name="password"
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                helperText={touched.password && errors.password}
                error={Boolean(touched.password && errors.password)}
                style={styles.inputBox}
              />
            </div>

            <div className="form-group mb-0 kt-register__checks">
              <FormControlLabel
                label={
                  <div className="kt-register__checks-text">
                    Agree to Privacy Policy & Terms of Service
                      <div>
                      By creating your account, you agree to the Soarin{" "}
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                        </a>{" "}and{" "}
                      <a href="https://www.soarinenergy.com/privacy-policy-2/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy policy
                        </a>.
                      </div>
                  </div>
                }
                control={
                  <Checkbox
                    color="primary"
                    name="acceptTerms"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values.acceptTerms}
                  />
                }
              />
            </div>

            <div className="kt-login__actions">
              <Button
                disabled={isSubmitting || !values.acceptTerms}
                className="btn btn-primary btn-elevate kt-login__btn-primary auth__btn-compact"
              >
                Register
              </Button>

              <Link to={URL.LOGIN()}>
                <Button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary" color="#333333">
                  Go to Login
                </Button>
              </Link>
            </div>
          </form>
        )}
    </Formik>
  );
  
  return (
    <Form show={true}
      modalClosed={null}>
      {formContent}
    </Form>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Registration)
);
