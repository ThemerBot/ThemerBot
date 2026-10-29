module.exports = {
    apps: [
        {
            name: 'themerbot',
            script: 'node build/index.js',
            max_memory_restart: '1G',
            time: true,
        },
    ],
};
