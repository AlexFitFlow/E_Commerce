// This line is requiring the 'fs' (File System) module in Node.js. The fs module provides a way of working with the 
// file system on your computer, allowing you to read, write, and manipulate files and directories
const fs = require("fs");
require('dotenv').config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.products);
const {YOUR_DOMAIN} = process.env;
const {FRONT_END_BASE_URL} = process.env;

// Creates a product in the Stripe API. It takes the product information, such as title and description, and 
// metadata (such as product title and data ID) as input, and returns the product object created in the Stripe API
async function createStripeProduct(product, options = {}) {
	try{
		const stripeProduct = await stripe.products
		.create({
			name: product.title,
			desciption: product.desciption,
			images: product.image ? [`${YOUR_DOMAIN}${product.image.slice(1)}`] : [],
			metadata: {
				product_title: product.title,
				data_id: product.id,
			},
			...options,
		})
	return stripeProduct;

	}
	catch(err){
		console.log(err)
	}
}

// Creates the price for the product in the Stripe API. It takes the product information, 
// the Stripe product ID, and metadata (such as product title and data ID) as input, and 
// returns the price object created in the Stripe API.
async function createStripeProductPrice(product, stripeProductId, options = {}) {
	const productPrice = Math.round(product.price * 100);

	const price = await stripe.prices
		.create({
			unit_amount: productPrice,
			currency: "usd",
			billing_scheme: "per_unit",
			product: stripeProductId,
			metadata: {
				product_title: product.title,
				data_id: product.id,
			},
			...options,
		})
		.catch((err) => ({ error: err }));

	return price;
}

// creates both a product and a price in the Stripe API. It takes the product information, product options, 
// and price options as input and returns the product and price objects created in the Stripe API.
async function createStripeProductAndPrice(product, productOptions = {}, priceOptions = {}) {
	if (!product) throw new Error("Product required");

	let stripeProduct = await createStripeProduct(product, productOptions).catch((err) => ({ error: err }));
	if (stripeProduct?.error) return stripeProduct;

	const stripeProductPrice = await createStripeProductPrice(product, stripeProduct.id, priceOptions).catch((err) => ({ error: err }));
	if (stripeProductPrice?.error) return stripeProductPrice;

	stripeProduct = await stripe.products.update(stripeProduct.id, { default_price: stripeProductPrice.id });

	return { product: stripeProduct, price: stripeProductPrice };
}

// Deletes duplicate products from the Stripe API. It takes an array of product matches as input and returns an array 
// containing the "primary" entry (the first product in the array) only.
async function cleanupDuplicateStripeProducts(productMatches) {
	for (let i = 0; i < productMatches.length; i++) {
		if (i > 0) {
			if (productMatches[i]?.default_price) {
				await stripe.prices.update(productMatches[i].default_price, { active: false }).catch((err) => err);
			}
			// deactivate all prices matching a product to delete
			await stripe.prices
				.search({
					query: `active:\'true\' AND product:\'${productMatches[i].id}\'`,
				})
				.then(async (prices) => {
					if (prices.length > 0) {
						for (let price of prices) {
							await stripe.prices.update(price.id, { active: false }).catch((err) => err);
						}
					}
				})
				.catch((err) => ({ error: err }));

			// try to delete product
			await stripe.products.del(productMatches[i].id).catch((err) => {
				console.log("ERROR DELETING PRODUCT: ", productMatches[i].id);
				return { error: err };
			});
		}
	}
	// return array with "primary" entry only
	return [productMatches[0]];
}

// importing the express module, which is a web framework for Node.js
const express = require("express");

// Method To Handle CORS (Cross-Origin Resource Sharing) Headers
const cors = require("cors");

// The express function is then invoked to create an instance of the Express application
const app = express();

app.options(FRONT_END_BASE_URL, cors())

// A GET route is defined for the root path ("/") that returns a response of "home".
app.get("/", (req, res) => {
	// res.send('hello world')
	res.send("home");
});

