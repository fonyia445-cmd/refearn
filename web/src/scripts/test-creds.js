const mongoose = require('mongoose');

const uris = [
  'mongodb://mydb_admin:Thisis_admin1st1st!@34.9.202.173:27017/mydb?authSource=admin',
  'mongodb://mydb_admin:Thisis_admin1st1st!@34.9.202.173:27017/mydb?authSource=mydb',
  'mongodb://admin:Thisis_admin1st1st!@34.9.202.173:27017/mydb?authSource=admin',
  'mongodb://mydb_admin:Thisis_admin1st1st%21@34.9.202.173:27017/mydb?authSource=admin',
  'mongodb://mydb_admin:Thisis_admin1st1st%21@34.9.202.173:27017/mydb?authSource=mydb',
];

async function run() {
  for (const uri of uris) {
    try {
      console.log('Trying:', uri.replace(/:(.*?)@/, ':***@'));
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('SUCCESS! ->', uri.replace(/:(.*?)@/, ':***@'));
      await mongoose.disconnect();
      return;
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
}
run();
