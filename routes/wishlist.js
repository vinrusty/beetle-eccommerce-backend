const router = require("express").Router()
const authenticate = require("../middlewares/authenticate")
const Wishlist = require("../models/Wishlist")
const Customer = require("../models/Customer")

router.get("/:email", authenticate, async (req, res) => {
    const { email } = req.params
    try{
        const fetchedWishlist = await Wishlist.find({email: email})
        res.json(fetchedWishlist)
    }
    catch(err){
        res.status(500).json("server error")
    }
})

router.post("/", authenticate, (req, res) => {
    const { email, product } = req.body
    Customer.findOne({email: email}, (err, result) => {
        if(err){
            res.status(500).json("server error")
        }
        else if(!result){
            res.status(400).json("not found error")
        }
        else{
            Wishlist.findOne({productid: product.productid}, async(err, result) => {
                if(err){
                    res.status(500).json("server error")
                }
                else if(!result){
                    try{
                        const wishlistItem = new Wishlist(req.body)
                        const savedWishlistItem = await wishlistItem.save()
                        res.json({wishlist: savedWishlistItem, message: "success"})
                    }
                    catch(err){
                        res.status(500).json("server error")
                    }
                }
                else{
                    res.json("added")
                }
            })
        }
    })
})

router.delete("/:id", authenticate, (req, res) => {
    const { id } = req.params
    Wishlist.findOneAndDelete({wishlistItemId: id}, function(err, result){
        if(err){
            res.status(500).json("error in deleting from wishlist")
        }
        else if(!result){
            res.status(400).json("item not found")
        }
        else{
            res.json({message: "success", result})
        }
    })
})

module.exports = router