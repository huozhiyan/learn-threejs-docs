// 检查并调整渲染器的尺寸以适应 canvas 的实际显示尺寸
export default function resizeRendererToDisplaySize(renderer) {
  // 获取渲染器绑定的 canvas 元素
  const canvas = renderer.domElement;
  // 获取设备像素比（用于高分屏适配）
  const pixelRatio = window.devicePixelRatio;
  // 计算实际需要的渲染宽度和高度（乘以像素比，提升清晰度）
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  // 判断 canvas 的绘图缓冲区尺寸是否与显示尺寸不一致
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    // 如果尺寸不一致，则调整渲染器尺寸以匹配显示尺寸
    renderer.setSize(width, height, false);
  }
  // 返回是否进行了尺寸调整
  return needResize;
}
