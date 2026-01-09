import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './App.css';

const IMG_BASE_URL = "http://localhost:5000/uploads/";

// --- 1. POS PAGE (PRINCIPALE) ---
const PosPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('TUTTI'); // Stato per il filtro

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? {...item, qty: item.qty + 1} : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const decrementCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing.qty > 1) {
      setCart(cart.map(item => item._id === product._id ? {...item, qty: item.qty - 1} : item));
    } else {
      removeFromCart(product._id);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const orderData = {
      items: cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.qty })),
      total: total
    };
    await axios.post('http://localhost:5000/api/orders', orderData);
    setCart([]);
    alert("Ordine registrato!");
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // LOGICA FILTRO CATEGORIE
  // 1. Estrai categorie uniche dai prodotti (ignorando quelle vuote)
  const categories = ['TUTTI', ...new Set(products.map(p => p.category).filter(c => c && c.trim() !== ''))];
  
  // 2. Filtra i prodotti da mostrare
  const filteredProducts = selectedCategory === 'TUTTI' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="d-flex w-100 h-100 overflow-hidden">
        
        {/* COLONNA SINISTRA: PRODOTTI + FILTRI */}
        <div className="col-8 d-flex flex-column h-100">
          
          {/* BARRA FILTRI CATEGORIE */}
          <div className="p-2 bg-white border-bottom overflow-auto d-flex flex-nowrap" style={{whiteSpace: 'nowrap'}}>
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`btn me-2 rounded-pill px-4 fw-bold shadow-sm ${selectedCategory === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
               >
                 {cat.toUpperCase()}
               </button>
             ))}
          </div>

          {/* GRIGLIA PRODOTTI */}
          <div className="p-3 bg-light overflow-auto flex-grow-1">
            <div className="row g-2">
              {filteredProducts.map(p => (
                <div key={p._id} className="col-4 col-lg-3 col-xl-2">
                  <div className="card h-100 shadow-sm product-card" onClick={() => addToCart(p)}>
                    {p.imageFilename ? (
                      <img src={IMG_BASE_URL + p.imageFilename} className="card-img-top small-img" alt={p.name} />
                    ) : (
                      <div className="card-img-top bg-secondary text-white d-flex align-items-center justify-content-center small-img">NO FOTO</div>
                    )}
                    <div className="card-body p-2 text-center bg-warning bg-opacity-10">
                      <h6 className="card-title fw-bold mb-1 text-truncate" style={{fontSize: '0.9rem'}}>{p.name}</h6>
                      <p className="card-text small m-0">€ {p.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: RIEPILOGO */}
        <div className="col-4 bg-light border-start d-flex flex-column h-100 shadow-lg" style={{zIndex: 10}}>
          <div className="p-3 bg-primary text-white shadow-sm flex-shrink-0">
            <h4 className="m-0 fs-5">Riepilogo Ordine</h4>
          </div>
          
          <div className="flex-grow-1 overflow-auto p-2">
            <ul className="list-group">
              {cart.map(item => (
                <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center mb-1 p-2">
                  <div className="me-1 overflow-hidden" style={{flex: 1}}>
                    <div className="fw-bold text-truncate">{item.name}</div>
                    <div className="text-muted small">€ {(item.price * item.qty).toFixed(2)}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="btn-group btn-group-sm me-2">
                      <button onClick={(e) => {e.stopPropagation(); decrementCart(item);}} className="btn btn-outline-secondary px-2">-</button>
                      <button className="btn btn-light disabled text-dark px-2 border-top border-bottom" style={{minWidth: '30px'}}>{item.qty}</button>
                      <button onClick={(e) => {e.stopPropagation(); addToCart(item);}} className="btn btn-outline-primary px-2">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="btn btn-danger btn-sm px-2">X</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-white border-top flex-shrink-0 shadow-lg">
            <div className="d-flex justify-content-between align-items-end mb-2">
              <span className="fs-5 text-muted">Totale:</span>
              <span className="fs-2 fw-bold text-success">€ {total.toFixed(2)}</span>
            </div>
            <button onClick={submitOrder} className="btn btn-success w-100 py-3 fw-bold fs-4 shadow-sm text-uppercase">
              PAGA
            </button>
          </div>
        </div>

    </div>
  );
};

// --- 2. GESTIONE PRODOTTI ---
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: '' }); // Aggiunto category
  const [file, setFile] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({ name: product.name, price: product.price, category: product.category || '' }); // Popola category
    setFile(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', price: '', category: '' });
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category); // Invia category
    if (file) formData.append('image', file);

    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, formData);
      alert('Prodotto aggiornato!');
    } else {
      await axios.post('http://localhost:5000/api/products', formData);
      alert('Prodotto aggiunto!');
    }
    handleCancel();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="container mt-4 pb-5 h-100 overflow-auto">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card p-3 shadow sticky-top" style={{top: '20px'}}>
            <h4 className="mb-3">{editingId ? 'Modifica' : 'Nuovo Prodotto'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">Nome</label>
                <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="mb-2">
                <label className="form-label small">Prezzo (€)</label>
                <input type="number" className="form-control" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              {/* NUOVO CAMPO CATEGORIA */}
              <div className="mb-2">
                <label className="form-label small">Categoria / Evento</label>
                <input 
                  className="form-control" 
                  placeholder="Es. Sagra, Bar, Colazione..." 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Immagine</label>
                <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`}>{editingId ? 'Aggiorna' : 'Aggiungi'}</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={handleCancel}>Annulla</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <h4 className="mb-3">Prodotti in listino</h4>
          <div className="table-responsive bg-white shadow-sm rounded">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Foto</th><th>Info</th><th>Prezzo</th><th className="text-end">Azioni</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>{p.imageFilename ? <img src={IMG_BASE_URL + p.imageFilename} alt="" style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'4px'}}/> : '-'}</td>
                    <td>
                      <div>{p.name}</div>
                      <small className="text-muted fst-italic">{p.category || 'Nessuna cat.'}</small>
                    </td>
                    <td>€ {p.price}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. REPORT ---
