import React, { Component } from 'react'
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";

import "./Style.css";
import axios from 'axios';
import firebase from 'firebase';
import Swal from 'sweetalert2';

// import nodemailer from 'nodemailer'
var nodemailer = require('nodemailer');

class DetailOrder extends Component {
    constructor(props) {
        super(props);
        this.state = { item: {}, adminAccess:false };
        this.getDetailOrder();
    }
    mail = {
        subject: '',
        name: '',
        email: '',
        massage: ''
    }
    id = this.props.match.params.id;


// Generate SMTP service account from ethereal.email

    sendMailToCustom() {
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return ;
            }
        
            console.log('Credentials obtained, sending message...');
            // Create a SMTP transporter object
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail',
                auth: {
                    user: 'marina73@ethereal.email',
                    pass: 'mdjdhDTMgtUcnMaRA4'
                }
            });
        
            // Message object
            let message = {
                from: 'katrine.bins25@ethereal.email',
                to: 'marina73@ethereal.email',
                subject: 'Nodemailer is unicode friendly ✔',
                text: 'Hello to myself!',
                html: '<p><b>Hello</b> to myself!</p>'
            };
        
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return ;
                }
        
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });

    }
    getDetailOrder = () => {
        axios({
            url: 'https://shoponline-5fa44.firebaseio.com/ShoppingCart/' + this.id + '.json',
            method: 'GET'
        }).then(result => {

            this.setState({
                item: result.data
            })
        }).catch(error => {
            console.log(error.data);

        })
    }
    updateStatusCart(id) {
        firebase.database().ref('ShoppingCart/' + id + '/status').set(false).then(() => {

            Swal.fire({
                type: 'success',
                title: 'Check Bill Successfull',
                showConfirmButton: false,
                timer: 1500
            })
        }).catch((error) => {
            var errorMessage = error.message;
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: errorMessage,
            })
        });
    }
    componentWillMount(){
        if(this.props.loggedInUser === "admin@mail.com")
        {
            this.setState({
                adminAccess: true
            })
        }
        else{
            this.setState({
                adminAccess: false
            })
        }
    }

    componentWillUpdate() {
        this.getDetailOrder();
    }

    render() {
        if (!this.state.item || !this.state.item.listProduct) {
            return <p style={{ margin: "20px" }}> </p>;
        }
        return (
            <div className="m-2 ">
                <p style={{ fontSize: "32px", color: "#504F5A" }}>Detail</p>
                {/* div left  */}
                <div className="d-flex">
                    <div className="col-md-8">
                        <div className=" d-flex justify-content-between">
                            <p style={{ fontSize: 23 }}>Order #{this.state.item.id+ 4900} <br /> <span style={{ fontSize: 15, color: "gray" }}>Placed on {this.state.item.time}</span></p>
                            <p style={{ fontSize: 15, color: "gray", paddingTop: 10 }}>FULFILLED</p>
                        </div>

                        <Paper>
                            <Table className="mb-5 ">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.item.listProduct.map((item, index) => {
                                        return <TableRow key={index}>
                                            <TableCell style={{ color: "#2EA5D4" }}>{item.name}</TableCell>
                                            <TableCell align="right">$ {item.price}.00</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">$ {item.price * item.quantity}.00</TableCell>
                                        </TableRow>
                                    })}
                                    <TableRow>
                                        <TableCell className="row-border" rowSpan={4} />
                                        <TableCell className="row-border" colSpan={2} >Subtotal</TableCell>
                                        <TableCell className="row-border"  >${this.state.item.totalPrice}.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="row-border" colSpan={2} >Shipping</TableCell>
                                        <TableCell className="row-border"  >$ 0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="row-border" colSpan={2} >Taxes</TableCell>
                                        <TableCell className="row-border"   >$ 0.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="row-border" style={{ fontSize: 17, color: "#2EA5D4" }} colSpan={2}>Grand total</TableCell>
                                        <TableCell className="row-border" style={{ fontSize: 15, color: "#2EA5D4" }} >$ {this.state.item.totalPrice}.00</TableCell>
                                    </TableRow >

                                </TableBody>
                            </Table>
                            {!this.state.adminAccess ? 
                        ( <button className=" w-100 btn btn-dark" onClick={() => this.props.history.push('/userOrder/'+this.props.loggedInUser)}>Back Monitor Order Page</button>) : ( <button className=" w-100 btn btn-dark" onClick={() => this.props.history.push('/admin')}>Back Admin Page</button>)}
                           
                        </Paper>
                    </div> {/* end div left  */}
                    {/* div right  */}
                    <div className="col-md-4">
                        <p style={{ fontSize: 23 }}>Customer <br /> <span style={{ fontSize: 15, color: "gray" }}>{this.state.item.name}</span></p>
                        <Paper>
                            <Table className="mb-5">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="right">{this.state.item.customer}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Shipping address</TableCell>
                                        <TableCell align="right">{this.state.item.address}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Number Phone</TableCell>
                                        <TableCell align="right">{this.state.item.phone}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                        {!this.state.adminAccess ? 
                        (<div>
                            <Button
                           variant="outlined"
                           color="primary"
                           disabled={!this.state.item.status}
                       >
                           Cancel Bill
                       </Button>
                      
                       </div>) : 
                        (<div>
                             <Button
                            variant="outlined"
                            color="primary"
                            disabled={!this.state.item.status}
                            onClick={() => {
                                this.updateStatusCart(this.state.item.id);
                            }}
                        >
                            Checked Bill
                        </Button>
                        <Button
                        style={{ marginLeft: "30px" }}
                        variant="outlined"
                        color="secondary"
                        onClick={()=>
                            Swal.fire({
                                type: 'success',
                                title: 'Sended mail to Customer !',
                                showConfirmButton: false,
                                timer: 700,
                                width: 300
                            })
                        }
                    // onClick={ () => transporter.sendMail(mailOptions, (info, error )=> {
                    //     console.log("aa");
                    //     if (error) {
                    //         console.log(error);
                    //     } else {
                    //         console.log('Email sent: ' + info.response);
                    //     }
                    // })}
                    >
                        Send Email Notification
                    </Button>
                        </div>
                       
                        )
                    }
                        
                        

                    </div>
                    {/* end div right */}
                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        loggedInUser: state.rootReducer.loggedInUser
    }
}

export default connect(mapStateToProps)(DetailOrder)