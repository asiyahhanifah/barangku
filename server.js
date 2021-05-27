// buat 3 variabel
// variabel express untuk memanggil library express
const express = require('express');
//variabel bodyParser untuk memanggil library body-parser
const bodyParser = require('body-parser');
//menambahkan morgan
var morgan = require('morgan');
// fungsi untuk memanggil expressjs
const app = express();

//parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//mendaftarkan menu routes dari index
app.use('/auth', require('./middleware'));

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});