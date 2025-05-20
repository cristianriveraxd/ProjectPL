// --- Inicio de sesión ----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const jefe = localStorage.getItem('jefe');
    if (!usuario || !jefe) return (window.location.href = 'index.html');
    document.getElementById('usuario').textContent = usuario;
    document.getElementById('jefe').textContent = jefe;
    iniciarCamara();                // ⬅️  activar cámara
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// --- Variables globales --------------------------------------------
let video, canvas, context;
let previousImageData = null;
let estadoActual = 'marcha';
let horaParada = null;
const umbralSensibilidad = 8000; // Ajusta según tu cámara/escena
let indice = 0;
const totalMinutosTurno = 480;
let minutosPerdidos = 0;
let tiempoInicioParada = null;

// --- Iniciar cámara -------------------------------------------------
function iniciarCamara() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.addEventListener('play', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            setInterval(detectarMovimiento, 300); // cada 300 ms
        });
    }).catch(console.error);
}

// --- Detección de movimiento ---------------------------------------
function detectarMovimiento() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);

    if (previousImageData) {
        let cambios = 0;
        for (let i = 0; i < currentImageData.data.length; i += 4) {
            const diff = Math.abs(currentImageData.data[i] - previousImageData.data[i]);
            if (diff > 30) cambios++;
        }

        const sensibilidadMinima = umbralSensibilidad * 0.8;

        // CAMBIO a PARADA
        if (cambios < sensibilidadMinima && estadoActual === 'marcha') {
            horaParada = new Date();
            estadoActual = 'parada';
            actualizarEstado('parada');
        }

        // CAMBIO a MARCHA
        if (cambios >= umbralSensibilidad && estadoActual === 'parada') {
            actualizarEstado('marcha');
            const horaMarcha = new Date();
            const duracionParada = Math.round((horaMarcha - horaParada) / 60000); // minutos
            minutosPerdidos += duracionParada;

            actualizarGraficaEficiencia();

            horaParada = null;
            estadoActual = 'marcha';
        }
    }
    previousImageData = currentImageData;
}

// --- Actualizar estado y registrar eventos -------------------------
function actualizarEstado(nuevoEstado) {
    const estadoBadge = document.getElementById('estado');
    if (nuevoEstado === 'parada') {
        estadoBadge.textContent = 'Estado: Parada';
        estadoBadge.classList.replace('bg-success', 'bg-danger');
        horaParada = new Date();
        estadoActual = 'parada';
    } else {
        estadoBadge.textContent = 'Estado: Marcha';
        estadoBadge.classList.replace('bg-danger', 'bg-success');
        const horaMarcha = new Date();
        registrarEvento(horaParada, horaMarcha);
        estadoActual = 'marcha';
    }
}

// --- Registrar evento en la tabla ----------------------------------
function registrarEvento(inicio, fin) {
    indice++;
    const tbody = document.querySelector('#tablaEventos tbody');
    const duracionMs = fin - inicio;
    const duracion = new Date(duracionMs).toISOString().substr(11, 8); // hh:mm:ss
    console.log(`Minutos perdidos acumulados: ${minutosPerdidos}`);

    const causales = ['Falla electrica', 'Falla mecanica', 'Cambio de formato no notificado', 'Producto sin sticker', 'Codificación de sticker', 'Secuencia de productos'
        ,'Producto no conforme','Producto abierto','Formatos altos','Descarte','Bloqueo por chequeador de peso', 'Bloqueo en chequeador de peso'
    ];
    const opciones = causales.map(causal => `<option value="${causal}">${causal}</option>`).join('');

    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${indice}</td>
        <td>${inicio.toLocaleTimeString()}</td>
        <td>${fin.toLocaleTimeString()}</td>
        <td>${duracion}</td>
        <td class="bg-light">
            <select class="form-select causal-select">
                <option disabled selected>Seleccionar causal</option>
                ${opciones}
            </select>
        </td>
    `;
    tbody.prepend(fila); // Agrega la fila al inicio de la tabla

    // Confirmar automáticamente la causal al seleccionarla
    const select = fila.querySelector('.causal-select');
    select.addEventListener('change', function () {
        const valorSeleccionado = this.value;
        const td = document.createElement('td');
        td.textContent = valorSeleccionado;
        td.classList.add('bg-light');
        this.parentNode.replaceWith(td); // Reemplaza el <td> que contenía el <select> por uno fijo
    });
}

// --- Exportar a Excel ----------------------------------------------
document.getElementById('btnExport').addEventListener('click', () => {
    const usuario = localStorage.getItem('usuario') || 'usuario';
    const jefe = localStorage.getItem('jefe') || 'jefe';
    const fecha = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `paradas_${usuario}_${fecha}_Jefe:${jefe}.xlsx`;

    const rows = [...document.querySelectorAll('#tablaEventos tr')]
        .slice(1)
        .map(tr => [...tr.children].map(td => td.innerText));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([['#', 'Inicio', 'Fin', 'Duración', 'Causal'], ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, 'Paradas');
    XLSX.writeFile(wb, nombreArchivo);
});



//--- Graficos ------------------------------------------------------
const ctx = document.getElementById('graficaEficiencia').getContext('2d');
const graficaEficiencia = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Disponible', 'Detenida'],
        datasets: [{
            data: [480, minutosPerdidos],
            backgroundColor: ['#0EA700', '#E60000'],
            borderWidth: 1
        }]
    },
    options: {
        cutout: '75%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw} minutos`;
                    }
                }
            }
        }
    }
});

function actualizarGraficaEficiencia() {
    const minutosDisponibles = totalMinutosTurno - minutosPerdidos;
    let color;

    const porcentaje = (minutosDisponibles / totalMinutosTurno) * 100;

    if (porcentaje >= 80) color = '#0EA700';     // verde
    else if (porcentaje >= 60) color = '#FF8322'; // naranja
    else color = '#FE0000';                       // rojo

    graficaEficiencia.data.datasets[0].data = [minutosDisponibles, minutosPerdidos];
    graficaEficiencia.data.datasets[0].backgroundColor[0] = color;
    graficaEficiencia.update();
}



