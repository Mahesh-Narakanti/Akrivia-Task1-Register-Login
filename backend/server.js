const express=require('express');
const cors=require('cors');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const knex=require('./objection');
const user=require('./user');

const app=express();
app.use(cors());
app.use(express.json());

const checkTokenExpiry = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from Authorization header
  
    if (!token) {
      return res.status(403).json({ message: 'Token required' });
    }
  
    jwt.verify(token, 'godisgreat', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // Get the token expiration time from the decoded payload
      const expiresAt = decoded.exp * 1000; // The expiration time is in seconds, so convert it to milliseconds
      const currentTime = new Date().getTime();
  
      // Check if the token is expired
      if (currentTime >= expiresAt) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
      }
  
      // If token is valid and not expired, attach the user ID to the request and proceed
      req.userId = decoded.id;
      next();
    });
  };

app.post('/register' , async (req ,res)=>{
    const {username,email,password,addresses,languages}=req.body;
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await user.query().insert({
            username,
            email,
            password:hashedPassword,
            address:JSON.stringify(addresses),
            languages:JSON.stringify(languages),
        });
        res.status(200).json({message: "user registered successfully"});
    }
    catch (err){
        console.error('Error inserting user:', err);
    res.status(500).send('Error inserting user into DB');
    }

});

app.post('/login', async (req,res)=>{
    const {username,password}=req.body;
    try{
        const User=await user.query().findOne({username});
        if(!User)
            return res.status(404).send('User not found');
        const match=await bcrypt.compare(password,User.password);
        if(!match) return res.status(400).send('invalid credentials');

        const token=jwt.sign({id:User.id},'godisgreat',{expiresIn:'1m'});
        res.status(200).send({message:'login successfull',token});
    }
    catch (err){
        console.error('Error during login:', err);
    res.status(500).send('Database error');
    }
});

app.get('/user-details',async (req,res)=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token)
        return res.status(403).send("Token Required");
    try{
        const decoded=jwt.verify(token,'godisgreat');
        const uid=decoded.id;
        const User=await user.query().findById(uid);
        if(!User) return res.status(404).send('user not found');
        res.status(200).json({
               username:User.username,
               email:User.email,
               addresses:User.address,
               languages:User.languages,
        });
    }
    catch (err){
        console.error('Error fetching user details:', err);
    res.status(401).send('Invalid token');
    }
});

app.get('/home', checkTokenExpiry, async (req, res)=>{
    const userId = req.userId; // The user ID is added by the middleware

  try {
    const userData = await user.query().findById(userId);

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Session is valid', userData });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Database error' });
  }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
  });