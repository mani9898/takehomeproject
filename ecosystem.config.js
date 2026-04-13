module.exports = {
  apps: [
    {
      name: 'ecfr-auth-node',
      cwd: './authz-service',
      script: './mvnw',
      args: 'spring-boot:run',
      interpreter: 'bash',
      watch: false,
      env: {
        SERVER_PORT: '9000'
      }
    },
    {
      name: 'ecfr-backend-node',
      cwd: './backend',
      script: './mvnw',
      args: 'spring-boot:run',
      interpreter: 'bash',
      watch: false,
      env: {
        SERVER_PORT: '8080'
      }
    },
    {
      name: 'ecfr-frontend-node',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
