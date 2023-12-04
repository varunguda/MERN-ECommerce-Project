import jwt from 'jsonwebtoken';

export const addCookie = async (user, message, status, req, res, next) => {
    const token = jwt.sign({
        _id: user.id
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res
        .status(status)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
            secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true,
        })
        .json({
            success: true,
            message,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                is_seller: user.is_seller,
                is_admin: user.is_admin,
                phone_number: user.phone_number ? user.phone_number : "",
            }
        })
}