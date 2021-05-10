const bcrypt = require('bcrypt');
//a salt is a random string that's added after and/or before hashed pw

async function run(){
    //can return a promise or you can pass a callback.
    const salt = await bcrypt.genSalt(10); 
    const hashed = bcrypt.hash('1234', salt);
    console.log(salt);
    console.log(hashed);
}

run();