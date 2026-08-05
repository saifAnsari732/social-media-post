const { MongoClient } = require('mongodb'); 
async function run() { 
  const client = new MongoClient('mongodb://kisandeveloper2_db_user:s3inMXmppkgFYGXF@ac-arqlgvg-shard-00-00.vpmg6fg.mongodb.net:27017,ac-arqlgvg-shard-00-01.vpmg6fg.mongodb.net:27017,ac-arqlgvg-shard-00-02.vpmg6fg.mongodb.net:27017/social_db?ssl=true&replicaSet=atlas-6qhyy7-shard-0&authSource=admin&appName=Cluster0'); 
  await client.connect(); 
  const db = client.db(); 
  const accounts = await db.collection('accounts').find({platform: 'facebook'}).toArray(); 
  console.dir(accounts, {depth: null}); 
  await client.close(); 
} 
run();
