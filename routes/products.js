const router = require("express").Router()
const authenticate = require("../middlewares/authenticate")
const Product = require("../models/Products")

router.get("/", async (req, res) => {
    try{
        const fetchedProducts = await Product.find({});
        res.json(fetchedProducts);
    }
    catch(err){
        res.status(400).json("Error in fetching products");
    }
})

router.post("/", async (req, res) => {
    try{
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.json(savedProduct);
    }
    catch(err){
        res.status(500).json("Error in adding product");
    }
})

module.exports = router