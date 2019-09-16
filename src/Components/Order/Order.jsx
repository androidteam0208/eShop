import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { setCheckedOutItems  } from "../../Redux/Actions/Data";
import Swal from 'sweetalert2'


const mapStateToProps = (state) => {
  return {
    checkedOutItems: state.rootReducer.checkedOutItems,
    // cartItems: state.rootReducer.cartItems
  };
};

// This component shows the items user checked out from the cart.
class ConnectedOrder extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    let totalPrice = this.props.checkedOutItems.reduce((accumulator, item) => {
      // console.log(item);  
      return accumulator + item.price * item.quantity;
    }, 0);

    return (
      <div style={{ padding: 10 }}>
        <div className="online-shop-title">
          Please review order before purchase
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Item name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.checkedOutItems.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell ><img style={{ width: "100px" }} alt="Product" src={item.imageUrls[0]} /></TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>$ {item.price}.00</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div
          style={{
            color: "#504F5A",
            marginLeft: 5,
            marginTop: 50,
            fontSize: 22
          }}
        >
          Total price: $ {totalPrice}.00
        </div>
        <Button
          color="primary"
          variant="outlined"
          disabled={totalPrice === 0}
          onClick={() => {
              this.props.history.push("/payment");
          }}
          style={{ margin: 5, marginTop: 30 }}
        >
          Purchase
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          disabled={totalPrice === 0}
          onClick={() => {
            // this.props.cartItems=[];
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, Discard!',
            }).then((result) => {
              
              if (result.value) {
                this.props.dispatch(setCheckedOutItems([]));
                // this.props.dispatch(clearCartAction());
                Swal.fire(
                  'Deleted!',
                  'Your cart has been deleted.',
                  'success',
                  '1000'
                  
                )
              }
            })
            

          }}
          style={{ margin: 5, marginTop: 30 }}
        >
          Discard
        </Button>
      </div>
    );
  }
}
const Order = withRouter(connect(mapStateToProps)(ConnectedOrder));

export default Order;
