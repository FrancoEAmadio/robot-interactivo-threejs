# Simulador 3D Interactivo: Control Lógico de Robot

## 📝 Descripción del Proyecto
Proyecto final desarrollado para la materia **Programación con Entorno de Trabajo**. Consiste en un simulador en entorno tridimensional interactivo construido con **Three.js** (JavaScript Vanilla). 

El objetivo del desafío es controlar las acciones de un robot mediante una interfaz de comandos de texto para resolver un puzzle logístico: localizar cubos dispersos en la escena, orientar espacialmente al robot, manipular la jerarquía de objetos para "agarrarlos", transportarlos hasta una meta (aro/Torus) y anotar puntos hasta completar la condición de victoria.

## 🕹️ Mecánicas y Lógica del Juego
* **Sistema de Comandos por Texto:** Interfaz de usuario donde se ingresan instrucciones textuales (avanzar, rotar, agarrar, soltar) que el robot interpreta y ejecuta paso a paso.
* **Orientación y Cinemática Espacial:** El usuario debe calcular los giros del robot (izquierda/derecha) para alinear su vector de visión con los objetivos antes de avanzar.
* **Manipulación de Jerarquías (Padre / Hijo):** Al emitir el comando de **agarrar**, el script desvincula el cubo del entorno global, lo adjunta dinámicamente a la estructura del robot, y lo vuelve a soltar en la zona de destino al indicar **soltar**.
* **Detección de Colisiones y Metas:** Implementación de `Raycaster` y cálculo espacial (`Box3` y distancia euclidiana) para validar las interacciones físicas y corroborar automáticamente la condición de anotación de puntos.
* **Condición de Victoria:** Al recopilar y depositar con éxito los tres cubos en la meta asignada, el sistema dispara la alerta de victoria.

## 🛠️ Tecnologías Utilizadas
* **JavaScript (ES6+)** - Lógica de control, eventos del DOM y parseo de comandos.
* **Three.js** - Motor gráfico 3D basado en WebGL para renderizado de escenas, luces, materiales y cámaras orbitales (`OrbitControls`).
* **JSON (ObjectLoader)** - Carga y estructuración de la escena estática (`Scene.json`).
* **HTML5 & CSS3** - Interfaz minimalista de comandos flotantes (`<details>`).

## 🚀 Instalación y Ejecución Local
1. Clonar o descargar el repositorio.
2. Abrir el proyecto utilizando un servidor local (como la extensión **Live Server** de Visual Studio Code) para evitar restricciones de seguridad CORS al importar módulos de Three.js.
3. Ingresar comandos en la caja de texto lateral y presionar "Actuar" para interactuar con el robot.
