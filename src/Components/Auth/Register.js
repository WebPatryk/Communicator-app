import React, { useState } from 'react';
import { Grid, Image, Header, Button, Icon, Form, Checkbox, Segment, Placeholder } from 'semantic-ui-react';
// import womanRegister from '../../images/woman-register2.jpg';
// import '../../style/register.css';
import { Link } from 'react-router-dom';
import firebase from '../Firebase/firebase';
import Error from './Error';
import md5 from 'md5';



export default function Register() {


    const [error, setError] = useState("");
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [loading, setLoading] = useState(false);
    const [userDatabase, setUserDatabase] = useState(firebase.database().ref('users'));


    const validate = form => {
        if (!form.username) {
            return "Username is require";
        }
        else if (form.username.length < 6) {
            return "Username is too short";
        }
        if (!form.email) {
            return "Email is require";
        }
        else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            return "Bad email";
        if (!form.password) {
            return "Password is require";
        }
        else if (form.password.length < 6) {
            return "Password is too short";
        }
        if (!form.passwordConfirm) {
            return "Confirm password is require";
        }
        else if (form.passwordConfirm.length < 6) {
            return "Confirm password  is too short";
        }
        else if (form.passwordConfirm !== form.password) {
            return "Passwords are diffrent";
        }
        return null;
    };

    function handleForm(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errorMsg = validate(form);
        if (errorMsg) {
            setError(errorMsg);
            console.log('Error');
            return;
        }

        setLoading(true);
        setError("");
        firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: form.username,
                    photoURL: `https://api.adorable.io/avatars/${md5(createdUser.user.email)}`
                })
                    .then(() => {
                        saveUser(createdUser).then(() => {
                            console.log('user saved');
                        });

                    })
                    .catch(err => {
                        setError(err.message);
                        setLoading(false);
                    });
                setLoading(false);
                setError("");
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setError(err.message);
            });
    }

    function saveUser(user) {
        return userDatabase.child(user.user.uid).set({
            name: user.user.displayName,
            avatar: user.user.photoURL
        });
    }


    return (
        <div className="register">

            <Grid columns='two' >
                <Grid.Row verticalAlign="middle">

                    <Grid.Column>



                        <Header as='h1' textAlign="center">
                            Good Morning
                            <Header.Subheader>Register to your account</Header.Subheader>
                            {error && <Error text={error} />}
                        </Header>

                        <Form onSubmit={handleSubmit}>

                            <Form.Field >
                                <Form.Input size='massive'
                                    fluid
                                    name="username"
                                    onChange={handleForm}
                                    type="text"
                                    placeholder="Username"
                                    icon="user circle"
                                    iconPosition="left"
                                    value={form.username}
                                    className={error.toLowerCase().includes('username') ? 'error' : ''}
                                />
                            </Form.Field>
                            <Form.Field >
                                <Form.Input
                                    size='massive'
                                    fluid
                                    name="email"
                                    onChange={handleForm}
                                    type="email"
                                    placeholder="Email"
                                    icon="mail"
                                    iconPosition="left"
                                    value={form.email}
                                    className={error.toLowerCase().includes('email') ? 'error' : ''}

                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    size='massive'
                                    fluid
                                    name="password"
                                    onChange={handleForm}
                                    type="password"
                                    placeholder="Password"
                                    icon="unlock"
                                    iconPosition="left"
                                    value={form.password}
                                    className={error.toLowerCase().includes('password') ? 'error' : ''}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    size='massive'
                                    fluid
                                    name="passwordConfirm"
                                    onChange={handleForm}
                                    type="password"
                                    placeholder="Confirm password"
                                    icon="repeat"
                                    iconPosition="left"
                                    value={form.passwordConfirm}
                                    className={error.toLowerCase().includes('confirm') ? 'error' : ''}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox label='Remember me' />
                            </Form.Field>

                            <Link>
                                <Header as='h4'>Forgot password ? </Header>
                            </Link>

                            <Button
                                type='submit'
                                fluid
                                size="large"
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                            >
                                Register
                                </Button>

                            <Link to="/login">
                                <Header as='h4'>Already have an account ?</Header>
                            </Link>
                        </Form>
                    </Grid.Column>


                    <Grid.Column style={{
                        // backgroundImage: `url(${womanRegister})`,
                        backgroundSize: 'cover',
                        backgroundPosition: "center",
                        height: '85vh',

                    }}>
                        <Header as="h1" textAlign="center" verticalAlign="middle" style={{ margin: "40% 0", color: "white", }}>
                            Social communicator
                            <Header.Subheader style={{ color: "white", width: "50%", margin: "5rem auto", }}>
                                Start using our social app to make conversation with other people in diffrent canals in easy way. Just try for free.
                            </Header.Subheader>

                            <Header as='h5' style={{ color: 'white' }}>Login with social media</Header>
                            <Button color='facebook'>
                                <Icon name='facebook' /> Facebook
                            </Button>
                            <Button color='google plus'>
                                <Icon name='google plus' /> Google Plus
                            </Button>
                        </Header>
                    </Grid.Column>

                </Grid.Row>


            </Grid>
        </div >
    );
}
