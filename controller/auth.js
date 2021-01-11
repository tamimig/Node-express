
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
exports.login = async(req, res) =>{
    try {
        const {email,password} = req.body; 
        if(!email || !password){
            return res.status(400).render('login', {
                message: 'email and password are required'
            })
        }
        db.query('select * from users where email = ?', [email], async(error, results)=>{
            if(!results || !(await bcrypt.compare(password,results[0].password))){
                   res.status(401).render('login',{
                message: 'Email or Password incorrect'
            })
            } else {
                const id = results[0].id; 
                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                const cookieOptions = { 
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ), 
                    httpOnly: true
                }

                res.cookie('jwt',token,cookieOptions); 
                res.status(200).redirect("/")
            }
         
        })
    }catch(error) {
            console.log(error)
    }

} 
exports.register = (req,res) => {
    console.log(req.body); 

// exports.login = (req,res) => {
    
// }

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordconfirm = req.body.passwordconfirm;

    const {name, email, password, passwordconfirm} =req.body; 
    db.query('select email from users where email=?',[email],async(error,results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register',{
                message: `The email ${email} already in use`
            })
         } else if(password !== passwordconfirm){
                return res.render('register', {
                    message:'Passwords do not match'
                });
            }
            let hashedPassword =await bcrypt.hash(password,8); 
            console.log(hashedPassword); 
            db.query('insert into users set ?', {name:name,email:email,password:hashedPassword}, (error,results)=>{
                if(error){
                    consol.log(error); 
                }else {
                    console.log(results);
                    return res.render('register', {
                        message: "User Registered"
                    }); 
                }

            });
    });

   
    //res.send("Form submitted"); 
}