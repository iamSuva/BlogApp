 const {validateToken}=require("../services/authentication");
function checkForAuthenticationCookie(cookiename){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookiename];
        if(!tokenCookieValue)
        {
        return next();
        }
        try{

            const userPayload= validateToken(tokenCookieValue);
            //console.log("user playload ",userPayload);
             req.user=userPayload;
        }catch(error){};
       return next();
    };


}
module.exports={
    checkForAuthenticationCookie
}