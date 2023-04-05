const { JSDOM } = require('jsdom');

function getURLsFromHTML(htmlBody, baseURL){
    const urls =[];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const le of linkElements){
        if(le.href.slice(0, 1) === '/') {
            try {
                const urlObj = new URL(`${baseURL}${le.href}`);
                urls.push(urlObj.href);
            } catch (err){
                console.log(`error with relative url: ${err.message}`)
            }
        } else {
            try {
                const urlObj = new URL(`${le.href}`);
                urls.push(urlObj.href);
            } catch (err){
                console.log(`error with relative url: ${err.message}`)
            }
        }
    }
    return urls;
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if(hostPath.length > 0 && hostPath.slice(-1) ==='/') {
        return hostPath.slice(0, -1);
    }
    return `${urlObj.hostname}${urlObj.pathname}`;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}