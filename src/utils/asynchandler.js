
// const asyncHandler = (requestHandler) =>{
//     return (req, res, next)=>{
//         Promise.resolve(requestHandler(req, res, next)).catch((error)=> next(error))
//     }
// }







const asyncHandler = (func) => {
    return async (req, res, next)=>{
        try{
            await func(req,res,next)
        }catch(error){
            res.status(error.code).json({
                success : false,
                message : error.message
            })
        }
    }
}

export {asyncHandler}