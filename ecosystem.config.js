module.exports = {
  apps: [{
    name: 'index',
    script: 'index.js',
    watch: true,
    max_memory_restart: '130M',
    autorestart: true,
    watch_delay: 1000,
  }]
};
