$(document).ready(function () {
    console.log('App ready', document);
    background = new THREE.Color('#fff');
    init();
    animate();
    initKeyEvents();
});

var camera, scene, renderer;
var geometry, material;
var background;
var lightHelper;

function init() {
    var solarSystem = new SolarSystem();
    var sun, mercury, venus, earth, mars, jupiter;
    scene = new THREE.Scene();
    // scene.background = background;

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 100, 10000);
    camera.position.z = 1000;

    sun = initSpere(0, 0, '#ff8d14', 100, 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/sunSurfaceMaterial.jpg', true);
    solarSystem.startCelestialBodyRotation(sun, 2000000, true);
    mercury = initSpere(220, 0, '#42a6ce', 11, 'https://doc.qt.io/archives/qt-5.8/images/used-in-examples/threejs/planets/images/mercurymap.jpg');
    solarSystem.startCelestialBodyRotation(mercury, 600000);
    venus = initSpere(300, 0, '#42a6ce', 16, 'https://doc.qt.io/archives/qt-5.8/images/used-in-examples/threejs/planets/images/venusmap.jpg');
    solarSystem.startCelestialBodyRotation(venus, 600000);
    earth = initSpere(380, 0, '#4c351c', 16, 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg');
    solarSystem.startCelestialBodyRotation(earth, 800000);
    mars = initSpere(460, 0, '#1d4c1c', 12, 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/marsSurfaceMaterial.png');
    solarSystem.startCelestialBodyRotation(mars, 500000);
    jupiter = initSpere(580, 0, '#1d4c1c', 30, 'https://doc.qt.io/archives/qt-5.8/images/used-in-examples/threejs/planets/images/jupitermap.jpg');
    solarSystem.startCelestialBodyRotation(jupiter, 500000);

    solarSystem.startPlanetOrbit(mercury, 220, 20000);
    solarSystem.startPlanetOrbit(venus, 300, 17000);
    solarSystem.startPlanetOrbit(earth, 380, 22000);
    solarSystem.startPlanetOrbit(mars, 460, 27000);
    solarSystem.startPlanetOrbit(jupiter, 580, 37000);

    createSunLight();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

};

var createSunLight = function () {
    var light = new THREE.PointLight(0xffffff, 6, 1000, 1.5);
    scene.add(light);
}

var SolarSystem = function () {
    this.celestialBodies = [];
};

SolarSystem.prototype.add = function (celestialBody) {
    this.celestialBodies.push(celestialBody);
};

SolarSystem.prototype.startPlanetOrbit = function (object, radius, delay) {
    var pathGuid = { angle: 0 };
    var tweenDelay = delay || 10000;
    var point = { x: 0, y: 0 };
    var angle = 360;

    var tween = new TWEEN.Tween(pathGuid)
        .to({ angle: angle }, tweenDelay)
        .onUpdate(() => {
            point.x = radius * Math.cos(pathGuid.angle * (Math.PI / 180));
            point.y = radius * Math.sin(pathGuid.angle * (Math.PI / 180));

            object.position.x = point.x;
            object.position.z = point.y;
        });

    tween.repeat(10);
    tween.start();
};

SolarSystem.prototype.startCelestialBodyRotation = function (object, delay, isClockWise) {
    var rotationGuid = { rotation: 0 };
    delay = delay || 5000;
    var finalRotaion = 360;
    finalRotaion = isClockWise ? -finalRotaion : finalRotaion;

    var tween = new TWEEN.Tween(rotationGuid)
        .to({ rotation: finalRotaion }, delay)
        .onUpdate(() => {
            object.rotation.y = rotationGuid.rotation;
        });

    tween.repeat(10);
    tween.start();
};



function initSpere(x, y, color, size, textureUrl, isLightSensitive) {
    isLightSensitive = isLightSensitive || false;
    color = color || '#bbb';
    var radius = size;
    var segments = 40;
    var rings = 20;
    var material;

    geometry = new THREE.SphereGeometry(radius, segments, rings);

    if (!textureUrl) {
        material = new THREE.MeshLambertMaterial({
            color: color
        });
    } else {
        var texture = new THREE.TextureLoader().load(textureUrl);
        if (!isLightSensitive) {
            material = new THREE.MeshPhongMaterial({ map: texture });
        } else {
            material = new THREE.MeshBasicMaterial({ map: texture });
        }
    }

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y || 0;
    mesh.position.x = x || 0;
    scene.add(mesh);
    return mesh;
};

function animate(time) {
    requestAnimationFrame(animate);
    camera.updateProjectionMatrix();
    TWEEN.update(time);
    renderer.render(scene, camera);
}

function initKeyEvents() {
    var keyCode;
    document.addEventListener('keydown', (event) => {
        keyCode = event.keyCode;
        switch (keyCode) {
            case 37:
                scene.rotation.y -= 0.2;
                break
            case 38:
                scene.rotation.x += 0.2;
                break;
            case 39:
                scene.rotation.y += 0.2
                break;
            case 40:
                scene.rotation.x -= 0.2;
                break;
            case 61:
                camera.zoom += 0.1;
                break;
            case 173:
                camera.zoom -= 0.1;
                break;
        }
    })
}