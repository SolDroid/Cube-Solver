import * as THREE from "./packages/three.module.js"

import {
    OrbitControls
} from './packages/OrbitControls.js'

import Cube from "./cube.js"

let viewport = document.getElementById("viewport")

let Width = viewport.clientWidth
let Height = viewport.clientHeight

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.domElement);

/* --------------------- THREE Setup --------------------- */

// Create base THREE js scene
let scene = new THREE.Scene();

// Create perspective camera
// (fov, aspect ratio, near clip, far clip)
let camera = new THREE.PerspectiveCamera(75, Width / Height, 0.1, 1000);
camera.position.x = -1;
camera.position.z = -1;
camera.position.y = 1;

// WebGL Renderer Setup
let renderer = new THREE.WebGLRenderer({
    canvas: viewport,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(Width, Height);

let controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true
controls.dampingFactor = 0.05

controls.screenSpacePanning = false
controls.enableKeys = true
controls.keys = {
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    BOTTOM: 83
}

controls.minDistance = 1
controls.maxDistance = 100

controls.maxPolarAngle = Math.PI

// Animation mixer
let mixer

// Create ambient light
let light = new THREE.AmbientLight(0xd5c1f8, 0.6);
scene.add(light);

// Create directional light
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight);

// Handel window resize
function resize(e) {
    let Width = viewport.clientWidth
    let Height = viewport.clientHeight

    renderer.setSize(Width, Height);

    camera.aspect = Width / Height
    camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize, false)

/* --------------------- Cube Setup --------------------- */

var axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let cube = new Cube(2)
cube.build()
console.log(cube)
cube.generateMesh()
scene.add(cube.Node)

/* --------------------- Rendering --------------------- */

let clock = new THREE.Clock()

// Render loop
function render() {
    stats.begin();

    // Lock to 60fps
    setTimeout(function () {
        requestAnimationFrame(render);
    }, 1000 / 60);
    renderer.render(scene, camera);

    // rotate cube
    // mesh.rotation.x += 0.01
    // mesh.rotation.y += 0.01

    // cube.Node.rotation.x += 0.01
    // cube.Node.rotation.y += 0.01

    controls.update()

    // Play animation
    let delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    stats.end();
}
render();