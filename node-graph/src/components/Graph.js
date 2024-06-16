// Frontend: src/components/Graph.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Graph = ({ topology }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mountNode = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountNode.appendChild(renderer.domElement);

        fetch('http://localhost:5000/nodes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const nodes = {};
                data.forEach(node => {
                    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
                    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(node.x, node.y, node.z);
                    scene.add(sphere);
                    nodes[node.node] = sphere;
                });

                data.forEach(node => {
                    node.edges.forEach(edge => {
                        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
                        const points = [];
                        points.push(new THREE.Vector3(node.x, node.y, node.z));
                        const targetNode = data.find(n => n.node === edge.target);
                        points.push(new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z));
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, material);
                        scene.add(line);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching nodes:', error);
                if (error.message.includes('Unexpected token')) {
                    console.error('The response is not valid JSON. The server might be returning HTML.');
                }
                alert('Failed to fetch nodes. Please try again later.');
            });

        camera.position.z = 50;

        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mountNode.removeChild(renderer.domElement);
        };
    }, [topology]);

    return (
        <div>
            <h2>3D Network Visualization</h2>
            <div ref={mountRef} />
        </div>
    );
};

export default Graph;
