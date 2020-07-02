import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import firebase from '../Components/Firebase/firebase';
import Login from './Auth/Login';
import Register from './Auth/Register';
import MainPage from './MainPage';
import Spinner from './Spinner';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './Redux/duck/actions';
import { clearUser } from './Redux/duck/actions';

export default function App() {
  let history = useHistory();
  const dispatch = useDispatch();
  const setUserReducer = useSelector(state => state.user_reducer);


  useEffect(() => {

    firebase.auth().onAuthStateChanged(user => {

      if (user) {
        dispatch(setUser(user));
        history.push("/");
      }
      else {
        history.push("/login");
        dispatch(clearUser());
      }
    });


  }, [dispatch, history]);


  return setUserReducer.isLoading ? <Spinner /> : (
    <div className="App">
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  );
}
