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
  ],
}
