const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET;
exports.generateAccessToken = async(payload) => {
    try {
        let accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '7 days',
        });
        return accessToken;
    } catch (error) {
        console.log(error);
    }
};
exports.generatePasswordResetToken = async() => {
    try {
        const resetPasswordToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetPasswordToken)
            .digest('hex');
        const passwordResetTokenExpires = Date.now() + 60 * 60 * 1000; // pick the current time and add 60 ie(60*60) minutes to it and convert to seconds by multiplying with 1000

        return {
            resetPasswordToken,
            passwordResetTokenExpires,
            passwordResetToken,
        };
    } catch (error) {
        console.log(error);
    }
};