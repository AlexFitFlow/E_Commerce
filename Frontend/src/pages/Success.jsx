import React from "react";
import { Link } from "react-router-dom";


/*
==============
Success Page
==============
*/


const Success = () => {
return (
<>
    {/* Navbar */}
    {/* <Navbar /> */}
    <div className="container my-3 py-3">
    <div className="container">
        <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">

            {/* Header */}
            <h4 className="p-3 display-5">Thank You for Your Purchase!</h4>
            <p style = {{margin:'auto', width: '70%', lineHeight: '1.5', marginBottom: '3rem'}} className="lead text-center improv2">
                Congratulations on completing your purchase! Your payment was successful 
                and your order is now being processed. If you have any questions or concerns, 
                please don't hesitate to reach out to us at fitwarehouse@gmail.com.</p>
            <p style = {{margin:'auto', width: '70%', lineHeight: '1.5', marginBottom: '3rem'}} className="lead text-center improv2">
                Thank you for choosing our product and we hope you enjoy it!</p>
            <p  style = {{margin:'auto', width: '70%', lineHeight: '1.5', marginBottom: '3rem'}} className="lead text-center improv2">
                Best regards, Fitness Warehouse</p>
            {/* Link To Home */}
            <Link to="/" className="btn  btn-outline-dark mx-4 graphic2 btn-2 p-2">
            <i className="fa fa-arrow-left "></i> Go Back to Home
            </Link>
        </div>
        </div>
    </div>
    </div>
</>
);
};

export default Success;
