const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 9000;

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
  host: 'blk9jnubod3xbidaqbva-mysql.services.clever-cloud.com',
  user: 'uzzjhqjr9hs3xt8b',
  password: 'mN06mislbAcoRCmsHnMX',
  database: 'blk9jnubod3xbidaqbva',
  port: 3306
});
  

// Membuat koneksi MySQL
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
  } else {
    console.log('Connected to database');
  }
});

// Middleware untuk mengatur header CORS
app.use(cors());
app.use(express.json());

// Route utama
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Contoh penggunaan koneksi MySQL
app.get('/mahasiswa', (req, res) => {
  connection.query('SELECT * FROM mahasiswa', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      res.json(results);
    }
  });
});

// Rute untuk menyimpan data mahasiswa
app.post('/mahasiswa', (req, res) => {
  const mahasiswaData = req.body;

  // Query untuk menyimpan data mahasiswa ke database
  const query = 'INSERT INTO mahasiswa (nama, nim, tanggalLahir, email) VALUES (?, ?, ?, ?)';
  const values = [mahasiswaData.nama, mahasiswaData.nim, mahasiswaData.tanggalLahir, mahasiswaData.email];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      res.json({ message: 'Mahasiswa data saved successfully' });
    }
  });
});

// Rute untuk mendapatkan data mahasiswa berdasarkan ID
app.get('/mahasiswa/:id', (req, res) => {
  const mahasiswaId = req.params.id;

  // Query untuk mendapatkan data mahasiswa berdasarkan ID
  const query = 'SELECT * FROM mahasiswa WHERE no = ?';

  connection.query(query, [mahasiswaId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Mahasiswa not found' });
      } else {
        res.json(results[0]);
      }
    }
  });
});

// Rute untuk mengupdate data mahasiswa
app.put('/mahasiswa/:id', (req, res) => {
  const mahasiswaId = req.params.id;
  const mahasiswaData = req.body;

  // Query untuk mengupdate data mahasiswa berdasarkan ID
  const query = 'UPDATE mahasiswa SET nama = ?, nim = ?, tanggalLahir = ?, email = ? WHERE no = ?';
  const values = [mahasiswaData.nama, mahasiswaData.nim, mahasiswaData.tanggalLahir, mahasiswaData.email, mahasiswaId];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Mahasiswa not found' });
      } else {
        res.json({ message: 'Mahasiswa data updated successfully' });
      }
    }
  });
});

// Rute untuk menghapus data mahasiswa
app.delete('/mahasiswa/:id', (req, res) => {
  const mahasiswaId = req.params.id;

  // Query untuk menghapus data mahasiswa dari database
  const query = 'DELETE FROM mahasiswa WHERE no = ?';

  connection.query(query, [mahasiswaId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error executing query');
    } else {
      res.json({ message: 'Mahasiswa data deleted successfully' });
    }
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
