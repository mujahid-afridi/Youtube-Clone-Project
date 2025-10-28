
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
            res.status(error.statusCode || 500).json({
                success : false,
                message : "error occurred in asynhandler file"
            })
        }
    }
}

export default asyncHandler