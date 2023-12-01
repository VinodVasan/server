var fs = require('fs');
const http = require('http');
const server = http.createServer();
const filePath = './resources/test.jpeg';
 
server.on('request', (request, response)=>{
    if(request.method == 'POST' && request.url === "/imageUpdate"){
        
        var ImageFile = fs.createWriteStream(filePath, {encoding: 'utf8'});
        request.on('data', function(data){
            ImageFile.write(data);
        });
 
        request.on('end',async function(){
            ImageFile.end();
            const labels = await labelAPI();
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(JSON.stringify(labels));
        });
    }else{
        console.log("error");
        response.writeHead(405, {'Content-Type' : 'text/plain'});
        response.end();
    }
});
 
async function labelAPI() {
  var o = [];
  const vision = require('@google-cloud/vision');
  // Creates a client
  const client = new vision.ImageAnnotatorClient();
  /**
  * TODO(developer): Uncomment the following line before running the sample.
  */
  // const fileName = 'Local image file, e.g. /path/to/image.png';
  // Performs text detection on the local file
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations;
  detections.forEach(text => console.log(text));
	
  detections.forEach(detection => {
    o.push({description: detection.description, score: detection.score});
  });
  return o;
}
 
const port = 8888;
server.listen(port)
console.log(`Listening at ${port}`)