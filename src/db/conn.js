const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userregister")
.then(() => {
    console.log(`connectin successful`)
}).catch((e) => {
    console.log('Noo connect');
})