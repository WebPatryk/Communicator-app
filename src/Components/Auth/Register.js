import React, { useState } from "react";
import {
  Grid,
  Image,
  Header,
  Button,
  Icon,
  Form,
  Checkbox,
  Segment,
  Placeholder,
  Divider,
  Container,
} from "semantic-ui-react";
import womanRegister from "../../images/woman-register2.jpg";
import "../../style/register.css";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import Error from "./Error";
import md5 from "md5";

export default function Register() {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [userDatabase, setUserDatabase] = useState(
    firebase.database().ref("users")
  );

  const validate = (form) => {
    if (!form.username) {
      return "Username is require";
    } else if (form.username.length < 6) {
      return "Username is too short";
    }
    if (!form.email) {
      return "Email is require";
    } else if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
      return "Bad email";
    if (!form.password) {
      return "Password is require";
    } else if (form.password.length < 6) {
      return "Password is too short";
    }
    if (!form.passwordConfirm) {
      return "Confirm password is require";
    } else if (form.passwordConfirm.length < 6) {
      return "Confirm password  is too short";
    } else if (form.passwordConfirm !== form.password) {
      return "Passwords are diffrent";
    }
    return null;
  };

  function handleForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errorMsg = validate(form);
    if (errorMsg) {
      setError(errorMsg);
      console.log("Error");
      return;
    }

    setLoading(true);
    setError("");
    firebase
      .auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then((createdUser) => {
        console.log(createdUser);
        createdUser.user
          .updateProfile({
            displayName: form.username,
            photoURL: `https://api.adorable.io/avatars/${md5(
              createdUser.user.email
            )}`,
          })
          .then(() => {
            saveUser(createdUser).then(() => {
              console.log("user saved");
            });
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(err.message);
      });
  }

  function saveUser(user) {
    return userDatabase.child(user.user.uid).set({
      name: user.user.displayName,
      avatar: user.user.photoURL,
    });
  }

  return (
    <div className="background">
      <Grid textAlign="center" padded color="teal">
        <Grid.Column>
          <Header
            as="h3"
            icon
            textAlign="center"
            verticalAlign="middle"
            color="black"
          >
            <Icon name="users" circular />
            <Header.Content>Communicator app </Header.Content>
          </Header>
        </Grid.Column>
      </Grid>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Header
          attached
          size="small"
          compact
          textAlign="center"
          verticalAlign="middle"
          stackable
          style={{ width: 900 }}
          color="red"
        >
          <Grid
            columns="equal"
            textAlign="center"
            stackable
            centered
            verticalAlign="middle"
            style={{ marginTop: 20 }}
          >
            <Grid.Row>
              <Grid.Column width="6">
                <Grid textAlign="center" padded>
                  <Header as="h2" verticalAlign="middle">
                    <Icon name="plug" />
                    <Header.Content>Register</Header.Content>
                  </Header>
                  <Header as="h1" textAlign="center"></Header>
                </Grid>
                <Container>
                  {error && <Error text={error} />}
                  <Form unstackable size="large" onSubmit={handleSubmit}>
                    <Form.Field>
                      <Form.Input
                        label="Username"
                        name="username"
                        onChange={handleForm}
                        type="text"
                        placeholder="Username"
                        icon="user circle"
                        iconPosition="left"
                        value={form.username}
                        className={
                          error.toLowerCase().includes("username")
                            ? "error"
                            : ""
                        }
                        fluid
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.Input
                        label="Email"
                        name="email"
                        onChange={handleForm}
                        type="email"
                        placeholder="Email"
                        icon="user circle"
                        iconPosition="left"
                        value={form.email}
                        className={
                          error.toLowerCase().includes("email") ? "error" : ""
                        }
                        fluid
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.Input
                        label="Passwword"
                        name="password"
                        onChange={handleForm}
                        type="password"
                        placeholder="Password"
                        icon="unlock"
                        iconPosition="left"
                        value={form.password}
                        className={
                          error.toLowerCase().includes("password")
                            ? "error"
                            : ""
                        }
                        textAlign="center"
                      />
                    </Form.Field>
                    <Form.Field>
                      <Form.Input
                        label="Confirm Password"
                        name="passwordConfirm"
                        onChange={handleForm}
                        type="password"
                        placeholder="Confirm Password"
                        icon="user circle"
                        iconPosition="left"
                        value={form.passwordConfirm}
                        className={
                          error.toLowerCase().includes("confirm") ? "error" : ""
                        }
                        fluid
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox label="I agree to the Terms and Conditions" />
                    </Form.Field>
                    <Button
                      type="submit"
                      fluid
                      color="brown"
                      size="large"
                      disabled={loading}
                      className={loading ? "loading" : ""}
                    >
                      Submit
                    </Button>
                    <Segment>
                      Already have an account?&nbsp;
                      <Link to="/login">Login here</Link>
                    </Segment>
                  </Form>
                </Container>
                <Divider horizontal>Or</Divider>
                <Grid columns="equal" textAlign="center" padded>
                  <Grid.Row>
                    <Grid.Column fluid>
                      <Button color="facebook">
                        <Icon name="facebook" /> Facebook
                      </Button>
                    </Grid.Column>
                    <Grid.Column fluid>
                      <Button color="google plus">
                        <Icon name="google plus" /> Google Plus
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Header>
      </div>
    </div>
  );
}
