import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const sceneLoader = new THREE.ObjectLoader();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

let escena;
let personaje;
let cubos = [];
window.cubos = cubos;
let cuboAgarrado = null;
window.cuboAgarrado = cuboAgarrado;

const idTextoUsuario = document.getElementById("idTextoUsuario");

sceneLoader.load(
  "Scene.json",
  function (scene) {
    escena = scene;
    personaje = escena.getObjectByName("robot");

    // Llenar el array de cubos
    scene.traverse(function (hijo) {
      if (hijo.isMesh && hijo.material && hijo.material.name) {
        if (hijo.material.name.includes("cubo")) {
          cubos.push(hijo);
        }
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    controls.target.copy(center);
    controls.update();
    animate(scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate(scene) {
  requestAnimationFrame(() => animate(scene));
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function fnActuar() {
  fnProcesarTexto(idTextoUsuario.value);
  idTextoUsuario.focus();
  idTextoUsuario.select();
}
window.fnActuar = fnActuar;

idTextoUsuario.onkeyup = function (event) {
  if (event.code === "Enter") {
    fnActuar();
  }
};

function fnProcesarTexto(_dadoTexto) {
  _dadoTexto = _dadoTexto.toLowerCase();

  // AVANZAR
  let _expRegAvanzar = /(move|avan|camina)(.*?)\s(?<_num>\d+)\s(paso|lugar)/i;
  let _extracc1 = _expRegAvanzar.exec(_dadoTexto);
  if (_extracc1) {
    let _cantPasos = Number(_extracc1.groups._num);
    animarAdelante(personaje, _cantPasos);
    return;
  }

  // GIRAR DERECHA
  let _expRegDerecha = /(gir|move|rot)(.*?)\s(der)/i;
  if (_expRegDerecha.test(_dadoTexto)) {
    girarDerecha(personaje);
    return;
  }

  // GIRAR IZQUIERDA
  let _expRegIzquierda = /(gir|move|rot)(.*?)\s(izq)/i;
  if (_expRegIzquierda.test(_dadoTexto)) {
    girarIzquierda(personaje);
    return;
  }

  // AGARRAR CUBO
  let _expRegAgarrar = /(agarrar|tomar|levanta|agarra)/i;
  if (_expRegAgarrar.test(_dadoTexto)) {
    fnAgarrarCubo();
    return;
  }

  // SOLTAR CUBO
  let _expRegSoltar = /(solta|deja|tira|suelta)/i;
  if (_expRegSoltar.test(_dadoTexto)) {
    fnSoltarCubo();
    return;
  }

  alert("No te entendí. Probá de nuevo.");
}

function animarAdelante(personaje, pasos) {
  if (!personaje) return;

  let totalMiniPasos = pasos * 10;
  let distanciaMiniPaso = 0.1;

  for (let i = 0; i < totalMiniPasos; i++) {
    personaje.translateZ(distanciaMiniPaso);
  }
}
window.animarAdelante = animarAdelante;

function girarDerecha(personaje) {
  if (!personaje) return;
  personaje.rotation.y -= THREE.MathUtils.degToRad(45);
}

function girarIzquierda(personaje) {
  if (!personaje) return;
  personaje.rotation.y += THREE.MathUtils.degToRad(45);
}

// LÓGICA DE AGARRAR Y SOLTAR
function fnAgarrarCubo() {
  if (cuboAgarrado) {
    alert("Ya tengo un cubo en la mano.");
    return;
  }

  let cajaRobot = new THREE.Box3().setFromObject(personaje);
  cajaRobot.expandByScalar(1.5);

  for (let i = 0; i < cubos.length; i++) {
    let cajaCubo = new THREE.Box3().setFromObject(cubos[i]);

    if (cajaRobot.intersectsBox(cajaCubo)) {
      cuboAgarrado = cubos[i];
      personaje.add(cuboAgarrado);
      cuboAgarrado.position.set(0, 0.5, 0.8);
      console.log("Cubo agarrado!");
      return;
    }
  }
  alert("No hay ningún cubo lo suficientemente cerca.");
}

function fnSoltarCubo() {
  if (!cuboAgarrado) {
    alert("No tengo nada para soltar.");
    return;
  }

  let posMundo = new THREE.Vector3();
  cuboAgarrado.getWorldPosition(posMundo);

  escena.add(cuboAgarrado);
  cuboAgarrado.position.copy(posMundo);
  cuboAgarrado.position.y = 0.5;
  cuboAgarrado.rotation.set(0, 0, 0);

  cuboAgarrado = null;
  console.log("Cubo en el piso.");

  fnChequearVictoria();
}

function fnChequearVictoria() {
  let zonaDestino = escena.getObjectByName("Torus");
  if (!zonaDestino) return;

  let posDestino = new THREE.Vector3();
  zonaDestino.getWorldPosition(posDestino);

  let cubosEnDestino = 0;

  for (let cubo of cubos) {
    let posCubo = new THREE.Vector3();
    cubo.getWorldPosition(posCubo);

    if (posCubo.distanceTo(posDestino) < 5) {
      cubosEnDestino++;
    }
  }

  if (cubosEnDestino >= 3) {
    setTimeout(() => {
      alert("¡GANASTE! Llevaste los 3 cubos a la zona de destino.");
    }, 300);
  }
}