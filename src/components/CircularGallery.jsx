import { useEffect, useRef } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import "./CircularGallery.css";

const lerp = (from, to, t) => from + (to - from) * t;

class GalleryPlane {
  constructor({
    bend,
    borderRadius,
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    scrollEase,
    viewport,
  }) {
    this.bend = bend;
    this.borderRadius = borderRadius;
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.scrollEase = scrollEase;
    this.viewport = viewport;
    this.createShader();
    this.createMesh();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      transparent: true,
      uniforms: {
        tMap: { value: texture },
        uBorderRadius: { value: this.borderRadius },
        uImageSizes: { value: [1, 1] },
        uPlaneSizes: { value: [1, 1] },
      },
    });

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth || 1, img.naturalHeight || 1];
    };
    img.src = this.image;
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.mesh.setParent(this.scene);
  }

  resize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;
    const cardHeight = this.viewport.height * (this.screen.width < 720 ? 0.68 : 0.82);
    const cardWidth = cardHeight * 0.82;
    this.mesh.scale.set(cardWidth, cardHeight, 1);
    this.program.uniforms.uPlaneSizes.value = [cardWidth, cardHeight];
    this.width = cardWidth + this.viewport.width * (this.screen.width < 720 ? 0.08 : 0.045);
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  update(scroll, direction) {
    this.mesh.position.x = this.x - scroll.current - this.extra;
    const x = this.mesh.position.x;
    const halfViewport = this.viewport.width / 2;

    if (this.bend === 0) {
      this.mesh.position.y = 0;
      this.mesh.rotation.z = 0;
    } else {
      const bendAbs = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + bendAbs * bendAbs) / (2 * bendAbs);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      this.mesh.position.y = this.bend > 0 ? -arc : arc;
      this.mesh.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }

    const speed = scroll.current - scroll.last;
    void speed;
    void direction;
  }
}

class GalleryApp {
  constructor(container, { bend, borderRadius, items, scrollEase, scrollSpeed }) {
    this.container = container;
    this.bend = bend;
    this.borderRadius = borderRadius;
    this.items = items;
    this.scroll = { current: 0, ease: scrollEase, last: 0, target: 0 };
    this.scrollSpeed = scrollSpeed;
    this.createRenderer();
    this.createCamera();
    this.scene = new Transform();
    this.geometry = new Plane(this.gl, { heightSegments: 44, widthSegments: 80 });
    this.createPlanes();
    this.resize();
    this.addEventListeners();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createPlanes() {
    const visibleItems = this.items?.length ? this.items : [];
    this.planes = visibleItems.map(
      (item, index) =>
        new GalleryPlane({
          bend: this.bend,
          borderRadius: this.borderRadius,
          geometry: this.geometry,
          gl: this.gl,
          image: item.image,
          index,
          length: visibleItems.length,
          renderer: this.renderer,
          scene: this.scene,
          scrollEase: this.scroll.ease,
          viewport: this.viewport,
        })
    );
  }

  viewportFromCamera() {
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    return {
      height,
      width: height * this.camera.aspect,
    };
  }

  resize = () => {
    this.screen = {
      height: Math.max(this.container.clientHeight, 1),
      width: Math.max(this.container.clientWidth, 1),
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    this.viewport = this.viewportFromCamera();
    this.planes.forEach((plane) => plane.resize({ screen: this.screen, viewport: this.viewport }));
    if (!this.hasInitialPosition) {
      const start = this.maxScroll() / 2;
      this.scroll.current = start;
      this.scroll.target = start;
      this.scroll.last = start;
      this.hasInitialPosition = true;
    } else {
      this.scroll.target = this.clampScroll(this.scroll.target);
      this.scroll.current = this.clampScroll(this.scroll.current);
    }
  };

  maxScroll() {
    const plane = this.planes[0];
    if (!plane?.width) return 0;
    return plane.width * Math.max(this.planes.length - 1, 0);
  }

  clampScroll(value) {
    return Math.min(Math.max(value, 0), this.maxScroll());
  }

  snapToNearest = () => {
    const plane = this.planes[0];
    if (!plane?.width) return;
    const itemIndex = Math.min(Math.max(Math.round(this.scroll.target / plane.width), 0), this.planes.length - 1);
    this.scroll.target = itemIndex * plane.width;
  };

  onPointerDown = (event) => {
    this.isDragging = true;
    this.dragStart = event.clientX;
    this.dragStartScroll = this.scroll.current;
    this.container.classList.add("is-dragging");
  };

  onPointerMove = (event) => {
    if (!this.isDragging) return;
    const distance = (this.dragStart - event.clientX) * (this.scrollSpeed * 0.018);
    this.scroll.target = this.clampScroll(this.dragStartScroll + distance);
  };

  onPointerUp = () => {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.classList.remove("is-dragging");
    this.snapToNearest();
  };

  onWheel = (event) => {
    const direction = event.deltaY || event.deltaX;
    this.scroll.target = this.clampScroll(
      this.scroll.target + (direction > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.24
    );
    window.clearTimeout(this.snapTimer);
    this.snapTimer = window.setTimeout(this.snapToNearest, 180);
  };

  onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.scroll.target = this.clampScroll(this.scroll.target + this.scrollSpeed * 1.8);
      this.snapToNearest();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.scroll.target = this.clampScroll(this.scroll.target - this.scrollSpeed * 1.8);
      this.snapToNearest();
    }
    if (event.key === "Home") {
      event.preventDefault();
      this.scroll.target = 0;
      this.snapToNearest();
    }
  };

  addEventListeners() {
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.container);
    this.container.addEventListener("pointerdown", this.onPointerDown);
    this.container.addEventListener("wheel", this.onWheel, { passive: true });
    this.container.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
  }

  update = () => {
    this.scroll.target = this.clampScroll(this.scroll.target);
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.planes.forEach((plane) => plane.update(this.scroll, direction));
    this.renderer.render({ camera: this.camera, scene: this.scene });
    this.scroll.last = this.scroll.current;
    this.frame = window.requestAnimationFrame(this.update);
  };

  destroy() {
    window.cancelAnimationFrame(this.frame);
    window.clearTimeout(this.snapTimer);
    this.resizeObserver?.disconnect();
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.renderer?.gl?.canvas?.remove();
  }
}

export default function CircularGallery({
  bend = 2.2,
  borderRadius = 0.055,
  items,
  scrollEase = 0.08,
  scrollSpeed = 2,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !items?.length) return undefined;
    const app = new GalleryApp(containerRef.current, {
      bend,
      borderRadius,
      items,
      scrollEase,
      scrollSpeed,
    });
    return () => app.destroy();
  }, [bend, borderRadius, items, scrollEase, scrollSpeed]);

  return (
    <div
      aria-label="AI 产品落地能力地图"
      className="circular-gallery"
      ref={containerRef}
      role="region"
      tabIndex={0}
    />
  );
}
