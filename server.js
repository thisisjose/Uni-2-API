const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Uni-2 corriendo en puerto ${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI}`);
});