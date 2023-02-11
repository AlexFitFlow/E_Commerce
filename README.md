# E-Commerce Website

The website is an e-commerce platform built using React and Node.js. React is used to create the front-end, allowing for dynamic and interactive components, while Node.js is used for the back-end, providing server-side code execution and integration with the front-end. The website uses Express as its server, MongoDB to store user account information, Stripe API for handling financial transactions, and Google Maps API to display the company's location on the Contact Us page. Other technologies include FontAwesome for styling, Redux for state management, Bootstrap & Material UI for enhancing design, and Axios for making HTTP requests to the back-end.


## Tech Stack

* [React](https://reactjs.org/) 
    * A JavaScript library for building user interfaces. React is used to create the front-end of my website. React makes it easy to 
        create dynamic, interactive components that can be updated in real-time in response to user actions.
* [Node](https://nodejs.org/)
    * A JavaScript runtime built on Chrome's V8 JavaScript engine. Node is used to create the back-end of my website. Node allows you to
        write server-side code in JavaScript, making it easier to integrate with your front-end code and share data between the two.
* [Express](https://expressjs.com/)
    * A minimal and flexible Node.js web application framework. Express is used as the server for my website. Express makes it easy to
        handle incoming HTTP requests, route them to the appropriate handlers, and send responses back to the client.
* [MongoDB](https://www.mongodb.com/)
    * A document-oriented database that is designed to be scalable and flexible. MongoDB is used to store user account information and allow
        users to create an account and log out.
* [StripeAPI](https://stripe.com/)
    * A payment processing platform that provides a wide range of tools and APIs for accepting payments online. Stripe API to handle
        financial transactions, including checking out a user's cart.
* [GoogleMapsAPI](https://developers.google.com/maps) - Displays company location on Contact Us page
    * A mapping platform that provides a wide range of tools and APIs for displaying maps and information about geographic locations. Google
        Maps API to display the location of my company on the Contact Us page of the website.
* [FontAwesome](https://fontawesome.com/)
    * A toolkit that provides a large library of scalable vector icons that can be customized and styled using CSS. FontAwesome is used to
        style various pages of the website, making it easier to add visual interest and organization to my site.
* [Redux](https://redux.js.org/)
    * A state management library for JavaScript applications. Redux is used to manage the state of my cart and products, ensuring that
        updates to the cart and product data are consistent and available throughout the application.
* [Bootstrap](https://getbootstrap.com/)
    * A CSS framework that provides a set of pre-designed UI components and styles that can be easily customized and used in web
        applications. Bootstrap is used to enhance the design aspect of the website, making it easier to create a visually appealing and user-friendly experience.
* [MaterialUI](https://mui.com)
    * a popular React-based framework for building user interfaces with a material design look and feel, offering pre-designed and
        customizable components following Google's guidelines. MaterialUI is used to enhance the design aspect of the website, making 
        it easier to create a visually appealing and user-friendly experience.
* [Axios](https://axios-http.com/)
    * A Promise-based HTTP client for JavaScript. Axios is used to make HTTP requests for your Node back-end, allowing you me to easily
        retrieve and update data from the server.
* [AOS](https://michalsnik.github.io/aos/)
    * A JavaScript library that allows developers to create animations that are triggered when the user scrolls the page. AOS is used to
        add animated features to the user experience.



## Features

1. E-commerce platform built using React and Node.js.
2. Dynamic and interactive front-end created with React and styling with FontAwesome, Bootstrap & AOS.
3. Back-end implemented with Node.js and Express, utilizing MongoDB to store user account information and Stripe API for financial transactions.
4. State management handled with Redux.
5. Use of Google Maps API to display the company's location on the Contact Us page.
6. Product details page displaying individual product information including images, descriptions, and additional information.
7. Product list page with filters to sort products based on their category.
8. Checkout page to display order summary for items in a cart stored in the Redux store.
9. Shopping cart feature allowing users to add and remove products from the cart and display the total cost.
10. Light/dark mode feature for the user interface, with the ability to switch between modes and store the selected theme in local storage.


## Dependencies


|    Frontend   |    Backend    |
| ------------- | ------------- |
|      aos     | cors   |
|   axios      | stripe    |
|   bootstrap  | express  |
| font-awesome | cors    |
| @emotion/react | dotenv   |
| @emotion/styled |      |
| @mui/icons-material |      |
| @mui/material|    |
| @reduxjs/toolkit|     |
| @react-google-maps/api|     |
| react-bootstrap  |     |
| react-fast-marquee |    |
| react-redux |     |
| react-router-dom |     |
| stripe |     |



## Start Project

 * Frontend - npm start
 * Backend - node server.js
