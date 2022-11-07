const asyncHandler = require('express-async-handler')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validateEmail, validateLength } = require('../helpers/validation')



module.exports = {

    ///register user
    register: asyncHandler(async (req, res) => {
        console.log(req.body)
        const { firstname,
            lastname,
            email,
            phonenumber,
            password,
            // dateofbirth,
            gender,
           
        } = req.body

        if (!validateEmail(email)) {
            res.status(400).json({ message: 'invlaid email address' })
            // throw new Error('Invalid email address')
        }

        const check = await userModel.findOne({$or:[{email},{phonenumber}] })
        if (check) {
            res.json({ message: 'This email already exists, try another one' })
            throw new Error('Email already exists')

        }
        else if (!validateLength(firstname, 3, 12)) {
            res.json({ message: 'First name need minimum 3 and maximum 12 characters' })
            throw new Error('First name need minimum 3 and maximum 12 characters')
        }
        else if (!validateLength(lastname, 1, 12)) {
            res.json({ message: 'Last name need minimum 1 and maximum 12 characters' })
            throw new Error('Last name need minimum 1 and maximum 12 characters')
        }
        else if (!validateLength(phonenumber, 10, 10)) {
            res.json({ message: 'Please enter a valid mobile number' })
            throw new Error('Please enter a valid mobile number')
        }
        else if (!validateLength(password, 6, 16)) {
            res.json({ message: 'Password need minimum 6 or maximum 16 characters' })
            throw new Error('Password need minimum 6 or maximum 16 characters')
        }

        else {
            let bcryptedPassword = await bcrypt.hash(password, 12)
            console.log(bcryptedPassword)
            const user = await new userModel({
                firstname,
                lastname,
                email,
                phonenumber,
                password: bcryptedPassword,              
                gender,               
            }).save()
            const token = jwt.sign(
                { _id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h',
                }
            )
            ///save userToken
            user.token = token
            res.status(200).json({
                _id:user._id,
                firstname:user.firstname,
                lastname:user.lastname,
                email:user.email,
                phonenumber:user.phonenumber,
                token
            })
        }
    }),



    ///login user
    loginUser: asyncHandler(async (req, res) => {
        const { email, password } = req.body

        if (!email || !password) {
            res.json({ message: 'Please fill up your details' })
            throw new Error('Details are missing')
        }
        let user = await userModel.findOne({ email: email })
        if (user && (await bcrypt.compare(password, user.password))) {
           //generating token 
            const token = jwt.sign({
                _id: user._id, email
            },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                }
            )
            res.status(200).json({
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                token
            })
        } else {
            res.json({ message: 'user not found' })
            throw new Error('User not found')
        }
    }),


    ///user details getting
    getUser: asyncHandler(async (req, res) => {
        const user = await userModel.findOne({_id:req.user._id})
        if(user){
        res.status(200).json(user)
    }
    else{
        res.json({message:'userNotFound'})
        throw new Error('User not found')
    }
    })


}