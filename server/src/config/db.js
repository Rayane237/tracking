import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('❌ MONGODB_URI manquant. Configure la variable d\'environnement MONGODB_URI.');
  }

  try {
    mongoose.set('strictQuery', true);
    
    // Set timeout for connection
    const connectOptions = {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    };
    
    await mongoose.connect(uri, connectOptions);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Vérifiez:');
    console.error('   1. URL MONGODB_URI est correcte');
    console.error('   2. IP 0.0.0.0/0 est whitelisted sur MongoDB Atlas');
    console.error('   3. Network/firewall n\'est pas bloqué');
    throw error;
  }
}

