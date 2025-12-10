import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

function GlassKnot() {
    const ref = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ref.current.rotation.x = t * 0.2
        ref.current.rotation.y = t * 0.25

        // Slight breathing scale
        const scale = 1 + Math.sin(t * 0.5) * 0.05
        ref.current.scale.set(scale, scale, scale)
    })

    return (
        <Float floatIntensity={2} rotationIntensity={1}>
            <mesh ref={ref} scale={1.5}>
                <torusKnotGeometry args={[1, 0.35, 128, 32]} />
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    resolution={512}
                    transmission={1}
                    roughness={0.2}
                    thickness={1.5}
                    ior={1.5}
                    chromaticAberration={1}
                    anisotropy={1}
                    distortion={1}
                    distortionScale={0.5}
                    temporalDistortion={0.2}
                    color="#ffffff"
                    bg="#000000"
                />
            </mesh>
        </Float>
    )
}

function Scene() {
    return (
        <>
            <color attach="background" args={['#050505']} />

            <GlassKnot />

            {/* Lighting environment for glass reflections */}
            <Environment resolution={512}>
                <group rotation={[-Math.PI / 3, 0, 1]}>
                    <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
                    <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
                    <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
                    <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
                </group>
            </Environment>

            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        </>
    )
}

export default function Background3D() {
    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 6], fov: 35 }} gl={{ preserveDrawingBuffer: true }}>
                <Scene />
            </Canvas>
        </div>
    )
}
