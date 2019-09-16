import React, { Component } from 'react'
export default class Home extends Component {
    render() {
        return (
            <div className="ml-3">
                <div style={{
                    height: 500,
                    overflow: 'hidden',
                    backgroundSize: 'cover', backgroundImage: "url('./img/background1.jpg')"
                }}>
                    <div style={{ textAlign:"center" , position:"relative", top:"30%"}}>
                        <button onClick={() => {
                            this.props.history.push("/search/")
                        }} className="btn btn-outline-light">POPULAR PRODUCT</button>
                        <h3 style={{ color: "white" }}>POPULAR PRODUCT IN MY STORE</h3>
                    </div>

                </div>
                <div className="d-flex justify-content-between">
                    <div  style={{
                        width: "45%", marginTop: 10, height: 500,
                        overflow: 'hidden',
                        backgroundSize: 'cover', backgroundImage: "url('./img/background2.jpg')"
                    }}>
                        <div style={{ textAlign:"center" , position:"relative", top:"30%"}}>
                            <button onClick={() => {
                                this.props.history.push("/account")
                            }} className="btn btn-outline-light">ACCOUNT</button>
                            <h3 style={{ color: "white" }}>LOGIN & CREATE ACCOUNT</h3>
                        </div>

                    </div>
                    <div  style={{
                        width: "54%", marginTop: 10, height: 500,
                        overflow: 'hidden',
                        backgroundSize: 'cover', backgroundImage: "url('./img/background3.jpg')"
                    }}>
                        <div style={{ textAlign:"center" , position:"relative", top:"30%"}}>
                            <button onClick={() => {
                                this.props.history.push("/search/?category=All categories")
                            }} className="btn btn-outline-light">ALL CATEGORY</button>
                            <h3 style={{ color: "white" }}>SHOPPING NOW</h3>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
