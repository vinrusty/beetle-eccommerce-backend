const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const customerRoutes = require('./routes/customers');
const googleAuthRoutes = require('./routes/googleAuth');
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders")
const paymentRoutes = require("./routes/payment");
const wishlistRoutes = require("./routes/wishlist")
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportSetup = require('./passport');

dotenv.config();

try{
    mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log("connected to the database");
        }
    );
}
catch(err){
    console.log("could not connect to the database");
}

app.use(cookieParser())
app.use(
    session({
        secret: 'vineeth',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize())
app.use(passport.session())


app.use(bodyParser.json());
app.use(cors({
    origin: "https://beetles-ecommerce.web.app/",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true
}));

app.use("/api/customers", customerRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/wishlist", wishlistRoutes);

app.listen(process.env.PORT || 3001, () => {
    console.log(`listening to you`);
})