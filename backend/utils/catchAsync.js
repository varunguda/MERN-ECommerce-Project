export default (asyncFunc) => async (req, res, next) => {
    try{
        await asyncFunc(req, res, next)
    }
    catch(err){
        next(err);
    }
}