// A GET route is defined for the /cart path that returns a response of "cart test".
app.get("/cart", function (req, res) {
	res.send("cart test");
});

// The express.static middleware is used to serve a public directory. The name of the directory is "public"
app.use(express.static("public"));

// The cors middleware is then used to handle CORS headers.
app.use(cors({
	origin: [FRONT_END_BASE_URL]
}));

// The express.json middleware is used to parse incoming request bodies in JSON format.
app.use(express.json());

// The express.urlencoded middleware is used to parse incoming request bodies as URL-encoded data. 
// This middleware is configured with the { extended: true } option, which allows for rich objects 
// and arrays to be encoded into the URL-encoded format.
app.use(express.urlencoded({ extended: true }));

// Setting up a GET endpoint on the Express server at the path "/products". When a GET request is 
// made to this endpoint, the code inside the function will run.
app.get("/products", async function (req, res) {
	const products = await stripe.products
		.list()
		.then((prods) => prods.data)
		.catch((err) => ({
			error: err,
		}));

	if (products.error) {
		res.status(500).json({ error: products.error });
		return;
	}

	console.log(products.length);

	res.status(200).json({ message: "Success", products, length: products.length });
});


app.post("/products/seed", async function (req, res) {
	const exportToFile = req.body?.exportToFile ?? false;
	const cleanupDuplicates = req.body?.removeDuplicates ?? false;
	const products = req.body.products ?? [];
	const mutatedProducts = [];

	for (const product of products) {
		console.log(`${product.title}: ${product.id}`);
		let productPriceId;

		let productMatches = await stripe.products
			.search({
				query: `active:\'true\' AND metadata[\'data_id\']:\'${product.id}\'`,
			})
			.then(async (m) => {
				if (m.data?.length > 0) return m.data;

				let retryMatch = await stripe.products
					.search({
						query: `active:\'true\' AND name:\'${product.title}\'`,
					})
					.then((m) => m.data)
					.catch((err) => ({ error: err }));

				return retryMatch;
			})
			.catch((err) => ({ error: err }));

		if (!productMatches?.error && productMatches.length > 0) {
			// optionally cleanup duplicate products and prices
			if (productMatches.length > 1 && cleanupDuplicates) {
				productMatches = await cleanupDuplicateStripeProducts(productMatches);
			}

			if (!productMatches[0]?.metadata?.data_id && !productMatches[0]?.metadata?.product_title) {
				const updates = {
					desciption: product.desciption,
					metadata: {
						data_id: Number.parseInt(product.id),
						product_title: product.title,
					},
				};

				if (product?.image && updates?.images?.length === 0) updates.images = [`${YOUR_DOMAIN}${product.image.slice(1)}`];

				const stripeProductUpdate = await stripe.products.update(productMatches[0].id, updates).catch((err) => ({ error: err }));
				if (!stripeProductUpdate?.error) productMatches = [stripeProductUpdate];
			}

			// if existing default price, set as productPriceId
			if (productMatches[0]?.default_price) {
				productPriceId = productMatches[0].default_price;
			} else {
				// find matching prices
				let matchingPriceArr = await stripe.prices
					.search({
						query: `active:\'true\' AND product:\'${productMatches[0].id}\' AND unit_amount:\'${Math.round(product.price * 100)}\'`,
					})
					.catch((err) => ({ error: err }));

				// if matches, setProductPriceId equal to the first element, otherwise create new price
				if (!matchingPriceArr.error && matchingPriceArr.length > 0) {
					productPriceId = matchingPriceArr[0].id;
				} else {
					const newProductPrice = await createStripeProductPrice(product, productMatches[0].id);
					if (!newProductPrice?.error) productPriceId = newProductPrice.id;
				}

				await stripe.products.update(productMatches[0].id, { default_price: productPriceId }).catch((err) => ({ error: err }));
			}

			// uncomment following lines if you need to replace all prices for some reason
			// await stripe.prices.update(productPriceId, { active: false }).catch((err) => err);
			// let replacePrice = await createStripeProductPrice(product, productMatches[0].id);
			// if (!replacePrice?.error) {
			// 	productPriceId = replacePrice.id;
			// 	await stripe.products.update(productMatches[0].id, { default_price: productPriceId }).catch((err) => err);
			// }
		} else {
			const newProdAndPrice = await createStripeProductAndPrice(product).catch((err) => err);
			if (!newProdAndPrice?.error) productPriceId = newProdAndPrice.price.id;
		}

		mutatedProducts.push({ ...product, priceId: productPriceId });
	}

	// console.log("MUTATED PRODUCTS", mutatedProducts);

	// optionally export data (products array with priceId appended to each product) to local file:
	if (exportToFile) {
		const exportFile = res.body?.exportFile ?? "updatedProducts.js";
		// copy array insde file over to json file after to update local products
		fs.writeFileSync(exportFile, `let products = ${JSON.stringify(mutatedProducts)}`, { encoding: "utf8", flag: "w" });
	}

	res.status(200).json({ message: "Success", products: mutatedProducts });
});





