const router = require('express').Router();
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);

    if(error){
        return res.status(400).json({error: error.details[0].message})
    }

    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists){
        return res.status(400).json({error: 'Email exists'})
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try{
        const savedUser = await user.save();
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.json({status: 'success', user: user._id, redirect: 'batcave', token})
    } catch(error){
        res.status(400).json(error);
    }

});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);

    console.log(error);

    if(error) {
        return res.status(400).json({error : error.details[0].message});
    }

    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return res.status(400).json({error: 'Email is not found'})
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword){
        return res.status(400).json({error: 'Invalid password'})
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({status: 'success', redirect:'batcave', token});
});

module.exports = router;