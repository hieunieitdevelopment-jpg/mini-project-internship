const isProduction = process.env.NODE_ENV === "production" && process.env.ENABLE_SECURE_COOKIE === "true";

const accessTokenOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, 
};

const refreshTokenOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,  
};

module.exports = { accessTokenOptions, refreshTokenOptions };
