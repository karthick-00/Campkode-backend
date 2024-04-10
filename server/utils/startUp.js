const User = require("../models/userModel");
const bcrypt = require('bcrypt');

const performStartUp = async()=>{   
    try {
        // Create an admin user
        const adminEmail='admin@elerning';
        const existadmin = await User.findOne({adminEmail});
        if(!existadmin){
        const admin = new User({
        name: 'admin',
        email: adminEmail,
        password: 'admin123',
        isVerified: true,
        });
        
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        admin.password = hashedPassword;
        await admin.save();

    }
    } catch (e) {
       
        console.error(e.message);
      
    }

    console.log('Startup tasks completed');
}

module.exports=performStartUp;