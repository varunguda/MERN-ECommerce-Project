import jwt from 'jsonwebtoken';

export const addCookie = async (user ,message, status ,req, res, next) => {
    const token = jwt.sign({
        _id: user.id
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res
        .status(status)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 24*60*60*1000
        })
        .json({
            success: true,
            message
        })
}