app.post("/checkout", async (req, res) => {
	// Data sent from frontend axios request in data param is accessed on req.body
	// console.log("REQUEST DATA: ", req.body);
	// console.log("REQUEST QUERY: ", req.query);
	// console.log should be visible in your server terminal

	async function createStripeShipping(amount, options = {}) {
		let amountInCents = amount * 100;
		const shipping = await stripe.shippingRates
			.create({
				display_name: "Ground Shipping",
				type: "fixed_amount",
				fixed_amount: { amount: amountInCents, currency: "usd" },
				...options,
			})
			.catch((err) => ({ error: err }));

		return shipping;
	}

	let products = req.body?.products ?? [];
	let shipping = req.body?.shipping ?? 0.0;

	let stripeProducts = [];

	if (products.length > 0) {
		for (let product of products) {
			const stripeProd = {
				quantity: product.qty,
				price: product.priceId,
			};

			stripeProducts.push(stripeProd);
		}
	}

	const stripeShipping = await createStripeShipping(shipping);

	// 	// you would likely want to handle stripe here and now have access to the data sent over
	const session = await stripe.checkout.sessions.create({
		line_items: stripeProducts,
		mode: "payment",
		// success_url: `http://localhost:3001/checkout/success`,
		// cancel_url: `http://localhost:3001/checkout/cancel`,
		success_url: `${FRONT_END_BASE_URL}/success`,
		cancel_url: `${FRONT_END_BASE_URL}/cancel`,
		custom_text: {
            submit: {
                message: 'Card Info: 4242424242424242 - Date: Any future date - CVC: Any 3 numbers'
            },
		},
		// automatic_tax: { enabled: true },
		shipping_options: [
			{
				shipping_rate: stripeShipping.id,
			},
		],
	});

	// 	// res.redirect(303, session.url);
	// 	// send back successful status of 200 and whatever data we want to send back -- so an object with message in this case
	res.status(200).json({ message: "Success", url: session.url, id: session.id });
	// });
});


// setting up the express application to use the routes defined in the cart.routes module, and starting the server to listen 
// for incoming requests on port 3001

// Requires the cart.routes module, which exports the defined routes for handling requests related to the cart.
const cartRoutes = require("./routes/cart.routes");

// This line mounts the cartRoutes module to the /cart endpoint of the application. This means that when a request is made to 
// the /cart endpoint, the cartRoutes module will handle the request.
app.use("/cart", cartRoutes);

// This line starts the server and listens on port 3001. The listen method takes two arguments: the first is the port number 
// and the second is a callback function that logs a message to the console indicating that the server is running on the specified port.
app.listen(3001, () => console.log("Running on port 3001"));

