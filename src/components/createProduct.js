import * as THREE from 'three';

export function createProduct() {
    const group = new THREE.Group();
    const parts = new Map();

    // Materials
    const mainMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,  // Pure black
        metalness: 0.7,   // Reduced metalness slightly, might suggest plastic feel
        roughness: 0.6,   // Significantly increased roughness for a very diffused, soft reflection
        clearcoat: 1.0,   // High clearcoat for a subtle top layer
        clearcoatRoughness: 0.3 // Increased clearcoat roughness for very diffused highlights
    });

    const accentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x080808,  // Very dark gray, slightly distinguishable from main
        metalness: 0.6,
        roughness: 0.7,
        clearcoat: 0.9
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000, // Darker glass
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        transparent: true,
        opacity: 0.1
    });

    const ledMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF0000, // TEMPORARY: Bright Red for visibility check
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0xFF0000, // TEMPORARY: Bright Red for visibility check
        emissiveIntensity: 5.0 // Further increased intensity for stronger glow
    });

    const portMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffa500, // Changed to orange
        metalness: 0.7,
        roughness: 0.3,
        clearcoat: 0.5
    });

    // New material for the integrated light strip
    const lightStripMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // Will be overridden by animated emissive color
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.95,
        transparent: true,
        opacity: 0.2,
        emissive: 0x00ff00, // Initial emissive color for the strip, but will be animated
        emissiveIntensity: 5.0 // Significantly stronger initial glow for the strip
    });

    // New material for buttons (subtle contrast)
    const buttonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0000FF, // TEMPORARY: Bright Blue for visibility check
        metalness: 0.8,
        roughness: 0.4,
        clearcoat: 0.8
    });

    // New material for the logo
    const logoMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00FF00, // TEMPORARY: Bright Green for visibility check
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0
    });

    // New material for antenna tips (green)
    const antennaTipMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00, // Green for antenna tips
        metalness: 0.6,
        roughness: 0.3,
        clearcoat: 1.0
    });

    // Create main body with a more complex, sculpted shape
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-1.0, 0.0);
    bodyShape.lineTo(-1.0, 0.4);
    bodyShape.lineTo(-0.8, 0.5);
    bodyShape.lineTo(0.8, 0.5);
    bodyShape.lineTo(1.0, 0.4);
    bodyShape.lineTo(1.0, 0.0);
    bodyShape.lineTo(-1.0, 0.0);

    const extrudeSettings = {
        steps: 1,
        depth: 1.5,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 32
    };
    const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeometry.center(); // Center the geometry

    const body = new THREE.Mesh(bodyGeometry, mainMaterial);
    body.position.y = 0.3; // Adjust global position for new shape
    body.userData.partName = 'body';
    group.add(body);
    parts.set('body', body);

    // Create a central elevated ridge on the body
    const ridgeGeometry = new THREE.BoxGeometry(0.8, 0.15, 1.4, 32, 32, 32);
    const ridge = new THREE.Mesh(ridgeGeometry, accentMaterial);
    ridge.position.set(0, 0.58, 0); // Position on top of the main body
    ridge.userData.partName = 'ridge';
    group.add(ridge);
    parts.set('ridge', ridge);

    // Add subtle buttons on the central ridge
    const buttonGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16);
    const numButtons = 2;
    const buttonSpacing = 0.2;
    for (let i = 0; i < numButtons; i++) {
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0.2 - i * buttonSpacing, 0.65, 0.5); // Position on the ridge
        button.userData.partName = `button_${i}`;
        group.add(button);
        parts.set(`button_${i}`, button);
    }

    // Add LED light housing and 3 LED lights to the front (opposite ports)
    const frontLedHousingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x151515, // Darker gray for housing
        metalness: 0.7,
        roughness: 0.3
    });
    const frontLedHousingGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16); // Even larger housing
    const frontLedGeometry = new THREE.SphereGeometry(0.06, 16, 16); // Even larger LED light

    for (let i = 0; i < 3; i++) {
        const ledHousing = new THREE.Mesh(frontLedHousingGeometry, frontLedHousingMaterial);
        // Drastically adjusted position to be clearly visible on the front face, very far forward
        ledHousing.position.set(-0.3 + i * 0.3, 0.35, 1.15);
        ledHousing.userData.partName = `front_led_housing_${i}`;
        group.add(ledHousing);
        parts.set(`front_led_housing_${i}`, ledHousing);

        const led = new THREE.Mesh(frontLedGeometry, ledMaterial); // Use existing ledMaterial
        // Drastically adjusted position to be clearly visible on the front face, very far forward
        led.position.set(-0.3 + i * 0.3, 0.35, 1.18);
        led.userData.partName = `front_led_${i}`;
        group.add(led);
        parts.set(`front_led_${i}`, led);
    }

    // Add a power button with a brand mark
    const powerButtonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x444444, // Slightly lighter dark gray for distinction
        metalness: 0.8,
        roughness: 0.3,
        clearcoat: 0.8
    });
    const powerButtonGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.06, 32); // Even larger button
    const powerButton = new THREE.Mesh(powerButtonGeometry, powerButtonMaterial);
    // Drastically adjusted position to be clearly visible on the front face, very far forward
    powerButton.position.set(0.6, 0.35, 1.15);
    powerButton.userData.partName = 'power_button';
    group.add(powerButton);
    parts.set('power_button', powerButton);

    // Brand mark on the power button (simple rectangle as text is complex)
    const brandMarkGeometry = new THREE.BoxGeometry(0.12, 0.025, 0.025, 1, 1, 1); // Significantly larger mark
    const brandMark = new THREE.Mesh(brandMarkGeometry, logoMaterial); // Use logo material for visibility
    // Drastically adjusted position to be clearly visible on the power button surface, very far forward
    brandMark.position.set(0.6, 0.39, 1.16);
    brandMark.userData.partName = 'brand_mark';
    group.add(brandMark);
    parts.set('brand_mark', brandMark);

    // Create a recessed area for the light strip (part of the body)
    const lightRecessGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.1, 32, 32, 32);
    const lightRecess = new THREE.Mesh(lightRecessGeometry, accentMaterial);
    lightRecess.position.set(0, 0.1, 0.9); // Moved further forward for better visibility
    lightRecess.userData.partName = 'light_recess';
    group.add(lightRecess);
    parts.set('light_recess', lightRecess);

    // Create integrated light strip (now fits into the recess)
    const lightStripGeometry = new THREE.BoxGeometry(1.3, 0.03, 0.08, 32, 32, 32);
    const lightStrip = new THREE.Mesh(lightStripGeometry, lightStripMaterial);
    lightStrip.position.set(0, 0.1, 0.9); // Moved further forward for better visibility
    lightStrip.userData.partName = 'light_strip';
    group.add(lightStrip);
    parts.set('light_strip', lightStrip);

    // Create antennas with more detail and increased segments, adjusted for new body top
    for (let i = 0; i < 3; i++) {
        // Antenna base
        const baseGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 32);
        const base = new THREE.Mesh(baseGeometry, accentMaterial);
        base.position.set(-0.6 + i * 0.6, 0.7, 0); // Position on top of the ridge
        base.userData.partName = `antenna_base_${i}`;
        group.add(base);
        parts.set(`antenna_base_${i}`, base);

        // Antenna rod
        const rodGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 32);
        const rod = new THREE.Mesh(rodGeometry, accentMaterial);
        rod.position.set(-0.6 + i * 0.6, 1.1, 0); // Adjust position based on new base
        rod.userData.partName = `antenna_${i}`;
        group.add(rod);
        parts.set(`antenna_${i}`, rod);

        // Antenna tip
        const tipGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const tip = new THREE.Mesh(tipGeometry, antennaTipMaterial); // Use new antennaTipMaterial
        tip.position.set(-0.6 + i * 0.6, 1.5, 0); // Adjust position based on new rod
        tip.userData.partName = `antenna_tip_${i}`;
        group.add(tip);
        parts.set(`antenna_tip_${i}`, tip);
    }

    // Individual LEDs are no longer needed, replaced by the light strip
    // for (let i = 0; i < 4; i++) { ... } // This block is removed

    // Create ports with more detail, adjusted for new body bottom
    for (let i = 0; i < 4; i++) {
        // Port housing
        const portHousingGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.15);
        const portHousing = new THREE.Mesh(portHousingGeometry, accentMaterial);
        // Adjusted position for better alignment with new body and middle height of the back
        portHousing.position.set(-0.7 + i * 0.4, 0.35, -0.78); // Adjusted Y and Z for back panel middle height
        portHousing.userData.partName = `port_housing_${i}`;
        group.add(portHousing);
        parts.set(`port_housing_${i}`, portHousing);

        // Port connector
        const portGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.1);
        const port = new THREE.Mesh(portGeometry, portMaterial);
        // Adjusted position for better alignment with new body and middle height of the back
        port.position.set(-0.7 + i * 0.4, 0.35, -0.85); // Adjusted Y and Z for back panel middle height
        port.userData.partName = `port_${i}`;
        group.add(port);
        parts.set(`port_${i}`, port);
    }

    // Add LED light housing and 3 LED lights to the back
    const backLedHousingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x151515, // Darker gray for housing
        metalness: 0.7,
        roughness: 0.3
    });
    const backLedHousingGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16); // Small housing
    const backLedGeometry = new THREE.SphereGeometry(0.04, 16, 16); // Small LED light

    for (let i = 0; i < 3; i++) {
        const ledHousing = new THREE.Mesh(backLedHousingGeometry, backLedHousingMaterial);
        ledHousing.position.set(-0.3 + i * 0.3, 0.6, -0.7);
        ledHousing.userData.partName = `back_led_housing_${i}`;
        group.add(ledHousing);
        parts.set(`back_led_housing_${i}`, ledHousing);

        const led = new THREE.Mesh(backLedGeometry, ledMaterial); // Use existing ledMaterial
        led.position.set(-0.3 + i * 0.3, 0.6, -0.75);
        led.userData.partName = `back_led_${i}`;
        group.add(led);
        parts.set(`back_led_${i}`, led);
    }

    // Create base with more detail (might need to be larger to support new body)
    const baseGeometry = new THREE.BoxGeometry(2.4, 0.05, 1.8); // Larger and thinner base
    const base = new THREE.Mesh(baseGeometry, accentMaterial);
    base.position.y = -0.15; // Lower the base further for more distinct feet elevation
    base.userData.partName = 'base';
    group.add(base);
    parts.set('base', base);

    // Create feet, adjusted for new base elevation
    for (let i = 0; i < 4; i++) {
        const footGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
        const foot = new THREE.Mesh(footGeometry, portMaterial);
        const x = (i % 2 === 0 ? -1 : 1) * 0.9;
        const z = (i < 2 ? -1 : 1) * 0.7;
        foot.position.set(x, -0.18, z); // Adjusted position for feet to be visible below the base
        foot.userData.partName = `foot_${i}`;
        group.add(foot);
        parts.set(`foot_${i}`, foot);
    }

    // Add ventilation grilles on the sides, adjusted for new body shape
    const ventGeometry = new THREE.BoxGeometry(0.05, 0.25, 0.05, 16, 16, 16); // Thinner and shorter vents
    const numVents = 3; // Fewer vents to fit new sides
    const ventSpacing = 0.3; // Spacing between vents
    const sideXPosition = 1.0; // Aligned with the side of the new body
    const startZVent = -0.3; // Starting Z position for vents, adjusted for new body

    for (let i = 0; i < numVents; i++) {
        // Right side vents (might need rotation to align with sloped sides)
        const ventRight = new THREE.Mesh(ventGeometry, accentMaterial);
        ventRight.position.set(sideXPosition, 0.25, startZVent + i * ventSpacing); // Position on the side of the new body
        // ventRight.rotation.y = Math.PI / 2; // Might need to adjust rotation based on final body shape
        ventRight.userData.partName = `vent_right_${i}`;
        group.add(ventRight);
        parts.set(`vent_right_${i}`, ventRight);

        // Left side vents
        const ventLeft = new THREE.Mesh(ventGeometry, accentMaterial);
        ventLeft.position.set(-sideXPosition, 0.25, startZVent + i * ventSpacing); // Position on the side of the new body
        // ventLeft.rotation.y = Math.PI / 2; // Might need to adjust rotation
        ventLeft.userData.partName = `vent_left_${i}`;
        group.add(ventLeft);
        parts.set(`vent_left_${i}`, ventLeft);
    }

    // Remove previous decorative strips and edge glows
    // No longer needed: edgeGlowMaterial, sideStripGeometry, edgeTopFrontGeometry, etc.

    // Add subtle side insets/decorative panels
    const sideInsetGeometry = new THREE.BoxGeometry(0.01, 0.2, 0.8, 16, 16, 16); // Thin, recessed panel
    const numSideInsets = 2;
    const sideInsetSpacing = 0.4;
    const sideInsetX = 0.98; // Very close to the edge

    for (let i = 0; i < numSideInsets; i++) {
        const insetY = 0.25 + i * sideInsetSpacing; // Position along the height

        const leftInset = new THREE.Mesh(sideInsetGeometry, accentMaterial);
        leftInset.position.set(-sideInsetX, insetY, 0); // Position on left side
        leftInset.userData.partName = `left_inset_${i}`;
        group.add(leftInset);
        parts.set(`left_inset_${i}`, leftInset);

        const rightInset = new THREE.Mesh(sideInsetGeometry, accentMaterial);
        rightInset.position.set(sideInsetX, insetY, 0); // Position on right side
        rightInset.userData.partName = `right_inset_${i}`;
        group.add(rightInset);
        parts.set(`right_inset_${i}`, rightInset);
    }

    // Add subtle etched lines/details on the central ridge
    const ridgeDetailGeometry = new THREE.BoxGeometry(0.02, 0.01, 0.5, 1, 1, 1); // Very thin line
    const numRidgeDetails = 3;
    const ridgeDetailSpacing = 0.3;

    for (let i = 0; i < numRidgeDetails; i++) {
        const detailZ = -0.4 + i * ridgeDetailSpacing; // Position along the ridge depth

        const detail = new THREE.Mesh(ridgeDetailGeometry, accentMaterial);
        detail.position.set(0, 0.585, detailZ); // Position on the ridge surface
        detail.userData.partName = `ridge_detail_${i}`;
        group.add(detail);
        parts.set(`ridge_detail_${i}`, detail);
    }

    return { group, parts };
} 