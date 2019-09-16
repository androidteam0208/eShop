import * as CONSTANTS from "../Constants/Data";
import firebase from 'firebase';
import Swal from 'sweetalert2'
// If multiple components need access to some data, in that case we store such data in redux.
const initialState = {
    cartItems: [],
    showCartDialog: false,
    showMenu: true,
    checkedOutItems: [],
    loggedInUser: null,


    // data category get on firebase
    categoryData: [],
    menuItems: [],
    // expandedItems: [],
    productData: [],

    //add shopingcart
    paymentInfor: [],
    totalPrice: 0,
    cartInfor: {},
    idShoppingCart: 0,
    //for user
    user: {},
    idNewUser: 0,

    //CART DATA ADMIN
    cartData: [],

    //inventory update
    inventory: 0


};
// const inventory = 0;

function createIdCart() {

    firebase.database().ref().child("ShoppingCart").on("value", function (snapshot) {
        let idCart = snapshot.numChildren();
        let arr = snapshot.val();
        let arr2 = Object.keys(arr);
        let key = parseInt(arr2[idCart - 1]) + 1;
        initialState.idShoppingCart = key;

    });
    return;
}
function createIdCustomer() {
    firebase.database().ref().child("Customer").on("value", function (snapshot) {
        let idUser = snapshot.numChildren();
        let arr = snapshot.val();
        let arr2 = Object.keys(arr);
        let key = parseInt(arr2[idUser - 1]) + 1;
        initialState.idNewUser = key;

    });
    return;

}

function writeCartData(table, data) {
    var updates = {};
    updates[`/${table}/` + initialState.idShoppingCart] = data;
    firebase.database().ref().update(updates).then(() => {
        Swal.fire({
            type: 'success',
            title: 'Your order has been save',
            showConfirmButton: false,
            timer: 1000
        })
    }).catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function writeUsertData(table, data) {
    let updates = {};
    let userId = firebase.auth().currentUser.uid;

    updates[`/${table}/` + userId] = data;
    firebase.database().ref().update(updates).then(() => {
        Swal.fire({
            type: 'success',
            title: 'Sign in Successfull',
            showConfirmButton: false,
            timer: 1000
        })
    }).catch((error) => {
        let errorMessage = error.message;
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: errorMessage,
        })
    });
}

function updateProductInventory(id, data) {
    let updates = {};
    updates[`/Product/` + id +`/inventory`] = data;
    firebase.database().ref().update(updates).then(() => {
        console.log("success");

    }).catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage);

    })
}


const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONSTANTS.GET_MENU_DATA:
            {
                state.categoryData = action.categoryData;
                state.expandedItems = action.categoryData.reduce((accum, current) => {
                    if (current.type === "title") {
                        accum[current.id] = true;
                    }
                    return accum;
                }, {});
                state.menuItems = action.categoryData;
                return { ...state };
            }
        case CONSTANTS.GET_PRODUCT_DATA:
            {
                state.productData = action.productData;
                return { ...state };
            }

        case CONSTANTS.ADD_SHOPPING_CART: {
            console.log(action.cart.listProduct[0]);
            for(let i=0; i < action.cart.listProduct.length ; i++){
                updateProductInventory(action.cart.listProduct[i].id, action.cart.listProduct[i].inventory)
            }
            

            state.cartInfor = action.cart;
            state.cartInfor.id = initialState.idShoppingCart;
            writeCartData('ShoppingCart', state.cartInfor);
            return { ...state };
        }
        //set total price
        case CONSTANTS.SET_TOTAL_PRICE:
            {
                // reduceProductInventory(0,2);
                state.totalPrice = action.price;
                return { ...state };
            }
        //clear cart 
        case CONSTANTS.CLEAR_CART: {
            return { ...state, cartItems: [] };
        }
        //get cart data shopping
        case CONSTANTS.GET_CART_DATA: {
            state.cartData = action.cartData.reverse();
            return { ...state };
        }
        case CONSTANTS.ADD_CUSTOMER: {
            createIdCustomer();
            state.user = action.user;
            writeUsertData('Customer', state.user)
            return { ...state };
        }

        case CONSTANTS.ADD_ITEM_IN_CART:
            {
                createIdCart();
                // console.log(action.payload);
                let index = state.cartItems.findIndex(x => x.id === action.payload.id);
                let store = action.payload.inventory;
                if (store < 0) {
                    console.log("ko đủ hàng");
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Sorry! Out Off Stock ...',
                    })
                    return { ...state };
                }
                // Is the item user wants to add already in the cart?
                if (index !== -1) {
                    // Yes, update the quantity.
                    let cloneCartItems = [...state.cartItems];
                    cloneCartItems[index] = {
                        ...cloneCartItems[index],
                        quantity: state.cartItems[index].quantity + action.payload.quantity,
                        inventory: state.cartItems[index].inventory - 1
                    };
                    if (cloneCartItems[index].inventory <= 0) {
                        console.log("ko đủ hàng");
                        Swal.fire({
                            type: 'error',
                            title: 'Oops...',
                            text: 'Sorry! Out Off Stock...',
                        })
                        return { ...state };
                    }
                    else {
                        Swal.fire({
                            type: 'success',
                            title: 'Add to cart !',
                            showConfirmButton: false,
                            timer: 700,
                            width: 300
                        })
                        return { ...state, cartItems: cloneCartItems };
                    }
                    // console.log(...state.cartItems);

                }
                // No, add a new item.
                Swal.fire({
                    type: 'success',
                    title: 'Add to cart !',
                    showConfirmButton: false,
                    timer: 700,
                    width: 300
                })
                return { ...state, cartItems: state.cartItems.concat(action.payload) };
            }


        case CONSTANTS.SHOW_CART_DLG:
            return { ...state, showCartDialog: action.payload };


        case CONSTANTS.DELETE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.id !== action.payload)
            };


        case CONSTANTS.TOGGLE_MENU:
            return { ...state, showMenu: !state.showMenu };


        case CONSTANTS.SET_LOGGED_IN_USER:
            return { ...state, loggedInUser: action.payload };


        case CONSTANTS.SET_CHECKEDOUT_ITEMS:
            return { ...state, checkedOutItems: action.payload };


        case CONSTANTS.UPDATE_CART_ITEM_QUANTITY:

            {
                let index = state.cartItems.findIndex(x => x.id === action.payload.id);

                if (index !== -1) {
                    let cloneCartItems = [...state.cartItems];
                    cloneCartItems[index] = {
                        ...cloneCartItems[index],
                        quantity: action.payload.quantity,
                        inventory: state.cartItems[index].inventory - 1
                    };

                    if (cloneCartItems[index].inventory <= 0) {
                        console.log("ko đủ hàng");
                        state.showCartDialog = false;
                        Swal.fire({
                            type: 'error',
                            title: 'Oops...',
                            text: 'Sorry!Out Off Stock...',
                        })
                        return { ...state };
                    }
                    else {
                        return { ...state, cartItems: cloneCartItems };
                    }
                }

                return { ...state };
            }
        default: return { ...state };

    }


};

export default rootReducer;
