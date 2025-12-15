import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  purchaseOrderService,
  ORDER_STATUS,
  CURRENCY,
  STATUS_LABELS,
  CURRENCY_LABELS,
} from "../services/api";
import Loading from "../components/Loading";

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatingOrderNumber, setGeneratingOrderNumber] = useState(false);

  const [formData, setFormData] = useState({
    orderNumber: "",
    supplierName: "",
    status: ORDER_STATUS.DRAFT,
    totalAmount: "",
    currency: CURRENCY.USD,
    expectedDeliveryDate: "",
  });

  const [errors, setErrors] = useState({});

  // Cargar datos de la orden si estamos editando
  useEffect(() => {
    if (isEditing) {
      loadOrder();
    } else {
      generateOrderNumber();
    }
  }, [id, isEditing]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getOrderById(id);
      // La API puede devolver {data: {...}} o directamente el objeto
      const order = response.data.data || response.data;

      setFormData({
        orderNumber: order.orderNumber,
        supplierName: order.supplierName,
        status: order.status,
        totalAmount: order.totalAmount.toString(),
        currency: order.currency,
        expectedDeliveryDate: order.expectedDeliveryDate,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar la orden");
    } finally {
      setLoading(false);
    }
  };

  const generateOrderNumber = async () => {
    try {
      setGeneratingOrderNumber(true);
      const response = await purchaseOrderService.generateOrderNumber();
      // La API devuelve {orderNumber: "PO-2025-XXXXXX", ...}
      const orderNumber =
        response.data.orderNumber || response.data.data || response.data;
      setFormData((prev) => ({
        ...prev,
        orderNumber: String(orderNumber),
      }));
    } catch (err) {
      console.error("Error generating order number:", err);
      // Si falla, generar uno manual como fallback
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0");
      setFormData((prev) => ({
        ...prev,
        orderNumber: `PO-${year}-${random}`,
      }));
    } finally {
      setGeneratingOrderNumber(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo modificado
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const orderNumber = String(formData.orderNumber || "").trim();
    if (!orderNumber) {
      newErrors.orderNumber = "El número de orden es requerido";
    }

    const supplierName = String(formData.supplierName || "").trim();
    if (!supplierName) {
      newErrors.supplierName = "El nombre del proveedor es requerido";
    } else if (supplierName.length > 255) {
      newErrors.supplierName =
        "El nombre del proveedor no puede exceder 255 caracteres";
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido";
    }

    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = "El monto total debe ser mayor a 0";
    }

    if (!formData.currency) {
      newErrors.currency = "La moneda es requerida";
    }

    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "La fecha de entrega es requerida";
    } else {
      const deliveryDate = new Date(formData.expectedDeliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deliveryDate < today) {
        newErrors.expectedDeliveryDate = "La fecha de entrega debe ser futura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const orderData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        supplierName: formData.supplierName.trim(),
        orderNumber: formData.orderNumber.trim(),
      };

      if (isEditing) {
        await purchaseOrderService.updateOrder(id, orderData);
        setSuccess("Orden actualizada exitosamente");
      } else {
        await purchaseOrderService.createOrder(orderData);
        setSuccess("Orden creada exitosamente");
      }

      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (err) {
      console.error("Error saving order:", err);
      setError(
        err.response?.data?.message ||
          `Error al ${isEditing ? "actualizar" : "crear"} la orden`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/orders");
  };

  if (loading && isEditing) {
    return <Loading message="Cargando datos de la orden..." />;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="fade-in">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">
                {isEditing ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
              </h2>
              <Link to="/orders">
                <Button variant="outline-secondary">← Volver a Lista</Button>
              </Link>
            </div>

            {/* Alertas */}
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

            {success && (
              <Alert variant="success" className="alert-custom">
                <Alert.Heading>¡Éxito!</Alert.Heading>
                <p>{success}</p>
              </Alert>
            )}

            {/* Formulario */}
            <Card className="card-custom">
              <Card.Header className="card-header-custom">
                <h5 className="mb-0">Información de la Orden</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {/* Número de Orden */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          Número de Orden *
                        </Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="text"
                            value={formData.orderNumber}
                            onChange={(e) =>
                              handleInputChange("orderNumber", e.target.value)
                            }
                            isInvalid={!!errors.orderNumber}
                            className="form-control-custom"
                            placeholder="PO-2025-XXXXXX"
                            disabled={generatingOrderNumber}
                          />
                          {!isEditing && (
                            <Button
                              type="button"
                              variant="outline-secondary"
                              onClick={generateOrderNumber}
                              disabled={generatingOrderNumber}
                              title="Generar nuevo número"
                            >
                              🔄
                            </Button>
                          )}
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.orderNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Estado */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          Estado *
                        </Form.Label>
                        <Form.Select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                          isInvalid={!!errors.status}
                          className="form-control-custom"
                        >
                          {Object.entries(STATUS_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.status}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Nombre del Proveedor */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          Nombre del Proveedor *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.supplierName}
                          onChange={(e) =>
                            handleInputChange("supplierName", e.target.value)
                          }
                          isInvalid={!!errors.supplierName}
                          className="form-control-custom"
                          placeholder="Ej: ACME Tools Inc."
                          maxLength={255}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.supplierName}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Máximo 255 caracteres
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Monto Total */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          Monto Total *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.totalAmount}
                          onChange={(e) =>
                            handleInputChange("totalAmount", e.target.value)
                          }
                          isInvalid={!!errors.totalAmount}
                          className="form-control-custom"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.totalAmount}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Moneda */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          Moneda *
                        </Form.Label>
                        <Form.Select
                          value={formData.currency}
                          onChange={(e) =>
                            handleInputChange("currency", e.target.value)
                          }
                          isInvalid={!!errors.currency}
                          className="form-control-custom"
                        >
                          {Object.entries(CURRENCY_LABELS).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            )
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.currency}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Fecha de Entrega */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="form-label-custom">
                          Fecha de Entrega Esperada *
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.expectedDeliveryDate}
                          onChange={(e) =>
                            handleInputChange(
                              "expectedDeliveryDate",
                              e.target.value
                            )
                          }
                          isInvalid={!!errors.expectedDeliveryDate}
                          className="form-control-custom"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.expectedDeliveryDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Botones */}
                  <div className="d-flex justify-content-end gap-3 mt-4">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="btn-primary-custom"
                    >
                      {loading
                        ? "Guardando..."
                        : isEditing
                        ? "Actualizar Orden"
                        : "Crear Orden"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PurchaseOrderForm;
