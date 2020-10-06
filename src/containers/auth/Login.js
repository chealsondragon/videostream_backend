import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Input, TextField } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login } from "../../crud/auth.crud";
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

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "0.5rem"
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "1.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "0.5rem" });
  };

  const formContent = (
    <>
      <Formik
        initialValues={{
          email: "admin@email.com",
          password: "aaa"
        }}
        validate={values => {
          const errors = {};

          if (!values.email) {
            // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
            errors.email = intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_EMAIL"
            });
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_FIELD"
            });
          }

          if (!values.password) {
            errors.password = intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_PASSWORD"
            });
          }

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          enableLoading();
          setTimeout(() => {
            login(values.email, values.password)
              .then(({ data : { access_token } }) => {
                console.log('login');
                disableLoading();
                setSubmitting(false);
                props.login(access_token);
              })
              .catch((error) => {
                const errorMsg = error.description || error.message || 'Unspecified error';
                console.log('login', errorMsg);

                disableLoading();
                setSubmitting(false);
                setStatus(
                  intl.formatMessage({
                    id: "AUTH.VALIDATION.INVALID_LOGIN"
                  })
                );
              });
          }, 1000);
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
            <form
              noValidate={true}
              autoComplete="off"
              className="kt-form-auth"
              onSubmit={handleSubmit}
            >
              <h3 style={styles.welcomeTitle}>Welcome to videostream</h3>
              {status && (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text" style={styles.loginTitle}>{status}</div>
                </div>
              )}

              <div className="form-group auth-form-field">
                <Input
                  type="email"
                  label="Email"
                  margin="normal"
                  name="email"
                  size="medium"
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                  style={styles.inputBox}
                />
              </div>

              <div className="form-group auth-form-field">
                <Input
                  type="password"
                  margin="normal"
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

              <div>
                <Button type="submit" disabled={isSubmitting}>
                  Login
                </Button>
                <Link to={URL.FORGOT_PASSWORD()}>
                  <Button right hidden disabled={isSubmitting}>
                    <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                  </Button>
                </Link>
                <Link to={URL.REGISTER()} right>
                  <Button  color="#333333">
                    Go to Register
                  </Button>
                </Link>
              </div>
            </form>
          )}
      </Formik>
    </>
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
  )(Login)
);