const ReportPage = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const res = await axios.get('http://localhost:5000/api/report');
    setReportData(res.data);
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendite");
    XLSX.writeFile(wb, "riepilogo_serata.xlsx");
  };

  const resetReport = async () => {
    if (window.confirm("SEI SICURO? \nQuesta operazione cancellerà tutto lo storico vendite attuale.\nNon si può annullare.")) {
      try {
        await axios.delete('http://localhost:5000/api/orders/reset');
        setReportData([]);
        alert("Storico azzerato correttamente.");
      } catch (err) {
        alert("Errore durante l'azzeramento.");
      }
    }
  };

  const grandTotal = reportData.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="container mt-5 text-center h-100 overflow-auto pb-5">
      <h2 className="mb-4">Vendite Ultime 24 Ore</h2>
      <div className="table-responsive shadow-sm mb-4 mx-auto" style={{maxWidth: '800px'}}>
        <table className="table table-striped table-bordered mb-0 text-start">
          <thead className="table-dark">
            <tr><th>Nome Prodotto</th><th>Quantità</th><th>Totale</th></tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.name}</td><td>{row.quantity}</td><td>€ {row.total.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="fw-bold fs-5 bg-warning bg-opacity-25">
              <td colSpan="2" className="text-end">TOTALE SERATA:</td>
              <td>€ {grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="d-flex justify-content-center gap-3">
        <button onClick={exportToExcel} className="btn btn-success px-4 py-2 fs-5 shadow">
           Scarica Excel
        </button>
        <button onClick={resetReport} className="btn btn-danger px-4 py-2 fs-5 shadow">
           Azzera Resoconto
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="d-flex flex-column vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-shrink-0">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/">CASSA</Link>
            <div className="d-flex">
              <Link className="btn btn-outline-light me-2" to="/">Vendita</Link>
              <Link className="btn btn-outline-light me-2" to="/manage">Prodotti</Link>
              <Link className="btn btn-outline-light" to="/report">Resoconto</Link>
            </div>
          </div>
        </nav>
        
        <div className="flex-grow-1 overflow-hidden position-relative">
          <Routes>
            <Route path="/" element={<PosPage />} />
            <Route path="/manage" element={<ProductManagementPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;