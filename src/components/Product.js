import * as THREE from 'three';

export class Product {
    constructor() {
        this.group = new THREE.Group();
        this.parts = new Map();
        this.hands = {
            hour: null,
            minute: null,
            second: null
        };
        this.createProduct();
        this.startClock();
    }

    createProduct() {
        // Create materials
        const mainMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2c3e50,
            metalness: 0.7,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });

        const accentMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x34495e,
            metalness: 0.8,
            roughness: 0.1,
            clearcoat: 1.0
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            transparent: true,
            opacity: 0.3
        });

        // Create base
        const baseGeometry = new THREE.CylinderGeometry(2, 2.2, 0.3, 32);
        const base = new THREE.Mesh(baseGeometry, mainMaterial);
        base.position.y = -0.15;
        this.group.add(base);
        this.parts.set('base', base);

        // Create clock face
        const faceGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 32);
        const face = new THREE.Mesh(faceGeometry, glassMaterial);
        face.position.y = 0.1;
        this.group.add(face);
        this.parts.set('face', face);

        // Create hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const markerGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const marker = new THREE.Mesh(markerGeometry, accentMaterial);
            marker.position.x = Math.sin(angle) * 1.5;
            marker.position.z = Math.cos(angle) * 1.5;
            marker.position.y = 0.15;
            this.group.add(marker);
            this.parts.set(`marker_${i}`, marker);
        }

        // Create hands
        // Hour hand
        const hourHandGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.8);
        const hourHand = new THREE.Mesh(hourHandGeometry, accentMaterial);
        hourHand.position.y = 0.2;
        this.group.add(hourHand);
        this.hands.hour = hourHand;
        this.parts.set('hour_hand', hourHand);

        // Minute hand
        const minuteHandGeometry = new THREE.BoxGeometry(0.08, 0.08, 1.2);
        const minuteHand = new THREE.Mesh(minuteHandGeometry, accentMaterial);
        minuteHand.position.y = 0.25;
        this.group.add(minuteHand);
        this.hands.minute = minuteHand;
        this.parts.set('minute_hand', minuteHand);

        // Second hand
        const secondHandGeometry = new THREE.BoxGeometry(0.05, 0.05, 1.4);
        const secondHand = new THREE.Mesh(secondHandGeometry, mainMaterial);
        secondHand.position.y = 0.3;
        this.group.add(secondHand);
        this.hands.second = secondHand;
        this.parts.set('second_hand', secondHand);

        // Create center point
        const centerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const center = new THREE.Mesh(centerGeometry, accentMaterial);
        center.position.y = 0.35;
        this.group.add(center);
        this.parts.set('center', center);

        return this.group;
    }

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Update hand rotations
        this.hands.hour.rotation.y = (hours / 12) * Math.PI * 2;
        this.hands.minute.rotation.y = (minutes / 60) * Math.PI * 2;
        this.hands.second.rotation.y = (seconds / 60) * Math.PI * 2;
    }

    // Method to handle part selection
    selectPart(partName) {
        const part = this.parts.get(partName);
        if (part) {
            // Add selection effect
            part.material.emissive.setHex(0x333333);
            setTimeout(() => {
                part.material.emissive.setHex(0x000000);
            }, 200);
        }
    }

    // Method to handle part hover
    hoverPart(partName, isHovered) {
        const part = this.parts.get(partName);
        if (part) {
            part.material.emissive.setHex(isHovered ? 0x222222 : 0x000000);
        }
    }
} 