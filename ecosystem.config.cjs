module.exports = {
  apps: [
    {
      name: 'access_folder',
      script: './bin/server.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      exec_mode: 'cluster',
      instances: 'max',
    },
    {
      name: 'resque-scheduler_access_folder',
      script: 'node ace resque:start --schedule',
      autorestart: true,
      watch: false,
    },
  ],
}
