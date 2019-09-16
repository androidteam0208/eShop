import React, { Component } from "react";

import { connect } from "react-redux";
import { addItemInCart } from "../../Redux/Actions/Data";
import { withRouter } from "react-router-dom";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import StarIcon from "@material-ui/icons/Stars";

// import Swal from 'sweetalert2'
import './Item.css';

class ConnectedItem extends Component {

  render() {
    return (
      <div className="card text-center item-card " style={{cursor:"pointer"}}
        onClick={() => {
          this.props.history.push("/details/" + this.props.item.id);
        }}>
        <img className="card-img-top item-image" src={this.props.item.imageUrls[0]} alt="Card" />
        <div className="card-body">
          <h4 className="card-title item-title" >
            {this.props.item.popular ? (
              <StarIcon color="secondary" size="medium" />
            ) : (
                <span></span>
              )}
            {this.props.item.name}</h4>
          <p className="card-text ">$ {(this.props.item.price).toLocaleString()}.00  </p>
          <Button className="detail" variant="outlined" color="primary" onClick={() => {
            this.props.history.push("/details/" + this.props.item.id);
          }}
          > Details
          </Button>
          &nbsp;
            <IconButton title="Add to cart"
            size="small"
            onClick={(e) => {
              let invertoryReduce = this.props.item.inventory - 1;
              e.stopPropagation();
              this.props.dispatch(
                addItemInCart({ ...this.props.item, quantity: 1 , inventory: invertoryReduce })
              );
            }}
            color="primary"
            aria-label="Add to shopping cart"
          >
            <AddShoppingCartIcon size="small" />
          </IconButton>
        </div>
      </div>

    );
  }
}


export default withRouter(connect()(ConnectedItem));
