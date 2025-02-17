const express =require('express');
const app=express();
const mongoose = require('mongoose');
const { User,User} = require('./models/User');
const bcrypt = require('bcrypt')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ;
const jwt = require('jsonwebtoken');
const jvt=require('jsonwebtoken');
const cors=require('cors');
const morgan=require('morgan');






mongoose.connect('mongodb://127.0.0.1:27017/ecommersekle')
.then(()=>{
    console.log("db is connected");

})
.catch(()=>{
    console.log("db is not connected");

})

// for form method we use middlewarew

app.use(express.json())


//  task-1 -> route for register

app.post('/register',async(req,res)=>{
    const{email,password,name} =req.body;
    if(!email||!password||!name){
        res.status(400).json({message:"some field are missing"})

    }
    // to check user is register or not

    const isUserAlreadyExist = await User.findOne({email});
      if(isUserAlreadyExist){
        res.status(400).json({message:"user already have account"})
        return;
      }else{

        // hashing password
        const salt =bcrypt.genSaltSync(10);
        const hashedpassword=bcrypt.hashSync(password,salt);
                                                                                                                      


const token = jwt.sign(email,"supersecret");
await User.create({
    name: name,
    email: email,
    password:hashedpassword,
    token:token

})


      }
      return res.status(201).json({message:"user created sucessfully"})

});
//  task 2 ->route register
app.post('/login',async(req,res)=>{
  const{email,password}=req.body;
  const user=await User.findOne({email:email});
  if(User){
    // if user exist
    const isPasswordMatched=bcrypt.compareSync(password,User.password);
    if(isPasswordMatched===true){
        res.status(200).json({
            name:User.name,
            token:User.token,
            email:User.email
        
            
        });
        }else{
            res.status(400).json({message:"password not match"});
          }
    }else{
        res.status(400).json({message:"user is not registered please register"});
    }

})





let PORT =8080;
app.listen(PORT,()=>{
console.log(`server is connected to ${PORT}`);

})
