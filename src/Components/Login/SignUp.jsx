import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import firebase from 'firebase';
import { addCustomerAction } from "./../../Redux/Actions/Data";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Swal from 'sweetalert2'


import "./Login.css";


class ConnectedLogin extends Component {
  state = {
    passWord: "",
    email: "",
    redirectToReferrer: false,
    loginName: "",
    phone:"",
    address:""
  };

  handleInput = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    });

  }

  validateForm(){
    let stateForm = false;
    let errorMasage ="";
    let regExPhone = /^0(3\d{8}|9\d{8})$/;
    let phone = this.state.phone;

    if(this.state.loginName.trim()===""|| this.state.phone.trim()==="" || this.state.address.trim()==="")
    {  
      errorMasage = "Don't allow empty Field";
      stateForm = true
    }

    if(!regExPhone.test(phone)){
      errorMasage = "Number Phone allow 10 number character and begin with 0...";
      stateForm = true; 
    }
    if(stateForm){
      Swal.fire({
        title: 'Error!',
        text: errorMasage,
        type: 'error',
      })
    }

    return stateForm;
  }


  render() {

    // this.createId();
    const { from } = this.props.location.state || { from: { pathname: "/login" } };
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div className="login-container">
        <div
          style={{
            height: 500,
            width: 500,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <AccountCircleIcon
            // fontSize
            style={{ fontSize: 50, color: "#F50057", cursor: "pointer", margin: "0 auto" }}
          />
          <div
            style={{
              color: "#504F5A",
              marginBottom: 20,
              fontSize: 26,
              textAlign: "center"
            }}
          >
            {" "}
            Sign Up{" "}
          </div>
          <div className="d-flex justify-content-between">
            <TextField style={{ width: 230 }}
              type="email"
              label="Email Address *"
              name="email"
              onChange={this.handleInput}
            />
            <TextField style={{ width: 230 }}
              type="password"
              label="Password *"
              name="passWord"
              onChange={this.handleInput}
            />
          </div>

          <TextField
            style={{ marginTop: 10 }}
            label="Name *"
            name="loginName"
            onChange={this.handleInput}
          />
          <TextField
            style={{ marginTop: 10 }}
            label="Phone *"
            name="phone"
            onChange={this.handleInput}
            onBlur={this.handleInputValidation}
          />
          <TextField
            style={{ marginTop: 10 }}
            label="Address *"
            name="address"
            onChange={this.handleInput}

          />
          <span  style={{ marginTop: 25 , color:"red" }}>* field must not empty</span>

          <Button
           style={{ marginTop: 5 }}
            variant="contained"
            color="secondary"
            onClick={() => {
              // console.log(this.state);
              if(this.validateForm()){
                return;
              }
              
              firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.passWord).then(() => {
                this.props.addCustomer(this.state);
                this.props.history.push("/login");
              }).catch((error) => {
                var errorMessage = error.message;
                Swal.fire({
                  title: 'Error!',
                  text: errorMessage,
                  type: 'error',
                })
              });
            }}
          >
            Sign up
          </Button>

          <span
            style={{ color: "#303f9f", textAlign: "right", marginTop: 10, cursor: "pointer", fontSize: 18 }}
            onClick={() => {
              this.props.history.push("/Login");
            }}>
            <LockOutlinedIcon
              style={{ color: "#303f9f", cursor: "pointer", margin: "0 auto" }}
            /> Login </span>
        </div>

      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addCustomer: (user) => {
      dispatch(addCustomerAction(user));
    }
  }
}
const Login = withRouter(connect(null, mapDispatchToProps)(ConnectedLogin));

export default Login;
