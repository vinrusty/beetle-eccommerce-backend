const router = require('express').Router()
const authenticate = require('../middlewares/authenticate')
const Order = require('../models/Orders')
const Customer = require('../models/Customer')
const sgMail = require("@sendgrid/mail")
const dotenv = require("dotenv")
dotenv.config()

router.get('/:email', authenticate, async(req, res) => {
    const { email } = req.params
    try{
        const fetchedOrder = await Order.find({email: email})
        res.json(fetchedOrder)
    }
    catch(err){
        res.status(500).json("server error")
    }
})

router.post('/', authenticate, (req, res) => {
    Customer.findOne({email: req.body.email}, async (err, result) => {
        if(err){
            res.status(500).json("server error")
        }
        else if(!result){
            res.status(403).json("not found error")
        }
        else{
            try{
                const order = new Order(req.body)
                const savedOrder = await order.save()
                res.json({message: "success", order: savedOrder})
            }
            catch(err){
                res.status(500).json("server error")
            }
        }
    })
})
router.post("/order-mail", (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: req.body.email, // Change to your recipient
        from: 'vineethhr2002@gmail.com', // Change to your verified sender
        subject: `Beetles Order ID ${req.body.orderId} has been placed.`,
        text: `Hello ${req.body.orderName}! Your order with ID ${req.body.orderId} has been placed successfully at ${req.body.orderDate} and is arriving soon.`,
        html: `Hello ${req.body.orderName}! Your order with ID ${req.body.orderId} has been placed successfully at ${req.body.orderDate} and is arriving soon.`,
    }
    sgMail
    .send(msg)
    .then(() => {
        res.json({message: "success"})
    })
    .catch((error) => {
        console.error(error)
        res.status(500).json("email not sent")
    })
})

module.exports = router