import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { purchaseOrderService, STATUS_LABELS } from '../services/api';
import Loading from '../components/Loading';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await purchaseOrderService.getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      console.error('Error loading order:', err);
      setError(err.response?.data?.message || 'Error al cargar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      try {
        await purchaseOrderService.deleteOrder(id);
        navigate('/orders');
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar la orden');
      }
    }
  };

  // Obtener clase CSS para badge de estado
  const getStatusBadgeClass = (status) => {
    const classes = {
      DRAFT: 'badge-status-draft',
      SUBMITTED: 'badge-status-submitted',
      APPROVED: 'badge-status-approved',
      REJECTED: 'badge-status-rejected',
      CANCELLED: 'badge-status-cancelled'
    };
    return classes[status] || 'bg-secondary';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear fecha simple
  const formatDateSimple = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Formatear monto
  const formatAmount = (amount, currency) => {
    const symbol = currency === 'USD' ? '$' : '€';
    return `${symbol}${Number(amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
    return <Loading message="Cargando detalles de la orden..." />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Alert variant="danger" className="alert-custom">
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Link to="/orders">
                  <Button variant="outline-danger">Volver a Lista</Button>
                </Link>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="fade-in">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">Detalles de Orden</h2>
              <div className="d-flex gap-2">
                <Link to="/orders">
                  <Button variant="outline-secondary">
                    ← Volver a Lista
                  </Button>
                </Link>
                <Link to={`/orders/edit/${order.id}`}>
                  <Button variant="warning" className="text-white">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={handleDeleteOrder}
                >
                  Eliminar
                </Button>
              </div>
            </div>

            {/* Información Principal */}
            <Card className="card-custom mb-4">
              <Card.Header className="card-header-custom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Información General</h5>
                  <Badge className={getStatusBadgeClass(order.status)} style={{ fontSize: '0.9rem' }}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="border-end pe-3">
                      <h6 className="text-muted mb-2">Número de Orden</h6>
                      <p className="h5 mb-3 text-primary">{order.orderNumber}</p>

                      <h6 className="text-muted mb-2">Proveedor</h6>
                      <p className="mb-3">{order.supplierName}</p>

                      <h6 className="text-muted mb-2">Estado</h6>
                      <Badge className={getStatusBadgeClass(order.status)}>
                        {STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-muted mb-2">Monto Total</h6>
                    <p className="h4 mb-3 text-success">
                      {formatAmount(order.totalAmount, order.currency)}
                    </p>

                    <h6 className="text-muted mb-2">Moneda</h6>
                    <p className="mb-3">
                      {order.currency === 'USD' ? 'Dólares Americanos (USD)' : 'Euros (EUR)'}
                    </p>

                    <h6 className="text-muted mb-2">ID de Orden</h6>
                    <p className="mb-0 text-muted">#{order.id}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Fechas Importantes */}
            <Card className="card-custom mb-4">
              <Card.Header className="card-header-custom">
                <h5 className="mb-0">Fechas Importantes</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <h6 className="text-muted mb-2">Fecha de Creación</h6>
                    <p className="mb-0">
                      <i className="bi bi-calendar-plus me-2"></i>
                      {formatDate(order.createdAt)}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-muted mb-2">Fecha de Entrega Esperada</h6>
                    <p className="mb-0">
                      <i className="bi bi-calendar-check me-2"></i>
                      {formatDateSimple(order.expectedDeliveryDate)}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Resumen en Tabla */}
            <Card className="card-custom">
              <Card.Header className="card-header-custom">
                <h5 className="mb-0">Resumen de la Orden</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table className="mb-0" striped>
                  <tbody>
                    <tr>
                      <th className="ps-3" style={{ width: '30%' }}>Número de Orden:</th>
                      <td>{order.orderNumber}</td>
                    </tr>
                    <tr>
                      <th className="ps-3">Proveedor:</th>
                      <td>{order.supplierName}</td>
                    </tr>
                    <tr>
                      <th className="ps-3">Estado:</th>
                      <td>
                        <Badge className={getStatusBadgeClass(order.status)}>
                          {STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-3">Monto Total:</th>
                      <td className="fw-bold text-success">
                        {formatAmount(order.totalAmount, order.currency)}
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-3">Moneda:</th>
                      <td>{order.currency === 'USD' ? 'Dólares (USD)' : 'Euros (EUR)'}</td>
                    </tr>
                    <tr>
                      <th className="ps-3">Fecha de Creación:</th>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                    <tr>
                      <th className="ps-3">Fecha de Entrega:</th>
                      <td>{formatDateSimple(order.expectedDeliveryDate)}</td>
                    </tr>
                    <tr>
                      <th className="ps-3">ID:</th>
                      <td className="text-muted">#{order.id}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Acciones Adicionales */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Link to="/orders">
                <Button variant="outline-primary" className="btn-outline-primary-custom">
                  Ver Todas las Órdenes
                </Button>
              </Link>
              <Link to="/orders/new">
                <Button variant="primary" className="btn-primary-custom">
                  Crear Nueva Orden
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PurchaseOrderDetail;
