const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Agregar ruta de auth
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
// Rutas de usuarios (admin)
app.use('/api/users', require('./routes/users'));
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uni2_db')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🚀 API Uni-2 funcionando!' });
});
app.use(cors({
  origin: '*', // Temporal, luego cambia a tu dominio
  credentials: true
}));
module.exports = app;