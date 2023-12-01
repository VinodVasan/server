const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8889;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/addOCRData') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const parsedData = JSON.parse(data);
                const ocrData = parsedData.description;

                console.log('Received OCR data:', ocrData);

                // Add the OCR data to the table
                addRowToTable(1, ocrData);

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('OK');
            } catch (error) {
                console.error('Error parsing OCR data:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
    } else {
        // Serve your HTML file
        const filePath = path.join(__dirname, 'index2.html');
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
