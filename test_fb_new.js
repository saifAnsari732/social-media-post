const { MongoClient } = require('mongodb'); 
async function run() { 
  const client = new MongoClient('mongodb://kisandeveloper2_db_user:s3inMXmppkgFYGXF@ac-arqlgvg-shard-00-00.vpmg6fg.mongodb.net:27017,ac-arqlgvg-shard-00-01.vpmg6fg.mongodb.net:27017,ac-arqlgvg-shard-00-02.vpmg6fg.mongodb.net:27017/social_db?ssl=true&replicaSet=atlas-6qhyy7-shard-0&authSource=admin&appName=Cluster0'); 
  await client.connect(); 
  const db = client.db(); 
  const accounts = await db.collection('accounts').find({platform: 'facebook'}).sort({_id: -1}).limit(1).toArray(); 
  if (accounts.length > 0) {
    const token = accounts[0].raw.access_token || accounts[0].accessToken;
    console.log("Token:", token);
    const res = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${token}`);
    console.log("Pages API:", await res.text());
    const dbRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`);
    console.log("Debug Token:", await dbRes.text());
  }
  await client.close(); 
} 
run();
