const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- MODIFICA QUI: Aggiunto campo 'category' ---
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String, // <--- NUOVO CAMPO
  imageFilename: String
});
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const connectWithRetry = () => {
  console.log('Tentativo connessione MongoDB...');
  mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/pos_db')
    .then(() => console.log('MongoDB Connesso!'))
    .catch(err => {
      console.log('Connessione fallita, riprovo tra 5 secondi...', err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// --- API ---

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST: Aggiunto category
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { name, price, category } = req.body; // <--- PRENDIAMO CATEGORIA
  const imageFilename = req.file ? req.file.filename : req.body.imageFilename;
  const newProduct = new Product({ name, price, category, imageFilename });
  await newProduct.save();
  res.json(newProduct);
});

// PUT: Aggiunto category
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { name, price, category } = req.body; // <--- PRENDIAMO CATEGORIA
  let updateData = { name, price, category };
  if (req.file) {
    updateData.imageFilename = req.file.filename;
  }
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updatedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Prodotto eliminato' });
});

app.post('/api/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json(newOrder);
});

app.get('/api/report', async (req, res) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const orders = await Order.find({ date: { $gte: oneDayAgo } });
  
  let report = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!report[item.name]) report[item.name] = { name: item.name, quantity: 0, total: 0 };
      report[item.name].quantity += item.quantity;
      report[item.name].total += item.price * item.quantity;
    });
  });
  res.json(Object.values(report));
});

app.delete('/api/orders/reset', async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'Storico vendite azzerato con successo' });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante l\'azzeramento' });
  }
});

app.get('/', (req, res) => {
  res.send('API POS ONLINE');
});

app.listen(5000, () => console.log('Server running on port 5000'));