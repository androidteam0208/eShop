import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import CreateIcon from "@material-ui/icons/Create";
import { setLoggedInUser } from "../../Redux/Actions/Data";
import firebase from 'firebase';
import Swal from 'sweetalert2'

var provider = new firebase.auth.FacebookAuthProvider();


class ConnectedLogin extends Component {
  // constructor(props) {
  //   super(props);

  // }
  state = {
    userName: "",
    pass: "",
    status: false,
  };
 
  



  handleInput = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  render() {
    provider.setCustomParameters({
      'display': 'popup'
    });
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // If user was authenticated, redirect her to where she came from.
    if (this.state.status === true) {
      return <Redirect to={from} />;
    }

    return (
      <div className="login-container">
        <div
          style={{
            height: 400,
            width: 400,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <LockOutlinedIcon
            // fontSize
            style={{ fontSize: 50, color: "#F50057", cursor: "pointer", margin: "0 auto" }}
          />
          <div
            style={{
              color: "primary",
              marginBottom: 20,
              fontSize: 26,
              textAlign: "center"
            }}
          >
            {" "}
            Log in{" "}
          </div>
          <TextField
            // value={this.state.userName}
            type="Email"
            label="Email Address *"
            name="userName"
            onChange={this.handleInput}
          />
          <TextField
            style={{ marginTop: 10 }}
            // value={this.state.pass}
            type="password"
            label="Password *"
            name="pass"
            onChange={this.handleInput}
          />
          {/* <VisibilityIcon  style={{ marginTop: 10 }}/> */}
          {/* <div className="d-flex justify-content-between mt-3"> */}
          <Button
            style={{ marginTop: 20 }}
            variant="contained"
            color="primary"
            onClick={() => {
              firebase.auth().signInWithEmailAndPassword(this.state.userName, this.state.pass).then(() => {
                this.props.dispatch(setLoggedInUser(this.state.userName));
                this.setState(() => ({
                  status: true,
                }));
              }).catch((error) => {
                // var errorCode = error.code;
                let errorMessage = error.message;
                Swal.fire({
                  title: 'Error!',
                  text: errorMessage,
                  type: 'error',
                })
              });
            }}
          >
            Log in
          </Button>
          <div className="d-flex justify-content-between">
          <span 
           style={{ color: "blue", textAlign: "left", marginTop: 5, cursor: "pointer" }}
          onClick={() => {
           firebase.auth().signInWithPopup(provider).then(function(result) {
            // var token = result.credential.accessToken;
          console.log(result.data);
          
            // ...
          }).catch(function(error) {
            var errorMessage = error.message;
            console.log(errorMessage);
            
            // ...
          });
          
            
            }}>
            Facebook Log In </span>
          <span
            style={{ color: "red", textAlign: "right", marginTop: 5, cursor: "pointer" }}
            onClick={() => {
              this.props.history.push("/SignUp");
            }}>
            <CreateIcon style={{ color: "red" }} />
            Create Acount </span>
          </div>
         

        </div>


      </div>
    );
  }
}
const Login = withRouter(connect()(ConnectedLogin));

export default Login;
