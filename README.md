# 📹 Detección de Movimiento y Registro de Estado en Tiempo Real

Este proyecto utiliza la cámara del navegador para detectar movimiento en tiempo real. Está orientado al monitoreo de actividad (por ejemplo, una máquina en una línea de producción), identificando **cuándo se detiene** y **cuánto tiempo permanece parada**, con visualización en pantalla y registro del tiempo perdido.

---

## 🧠 Características

- ✅ Captura en tiempo real desde la cámara web usando `getUserMedia`.
- 📊 Detección de movimiento por diferencia de imágenes.
- ⏱️ Registra eventos de cambio de estado (marcha/parada).
- 🔴 Ignora paradas menores a 1 minuto (configurable).
- 📈 Calcula el tiempo total perdido por inactividad.
- 🎨 Interfaz visual con actualización del estado actual y métricas.

---

## 📁 Estructura del proyecto

proyecto-deteccion-movimiento/
├── index.html # Interfaz del usuario
├── style.css # Estilos para el estado visual
├── script.js # Lógica de cámara, detección y registro
└── README.md # Este documento


---

## 🚀 Cómo usar

### 1. Clona o descarga el repositorio

```bash
git clone https://github.com/cristianriveraxd/ProjectPL
cd ProjectPL
```

### 2. Correr con virtual server.

Solo necesitas abrir el archivo en un navegador moderno (como Chrome o Firefox) que soporte getUserMedia.
Nota: Asegúrate de permitir el acceso a la cámara cuando el navegador lo solicite.

### 📦 Requisitos
Navegador moderno (Chrome, Firefox, Edge)

Permiso de cámara habilitado

No requiere instalación ni servidor: es 100% frontend

## 🔍 Descripción técnica
- 📸 iniciarCamara()
    - Solicita acceso a la cámara, vincula el video al canvas, y comienza a capturar imágenes cada 300 ms para analizar movimiento.

- 🧠 detectarMovimiento()
    - Dibuja el fotograma actual en el canvas.

    - Compara cada píxel con el fotograma anterior.

    - Si hay pocos cambios → se considera "parada".

    - Si hay muchos cambios → se considera "marcha".

    - Registra y actualiza estados según los cambios detectados.

- 🛑 actualizarEstado(nuevoEstado)
    - Cambia visualmente el estado actual (verde para marcha, rojo para parada).

    - Solo registra paradas mayores a 1 minuto (ajustable).

    - Calcula el tiempo perdido en minutos.

    - Llama a registrarEvento() para almacenar el evento.

    - Llama a actualizarGraficaEficiencia() para mostrar métricas.

### ⚙️ Personalización

```
const umbralSensibilidad = 2000; // sensibilidad a cambios (ajustable)
const intervaloDeteccion = 300; // milisegundos entre capturas
const tiempoMinimoParada = 60; // segundos mínimos para considerar una parada válida
```

## 🧑‍💻 Autores
- Cristian E. Rivera Desarrollador principal
