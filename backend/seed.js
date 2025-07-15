const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Product data (copy from frontend)
const products = [
  { id: 1, name: "Yomari", description: "Traditional steamed dumpling filled with sweet sesame seeds and jaggery", price: 250, image: "/Pic/Yomari.jpeg", category: "Traditional Sweets", featured: true },
  { id: 2, name: "Newari Khaja Set", description: "Complete traditional meal with beaten rice, curry, pickles, and meat", price: 850, image: "/Pic/Newari Khaja Set.jpg", category: "Main Course", featured: true },
  { id: 3, name: "Chatamari", description: "Newari rice crepe topped with vegetables, eggs, and meat", price: 180, image: "/Pic/Chatamari.jpg", category: "Snacks", featured: true },
  { id: 4, name: "Wo (Bara)", description: "Traditional black lentil pancake, crispy and flavorful", price: 120, image: "/Pic/Bara.jpg", category: "Snacks" },
  { id: 5, name: "Newari Aila", description: "Traditional rice wine, locally brewed and authentic", price: 450, image: "/Pic/aila.jpg", category: "Beverages", featured: true },
  { id: 6, name: "Buffalo Choila", description: "Spicy grilled buffalo meat with traditional spices", price: 650, image: "/Pic/choila.jpg", category: "Main Course" },
  { id: 7, name: "Juju Dhau", description: "King of yogurt, creamy and sweet Bhaktapur specialty", price: 150, image: "/Pic/JujuDhau.jpg", category: "Desserts" },
  { id: 8, name: "Lakhamari", description: "Traditional sweet bread, crispy and decorated", price: 200, image: "/Pic/lakmari.jpg", category: "Traditional Sweets" },
  { id: 9, name: "Aloo-tama", description: "Tangy bamboo shoot and potato curry, a Newari comfort food classic", price: 180, image: "/Pic/Aloo-tama.jpg", category: "Snacks" },
  { id: 10, name: "Kachila", description: "Spiced raw minced meat delicacy, seasoned with traditional herbs", price: 320, image: "/Pic/kachila.jpg", category: "Snacks" },
  { id: 11, name: "Kwati", description: "Hearty mixed bean soup, rich in protein and flavor", price: 220, image: "/Pic/Kwati.jpg", category: "Main Course" },
  { id: 12, name: "Samaybaji", description: "Traditional Newari platter with beaten rice, beans, eggs, and more", price: 500, image: "/Pic/Samaybaji.jpg", category: "Main Course" },
  { id: 13, name: "Thwon", description: "Mildly alcoholic traditional Newari rice beer, refreshing and unique", price: 200, image: "/Pic/thwon.jpg", category: "Beverages" },
  { id: 14, name: "Sanyakhuna", description: "Jellied fish aspic, a savory and spicy Newari specialty", price: 350, image: "/Pic/Sanyakhuna.jpg", category: "Snacks" }
];

const users = [
  { username: 'admin', email: 'admin@newabhojan.com', password: 'admin123', isAdmin: true },
  { username: 'muskan', email: 'customer@example.com', password: 'customer123', isAdmin: false }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Product.deleteMany();
    await User.deleteMany();
    await Product.insertMany(products);
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashed });
    }
    console.log('Database seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed(); 