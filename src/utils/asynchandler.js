const asyncHandler = (func) => {
    async (req, res, next)=>{
        try{

        }catch(error){
            await func(req,res,next)
        }
    }
}

export {asyncHandler}