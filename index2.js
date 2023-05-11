"use strict";

var $menu = $('.Menu-list'),
    $item = $('.Menu-list-item'),
    w = $(window).width(), //window width
    h = $(window).height(); //window height

$(window).on('mousemove', function(e) {
  var offsetX = 0.5 - e.pageX / w, //cursor position X
      offsetY = 0.5 - e.pageY / h, //cursor position Y
      dy = e.pageY - h / 2, //@h/2 = center of poster
      dx = e.pageX - w / 2, //@w/2 = center of poster
      theta = Math.atan2(dy, dx), //angle between cursor and center of poster in RAD
      angle = theta * 180 / Math.PI - 90, //convert rad in degrees
      offsetPoster = $menu.data('offset'),
      transformPoster = 'translate3d(0, ' + -offsetX * offsetPoster + 'px, 0) rotateX(' + (-offsetY * offsetPoster) + 'deg) rotateY(' + (offsetX * (offsetPoster * 2)) + 'deg)'; //poster transform

  //get angle between 0-360
  if (angle < 0) {
    angle = angle + 360;
  }

  //poster transform
  $menu.css('transform', transformPoster);

  //parallax for each layer
  $item.each(function() {
    var $this = $(this),
        offsetLayer = $this.data('offset') || 0,
        transformLayer = 'translate3d(' + offsetX * offsetLayer + 'px, ' + offsetY * offsetLayer + 'px, 20px)';

    $this.css('transform', transformLayer);
  });
});






// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the sphere
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0xaaaaaa,
  shininess: 10,
  side: THREE.DoubleSide
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 0, -50);
scene.add(sphere);

// Add a point light to the scene
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 0);
scene.add(light);

// Create a wavy surface animation
const time = new THREE.Clock();
const noise = new THREE.Noise();
const waveSpeed = 0.1;
const waveHeight = 1.5;
const waveFrequency = 4;
const waveOffset = 2;
function updateWave() {
  const t = time.getElapsedTime() * waveSpeed;
  const position = sphere.geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(position, i);
    vertex.z = noise.simplex3(
      vertex.x / waveFrequency + t,
      vertex.y / waveFrequency,
      vertex.z / waveFrequency + waveOffset
    ) * waveHeight;
    position.setZ(i, vertex.z);
  }
  position.needsUpdate = true;
}

// Animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Update the sphere's rotation and color
  sphere.rotation.y += 0.01;
  sphere.material.color.setHSL((time.getElapsedTime() / 2) % 1, 1, 0.5);

  // Update the wavy surface animation
  updateWave();

  renderer.render(scene, camera);
}
animate();
