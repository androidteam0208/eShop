import React, { Component } from "react";
import "./Details.css";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addItemInCart } from "../../Redux/Actions/Data";
import Api from "../../Api";
import Item from "../Item/Item";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Swal from 'sweetalert2'

var Remarkable = require("remarkable");

class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {
      relatedItems: [],
      quantity: "1",
      item: null,
      unfinishedTasks: 0
    };
    
  }
  // async componentWillMount(){
  //   await Api.getDataProductAction();
  // }

  async fetchProductUsingID(id) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // First, let's get the item, details of which we want to show.
    let item = await Api.getItemUsingID(id);
    // if(item === null){
    //   Api.getItemUsingID(id);
    // }
    // Now, get items from same category.
    let relatedItems = await Api.searchItems({
      category: item.category,
      page: "1",
      itemsPerPage: "5"
    });

    if (this.isCompMounted) {
      this.setState(ps => {
        return {
          item,
          unfinishedTasks: ps.unfinishedTasks - 1,
          relatedItems: relatedItems.data.filter(x => x.id !== item.id)
        };
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProductUsingID(nextProps.match.params.id);
  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchProductUsingID(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }

  // Product information contains markup, we use Remarkable for this.
  getRawMarkup(data) {
    const md = new Remarkable();
    return { __html: md.render(data) };
  }
  controlQuantity(state){
      let val = parseInt(this.state.quantity);
      if(!state){
        if (val > 1) {
          val -= 1;
          this.setState({ quantity: val.toString() });
        }
      }
      else{
        val += 1;
        this.setState({ quantity: val.toString() });
      }
  }

  render() {
    if (this.state.unfinishedTasks !== 0) {
      return <CircularProgress className="circular" />;
    }

    if (!this.state.item) {
      return null;
    }

    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      focusOnSelect: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    let settingsRelatedItems = {
      dots: true,
      infinite: true,
      speed: 500,
      focusOnSelect: false,
      slidesToShow:
        this.state.relatedItems.length < 3 ? this.state.relatedItems.length : 3,
      slidesToScroll:
        this.state.relatedItems.length < 3 ? this.state.relatedItems.length : 3
    };

    return (
      <div className="details">
        <div className="details-name" >
          {this.state.item.name}
        </div>
        <div style={{ display: "flex" }}>
          <div className="details-image">
            <Slider {...settings}>
              {this.state.item.imageUrls.map(x => {
                // NOTE: If I pass img directly instead of wrapping it in div, this component seems to mess up its styles.
                return (
                  <div key={x}>
                    <img
                      alt="Item"
                      style={{
                        objectFit: "contain",
                        height: 290,
                        width: 290
                      }}
                      src={x}
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
          <div className="details-infor">
            <div   className="details-price">
              Price:  $ {this.state.item.price}.00
            </div>

            {this.state.item.popular && (
              <span className="popular-item">
                (Popular product)
              </span>
            )}

            <div className="quantity">
              <IconButton className="btn-control" onClick={()=>{
                this.controlQuantity(false)}}>
                <RemoveIcon size="small" />
              </IconButton>
              &nbsp;
            <TextField className="details-quantity "
                type="text"
                disabled = {true}
                value={this.state.quantity}
                onChange={e => {
                  let val = parseInt(e.target.value);
                  if (val < 1 || val > 10) return;
                  this.setState({ quantity: val.toString() });
                }}
              />
              &nbsp;
             <IconButton className="btn-control"  onClick={()=>{
                this.controlQuantity(true)}}>
                <AddIcon size="small" />
              </IconButton>
            </div>

            <Button
              style={{ width: 200, marginTop: 5 }}
              color="primary"
              variant="contained"
              onClick={() => {
                let invertoryReduce = this.state.item.inventory - 1;
                this.props.dispatch(
                  addItemInCart({
                    ...this.state.item,
                    quantity: parseInt(this.state.quantity),
                    inventory: invertoryReduce
                  })
                )
              }}
            >
              Add to Cart &nbsp; <AddShoppingCartIcon style={{ marginLeft: 5 }} />
            </Button>
          </div>
        </div>

        <div className="details-title">Product Description</div>

        {this.state.item.description ? (
          <div className="description"
            dangerouslySetInnerHTML={this.getRawMarkup(
              this.state.item.description
            )}
          />
        ) : (
            <div className="description"
              style={{
                marginTop: 20,
                marginBottom: 20,
              }}
              dangerouslySetInnerHTML={{ __html: "Not available" }}
            />
          )}

        <div
          style={{
            color: "#504F5A",
            marginTop: 10,
            marginBottom: 20,
            fontSize: 22
          }}
        >
          Related Items
        </div>

        {this.state.relatedItems.length === 0 ? (
          <div
            style={{
              fontSize: 13,
              color: "gray",
              marginLeft: 10,
              marginBottom: 10
            }}
          >
            Not available
          </div>
        ) : (
            <div style={{ maxWidth: 770, height: 420, paddingLeft: 40 }}>
              <Slider {...settingsRelatedItems}>
                {this.state.relatedItems.map(x => {
                  return <Item key={x.id} item={x} />;
                })}
              </Slider>
            </div>
          )}
      </div>
    );
  }
}

let Details = connect()(ConnectedDetails);
export default Details;
