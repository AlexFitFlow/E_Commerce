import React from "react";
import { Link } from "react-router-dom";


/*
==============
Success Page
==============
*/


const Cancel = () => {
return (
<>
    {/* Navbar */}
    {/* <Navbar /> */}
    <div className="container my-3 py-3">
    <div className="container">
        <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">

            {/* Header */}
            <h4 className="p-3 display-5">The order has been canceled!</h4>
            <p style = {{margin:'auto', width: '70%', lineHeight: '1.5', marginBottom: '3rem'}} className="lead text-center improv2">
                We apologize that your transaction has been cancelled. We understand that sometimes things can go wrong during the 
                checkout process, and we're here to help. If there was an issue with your payment, we encourage you to try again or 
                reach out to us for assistance. Our customer service team is always available to assist you with any questions or 
                concerns you may have.</p>
            <p style = {{margin:'auto', width: '70%', lineHeight: '1.5', marginBottom: '3rem'}} className="lead text-center improv2">Best regards, Fitness Warehouse</p>
            {/* Link To Home */}
            <div className="d-flex flex-column align-items-center">
                <Link to="/contact" className="btn  btn-outline-dark mx-4 graphic2 btn-2 p-2">
                <i className="fa fa-arrow-left "></i> Go to Contact Us
                </Link>
                <Link to="/" className="btn  btn-outline-dark mx-4 graphic2 btn-2 p-2 mt-3">
                <i className="fa fa-arrow-left "></i> Go Back to Home
                </Link>
            </div>
        </div>
        </div>
    </div>
    </div>
</>
);
};

export default Cancel;