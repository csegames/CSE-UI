const { writeFileSync } = require('fs');
const { join } = require('path');

const server = process.argv[2];
if (!server) 
  console.error('usage: npm run gen:chat -- <server url, no path>');
else
 fetch(`${server}/v1/api/generated`)
   .then((response) => response.text())
   .then((text) => {
     writeFileSync(join(__dirname, 'src/chat/generated', 'uce-chat-v3.ts'), text);
   });
