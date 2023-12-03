const User = require("../model/userModel");

module.exports.register = async(req, res, next) => {
    try{
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username});
        if(usernameCheck)
            return res.json({msg: "username already used", status: false});
        const emailCheck = await User.findOne({email});
        if(emailCheck)
            return res.json({msg: "email already used", status: false});
        const user = await User.create({
            email,
            username,
            password,
        });
        delete user.password;
        return res.json({status: true, user});
    }catch(ex){
        next(ex);
    }
};

module.exports.login = async(req, res, next) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user)
            return res.json({msg: "incorrect username or password", status: false});
        const isPasswordValid = (password === user.password);
        if(!isPasswordValid)
            return res.json({msg: "incorrect username or password", status: false});
        delete user.password;
        return res.json({status: true, user});
    }catch(ex){
        next(ex);
    }
};

module.exports.setAvatar = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({isSet:userData.isAvatarImageSet, image: userData.avatarImage});
    }catch(ex){
        next(ex);
    }
};

module.exports.getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email", "username", "avatarImage", "_id",
        ]);
        return res.json(users);
    }catch(ex){
        next(ex);
    }
};

module.exports.updateName = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const username = req.body.username;
        const usernameCheck = await User.findOne({username});
        if(usernameCheck)
            return res.json({msg: "username already used", status: false});
        const userData = await User.findByIdAndUpdate(userId, {username});
        if(userData !== null){
            return res.json({msg: "username updated successfully", status: true, userData});
        }
        return res.json({msg: "user not found", status: false});
    }catch(ex){
        next(ex);
    }
};

module.exports.updateEmail = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const email = req.body.email;
        const emailCheck = await User.findOne({email});
        if(emailCheck)
            return res.json({msg: "email id already used", status: false});
        const userData = await User.findByIdAndUpdate(userId, {email});
        if(userData !== null)
            return res.json({msg: "email id updated successfully", status: true, userData});
        return res.json({msg: "user not found", status: false});
    }catch(ex){
        next(ex);
    }
};

module.exports.updatePassword = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const {oldpass, newpass} = req.body;
        const user = await User.findOne({_id: userId});
        const isPasswordValid = (oldpass === user.password);
        if(isPasswordValid === false){
            return res.json({msg: "old password is incorrect", status: false});
        }
        const isPasswordSame = (newpass === user.password);
        if(isPasswordSame){
            return res.json({msg: "old password and new password should not be same", status: false});
        }
        const userData = await User.findByIdAndUpdate(userId, {password: newpass});
        if(userData !== null)
            return res.json({msg: "password updated successfully", status: true, userData});
        return res.json({msg: "user not found", status: false});
    }catch(ex){
        next(ex);
    }
};

module.exports.deleteUser = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const userData = await User.deleteOne({_id: userId});
        if(userData.deletedCount === 1)
            return res.json({msg: "user deleted", status: true});
        return res.json({msg: "user not found", status: false});
    }catch(ex){
        next(ex);
    }
};

module.exports.getUser = async(req, res, next) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(user)
            return res.json({status: true, user});
        return res.json({msg: "user not found", status: false});
    }catch(ex){
        next(ex);
    }
}