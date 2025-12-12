package ec.edu.espe.paredes_leccion2.exceptions;

/**
 * Excepción personalizada para errores de validación
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
