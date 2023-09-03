import jwt from 'jsonwebtoken';

export const addCookie = async (user ,message, status ,req, res, next) => {
    const token = jwt.sign({
        _id: user.id
    }, process.env.JWT_SECRET);

    return res
        .status(status)
        .cookie("token", token, {
            httpOnly: true,
            maxAge:  15*60*100
        })
        .json({
            success: true,
            message
        })
}