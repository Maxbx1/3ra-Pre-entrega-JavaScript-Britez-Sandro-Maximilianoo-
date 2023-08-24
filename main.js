const tasasDeCambio = {
    USD: 1 / 550,
    EUR: 1 / 557,
};

const historialConversiones = [];

const conversorForm = document.getElementById('conversor-form');
const resultadoDiv = document.getElementById('resultado');
const historialBtn = document.getElementById('historial-btn');
const historialDiv = document.getElementById('historial');
const notificacionDiv = document.getElementById('notificacion');
const limpiarHistorialBtn = document.getElementById('limpiar-historial-btn');

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.classList.remove('hidden', 'success', 'error', 'info');
    notificacionDiv.classList.add(tipo);
    setTimeout(() => {
        notificacionDiv.classList.add('hidden');
        notificacionDiv.classList.remove(tipo);
    }, 3000);
}

function convertirMonto(monto, monedaDestino) {
    if (isNaN(monto) || monto <= 0) {
        mostrarNotificacion('Ingrese un monto válido.', 'error');
        return;
    }

    if (!tasasDeCambio[monedaDestino]) {
        mostrarNotificacion('Moneda de destino inválida. Intente nuevamente.', 'error');
        return;
    }

    const tasaDeCambio = tasasDeCambio[monedaDestino];
    const resultado = (monto * tasaDeCambio).toFixed(2);

    resultadoDiv.innerHTML = `Equivalente en ${monedaDestino}: ${resultado}`;
    resultadoDiv.classList.remove('hidden');

    const conversion = {
        montoOriginal: monto,
        monedaOrigen: 'ARS',
        montoConvertido: resultado,
        monedaDestino: monedaDestino,
    };

    historialConversiones.push(conversion);
    mostrarNotificacion('Conversión exitosa.', 'success');
}

function mostrarHistorial() {
    if (historialConversiones.length === 0) {
        historialDiv.textContent = 'No hay historial de conversiones.';
    } else {
        historialDiv.innerHTML = 'Historial de conversiones:<br>';
        historialConversiones.forEach((conversion, index) => {
            historialDiv.innerHTML += `${index + 1}. ${conversion.montoOriginal} ${conversion.monedaOrigen} = ${conversion.montoConvertido} ${conversion.monedaDestino} <span class="detalle-conversion" data-index="${index}">(Ver detalles)</span><br>`;
        });
    }
    historialDiv.classList.remove('hidden');
}

conversorForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const monto = parseFloat(document.getElementById('monto').value);
    const monedaDestino = document.getElementById('monedaDestino').value;
    convertirMonto(monto, monedaDestino);
    conversorForm.reset();
});

limpiarHistorialBtn.addEventListener('click', function () {
    historialConversiones.length = 0;
    historialDiv.textContent = 'Historial de conversiones limpiado.';
    notificacionDiv.classList.add('hidden');
});

historialBtn.addEventListener('click', mostrarHistorial);

historialDiv.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('detalle-conversion')) {
        const index = parseInt(target.dataset.index);
        const conversion = historialConversiones[index];
        mostrarNotificacion(`Detalles de conversión: ${conversion.montoOriginal} ${conversion.monedaOrigen} = ${conversion.montoConvertido} ${conversion.monedaDestino}`, 'info');
    }
});
