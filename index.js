const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const customerRoutes = require('./routes/customers');
const PORT = 3001

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

app.use(bodyParser.json());
app.use(cors());

app.use("/api/customers", customerRoutes);



app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
})