import axios, { AxiosResponse } from "axios"
import { CoreMSException, InternalServerException, ModelMSException } from "../exception/api.exception"
import { FetchFailedException } from "../exception/db.exception"

type MSHealthResponse = {
    message: string,
    metrics: {
        uptime: string,
        memoryUsage: string,
        cpuUsage: string
    }
}

const INTERVAL_MS = 60000;

let lastReport: any = null;

const microservices = new Map<string, string> ([
    ['core-ms', process.env.CORE_MS as string],
    ['content-ms', process.env.CONTENT_MS as string],
    ['model-ms', process.env.MODEL_MS as string]
])

const fetchMSHealth = async (service: string) => {
    try {
        console.log(process.env.CORE_MS);
        console.log(process.env.CONTENT_MS);
        console.log(process.env.MODEL_MS);

        const response: AxiosResponse<MSHealthResponse, string> = await axios.get(microservices.get(service) as string + '/health-check');
        return response.data;
        
    } catch (error: any) {
        console.log(error);
        return {
            message: `Failed to get health report from ${service}`,
            metrics: {
                uptime: 'NA',
                memoryUsage: 'NA',
                cpuUsage: 'NA'
            }
        }
    }
}

const healthReport = async () => {
    try {
        const serviceKeys = Array.from(microservices.keys());
        const reportsPromises = serviceKeys.map((service) => fetchMSHealth(service));
        const reports = await Promise.all(reportsPromises);
        return reports;
        
    } catch (error: any) {
        throw new InternalServerException(error, "Failed to get health report");
    }
}

const fetchHealthReport = async () => {
    try {
      lastReport = await healthReport();
    } catch (error: any) {
        throw new FetchFailedException(error, "Failed to fetch health report");
    }
};

fetchHealthReport();

setInterval(fetchHealthReport, INTERVAL_MS);

export const getLastHealthReport = () => lastReport;