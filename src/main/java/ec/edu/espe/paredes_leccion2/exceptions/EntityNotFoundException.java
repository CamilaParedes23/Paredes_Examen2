package ec.edu.espe.paredes_leccion2.exceptions;

/**
 * Excepción para cuando no se encuentra una entidad
 */
public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
