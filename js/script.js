import * as THREE from "./packages/three.module.js"

import {
    OrbitControls
} from './packages/OrbitControls.js'

import Cube from "./cube.js"

let viewport = document.getElementById("viewport")
let viewWrapper = document.getElementById("viewport-wrapper")

let Width = viewport.clientWidth
let Height = viewport.clientHeight

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.domElement);

/* --------------------- THREE Setup --------------------- */

// Create base THREE js scene
let scene = new THREE.Scene();

// Create perspective camera
// (fov, aspect ratio, near clip, far clip)
let camera = new THREE.PerspectiveCamera(60, Width / Height, 0.1, 1000);
camera.position.x = -1.5;
camera.position.z = -1.5;
camera.position.y = 1.5;

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
controls.enablePan = false
controls.enableKeys = false

controls.autoRotate = true

controls.enableZoom = false

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
    console.log("resize")

    viewport.width = viewWrapper.clientWidth
    viewport.height = viewWrapper.clientHeight

    let Width = viewWrapper.clientWidth
    let Height = viewWrapper.clientHeight

    console.log(Width, Height)

    renderer.setSize(Width, Height);

    camera.aspect = Width / Height
    camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize, false)

/* --------------------- Cube Setup --------------------- */

// var axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

let cube = new Cube(2)
cube.build()
console.log(cube)
cube.generateMesh()
scene.add(cube.Node)

/* --------------------- Ray Casting --------------------- */

let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2();

var dir = new THREE.Vector3(1, 2, 0);

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

var origin = new THREE.Vector3(0, 0, 0);
var length = 1;
var hex = 0xffff00;

// var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
// scene.add(arrowHelper);

viewport.addEventListener("mousemove", function (event) {
    let domRect = viewport.getBoundingClientRect()

    mouse.x = ((event.clientX - domRect.x) / domRect.width) * 2 - 1
    mouse.y = ((event.clientY - domRect.y) / domRect.height) * 2 - 1
    raycaster.setFromCamera(mouse, camera);

    let intersecting = raycaster.intersectObjects(cube.Node.children)

    if (intersecting.length > 0) {
        // console.log(intersecting[0])
        // intersecting[0].object.material.color = new THREE.Color(1, 1, 1)
    }
})

/* --------------------- GUI --------------------- */

for(let elem of document.getElementsByClassName("colour-swatch")) {
    elem.addEventListener("click", setColour(event))
}

function setColour(event) {
    console.log(this)
}

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