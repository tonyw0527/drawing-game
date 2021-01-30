import mongoose from 'mongoose';

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  const result = mongoose.connect(`mongodb://${process.env.MONGODB_HOST_NAME}:${process.env.MONGODB_HOST_SECRET}@initial-cluster-shard-00-00.r2sqy.mongodb.net:27017,initial-cluster-shard-00-01.r2sqy.mongodb.net:27017,initial-cluster-shard-00-02.r2sqy.mongodb.net:27017/Bible?ssl=true&replicaSet=atlas-p3n6uo-shard-0&authSource=admin&retryWrites=true&w=majority`,
 { useNewUrlParser: true,
   useUnifiedTopology: true
});
  const db = mongoose.connection;
  db.on('error', console.error.bind(console,
      "connection error:"));
  db.once('open', () => {
      console.log('DB connected');
  });

  return result;
}

export default dbConnect;