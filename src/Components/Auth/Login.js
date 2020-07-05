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
  Message,
  Container,
  Divider,
  Card,
} from "semantic-ui-react";
import womanRegister from "../../images/woman-register2.jpg";
import "../../style/register.css";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import Error from "./Error";

export default function Register() {
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [userDatabase, setUserDatabase] = useState(
    firebase.database().ref("users")
  );
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const validate = (form) => {
    if (!form.email) {
      return "Email is require";
    }

    if (!form.password) {
      return "Password is require";
    }
    return null;
  };

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
      .signInWithEmailAndPassword(form.email, form.password)
      .then((signedUser) => {
        console.log(signedUser);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      });
  }

  function handleForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="background">
      <Grid textAlign="center" padded color="teal">
        <Grid.Column>
          <Header
            as="h1"
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
            style={{ marginTop: 50 }}
          >
            <Grid.Row>
              <Grid.Column width="6">
                <Grid textAlign="center" padded>
                  <Header as="h2" verticalAlign="middle">
                    <Icon name="plug" />
                    <Header.Content>Sign in</Header.Content>
                  </Header>
                  <Header as="h1" textAlign="center"></Header>
                </Grid>
                <Container>
                  {error && <Error text={error} />}
                  <Form unstackable size="large" onSubmit={handleSubmit}>
                    <Form.Field>
                      <Form.Input
                        label="Email"
                        name="email"
                        onChange={handleForm}
                        type="email"
                        placeholder="Email"
                        icon="mail"
                        iconPosition="left"
                        value={form.email}
                        className={
                          error.toLowerCase().includes("email") ? "error" : ""
                        }
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
                      Haven't an account?&nbsp;
                      <Link to="/register">Register here</Link>
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
