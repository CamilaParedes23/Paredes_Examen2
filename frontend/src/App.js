import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importar páginas
import PurchaseOrderList from './pages/PurchaseOrderList';
import PurchaseOrderForm from './pages/PurchaseOrderForm';
import PurchaseOrderDetail from './pages/PurchaseOrderDetail';

// Importar componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            {/* Ruta principal - redirigir a lista de órdenes */}
            <Route path="/" element={<Navigate to="/orders" replace />} />

            {/* Lista de órdenes de compra */}
            <Route path="/orders" element={<PurchaseOrderList />} />

            {/* Crear nueva orden */}
            <Route path="/orders/new" element={<PurchaseOrderForm />} />

            {/* Editar orden existente */}
            <Route path="/orders/edit/:id" element={<PurchaseOrderForm />} />

            {/* Ver detalles de orden */}
            <Route path="/orders/view/:id" element={<PurchaseOrderDetail />} />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
