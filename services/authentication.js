const JWT=require("jsonwebtoken");
const secret="Suvadip@632";

function createTokenforUser(user){
    const payload={
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,
    };
    const expiresIn="10m";
    const token=JWT.sign(payload,secret,{expiresIn});//generate a token
    return token;
}

// This validateToken function is useful for verifying the 
// authenticity of JWTs received by your server. It helps ensure that the token hasn't been tampered with and that it was issued by your application's trusted authentication system. If the token is valid, 
// you can trust the user data contained in the payload for authentication and authorization purposes.
function validateToken(token)
{
    const payload=JWT.verify(token,secret);//If the token is valid, the function returns the
    //  decoded payload, which typically contains user-specific data.
   
    //If the token is invalid 
    //(e.g., the signature doesn't match, or the token has expired), JWT.verify will throw an error.
    //
    return payload;
};
module.exports={
    createTokenforUser,
    validateToken
}