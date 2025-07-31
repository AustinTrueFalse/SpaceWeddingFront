<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const scene = new THREE.Scene()
  scene.background = null

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000)
  camera.position.set(0, 1, 3)

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!,
    antialias: true,
    alpha: true
  })
  
  const updateRendererSize = () => {
    const width = canvasRef.value?.clientWidth || window.innerWidth
    const height = 400
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  
  updateRendererSize()
  
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false

  // Яркое освещение с трех сторон
  const light1 = new THREE.DirectionalLight(0xF2E30A, 0)
  light1.position.set(1, 1, 1)
  scene.add(light1)

  const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
  light2.position.set(-1, 1, -1)
  scene.add(light2)

  const light3 = new THREE.DirectionalLight(0xffffff, 0.5)
  light3.position.set(0, -1, 0)
  scene.add(light3)

  // Добавляем ambient light для заполняющего освещения
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight)

  const loader = new GLTFLoader()
  let model: THREE.Object3D | null = null

  loader.load('/models/star.glb', (gltf) => {
    model = gltf.scene

    // Мягкий золотисто-желтый цвет
    const softGold = new THREE.Color(0xF2E30A)
    
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const material = mesh.material
        
        if (Array.isArray(material)) {
          material.forEach((m: THREE.Material) => {
            const mat = m as THREE.MeshStandardMaterial
            if (mat.color) {
              mat.color.copy(softGold)
              mat.emissive = softGold.clone().multiplyScalar(0.3)
              mat.emissiveIntensity = 1
              mat.metalness = 0.1
              mat.roughness = 0.5
            }
          })
        } else {
          const mat = material as THREE.MeshStandardMaterial
          if (mat.color) {
            mat.color.copy(softGold)
            mat.emissive = softGold.clone().multiplyScalar(0.3)
            mat.emissiveIntensity = 1
            mat.metalness = 0.1
            mat.roughness = 0.5
          }
        }
      }
    })

    scene.add(model)
  })

  const onWindowResize = () => {
    updateRendererSize()
  }
  window.addEventListener('resize', onWindowResize)

  const animate = () => {
    requestAnimationFrame(animate)
    if (model) {
      model.rotation.y += 0.01
    }
    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize)
  })
})
</script>

<template>
  <v-card variant="text" class="pa-4" elevation="0" rounded="xl">
    <div style="width: 100%; height: 400px; background: transparent;">
      <canvas ref="canvasRef" style="width: 100%; height: 100%; display: block"></canvas>
    </div>
  </v-card>
</template>