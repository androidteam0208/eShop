import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import firebase from 'firebase';
import Swal from 'sweetalert2'

class account extends Component {
  state = {
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    edit: true
  }
  
  
  handleInput = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    });

  }

  validateForm() {
    let stateForm = false;
    let errorMasage = "";
    let regExPhone = /^0(3\d{8}|9\d{8})$/;
    let regExEmail=/^[a-z][a-z0-9_]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

    if (this.state.name.trim() === "" || this.state.email.trim() === ""|| this.state.phone.trim() === "" || this.state.address.trim() === "" ) {
      errorMasage = "Don't allow empty Field";
      stateForm = true
    }

    if (!regExPhone.test(this.state.phone)) {
      errorMasage = "Number Phone format is incorrect !";
      stateForm = true;
    }
    if (!regExEmail.test(this.state.email)) {
      errorMasage = "Mail format is incorrect !";
      stateForm = true;
    }
    if (stateForm) {
      Swal.fire({
        title: 'Error!',
        text: errorMasage,
        type: 'error',
      })
    }

    return stateForm;
  }
  componentWillMount(){
      this.getDetailUser();
  }

  getDetailUser = () => {
    let userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/Customer/' + userId).once('value').then((snapshot) => {
      this.setState({
        name: snapshot.child("loginName").val(),
        email: snapshot.child("email").val(),
        phone: snapshot.child("phone").val(),
        password: snapshot.child("passWord").val(),
        address: snapshot.child("address").val(),

      });
    });
  }
    editInforCustommer(data) {
    let userId = firebase.auth().currentUser.uid;
    let updates = {};
    updates[`/Customer/` + userId] = data;
    firebase.database().ref().update(updates).then(() => {
        Swal.fire({
            type: 'success',
            title: 'Edit information successfully',
            showConfirmButton: false,
            timer: 1000
        });
        this.setState({
            edit: true
        })
    }).catch((error) => {
        let errorMessage = error.message;
        alert(errorMessage);
    });
}
  render() {
    return (
      <div className="ml-3 mt-3">
        <div
          style={{
            height: 500,
            width: 500,
            display: "flex",
            flexDirection: "column"
          }}
        >
         
          <div
            style={{
              color: "primary",
              marginBottom: 20,
              fontSize: 26,
              textAlign: "left "
            }}
          >
            {" "}
            Account Information{" "}
          </div>
          <div className="d-flex justify-content-between">
            <TextField style={{ width: 230 }}
              name="email"
              label="Email *"
              value={this.state.email}
              onChange={this.handleInput}
              disabled= 'true'
            />
            <TextField style={{ width: 230 }}
              label="PassWord  *"
              name="password"
              value={this.state.password}
              onChange={this.handleInput}
              disabled = 'true'
            />
          </div>
          <TextField
            style={{ marginTop: 10 }}
            label="Phone *"
            name="phone"
            value={this.state.phone}
            onChange={this.handleInput}
            disabled= {this.state.edit}
          />
          <TextField
            style={{ marginTop: 10 }}
            label="Name *"
            name="name"
            value={this.state.name}
            onChange={this.handleInput}
            disabled= {this.state.edit}
          />
          <TextField
            style={{ marginTop: 10 }}
            label="Address *"
            name="address"
            value={this.state.address}
            onChange={this.handleInput}
            disabled= {this.state.edit}

          />
          <div className="d-flex mt-2 justify-content-between">
            <TextField style={{ marginTop: 10, width: 230 }}
              label="City "
            />
            <TextField
              style={{ margin: "10px 0px", width: 230 }}
              label="State/Province/Region"

            />
          </div>
          <p style={{ color: "red", cursor: "pointer" }} onClick={() => this.setState({edit:false})}>Edit information</p>

          <Button
            style={{ marginTop: 30 }}
            variant="outlined"
            color="primary"
            disabled ={this.state.edit}
            onClick={() => {
              if(this.validateForm()){
                return;
              }
              let customerInfor = {
                loginName: this.state.name,
                address: this.state.address,
                email: this.state.email,
                phone: this.state.phone,
                passWord: this.state.password
              }
              this.editInforCustommer(customerInfor)
            }}
          >
            Save Information
          </Button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    customer: state.rootReducer.loggedInUser,
  }
}

const Account = withRouter(connect(mapStateToProps)(account));

export default Account;
