const download = require('download')

// const headers = {
//     'accept-charset': 'ISO-8859-1,utf-8q=0.7,*q=0.3',
//     'accept-language': 'en-US,enq=0.8',
//     'accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,*/*q=0.8',
//     'user-agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2',
//     'accept-encoding': 'gzip,deflate'
// }

module.exports = async (url, filepath, filename) => {
    console.log('start download....')
    await download(
        url, 
        filepath, 
        { 
            filename, 
            timeout: 30 * 1000, 
            retries: 3, 
            // extract: true 
        }
    )
    console.log(`${filename} downloaded`)
}