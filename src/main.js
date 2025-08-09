import * as THREE from "three";

// 获取canvas元素
const canvas = document.querySelector("#c");
// 创建WebGL渲染器，它负责将你提供的所有数据渲染绘制到canvas上
// antialias参数可以开启抗锯齿功能，提升渲染质量
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// 视野范围
const fov = 75;
// 画布宽高比
const aspect = 2;
// 近平面
const near = 0.1;
// 远平面
const far = 5;
// 透视摄像机
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// 摄像机默认指向Z轴负方向，需要往后移相机才能显示出物体
camera.position.z = 2;

// 创建场景
const scene = new THREE.Scene();

// 设置光照颜色-白色
const color = 0xffffff;
// 设置光照强度
const intensity = 3;
// 从上方照射的白色平行光，强度为 0.5
const light = new THREE.DirectionalLight(color, intensity);
// 设置光源位置
light.position.set(-1, 2, 4);
// 将光源添加到场景中
scene.add(light);

// X 轴上面的宽度
const boxWidth = 1;
// Y 轴上面的高度
const boxHeight = 1;
// Z 轴上面的深度
const boxDepth = 1;
// BoxGeometry 是四边形的原始几何类，它通常使用构造函数所提供的 “width”、“height”、“depth” 参数来创建立方体或者不规则四边形。
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// 注意：在有灯光时不要使用 MeshBasicMaterial，因为它不会对光照做出反应。
// 具有镜面高光的光泽表面的材质
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue

// 网格，表示基于以三角形为多边形网格的物体的类。
const cube = new THREE.Mesh(geometry, material);

// 把构建好的网格放入场景中
scene.add(cube);

// 渲染函数
function render(time) {
  // 将时间单位变为秒
  time *= 0.001;

  cube.rotation.x = time;
  cube.rotation.y = time;

  // 使用渲染器渲染
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
