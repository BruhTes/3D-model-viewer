import * as THREE from 'three';

export function addLighting(scene) {
    // Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
    scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 5.0);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.radius = 4; // Softer shadows
    scene.add(mainLight);

    // Accent light
    const accentLight = new THREE.DirectionalLight(0xffffff, 3.5);
    accentLight.position.set(-5, 3, -5);
    scene.add(accentLight);

    // New Fill light from another angle (e.g., front-left or right) to address dark side
    const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
    fillLight.position.set(-3, 2, 5);
    scene.add(fillLight);

    // Hemisphere light for soft, general illumination
    const hemiLight = new THREE.HemisphereLight(0x404040, 0x000000, 2.0);
    scene.add(hemiLight);

    return { ambientLight, mainLight, accentLight, fillLight, hemiLight };
} 