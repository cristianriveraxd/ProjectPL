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
git clone 
