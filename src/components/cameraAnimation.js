import * as THREE from 'three';

export function setupCameraAnimation(camera, controls) {
    let isAutoRotating = true;
    let rotationSpeed = 0.005;
    let currentAngle = 0;
    const radius = 5;
    const center = new THREE.Vector3(0, 0, 0);

    // Toggle auto-rotation when user interacts with controls
    controls.addEventListener('start', () => {
        isAutoRotating = false;
    });

    controls.addEventListener('end', () => {
        isAutoRotating = true;
    });

    return {
        update: () => {
            if (isAutoRotating) {
                currentAngle += rotationSpeed;
                camera.position.x = Math.cos(currentAngle) * radius;
                camera.position.z = Math.sin(currentAngle) * radius;
                camera.lookAt(center);
            }
        }
    };
} 