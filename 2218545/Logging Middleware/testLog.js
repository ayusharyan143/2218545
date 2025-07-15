import { log } from './log.js'; 

const run = async () => {
  await log("backend", "info", "handler", "Logger test: first successful log entry.");
  await log("backend", "debug", "service", "Debugging a service function.");
  await log("backend", "error", "handler", "Received invalid data type.");
};

run();
