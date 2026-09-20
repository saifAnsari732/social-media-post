import clientPromise from './lib/mongodb.js';
async function run() {
  const client = await clientPromise;
  const db = client.db();
  const settings = await db.collection('settings').find({}).toArray();
  console.log('Settings:', settings);
  process.exit(0);
}
run();
