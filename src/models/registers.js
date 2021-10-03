const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const empyScham = new mongoose.Schema({
    full_name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    phone_no : {
        type: Number,
        required: true,
        unique: true
    },
    gender : {
        type: String,
        required: true,
    },
    age : {
        type: String,
        required: true
    },
    pass : {
        type: String,
        required: true
    },
    con_pass : {
        type: String,
        required: true
    },
    tokens : [{
        token:{
            type:String,
            required:true
        }
    }]
})

//Middleware

empyScham.methods.generatAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(e){
        res.send("This is console part"+e);
        console.log("This is console part"+e);

    }
}

empyScham.pre("save", async function(next) {
    if(this.isModified("pass")){
        console.log(`the pass 1 ${this.pass}`);
        this.pass = await bcrypt.hash(this.pass,10)
        this.con_pass = await bcrypt.hash(this.con_pass,10);
    //this.con_pass = undefined;

    }
    //const passHash = await bcrypt.hash(password,10);
    next();
})
const Register = new mongoose.model("register", empyScham);
module.exports = Register;