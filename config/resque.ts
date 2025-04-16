import { defineConfig } from 'adonis-resque'

const resqueConfig = defineConfig({
  redisConnection: 'main',

  runWorkerInWebEnv: true,

  runScheduler: true,
  isMultiWorkerEnabled: true,
  multiWorkerOption: {
    minTaskProcessors: 1,
    maxTaskProcessors: 10,
  },
  workerOption: {},

  queueNameForJobs: 'default',

  queueNameForWorkers: '*',

  logger: null,
  verbose: true,
})

export default resqueConfig
