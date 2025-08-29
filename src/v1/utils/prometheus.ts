import * as client from 'prom-client';

// Create a new Registry to collect the metrics
const register = new client.Registry();

// Create some metrics
export const upTime = new client.Gauge({ name: 'uptime', help: 'Uptime in seconds' });
export const memUsage = new client.Gauge({ name: 'memory_usage', help: 'Memory usage in bytes' });
export const cpuUsage = new client.Gauge({ name: 'cpu_usage', help: 'CPU usage in seconds' });

// Register the metrics
register.registerMetric(upTime);
register.registerMetric(memUsage);
register.registerMetric(cpuUsage);

// Update the metrics every second
setInterval(() => {
  upTime.set(process.uptime());
  memUsage.set(process.memoryUsage().heapUsed);
  cpuUsage.set(process.cpuUsage().user / 1000000);
}, 1000);

export default register;