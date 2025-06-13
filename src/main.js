import * as THREE from 'three';
import { initScene } from './components/initScene';
import { addLighting } from './components/addLighting';
import { createProduct } from './components/createProduct';
import { setupInteraction } from './components/interaction';
import { setupCameraAnimation } from './components/cameraAnimation';

// Initialize scene
const { scene, camera, renderer, controls } = initScene();

// Add lighting
addLighting(scene);

// Create and add router product
const { group, parts } = createProduct();
scene.add(group);

// Enable interaction for scaling animation and info panel
setupInteraction(scene, camera, renderer, { group, parts });

// Enable camera auto-rotation with user override
const cameraAnimation = setupCameraAnimation(camera, controls);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cameraAnimation.update();
    // Floating and pulsing animation
    const t = performance.now() * 0.001;
    group.position.y = 0.1 * Math.sin(t * 1.2); // floating
    const pulse = 1 + 0.03 * Math.sin(t * 2.5); // pulsing
    group.scale.set(pulse, pulse, pulse);

    // Animate integrated light strip color for a dynamic gradient effect
    const lightStrip = parts.get('light_strip');
    if (lightStrip) {
        // Calculate a color that transitions from blue to green based on time
        const hue = (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.3 + 0.5; // Hue from blue (0.5) to green (0.8)
        const saturation = 0.9; // Slightly higher saturation for vibrancy
        const lightness = 0.7; // Brighter for a stronger glow
        const animatedColor = new THREE.Color().setHSL(hue, saturation, lightness);

        lightStrip.material.emissive.copy(animatedColor);
    }

    controls.update();
    renderer.render(scene, camera);
}

animate(); 
