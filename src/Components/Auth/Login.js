import React, { useState } from 'react';
import { Grid, Image, Header, Button, Icon, Form, Checkbox, Segment, Placeholder, Message } from 'semantic-ui-react';
// import womanRegister from '../../images/woman-register2.jpg';
// import '../../style/register.css';
import { Link } from 'react-router-dom';
import firebase from '../Firebase/firebase';
import Error from './Error';



export default function Register() {



    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);
    const [userDatabase, setUserDatabase] = useState(firebase.database().ref('users'));
    const [form, setForm] = useState({
        email: "",
        password: "",
    });


    const validate = form => {
        if (!form.email) {
            return "Username is require";
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
            console.log('Error');
            return;
        }
        setLoading(true);
        setError("");
        firebase.auth().signInWithEmailAndPassword(form.email, form.password)
            .then(signedUser => {
                console.log(signedUser);
            })
            .catch(err => {
                console.log(err);
                setError(err.message);
                setLoading(false);
            });
    }

    function handleForm(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }



    return (
        <div className="register">

            <Grid columns='two' >
                <Grid.Row style={{ margin: "4rem 0" }}>
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



                    <Grid.Column verticalAlign="middle">


                        <Header as='h1' textAlign="center">
                            Good Morning
                            <Header.Subheader>Login to your account</Header.Subheader>
                            {error && <Error text={error} />}
                        </Header>

                        <Form onSubmit={handleSubmit} >
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
                                Login
                                </Button>

                            <Link to="/register">
                                <Header as='h4'>Create account</Header>
                            </Link>
                        </Form>
                    </Grid.Column>
                </Grid.Row>


            </Grid>
        </div >
    );
}
