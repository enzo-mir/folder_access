module.exports = {
  apps: [
    {
      name: 'access_folder',
      script: './bin/server.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      exec_mode: 'fork',
      instances: 1,
    },
    {
      name: 'resque-scheduler_access_folder',
      script: 'node ace resque:start --schedule --worker --queue-name=database_refresh',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
}
