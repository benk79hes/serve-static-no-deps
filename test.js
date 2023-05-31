const { createServer } = require('http');

const { join } = require('path');
const polka = require('polka');

const app = polka()


const testDir = join('.', 'test');

const static = require('./index')
const servePath = static(join(testDir, 'static-files-path'), 'test');
const serveRoot = static(join(testDir, 'static-files-root'));


app.use(servePath);
app.use(serveRoot);

try {
    const server = createServer(app.handler);
    server.listen(8080)
} catch (error) {
    console.error(error);
}