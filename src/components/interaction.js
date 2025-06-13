import * as THREE from 'three';

export function setupInteraction(scene, camera, renderer, product) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject = null;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Info panel setup
    const infoPanel = document.createElement('div');
    infoPanel.style.position = 'fixed';
    infoPanel.style.pointerEvents = 'none';
    infoPanel.style.background = 'rgba(255, 255, 255, 0.9)';
    infoPanel.style.color = '#000';
    infoPanel.style.padding = '6px 14px';
    infoPanel.style.borderRadius = '8px';
    infoPanel.style.fontFamily = 'Arial, sans-serif';
    infoPanel.style.fontSize = '15px';
    infoPanel.style.zIndex = '1000';
    infoPanel.style.display = 'none';
    infoPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    document.body.appendChild(infoPanel);

    function showInfoPanel(partName, x, y) {
        infoPanel.textContent = partName;
        infoPanel.style.left = `${x + 12}px`;
        infoPanel.style.top = `${y + 12}px`;
        infoPanel.style.display = 'block';
    }
    function hideInfoPanel() {
        infoPanel.style.display = 'none';
    }

    function onMouseMove(event) {
        if (isDragging) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(product.group.children, true);
        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            if (hoveredObject !== selectedObject) {
                if (hoveredObject) {
                    hoveredObject.scale.set(1, 1, 1);
                }
                hoveredObject = selectedObject;
                hoveredObject.scale.set(1.15, 1.15, 1.15);
            }
            // Show info panel with part name
            if (hoveredObject && hoveredObject.userData.partName) {
                showInfoPanel(hoveredObject.userData.partName, event.clientX, event.clientY);
            }
        } else {
            if (hoveredObject) {
                hoveredObject.scale.set(1, 1, 1);
                hoveredObject = null;
            }
            hideInfoPanel();
        }
    }

    function onMouseDown(event) {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseUp() {
        isDragging = false;
    }

    function onMouseClick(event) {
        if (isDragging) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(product.group.children, true);
        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;
            selectedObject.scale.set(0.9, 0.9, 0.9);
            setTimeout(() => {
                selectedObject.scale.set(1.15, 1.15, 1.15);
            }, 120);
            // Show info panel on click as well
            if (selectedObject.userData.partName) {
                showInfoPanel(selectedObject.userData.partName, event.clientX, event.clientY);
            }
        }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('click', onMouseClick);

    return {
        cleanup: () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('click', onMouseClick);
            document.body.removeChild(infoPanel);
        }
    };
} 