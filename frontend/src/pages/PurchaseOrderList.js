import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Alert,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  purchaseOrderService,
  ORDER_STATUS,
  CURRENCY,
  STATUS_LABELS,
  CURRENCY_LABELS,
} from "../services/api";
import Loading from "../components/Loading";

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    currency: "",
    minTotal: "",
    maxTotal: "",
    from: "",
    to: "",
  });

  const navigate = useNavigate();

  // Cargar órdenes
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Filtrar valores vacíos
      const cleanFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value && value.trim() !== "") {
            acc[key] = value.trim();
          }
          return acc;
        },
        {}
      );

      const response = await purchaseOrderService.getAllOrders(cleanFilters);
      console.log("API Response:", response.data);
      // La API devuelve {data: [], count: 0, message: "...", ...}
      let ordersData = [];
      if (response.data && typeof response.data === "object") {
        // Si response.data tiene una propiedad 'data', usar esa
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        }
      }
      console.log(
        "Orders Data:",
        ordersData,
        "Is Array:",
        Array.isArray(ordersData)
      );
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    fetchOrders();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      q: "",
      status: "",
      currency: "",
      minTotal: "",
      maxTotal: "",
      from: "",
      to: "",
    });
    setTimeout(() => fetchOrders(), 100);
  };

  // Eliminar orden
  const handleDeleteOrder = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
      try {
        await purchaseOrderService.deleteOrder(id);
        setOrders(orders.filter((order) => order.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Error al eliminar la orden");
      }
    }
  };

  // Obtener clase CSS para badge de estado
  const getStatusBadgeClass = (status) => {
    const classes = {
      DRAFT: "badge-status-draft",
      SUBMITTED: "badge-status-submitted",
      APPROVED: "badge-status-approved",
      REJECTED: "badge-status-rejected",
      CANCELLED: "badge-status-cancelled",
    };
    return classes[status] || "bg-secondary";
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formatear monto
  const formatAmount = (amount, currency) => {
    const symbol = currency === "USD" ? "$" : "€";
    return `${symbol}${Number(amount).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return <Loading message="Cargando órdenes de compra..." />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <div className="fade-in">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">Órdenes de Compra</h2>
              <Link to="/orders/new">
                <Button variant="primary" className="btn-primary-custom">
                  + Nueva Orden
                </Button>
              </Link>
            </div>

            {/* Filtros */}
            <Card className="card-custom mb-4">
              <Card.Header className="card-header-custom">
                <h5 className="mb-0">Filtros de Búsqueda</h5>
              </Card.Header>
              <Card.Body className="filters-container">
                <Row className="g-3">
                  <Col md={6} lg={3}>
                    <Form.Label className="form-label-custom">
                      Búsqueda
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Número de orden o proveedor..."
                      value={filters.q}
                      onChange={(e) => handleFilterChange("q", e.target.value)}
                      className="filter-input"
                    />
                  </Col>

                  <Col md={6} lg={2}>
                    <Form.Label className="form-label-custom">
                      Estado
                    </Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="filter-input"
                    >
                      <option value="">Todos</option>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6} lg={2}>
                    <Form.Label className="form-label-custom">
                      Moneda
                    </Form.Label>
                    <Form.Select
                      value={filters.currency}
                      onChange={(e) =>
                        handleFilterChange("currency", e.target.value)
                      }
                      className="filter-input"
                    >
                      <option value="">Todas</option>
                      {Object.entries(CURRENCY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6} lg={2}>
                    <Form.Label className="form-label-custom">
                      Monto Mín.
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0.00"
                      value={filters.minTotal}
                      onChange={(e) =>
                        handleFilterChange("minTotal", e.target.value)
                      }
                      className="filter-input"
                      min="0"
                      step="0.01"
                    />
                  </Col>

                  <Col md={6} lg={2}>
                    <Form.Label className="form-label-custom">
                      Monto Máx.
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="99999.99"
                      value={filters.maxTotal}
                      onChange={(e) =>
                        handleFilterChange("maxTotal", e.target.value)
                      }
                      className="filter-input"
                      min="0"
                      step="0.01"
                    />
                  </Col>

                  <Col md={12} lg={1} className="d-flex align-items-end">
                    <div className="d-flex gap-2 w-100">
                      <Button
                        variant="primary"
                        onClick={handleApplyFilters}
                        className="btn-primary-custom flex-grow-1"
                      >
                        Buscar
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Label className="form-label-custom">
                      Fecha Desde
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={filters.from}
                      onChange={(e) =>
                        handleFilterChange("from", e.target.value)
                      }
                      className="filter-input"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label className="form-label-custom">
                      Fecha Hasta
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={filters.to}
                      onChange={(e) => handleFilterChange("to", e.target.value)}
                      className="filter-input"
                    />
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearFilters}
                    size="sm"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Alertas de error */}
            {error && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setError(null)}
                className="alert-custom"
              >
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            {/* Tabla de órdenes */}
            <Card className="card-custom">
              <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Órdenes ({orders.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">
                      No se encontraron órdenes de compra
                    </p>
                    <small className="text-muted">
                      Intenta ajustar los filtros o crear una nueva orden
                    </small>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="table-custom mb-0">
                      <thead>
                        <tr>
                          <th>Número de Orden</th>
                          <th>Proveedor</th>
                          <th>Estado</th>
                          <th>Monto Total</th>
                          <th>Fecha de Creación</th>
                          <th>Fecha de Entrega</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <Link
                                to={`/orders/view/${order.id}`}
                                className="text-decoration-none fw-bold"
                              >
                                {order.orderNumber}
                              </Link>
                            </td>
                            <td className="text-truncate-custom">
                              {order.supplierName}
                            </td>
                            <td>
                              <Badge
                                className={getStatusBadgeClass(order.status)}
                              >
                                {STATUS_LABELS[order.status] || order.status}
                              </Badge>
                            </td>
                            <td className="fw-bold">
                              {formatAmount(order.totalAmount, order.currency)}
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              {new Date(
                                order.expectedDeliveryDate
                              ).toLocaleDateString("es-ES")}
                            </td>
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  as={Link}
                                  to={`/orders/view/${order.id}`}
                                  variant="outline-info"
                                  size="sm"
                                  title="Ver detalles"
                                >
                                  Ver
                                </Button>
                                <Button
                                  as={Link}
                                  to={`/orders/edit/${order.id}`}
                                  variant="outline-warning"
                                  size="sm"
                                  title="Editar orden"
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  title="Eliminar orden"
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PurchaseOrderList;
