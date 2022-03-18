const express = require('express');
const path = require('path');
const app = express();

const myLogger = (req,res,next) => {
    console.log("Middleware log 1");
    next();
}

//MIDDLEWARE
app.use(express.static('public'));
app.use(myLogger);

app.get('/', (req,res) => {
    res.status(200).sendFile(path.resolve(__dirname, 'temp/index.html'));
});

const port = 3000;
app.listen(port, ()=>{
    console.log(`PCAT is starting on ${port}`);
});