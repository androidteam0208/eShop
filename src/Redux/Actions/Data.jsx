import * as CONSTANTS from "../Constants/Data";
import firebase from 'firebase';

export const getMenuDataAction = () => {
  return dispatch => {
    firebase.database().ref().child("Categories").once("value").then((snapshot)=> {
      dispatch({
        type: CONSTANTS.GET_MENU_DATA,
        categoryData: snapshot.val()
      })
  }).catch((error)=>{
    console.log(error.massage);
    
  })
  } 
}
export const getDataProductAction = () => {
  return dispatch => {
    firebase.database().ref().child("Product").once("value").then((snapshot)=> {
      dispatch({
            type: CONSTANTS.GET_PRODUCT_DATA,
            productData:snapshot.val()
          })
  }).catch((error)=>{
    console.log(error.massage);
    
  })
  }
}
//get order 
export const getDataCartAction = () => {
  return dispatch => {
    firebase.database().ref().child("ShoppingCart").once("value").then((snapshot)=> {
      dispatch({
            type: CONSTANTS.GET_CART_DATA,
            cartData: snapshot.val()
          })
  }).catch((error)=>{
    console.log(error.massage);
    
  })
}
}
// add cart into database
export const addShoppingCartAction = (cart) => {
  return {
    type: CONSTANTS.ADD_SHOPPING_CART,
    cart
  }
}
//add customer 
export const addCustomerAction = (user) => {
  return {
    type: CONSTANTS.ADD_CUSTOMER,
    user
  }
}
//clear cart when discart or puchare success
export const clearCartAction = () => ({
  type: CONSTANTS.CLEAR_CART,
});
//set total price
export const setTotalPriceAction = (price) => {
  return {
    type: CONSTANTS.SET_TOTAL_PRICE,
    price
  }
}
export const addItemInCart = item => ({
  type: CONSTANTS.ADD_ITEM_IN_CART,
  payload: item
});

export const showCartDlg = status => ({
  type: CONSTANTS.SHOW_CART_DLG,
  payload: status
});
export const deleteCartItem = id => ({
  type: CONSTANTS.DELETE_CART_ITEM,
  payload: id
});
export const toggleMenu = () => ({
  type: CONSTANTS.TOGGLE_MENU,
  payload: null
});
export const updateCartItemQnt = obj => ({
  type: CONSTANTS.UPDATE_CART_ITEM_QUANTITY,
  payload: obj
});
export const setCheckedOutItems = items => ({
  type: CONSTANTS.SET_CHECKEDOUT_ITEMS,
  payload: items
});
export const setLoggedInUser = userName => ({
  type: CONSTANTS.SET_LOGGED_IN_USER,
  payload: userName
});

