import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { showCartDlg, setCheckedOutItems,clearCartAction,setTotalPriceAction  } from "../../Redux/Actions/Data";
import { withRouter } from "react-router-dom";
import CartRow from "./CartRow";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCartOutlined";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import Swal from 'sweetalert2'



class ConnectedCartDialog extends Component {
  render() {
    let totalPrice = this.props.items.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);

    return (
      <div>
        <Dialog
       
          open={this.props.open}
          onClose={() => {
            this.props.dispatch(showCartDlg(false));
          }}
        >
          <AppBar position="static" style={{maxWidth:600, backgroundColor: "#3863aa" }}>
            <Toolbar>
              <ShoppingCartIcon
                fontSize="large"
                style={{ color: "white", marginRight: 10 }}
              />
              Shopping Cart
              <span  style={{display:"inline-block" , position:"absolute" , right:10}}>
              <HighlightOffIcon   
                fontSize="large"
                style={{ color: "white" , cursor:"pointer" }}
                onClick = {()=>{
                  this.props.dispatch(showCartDlg(false));
                }}
             
            />
              </span>
            
            </Toolbar>
            
          </AppBar>

          <div
            style={{
              minWidth: 600,
              maxHeight: 300,
              padding: 10,
              overflow: "auto"
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.items.map((item, index) => {
                  return <CartRow item={item} key={item.id} {...this.props} />;
                })}
              </TableBody>
            </Table>
          </div>

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                color: "#504F5A",
                float: "left",
                margin: 10,
                marginTop: 20,
                fontSize: 20
              }}
            >
              {" "}
              Total Price: {totalPrice} $
            </div>
            <div  style={{ float: "right"}}> 
            <Button
              style={{margin: "20px 5px" }}
              variant="outlined"
              color="primary"
              disabled={totalPrice === 0}
              onClick={() => {
                console.log("propss: " , this.props.items);
                // this.setState({
                //   item :this.props.items
                // })

                // console.log(this.state.item.inventory);
                this.props.dispatch(showCartDlg(false));       
                this.props.dispatch(setTotalPriceAction(totalPrice));
                this.props.dispatch(setCheckedOutItems(this.props.items));
                
                this.props.history.push("/order");
              }}
            >
              Checkout
            </Button>
            <Button
              style={{ margin:"20px 5px" }}
              variant="outlined"
              color="secondary"
              onClick={() => {
                this.props.dispatch(showCartDlg(false));
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, Clear!',
                }).then((result) => {
                  
                  if (result.value) {
                    this.props.dispatch(clearCartAction());
                    Swal.fire({
                      type: 'success',
                      title: 'Deleted!',
                      text:  'Your cart has been deleted.',
                      showConfirmButton: false,
                      timer: 800,
                    })
                  }
                  else{
                    this.props.dispatch(showCartDlg(true));
                  }
                })
               
                
              }}
            >
              Clear Cart
            </Button>
            </div>
            
          </div>
        </Dialog>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return { 
    open: state.rootReducer.showCartDialog, 
    items: state.rootReducer.cartItems ,
  };
};


const CartDialog = withRouter(connect(mapStateToProps)(ConnectedCartDialog));
export default CartDialog;
