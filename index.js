const fs = require('fs')
const path = require('path')

//
const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
    webmanifest: "application/manifest+json",
};


/**
 * 
 * @param {*} root It is the root folder of the static files to serve 
 * @param {*} urlFolder It is the path to use as url base
 * @returns a middleware function to be used by express js or such
 */
module.exports = function(root, urlFolder="", defaultIndex="index.html") {
    return async function(req, res, next) {
        
		let urlPath = '/' + urlFolder + (urlFolder ? '/' : '');
		console.log('urlPath', urlPath);
		
        if (req.url.indexOf(urlPath) !== 0) {
            console.log('req.url', req.url);
            return next();
        }

        const localUrl = req.url.substr(urlPath.length);
		console.log(localUrl);
        
        let filePath = null;
        if (localUrl.endsWith("/") || ! localUrl) {
            filePath = path.join(root, localUrl, defaultIndex)
        }
        else {
            filePath = path.join(root, localUrl)
        }
		
		console.log(filePath);

        // requested path is outside of root
        if (!filePath.startsWith(root)) {
            return next();
        }

        const exists = await fs.promises.access(filePath)
            .then(() => true, () => false);

        if (!exists) {
            return next();
        }

        const ext = path.extname(filePath).substring(1).toLowerCase();
        const stream = fs.createReadStream(filePath);


        const mimeType = MIME_TYPES[ext] || MIME_TYPES.default;
        res.writeHead(200, { "Content-Type": mimeType });
        stream.pipe(res);
    }
}