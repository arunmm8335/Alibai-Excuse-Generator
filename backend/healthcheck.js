const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    timeout: 2000
};

const request = http.request(options, (res) => {
    if (res.statusCode === 200 || res.statusCode === 401) {
        process.exit(0); // Healthy
    } else {
        process.exit(1); // Unhealthy
    }
});

request.on('error', () => {
    process.exit(1); // Unhealthy
});

request.on('timeout', () => {
    request.destroy();
    process.exit(1); // Unhealthy
});

request.end(); 