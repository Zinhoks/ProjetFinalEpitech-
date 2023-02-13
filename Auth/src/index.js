const express = require ("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const cors = require('cors');
const mongoose = require ("mongoose")

app.use(express.json());
app.use(cors())
app.use("/users", userRouter)


//Stripe 
require('dotenv').config();
const stripe = require ("stripe")(process.env.STRIPE_SECRET_TEST);
console.log(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const Commande  = require("./models/commande");

app.post("/stripe", cors(), async(req, res) => {
        let {amount, id, iduser, dishinfo } = req.body;
        let total = parseInt(amount.TotalPrice);
        try {
                const payment = await stripe.paymentIntents.create({
                        amount : total,
                        currency : "EUR",
                        description : "Your Company Description",
                        payment_method : id,
                        confirm : true,
                        
                });
                const newPayment = new Commande({
                        amount : total,
                        currency : "EUR",
                        description : "Your Company Description",
                        payment_method : id,
                        confirm : true,
                        idUser : iduser,
                        dishinfo : JSON.parse(dishinfo),
                      });
                  
                      await newPayment.save();
                res.json({
                        message : "payment réussi",
                        success : true,
                })

        }catch(error){
            console.log("erreur...", error)
            res.json({
                message : " le payment a echoué",
                success : false,
            })    
        }
})




mongoose.connect("mongodb+srv://admin:admin@clusterilyes.teutkqo.mongodb.net/Epeat?retryWrites=true&w=majority")
.then(() => {
    app.listen(3001, () => {
        console.log("Server started on port n: 3001 have fun")
        });

})
.catch((error) => {
        console.log(error);
})


mongoose.set('strictQuery', true );
module.exports = app;

