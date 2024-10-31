'use strict'

// Import de la clase GastoCombustible
import GastoCombustible from "./GastoCombustible.js";

// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'data/tarifasCombustible.json';
let gastosJSONpath = 'data/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    // Mapea gastosJSON a un array de objetos GastoCombustible, esto facilita las comparativas de fecha.
    const gastos = gastosJSON.map(gasto => new GastoCombustible(
        gasto.vehicleType, 
        gasto.date, 
        gasto.kilometers, 
        gasto.precioViaje)
    )

    // Recorre el array de años para calcular y almacenar los gastos de cada año
    for (let anio in aniosArray) {

        // Filtra los objetos por el año que se está iterando
        const resultados = gastos.filter(elemento => elemento.date.getFullYear() == anio)

        // Acumula los gastos del año en el array de totales
        for (let gasto in resultados) {
            aniosArray[anio] += parseFloat(resultados[gasto].precioViaje)
        }

        // Fuerza el resultado final a un redondeo de dos decimales
        aniosArray[anio] = (Math.round(aniosArray[anio] * 100) / 100).toFixed(2)

        // Una vez terminados los cálculos, muestra el gasto total en el HTML
        document.getElementById('gasto' + anio).innerText = aniosArray[anio] + " €";
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    // Asigna a precioViaje el gasto calculado 
    const precioViaje = calcularPrecioViaje(tipoVehiculo, fecha, kilometros);

    // Genera un nuevo GastoCombustible a partir de todos los datos recogidos
    const gastoAGuardar = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);
    
    // Lo añade al array de gastosJSON
    gastosJSON.push(gastoAGuardar);

    // Recalcula los totales
    calcularGastoTotal();

    // Muestra el gasto añadido en el listado de Gastos Recientes del HTML
    document.getElementById('expense-list').innerHTML += "<li>" + gastoAGuardar.convertToJSON() + "</li>";

    // Por último, vacía el formulario
    document.getElementById('fuel-form').reset();
}

// Obtiene el precioViaje de un gasto a partir de las tarifas
function calcularPrecioViaje(tipoVehiculo, fecha, kilometros) {
    // Extrae el año de la fecha
    const anio = fecha.getFullYear();
    // Filtra el array de tarifas por el año y recoge el precio para el tipo de vehículo
    const coste =  tarifasJSON.tarifas.find((anio) => anio == anio).vehiculos[tipoVehiculo];
    // Calcula y devuelve el precio del viaje redondeando
    return Math.round((coste * kilometros) * 100) / 100;
}