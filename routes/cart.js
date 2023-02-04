const router = require("express").Router()
const authenticate = require('../middlewares/authenticate');
const Cart = require("../models/Cart")
const Customer = require("../models/Customer")

router.get("/:email", authenticate, async (req, res) => {
    const { email } = req.params
    try{
        const fetchedCart = await Cart.find({email: email})
        res.json(fetchedCart)
    }
    catch(err){
        res.status(500).json("Error in fetching cart items")
    }
})

router.post("/", authenticate, (req, res) => {
    Customer.findOne({email: req.body.email}, async (err, result) => {
        if(err){
            res.status(500).json("server error")
        }
        else if(!result){
            res.status(403).json("not found error")
        }
        else{
            try{
                const cartItem = new Cart(req.body)
                const savedCartItem = await cartItem.save()
                res.json({message: "success"})
            }
            catch(err){
                res.status(500).json("Error in adding to the cart")
            }
        }
    })
})

router.patch("/:id", authenticate, (req, res) => {
    Customer.findOne({email: req.body.email}, (err, result) => {
        if(err){
            res.status(500).json("server error")
        }
        else if(!result){
            res.status(403).json("not found error")
        }
        else{
            Cart.findOneAndUpdate({ cartItemid: req.params.id }, { quantity: req.body.quantity + req.body.incrementor }, function(err, result){
                if(err){
                    res.status(500).json("Error in updating the cart item")
                }
                else if(!result){
                    res.status(400).json("cart item not found")
                }
                else{
                    res.json({message: "success"})
                }
            })
        }
    })
})

router.delete("/:id", authenticate, (req, res) => {
    if(req.params.id === 'all'){
        Cart.deleteMany({email: req.body.email}, function(err){
            if(err){
                res.status(500).json("Error in deleting the cart items")
            }
            else{
                res.json({message: "success"})
            }
        })
    }
    else{
        Cart.findOneAndDelete({email: req.body.email, cartItemid: req.params.id}, function(err, result){
            if(err){
                res.status(500).json("Error in deleting the cart item")
            }
            else if(!result){
                res.status(403).json("Item not found")
            }
            else{
                res.json({message: "success"})
            }
        })
    }
})

module.exports = router