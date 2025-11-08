import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// 主函数
function main() {
  // 获取canvas元素并创建渲染器
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  // 设置相机参数
  const fov = 40;
  const aspect = 2; // 画布宽高比
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 120;

  // 创建场景并设置背景色
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  // 添加两个方向光源
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }

  // 用于存储所有物体的数组
  const objects = [];
  // 物体间隔
  const spread = 15;

  // 添加物体到场景并设置位置
  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;
    scene.add(obj);
    objects.push(obj);
  }

  // 创建随机颜色的双面材质
  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });
    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    // 根据RGB值设置颜色。h：色调（0-1），s：饱和度（0-1），l：亮度（0-1）
    material.color.setHSL(hue, saturation, luminance);
    return material;
  }

  // 添加实体几何体
  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
  }

  // 添加线框或边缘几何体
  function addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.LineSegments(geometry, material);
    addObject(x, y, mesh);
  }

  // 添加各种几何体示例
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth));
  }
  {
    const radius = 7;
    const segments = 24;
    addSolidGeometry(-1, 2, new THREE.CircleGeometry(radius, segments));
  }
  {
    const radius = 6;
    const height = 8;
    const segments = 16;
    addSolidGeometry(0, 2, new THREE.ConeGeometry(radius, height, segments));
  }
  {
    const radiusTop = 4;
    const radiusBottom = 4;
    const height = 8;
    const radialSegments = 12;
    addSolidGeometry(
      1,
      2,
      new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments
      )
    );
  }
  {
    const radius = 7;
    addSolidGeometry(2, 2, new THREE.DodecahedronGeometry(radius));
  }
  // 使用贝塞尔曲线绘制心形并拉伸成立体
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 2,
    };

    addSolidGeometry(-2, 1, new THREE.ExtrudeGeometry(shape, extrudeSettings));
  }
  {
    const radius = 7;
    addSolidGeometry(-1, 1, new THREE.IcosahedronGeometry(radius));
  }
  // 旋转体几何体
  {
    const points = [];
    for (let i = 0; i < 10; ++i) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
    }
    addSolidGeometry(0, 1, new THREE.LatheGeometry(points));
  }
  {
    const radius = 7;
    addSolidGeometry(1, 1, new THREE.OctahedronGeometry(radius));
  }
  // 克莱因瓶参数曲面
  {
    /**
     * 克莱因瓶参数方程
     */
    function klein(v, u, target) {
      u *= Math.PI;
      v *= 2 * Math.PI;
      u = u * 2;

      let x;
      let z;

      if (u < Math.PI) {
        x =
          3 * Math.cos(u) * (1 + Math.sin(u)) +
          2 * (1 - Math.cos(u) / 2) * Math.cos(u) * Math.cos(v);
        z =
          -8 * Math.sin(u) -
          2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
      } else {
        x =
          3 * Math.cos(u) * (1 + Math.sin(u)) +
          2 * (1 - Math.cos(u) / 2) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
      }

      const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

      target.set(x, y, z).multiplyScalar(0.75);
    }

    const slices = 25;
    const stacks = 25;
    addSolidGeometry(2, 1, new ParametricGeometry(klein, slices, stacks));
  }
  // 平面几何体
  {
    const width = 9;
    const height = 9;
    const widthSegments = 2;
    const heightSegments = 2;
    addSolidGeometry(
      -2,
      0,
      new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
    );
  }
  // 多面体几何体（细分立方体）
  {
    const verticesOfCube = [
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1,
    ];
    const indicesOfFaces = [
      2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
      3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
    ];
    const radius = 7;
    const detail = 2;
    addSolidGeometry(
      -1,
      0,
      new THREE.PolyhedronGeometry(
        verticesOfCube,
        indicesOfFaces,
        radius,
        detail
      )
    );
  }
  // 圆环几何体
  {
    const innerRadius = 2;
    const outerRadius = 7;
    const segments = 18;
    addSolidGeometry(
      0,
      0,
      new THREE.RingGeometry(innerRadius, outerRadius, segments)
    );
  }
  // 2D心形轮廓
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    addSolidGeometry(1, 0, new THREE.ShapeGeometry(shape));
  }
  // 球体
  {
    const radius = 7;
    const widthSegments = 12;
    const heightSegments = 8;
    addSolidGeometry(
      2,
      0,
      new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    );
  }
  // 四面体
  {
    const radius = 7;
    addSolidGeometry(-2, -1, new THREE.TetrahedronGeometry(radius));
  }
  // 加载字体并创建3D文字
  {
    const loader = new FontLoader();
    // 封装Promise方式加载字体
    function loadFont(url) {
      return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });
    }

    async function doit() {
      const font = await loadFont(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
      );
      const geometry = new TextGeometry("three.js", {
        font: font,
        size: 3.0,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 5,
      });
      const mesh = new THREE.Mesh(geometry, createMaterial());
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

      const parent = new THREE.Object3D();
      parent.add(mesh);

      addObject(-1, -1, parent);
    }

    doit();
  }
  // 圆环体
  {
    const radius = 5;
    const tubeRadius = 2;
    const radialSegments = 8;
    const tubularSegments = 24;
    addSolidGeometry(
      0,
      -1,
      new THREE.TorusGeometry(
        radius,
        tubeRadius,
        radialSegments,
        tubularSegments
      )
    );
  }
  // 扭结圆环体
  {
    const radius = 3.5;
    const tube = 1.5;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    addSolidGeometry(
      1,
      -1,
      new THREE.TorusKnotGeometry(
        radius,
        tube,
        tubularSegments,
        radialSegments,
        p,
        q
      )
    );
  }
  // 自定义三维曲线路径生成管道
  {
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    const tubularSegments = 20;
    const radius = 1;
    const radialSegments = 8;
    const closed = false;
    addSolidGeometry(
      2,
      -1,
      new THREE.TubeGeometry(
        path,
        tubularSegments,
        radius,
        radialSegments,
        closed
      )
    );
  }
  // 边缘线框几何体
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    const thresholdAngle = 15;
    addLineGeometry(
      -1,
      -2,
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(width, height, depth),
        thresholdAngle
      )
    );
  }
  // 线框几何体
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addLineGeometry(
      1,
      -2,
      new THREE.WireframeGeometry(new THREE.BoxGeometry(width, height, depth))
    );
  }

  // 渲染器尺寸自适应
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // 渲染循环
  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // 让所有物体自转
    objects.forEach((obj, ndx) => {
      const speed = 0.1 + ndx * 0.05;
      const rot = time * speed;
      obj.rotation.x = rot;
      obj.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
