const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const favicon = require('serve-favicon');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(favicon(path.join(__dirname + '/public/images/favicon.png')));
//app.use(express.urlencoded({extended:true}));


io.on('connection',(socket)=>{


    socket.on('sendMess', (data)=>{
        const dateTwo = (num) => ('0' + num).slice(-2);
        let date=new Date();
        let dateNow = `${dateTwo(date.getHours())}:${dateTwo(date.getMinutes())} (${dateTwo(date.getDate())}.${dateTwo(date.getMonth()+1)}.${date.getFullYear()})`;
        data.date = dateNow;

        let chat = JSON.parse(fs.readFileSync(__dirname + '/DB/chat.json', 'utf-8'));
        chat.push(data);
        chat = JSON.stringify(chat);
        fs.writeFile(__dirname + '/DB/chat.json', chat, 'utf-8', (err)=> {
            if(err) throw err;

            io.emit('receiveMess', data);
        });

    });

    socket.on('disconnect', (data)=>{})
});



app.get('/', (req, res, next)=>{
   res.sendFile('index.html');
});

app.post('/register', (req, res)=>{
    let errors = validRegister (req.body);

    if(Object.keys(errors).length !== 0){
        res.status(400).json({errors: errors, result: null})
    }else{
        console.log(req.body);
        let users = JSON.parse(fs.readFileSync(__dirname + '/DB/users.json', 'utf-8'));
        let login = [];

        for(let i = 0; users.length > i; i++){
            login[i] = users[i].login;
        }

        if(login.indexOf(req.body.login) !== -1){
            errors.login = 'Login does not unique';
            res.status(400).json({errors: errors, result: null})
        }else{
            let idLength = users.length + 1;
            let newUser = {
                id: idLength,
                login: req.body.login,
                email: req.body.email,
                password: req.body.password
            };

            users.push(newUser);
            users = JSON.stringify(users);

            fs.writeFile(__dirname + '/DB/users.json', users, 'utf-8', (err)=>{
                if(err){
                    console.log(err);
                    res.status(400).json({errors: {errorSaving: 'Error saving data', result: null}})
                }
                res.status(200).json({error: {}, result: true})
            });
        }
    }
});

app.post('/login', (req, res)=>{
    let errors = validLogin(req.body);

    if(Object.keys(errors).length !== 0) {
        return res.status(400).json({errors: errors, result: null, token: null})
    }
    let users = JSON.parse(fs.readFileSync(__dirname + '/DB/users.json', 'utf-8'));
    let user = {};

    for (let i = 0; users.length > i; i++){
        if(req.body.login === users[i].login){
            user = users[i];
        }
    }

    if(Object.keys(user).length === 0) {
        return res.status(400).json({errors: {login:'User not found'}, result: null, token: null})
    }

    if(user.password !== req.body.password){
        return res.status(400).json({errors: {password:'Password is incorrect'}, result: null, token: null})
    }

    let payload = {id: user.id, login: user.login};
    let token = jwt.sign(payload, 'secretKey');

    res.status(200).json({errors: {}, result: true, token: token})

});

app.get('/check', (req, res)=>{
    jwt.verify(req.headers.authorization, 'secretKey', function(err) {
        if (err) {
            res.status(200).json({auth: false, check: true});
        } else {
            res.status(200).json({auth: true, check: true});
        }
    });

});

app.get('/takeicons', (req, res)=>{
    jwt.verify(req.headers.authorization, 'secretKey', function(err) {
        if (err) {
            res.status(401).json({takeIcon: [], auth: false});
        } else {
            let icons = JSON.parse(fs.readFileSync(__dirname + '/DB/icons.json', 'utf-8'));
            res.status(200).json({takeIcon: icons, auth: true})
        }
    });
});

app.get('/takemessage', (req, res)=>{
    jwt.verify(req.headers.authorization, 'secretKey', function(err) {
        if (err) {
            res.status(401).json({takeMessage: [], auth: false});
        } else {
            let message = JSON.parse(fs.readFileSync(__dirname + '/DB/chat.json', 'utf-8'));

            res.status(200).json({takeMessage: message, auth: true})
        }
    });
});

app.post('/takegifs', (req, res)=>{
    let gif = JSON.parse(fs.readFileSync(__dirname + '/DB/gif.json', 'utf-8'));
    let chapterGif=[];
    for(let i=0; gif.length > i; i++){
        if(gif[i].group === req.body.group){
            chapterGif.push(gif[i]);
        }
    }
    res.status(200).json(chapterGif)
});




server.listen(5000, (err)=>{
    if (err) throw err;

    console.log('Server running and listenning 5000 port')
});


function validRegister (obj){
    let errors = {};
    if(obj.login.length < 3){
        errors.login = 'Must be min 3 chars'
    }
    if(obj.email.length <= 7){
        errors.email = 'Incorrect Email'
    }
    if(obj.password.length < 5){
        errors.password = 'Must be min 5 chars'
    }
    if(obj.password !== obj.confPassword){
        errors.confPassword = 'Confirm password does not match with Password'
    }

    return errors;
}

function validLogin (obj){
    let errors = {};
    if(obj.login.length === 0){
        errors.login = 'Fill in the Login field'
    }
    if(obj.password.length === 0 && obj.login.length !== 0){
        errors.password = 'Fill in the Password field'
    }

    return errors;
}
