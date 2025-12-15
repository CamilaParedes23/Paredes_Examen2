import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ message = 'Cargando...', size = 'lg' }) => {
  return (
    <div className="loading-container">
      <div className="text-center">
        <Spinner
          animation="border"
          role="status"
          variant="primary"
          size={size}
          className="spinner-custom"
        />
        <div className="mt-3">
          <p className="text-muted">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
