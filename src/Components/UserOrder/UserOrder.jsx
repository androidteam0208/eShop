import React, { Component } from 'react'
import { connect } from 'react-redux';
import firebase from 'firebase';

class UserOrder extends Component {

    constructor(props){
        super(props);
        this.state={
            listOrder:[],
            loggedInUser : this.props.loggedInUser
        }
    }
    getData(){
            firebase.database().ref().child("ShoppingCart").on("value", (snapshot) =>{
                let idCart = snapshot.numChildren();
                let arr = snapshot.val();
                let arr2 = Object.values(arr);
                var mang = [];
                for(let i=0; i<idCart; i++){
                    if(arr2[i].customer === this.props.match.params.mail){
                        mang = mang.concat(arr2[i])
                    } 
                }
                this.setState({
                    listOrder: mang.reverse()
                })

                return {...this.state};
            })
    }
    componentDidMount(){
        this._isMounted = true;
       this.getData();
       return {...this.state};
    }
    render() {
        return (
            <div className="m-2">
                <p style={{ fontSize: "32px", color: "504F5A" }}>Your Orders</p>
                <div>
                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Placed On</th>
                                <th scope="col">Payment status </th>
                                <th scope="col">Order status </th>
                                <th scope="col">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(this.state.listOrder!==[]) ? (this.state.listOrder.map((item, index) => {
                                
                                return (<tr key={index} style={{ cursor: "pointer" }} onClick={() => {
                                    this.props.history.push('/detailorder/' + item.id)
                                }}>
                                    <th scope="row">#{item.id+ 4900}</th>
                                    <td>{item.time}</td>
                                    {item.status ? <td style={{ color: "#375975" }}>UnCheck</td> : <td style={{ color: "lightgray" }}>Checked</td>}

                                    <td style={{ color: "green" }}>Fullfilled</td>
                                    <td>$ {item.totalPrice}.00</td>
                                </tr>)
                            })): (<div>
                            </div>)}

                        </tbody>
                    </table>
                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return { loggedInUser: state.rootReducer.loggedInUser, };
  };
export default connect(mapStateToProps)(UserOrder)
