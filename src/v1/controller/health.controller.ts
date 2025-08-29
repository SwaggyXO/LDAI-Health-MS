import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/response";
import { getLastHealthReport} from "../service/health.service";
import { oauth2Client } from "../utils/oauth2Client";
import { UnexpectedException } from "../exception/api.exception";
import { createTransporter } from "../utils/transporter";
import cron from "node-cron";
import nodemailer from "nodemailer"

let cronJob: cron.ScheduledTask | null = null;
let transporter: nodemailer.Transporter | null = null;
let accessToken: string | null = null;
let expiryTime: number | null = null;
let tokensReady = false;
let firstEmailMessageId: string | null = null;

export const baseHealthHandler = (req: Request, res: Response, next: NextFunction) => {
    return formatResponse(res, 200, "success", "Health-MS: Welcome to Health router", null);
}

export const healthReportHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await getLastHealthReport();
        return formatResponse(res, 200, "success", report, null);
        
    } catch (error: any) {
        next(error);
    }
}

export const oAuth2Handler = async (req: Request, res: Response, next: NextFunction) => {
    const code = req.query.code as string;
    
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log("OAuth 2.0 tokens:", tokens);
    
        // Here, you should store the tokens securely in your database or environment variables
        // For demonstration purposes, we'll set them in memory
        if (tokens.access_token && tokens.refresh_token) {
            accessToken = tokens.access_token;
            expiryTime = Number(tokens.expiry_date);
            transporter = createTransporter(accessToken);
            tokensReady = true;
        }
    
        return formatResponse(res, 200, "success", "OAuth 2.0 code exchanged for tokens", null);
    } catch (error: any) {
        console.error("Error exchanging code for tokens:", error);
        throw new UnexpectedException(error, "Failed to exchange code for tokens");
    }
}

const startOAuthFlow = async () => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://mail.google.com/',
    });

    // Redirect to authUrl or send it to the frontend
    console.log('Authorize this app by visiting:', authUrl);
};

export const startReportEmailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!cronJob) {
            await startOAuthFlow();

            transporter?.set('oauth2_provision_cb', (user: any, renew: any, callback: any) => {
                if (!accessToken || !expiryTime) {
                    return callback(new Error('No access or refresh token available'));
                }

                else {
                    return callback(null, accessToken, expiryTime);
                }
            });

            console.log("Report emailer started successfully");

            cronJob = cron.schedule('* * * * *', async () => {
                if (tokensReady) {

                    const content = getLastHealthReport();
                    const emailContent = `
                        Latest health report:
                            ${JSON.stringify(content, null, 2)}
                    `;
                    console.log(transporter);

                    try {
                        const info = await transporter?.sendMail({
                            from: process.env.GOOGLE_EMAIL_ID,
                            to: process.env.RECEPIENT_EMAIL_ID,
                            subject: 'LDAI-MS health report',
                            text: emailContent,
                            headers: firstEmailMessageId ? {
                                'In-Reply-To': firstEmailMessageId,
                                'References': firstEmailMessageId
                            } : undefined
                        });
    
                        if (info && !firstEmailMessageId) firstEmailMessageId = info.messageId;
    
                        console.log("Health report email sent successfully");
                    } catch (error: any) {
                        console.log(error);
                    }
                    return formatResponse(res, 200, "success", "Service Health reporting started successfully!", null);
                }

                else {
                    console.log("Tokens not ready yet");
                }
            });
        }
        
    } catch (error: any) {
        console.log(error);
        throw new UnexpectedException(error, "Failed to start report emailer");
    }
}

export const stopReportEmailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (cronJob) {
            cronJob.stop();
            cronJob = null;
            transporter?.close();
            transporter = null;
            tokensReady = false;
            console.log("Report emailer stopped successfully");

            return formatResponse(res, 200, "success", "Report emailer stopped successfully", null);
        }

        return formatResponse(res, 200, "success", "No report emailer currently running.", null);
        
    } catch (error: any) {
        throw new UnexpectedException(error, "Failed to stop report emailer");
    }
}