const FormData = require('form-data');
const fs = require('fs');
fs.writeFileSync('test.png', 'test');
const form = new FormData();
form.append('file', fs.createReadStream('test.png'));
fetch('https://tmpfiles.org/api/v1/upload', {method: 'POST', body: form}).then(r=>r.json()).then(d=>console.log(d)).catch(e=>console.error(e));
