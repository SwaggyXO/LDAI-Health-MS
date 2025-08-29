import nodemailer from "nodemailer";

export const createTransporter = (accessToken: string) => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_EMAIL_ID,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: "",
            accessToken: accessToken,
        },
    })
}
