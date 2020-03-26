import * as THREE from "./packages/three.module.js"

let viewport = document.getElementById("viewport")

let Width = viewport.clientWidth
let Height = viewport.clientHeight

/* --------------------- THREE Setup --------------------- */

// Create base THREE js scene
let scene = new THREE.Scene();

// Create perspective camera
// (fov, aspect ratio, near clip, far clip)
var camera = new THREE.PerspectiveCamera(75, Width / Height, 0.1, 1000);
camera.position.z = 2;

// WebGL Renderer Setup
let renderer = new THREE.WebGLRenderer({
    canvas: viewport,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(Width, Height);

// Animation mixer
let mixer

// Create ambient light
var light = new THREE.AmbientLight(0xd5c1f8, 0.6);
scene.add(light);

// Create directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight);

// Test cube
let geometry = new THREE.BoxBufferGeometry(1, 1, 1)
let material = new THREE.MeshPhongMaterial({
    color: 0xFF00FF
})
let mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// Handel window resize
function resize(e) {
    let Width = viewport.clientWidth
    let Height = viewport.clientHeight

    renderer.setSize(Width, Height);

    camera.aspect = Width / Height
    camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize, false)

/* --------------------- Rendering --------------------- */

let clock = new THREE.Clock()

// Render loop
function render() {
    // Lock to 60fps
    setTimeout(function () {
        requestAnimationFrame(render);
    }, 1000 / 60);
    renderer.render(scene, camera);

    // rotate cube
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01

    // Play animation
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
}
render();