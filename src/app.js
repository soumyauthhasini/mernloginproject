require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/registers");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}))
const static_path = path.join(__dirname, "../public");
const templare_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path)); 
app.set("view engine", "hbs");
app.set("views", templare_path);
hbs.registerPartials(partials_path);  

console.log(process.evn.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        
        
        const useremail = await Register.findOne({email:email});
        const passwor_pput = useremail.pass;

        const isMatch = await bcrypt.compare(password, passwor_pput);

        const token = await useremail.generatAuthToken();
        console.log(`Login Token ${token}`);

        console.log(isMatch);
        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send(`No no Pass ${isMatch}`);
        }
        //res.send(useremail.pass);
        

       //console.log(`Email: ${email} Password ${password} User ${useremail}`);

    }catch(e){
        res.status(400).send(`Inavlid Login`)
    }
})


app.post("/register", async(req, res) => {
    try{

        const pass = req.body.pass;
        const con_pass = req.body.con_pass;
        
        if( pass === con_pass){
            const registerEmp = new Register({
                full_name: req.body.full_name,
                email: req.body.email,
                gender: req.body.flexRadioDefault,
                phone_no: req.body.phone_no,
                age: req.body.age,
                pass: req.body.pass,
                con_pass: req.body.con_pass,
            })

            console.log(`Register Data ${registerEmp}`);

            const token = await registerEmp.generatAuthToken();

            const registerdata = await registerEmp.save();
            console.log("The data "+registerdata);
            res.status(201).render("index");
        }else{
            res.send("Password Not match");
        }
    }catch(e){
        res.status(400).send(e);
    }
});



app.get("/", (req, res) => {
    res.send("Hello Start The servers");
});

// const securePassword = async (password) =>{
     
//     const passHash = await bcrypt.hash(password,10);
//     console.log(passHash);

//     const passComm = await bcrypt.compare('123',passHash);
//     console.log(passComm);
// }
// securePassword('1234');

const jwt = require("jsonwebtoken");

const createdToken = async() => {
    const token = await jwt.sign({_id:"6158b6e44f16ab169171f432"}, "mynamesomdevelopericantyrtocreatedaaccesstoken")
    console.log(token);

    const userVer = await jwt.verify(token,"mynamesomdevelopericantyrtocreatedaaccesstoken");
    console.log(userVer);
}
createdToken();

app.listen(port, () => {
    console.log(`Server is runnning at port no ${port}`);
});