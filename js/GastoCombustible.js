'use strict'

// Clase para almacenar gastos individuales generados por el usuario
class GastoCombustible {
    constructor(tipo, fecha, km, precio){
        this.vehicleType = tipo;
        this.date = new Date(fecha);
        this.kilometers = km;
        this.precioViaje = precio;
    }

    convertToJSON() {
        const serializado = JSON.stringify({vehicleType: this.vehicleType, 
                                            date: this.date,
                                            kilometers: this.kilometers,
                                            precioViaje: this.precioViaje
                                        });
        return serializado;
    }
}

export default GastoCombustible;