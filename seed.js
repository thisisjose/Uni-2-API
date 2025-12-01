const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@uni2.com' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Administrador',
        email: 'admin@uni2.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Usuario admin creado: admin@uni2.com / admin123');
    } else {
      console.log('ℹ️  El usuario admin ya existe');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();