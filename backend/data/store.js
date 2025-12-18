const bcrypt = require('bcryptjs');

// In-memory data stores
let products = [];
let users = [];
let nextProductId = 1;
let nextUserId = 1;

// Initialize with seed data
async function initializeData() {
  // Product data
  const productData = [
    { name: "Yomari", description: "Traditional steamed dumpling filled with sweet sesame seeds and jaggery", price: 250, image: "/Pic/Yomari.jpeg", category: "Traditional Sweets", stock: 50, featured: true },
    { name: "Newari Khaja Set", description: "Complete traditional meal with beaten rice, curry, pickles, and meat", price: 850, image: "/Pic/Newari Khaja Set.jpg", category: "Main Course", stock: 30, featured: true },
    { name: "Chatamari", description: "Newari rice crepe topped with vegetables, eggs, and meat", price: 180, image: "/Pic/Chatamari.jpg", category: "Snacks", stock: 40, featured: true },
    { name: "Wo (Bara)", description: "Traditional black lentil pancake, crispy and flavorful", price: 120, image: "/Pic/Bara.jpg", category: "Snacks", stock: 60 },
    { name: "Newari Aila", description: "Traditional rice wine, locally brewed and authentic", price: 450, image: "/Pic/aila.jpg", category: "Beverages", stock: 25, featured: true },
    { name: "Buffalo Choila", description: "Spicy grilled buffalo meat with traditional spices", price: 650, image: "/Pic/choila.jpg", category: "Main Course", stock: 20 },
    { name: "Juju Dhau", description: "King of yogurt, creamy and sweet Bhaktapur specialty", price: 150, image: "/Pic/JujuDhau.jpg", category: "Desserts", stock: 45 },
    { name: "Lakhamari", description: "Traditional sweet bread, crispy and decorated", price: 200, image: "/Pic/lakmari.jpg", category: "Traditional Sweets", stock: 35 },
    { name: "Aloo-tama", description: "Tangy bamboo shoot and potato curry, a Newari comfort food classic", price: 180, image: "/Pic/Aloo-tama.jpg", category: "Snacks", stock: 50 },
    { name: "Kachila", description: "Spiced raw minced meat delicacy, seasoned with traditional herbs", price: 320, image: "/Pic/kachila.jpg", category: "Snacks", stock: 30 },
    { name: "Kwati", description: "Hearty mixed bean soup, rich in protein and flavor", price: 220, image: "/Pic/Kwati.jpg", category: "Main Course", stock: 40 },
    { name: "Samaybaji", description: "Traditional Newari platter with beaten rice, beans, eggs, and more", price: 500, image: "/Pic/Samaybaji.jpg", category: "Main Course", stock: 25 },
    { name: "Thwon", description: "Mildly alcoholic traditional Newari rice beer, refreshing and unique", price: 200, image: "/Pic/thwon.jpg", category: "Beverages", stock: 30 },
    { name: "Sanyakhuna", description: "Jellied fish aspic, a savory and spicy Newari specialty", price: 350, image: "/Pic/Sanyakhuna.jpg", category: "Snacks", stock: 20 }
  ];

  products = productData.map((p, index) => ({
    _id: String(nextProductId++),
    id: index + 1,
    ...p,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // User data
  const userData = [
    { username: 'admin', email: 'admin@newabhojan.com', password: 'admin123', isAdmin: true },
    { username: 'muskan', email: 'customer@example.com', password: 'customer123', isAdmin: false }
  ];

  for (const user of userData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    users.push({
      _id: String(nextUserId++),
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  console.log('In-memory data initialized:', products.length, 'products,', users.length, 'users');
}

// Initialize data on module load (async, but don't block)
initializeData().catch(err => {
  console.error('Error initializing data:', err);
});

// Export data stores and helper functions
module.exports = {
  products,
  users,
  getProducts: () => products,
  getProductById: (id) => products.find(p => p._id === id || p.id === parseInt(id)),
  addProduct: (product) => {
    const newProduct = {
      _id: String(nextProductId++),
      id: products.length + 1,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  },
  updateProduct: (id, updates) => {
    const index = products.findIndex(p => p._id === id || p.id === parseInt(id));
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, updatedAt: new Date() };
    return products[index];
  },
  deleteProduct: (id) => {
    const index = products.findIndex(p => p._id === id || p.id === parseInt(id));
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
  getUserByEmail: (email) => users.find(u => u.email === email),
  getUserById: (id) => users.find(u => u._id === id),
  addUser: (user) => {
    const newUser = {
      _id: String(nextUserId++),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },
  updateUser: (id, updates) => {
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date() };
    return users[index];
  },
  deleteUser: (id) => {
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
  getAllUsers: () => users.map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  })
};
