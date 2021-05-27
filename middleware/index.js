var express = require('express');
var auth = require('./auth');
var router = express.Router();
var verifikasi= require('./verifikasi');
var otorisasi= require('./otorisasi');

//mendaftarkan menu registrasi
router.post('/register', auth.registrasi);
router.post('/login', auth.login);

router.get('/tampil',  otorisasi(1), auth.tampilesemuadatabarang);
router.get('/tampilid',  otorisasi(1), auth.tampilesemuadatabarang);

//alamat yang perlu otorisasi
//halaman menampilkan data tabel oleh administrator
router.post('/tambah/barang', verifikasi(2), auth.admintambahbarang);
router.put('/ubah/barang', verifikasi(2), auth.adminubahbarang);
router.delete('/hapus/barang', verifikasi(2), auth.adminhapusbarang);

module.exports = router;
