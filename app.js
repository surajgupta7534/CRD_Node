var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
const port = 3000;
const file = 'database.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','ejs');

app.get('/',(req,res)=>{
   res.render('index');
});

app.post('/create',(req,res)=>{
    const{key,value}=req.body;
    try{
        fs.accessSync(file);
    }catch(err){
        fs.writeFileSync(file,'[]');
    }
    const newData = {key,value};
    const preData = fs.readFileSync(file,{encoding:'utf8'});
    const jsonData = JSON.parse(preData);
    const findId = jsonData.find(data=> data.key===newData.key);
    if(findId){
        res.status(409).send("Oops! Key is Already Exists");
    }
    else
    {
        jsonData.push(newData);
        fs.writeFileSync(file,JSON.stringify(jsonData))
        res.send("Value added Successfully!");
    }
});
app.get('/read',(req,res)=>{
    var read_key = req.query["readKey"];
    fs.access(file, fs.F_OK, (err) => {
        if (err) {
            res.send('Database Not exists!');
          return
        }
        const readData = fs.readFileSync(file,{encoding:'utf8'})
        const readJsonData = JSON.parse(readData);
        const findId = readJsonData.find(data=> data.key===read_key);
            if(findId){
                res.json(findId)
            }
            else{
                res.send("Key does not Exists!");
            }
      })
})

app.post('/delete',(req,res)=>{
    const {deleteKey} = req.body;
    fs.access(file, fs.F_OK, (err) => {
        if (err) {
            res.send('Database Not exists!');
          return
        }
        const delData = fs.readFileSync(file,{encoding:'utf8'})
        const delJsonData = JSON.parse(delData);
        const findId = delJsonData.find(data=> data.key===deleteKey);
            if(findId){
                const afterData = delJsonData.filter((data)=> {
                    return data.key != deleteKey;
                });
                fs.writeFileSync(file,JSON.stringify(afterData))
                res.send("Data deleted Successfully!")
            }
            else{
                res.send("Key does not Exists!");
            }
      })
})

app.get('/readAll',(req,res)=>{
    fs.access(file, fs.F_OK, (err) => {
        if (err) {
            res.send('Database Not exists!');
          return
        }
        const readData = fs.readFileSync(file,{encoding:'utf8'})
        const readJsonData = JSON.parse(readData);
        res.json(readJsonData)
      })
})

app.listen(port,()=>{
    console.log(`App Listening on Port: ${port}`);
    console.log(`localhost:${port} on browser`)
})