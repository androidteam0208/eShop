import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {
  showCartDlg,
  deleteCartItem,
  updateCartItemQnt
} from "../../Redux/Actions/Data";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from "@material-ui/core/TextField";

// import Swal from 'sweetalert2'

const CartRow = props => {
  let { item } = props;
  
  return (
    <TableRow className="text-center">
      <TableCell>
        <Link to={`/details/${item.id}`}>
          <div
            onClick={() => {
              //   User will be navigated to item URL by clicking this item due to link above,
              //   and also we close this dialog.
              props.dispatch(showCartDlg(false));
            }}
          >
            <img src={item.imageUrls[0]}  alt="Product" style={{ width: 70}}/>
            
          </div>
        </Link>
      </TableCell>
      <TableCell>$ {item.price}.00</TableCell>
      <TableCell>
        <div className="row">
          &nbsp;
            <TextField
            type="number"
            style={{ width: 40 }}
            inputProps={{ min: "1", step: "1" }}
            value={item.quantity}
            onChange={e => {
              let quantity = parseInt(e.target.value, 10);
              let inventory = item.inventory;
              // console.log("invento:" ,inventory);
              
              if (quantity < 0) return;

              // Update quantity for this cart item.
              props.dispatch(
                updateCartItemQnt({
                  id: item.id,
                  quantity,
                  inventory

                })
              );
            }}
          />
          
        </div>

      </TableCell>
      <TableCell>
        <Button
          color="secondary"
          onClick={() => {
            props.dispatch(deleteCartItem(item.id));
            // Delete.
            
          }}
        >
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartRow;
