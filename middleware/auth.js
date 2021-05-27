var connection = require('../connect');
var mysql = require('mysql');
var md5 = require('MD5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require ('ip');
const { runInNewContext } = require('vm');

//controller untuk register
exports.registrasi= function(req,res){
    var post = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role,
        tanggal_regis: new Date()
    }

    var query = "SELECT email FROM ?? WHERE ??=?";
    var table = ["user", "email", post.email];

    query = mysql.format(query,table);

    connection.query(query, function(error, rows){
        if (error){
            console.log(error);
        }else {
            if (rows.length == 0){
                var query = "INSERT INTO ?? SET?";
                var table = ["user"];
                query = mysql.format(query, table);
                connection.query(query,post, function(error,rows){
                    if(error){
                        console.log(error);
                    }else{
                        response.ok("Berhasil menambahkan data user baru", res);
                    }
                });
            }else{
                response.ok("Email sudah terdaftar!", res);
            }
        }
    })
}

//controller untuk login
exports.login = function(req,res){
    var post = {
        password: req.body.password,
        email: req.body.email
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["user", "password", md5(post.password), "email", post.email];

    query = mysql.format(query,table);
    connection.query(query,function(error, rows){
        if (error){
            console.log(error);
        }else{
            //apakah jika kita memasukkan data user itu sudah terdaftar di database maka
            //membuat token dengan jwt 
            if (rows.length==1){
                var token = jwt.sign({rows}, config.secret, {
                    //token ini akan hangus dalam berapa lama dalam second/detik
                    expiresIn: 2000
                });
                id_user = rows[0].id;
                
                //kemudian ditampung datanya yg isinya id_user, token akses, ip addressnya
                var data = {
                    id_user: id_user,
                    token_akses: token,
                    ip_address: ip.address()
                }
                
                var query = "INSERT INTO ?? SET ?";
                var table = ["token_akses"];

                query = mysql.format(query,table);
                connection.query(query, data, function (error, rows){
                    if (error){
                        console.log(error);
                    }else {
                        res.json({
                            success: true,
                            message: "Token JWT telah tergenerate!",
                            token: token,
                            currUser: data.id_user
                        });
                    }
                });
            }else{
                res.json({"Error": true, "Message": "Email atau password salah!"});
            }
        }
    });
}

//menampilkan semua data barang
exports.tampilesemuadatabarang = function(req,res){
    connection.query('SELECT * FROM barang', function(error, rows, fields){
        if (error){
            console.log(error);
        }else {
            response.ok(rows, res)
        }
    });
}

//menampilkan semua data barang berdasarkan id nya
exports.tampilberdasarkanid = function(req, res){
    let id = req.params.id;
    connection.query('SELECT * FROM barang WHERE id_barang =?', [id],
        function(error, rows, fields){
            if(error){
                connection.log(error);
            }else{
                response.ok(rows,res);
            }
        });
};

//menambahkan semua data barang
exports.admintambahbarang = function (req, res) {
    var namaBarang = req.body.namaBarang;
    var hargaBarang = req.body.hargaBarang;
    var stokBarang = req.body.stokBarang;

    connection.query('INSERT INTO barang (namaBarang,hargaBarang,stokBarang) VALUES(?,?,?)',
        [namaBarang, hargaBarang, stokBarang],
        function(error, rows, fields){
            if(error){
                console.log(error);
            }else{
                response.ok("Data berhasil ditambahkan!", res)
            }
    });
};

//mengubah data barang
exports.adminubahbarang = function (req, res) {
    var id = req.body.id_barang;
    var namaBarang = req.body.namaBarang;
    var hargaBarang = req.body.hargaBarang;
    var stokBarang = req.body.stokBarang;    

    connection.query('UPDATE barang SET namaBarang=?, hargaBarang=?, stokBarang=? WHERE id_barang=?' ,
        [namaBarang,hargaBarang,stokBarang, id],
        function(error, rows, fields){
            if(error){
                console.log(error);
            }else{
                response.ok("Data berhasil diubah!", res)
            }
    });
};

//menghapus data barang
exports.adminhapusbarang = function (req, res) {
    var id = req.body.id_barang;

    connection.query('DELETE FROM barang WHERE id_barang=?' ,
        [id],
        function(error, rows, fields){
            if(error){
                console.log(error);
            }else{
                response.ok("Data berhasil dihapus!", res)
            }
    });
};