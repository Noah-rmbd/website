/**
 * MINIMALIST LUMON-INSPIRED MACHINE LEARNING NEURAL ARCHITECTURE ENGINE
 * Pure vector geometry on dark background:
 *  - One predominant color with varying opacities
 *  - Circles instead of squares
 *  - Zero text in the canvas
 *  - No dithering or filters (pure, crisp, anti-aliased curves)
 *  - Infinite right-to-left scrolling neural layers connected by synapses
 *  - Hypnotic activation pulses & subtle concentric ripples
 */

// =========================================================================
// CONFIGURATION & VISUAL TUNING
// You can adjust DEFAULT_NODE_RADIUS here to change the circle size
// =========================================================================
export const DEFAULT_NODE_RADIUS = 20; // <-- Default node radius in pixels

export class MLNeuralEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d', { alpha: true });

    // Lumon Ice-Cyan aesthetic (#38bdf8 / 56, 189, 248) or configurable
    this.config = {
      colorRgb: options.colorRgb || '56, 189, 248', // Lumon Cold Cyan
      scrollSpeed: options.scrollSpeed || 42,        // Calm, hypnotic scroll speed
      columnSpacing: options.columnSpacing || 190,  // Distance between layers
      nodeRadius: options.nodeRadius !== undefined ? options.nodeRadius : DEFAULT_NODE_RADIUS, // Node circle radius
      ...options
    };

    // State & Timing
    this.isRunning = false;
    this.rafId = null;
    this.lastTimestamp = performance.now();
    this.time = 0;

    // Viewport
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Neural graph
    this.layers = [];
    this.synapses = [];
    this.pulses = [];
    this.layerCounter = 0;

    // Node count sequence (architectural cadence: input -> conv -> dense -> bottleneck -> expand -> output)
    this.nodePatterns = [4, 9, 6, 13, 8, 5, 11, 7, 3, 10, 6, 12, 5, 4];

    // Interaction
    this.mouse = { x: -9999, y: -9999, active: false };
    this.hoveredNode = null;

    this.handleResize();
    this.bindEvents();
    this.populateInitialLayers();
    this.start();
  }

  handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || 500;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    this._onResize = () => {
      this.handleResize();
      // Recalculate node Y positions on resize
      this.layers.forEach(layer => this.layoutLayerNodes(layer));
      this.rebuildSynapses();
    };
    window.addEventListener('resize', this._onResize);

    this._onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
      this.checkHover();
    };

    this._onMouseLeave = () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.active = false;
      this.hoveredNode = null;
    };

    this._onClick = () => {
      this.triggerPulseWave();
    };

    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this.canvas.addEventListener('click', this._onClick);
  }

  layoutLayerNodes(layer) {
    const topPad = 60;
    const bottomPad = 60;
    const usableH = Math.max(this.height - topPad - bottomPad, 180);
    const spacing = usableH / (layer.nodeCount + 1);

    layer.nodes.forEach((node, idx) => {
      node.y = topPad + spacing * (idx + 1);
    });
  }

  createLayer(x) {
    const countIndex = this.layerCounter % this.nodePatterns.length;
    const count = this.nodePatterns[countIndex];
    this.layerCounter++;

    const layer = {
      id: this.layerCounter,
      x: x,
      nodeCount: count,
      nodes: [],
      pulseCooldown: 1.2 + Math.random() * 2.0
    };

    for (let i = 0; i < count; i++) {
      layer.nodes.push({
        id: `${layer.id}_${i}`,
        index: i,
        y: 0,
        activation: 0.15 + Math.random() * 0.7,
        targetActivation: 0.2 + Math.random() * 0.7,
        glow: 0.0,
        rippleRadius: 0
      });
    }

    this.layoutLayerNodes(layer);
    return layer;
  }

  populateInitialLayers() {
    this.layers = [];
    const minX = -80;
    const maxX = this.width + 300;
    let currentX = minX;

    while (currentX < maxX) {
      this.layers.push(this.createLayer(currentX));
      currentX += this.config.columnSpacing;
    }

    this.rebuildSynapses();
  }

  rebuildSynapses() {
    this.synapses = [];
    for (let i = 0; i < this.layers.length - 1; i++) {
      const srcLayer = this.layers[i];
      const dstLayer = this.layers[i + 1];

      srcLayer.nodes.forEach(src => {
        dstLayer.nodes.forEach(dst => {
          // Semi-sparse matrix connections
          const w = Math.sin(src.index * 4.1 + dst.index * 2.7 + srcLayer.id * 1.3);
          const isConnected = Math.abs(w) > 0.25;

          if (isConnected) {
            this.synapses.push({
              srcLayer,
              dstLayer,
              srcNode: src,
              dstNode: dst,
              weight: Math.abs(w),
              glow: 0.0
            });
          }
        });
      });
    }
  }

  checkHover() {
    if (!this.mouse.active) return;
    let found = null;
    const threshold = this.config.nodeRadius + 8;

    for (const layer of this.layers) {
      for (const node of layer.nodes) {
        const d = Math.hypot(this.mouse.x - layer.x, this.mouse.y - node.y);
        if (d < threshold) {
          found = { layer, node };
          break;
        }
      }
      if (found) break;
    }

    this.hoveredNode = found;
  }

  triggerPulseWave() {
    // Send pulses across the first 3 visible layers
    for (let i = 0; i < Math.min(3, this.layers.length - 1); i++) {
      const srcLayer = this.layers[i];
      const dstLayer = this.layers[i + 1];

      srcLayer.nodes.forEach(src => {
        dstLayer.nodes.forEach(dst => {
          if (Math.random() < 0.4) {
            this.pulses.push({
              srcLayer,
              dstLayer,
              srcNode: src,
              dstNode: dst,
              progress: 0.0,
              speed: 0.9 + Math.random() * 0.7
            });
          }
        });
      });
    }
  }

  update(dt) {
    this.time += dt;
    const move = this.config.scrollSpeed * dt;

    // Scroll layers right to left
    this.layers.forEach((layer, idx) => {
      layer.x -= move;

      // Pulse generation
      layer.pulseCooldown -= dt;
      if (layer.pulseCooldown <= 0) {
        layer.pulseCooldown = 1.4 + Math.random() * 2.4;
        const randNode = layer.nodes[Math.floor(Math.random() * layer.nodes.length)];
        randNode.glow = 1.0;
        randNode.targetActivation = Math.random();

        if (idx < this.layers.length - 1) {
          const next = this.layers[idx + 1];
          const target = next.nodes[Math.floor(Math.random() * next.nodes.length)];
          this.pulses.push({
            srcLayer: layer,
            dstLayer: next,
            srcNode: randNode,
            dstNode: target,
            progress: 0.0,
            speed: 0.85 + Math.random() * 0.5
          });
        }
      }

      // Smooth node activations & ripples
      layer.nodes.forEach(n => {
        n.activation += (n.targetActivation - n.activation) * 0.08;
        if (n.glow > 0) {
          n.glow = Math.max(0, n.glow - dt * 2.0);
          n.rippleRadius += dt * 26;
        } else {
          n.rippleRadius = 0;
        }
      });
    });

    // Remove exited layer on left ONLY when the next layer has also moved off-screen
    // This guarantees all incoming synapses to dstLayer stay fully connected until scrolling past the left edge
    if (this.layers.length > 1 && this.layers[1].x < -50) {
      this.layers.shift();
      this.rebuildSynapses();
    }

    // Spawn new layer on right
    const rightmost = this.layers[this.layers.length - 1];
    if (rightmost && rightmost.x < this.width + 250) {
      const newX = rightmost.x + this.config.columnSpacing;
      this.layers.push(this.createLayer(newX));
      this.rebuildSynapses();
    }

    // Update pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed * dt;
      if (p.progress >= 1.0) {
        p.dstNode.glow = 1.0;
        p.dstNode.rippleRadius = 0;
        p.dstNode.targetActivation = Math.min(1.0, p.dstNode.activation + 0.35);
        this.pulses.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const c = this.config.colorRgb;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Minimalist background grid line / horizon track
    ctx.save();
    ctx.strokeStyle = `rgba(${c}, 0.04)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const midY = Math.floor(this.height / 2);
    ctx.moveTo(0, midY);
    ctx.lineTo(this.width, midY);
    ctx.stroke();
    ctx.restore();

    // 2. Synapses (smooth curves between circles)
    ctx.save();
    this.synapses.forEach(syn => {
      const x1 = syn.srcLayer.x;
      const y1 = syn.srcNode.y;
      const x2 = syn.dstLayer.x;
      const y2 = syn.dstNode.y;

      if (x2 < -40 || x1 > this.width + 40) return;

      const isHovered = this.hoveredNode &&
        (syn.srcNode === this.hoveredNode.node || syn.dstNode === this.hoveredNode.node);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const mx = (x1 + x2) / 2;
      ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);

      if (isHovered) {
        ctx.strokeStyle = `rgba(${c}, 0.85)`;
        ctx.lineWidth = 2.0;
      } else {
        const alpha = 0.5 + syn.weight * 0.12;
        ctx.strokeStyle = `rgba(${c}, ${alpha})`;
        ctx.lineWidth = 1.0;
      }
      ctx.stroke();
    });
    ctx.restore();

    // 3. Activation Pulses (luminous moving dots)
    ctx.save();
    this.pulses.forEach(p => {
      const x1 = p.srcLayer.x;
      const y1 = p.srcNode.y;
      const x2 = p.dstLayer.x;
      const y2 = p.dstNode.y;

      const t = p.progress;
      const mx = (x1 + x2) / 2;
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const px = uu * u * x1 + 3 * uu * t * mx + 3 * u * tt * mx + tt * t * x2;
      const py = uu * u * y1 + 3 * uu * t * y1 + 3 * u * tt * y2 + tt * t * y2;

      // Pulse Core
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c}, 0.95)`;
      ctx.fill();

      // Subtle pulse halo
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c}, 0.25)`;
      ctx.fill();
    });
    ctx.restore();

    // 4. Nodes (Clean minimalist concentric circles)
    ctx.save();
    const baseR = this.config.nodeRadius;

    this.layers.forEach(layer => {
      const lx = layer.x;
      const pad = baseR + 25;
      if (lx < -pad || lx > this.width + pad) return;

      // Very subtle vertical column axis line
      if (layer.nodes.length > 1) {
        const topY = layer.nodes[0].y;
        const botY = layer.nodes[layer.nodes.length - 1].y;
        ctx.strokeStyle = `rgba(${c}, 0.06)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lx, topY);
        ctx.lineTo(lx, botY);
        ctx.stroke();
      }

      layer.nodes.forEach(node => {
        const ny = node.y;
        const isHovered = this.hoveredNode && this.hoveredNode.node === node;

        // Ripple Ring when activated
        if (node.glow > 0.05 && node.rippleRadius > 0) {
          ctx.beginPath();
          ctx.arc(lx, ny, baseR + node.rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c}, ${node.glow * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Outer Ring
        ctx.beginPath();
        ctx.arc(lx, ny, baseR, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered
          ? `rgba(${c}, 1.0)`
          : (node.glow > 0.2
            ? `rgba(${c}, 0.9)`
            : `rgba(${c}, 0.38)`);
        ctx.lineWidth = isHovered ? 2.4 : (baseR >= 10 ? 1.5 : 1.0);
        ctx.stroke();

        // Inner Filled Core (scaled by activation level)
        const innerR = Math.max(2, baseR * 0.65 * node.activation);
        ctx.beginPath();
        ctx.arc(lx, ny, innerR, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? `rgba(${c}, 1.0)`
          : (node.glow > 0.1
            ? `rgba(${c}, 0.85)`
            : `rgba(${c}, ${0.2 + node.activation * 0.45})`);
        ctx.fill();

        // Center dot
        const dotR = Math.max(1.5, baseR * 0.15);
        ctx.beginPath();
        ctx.arc(lx, ny, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, 0.9)`;
        ctx.fill();
      });
    });
    ctx.restore();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min((now - this.lastTimestamp) / 1000, 0.1);
      this.lastTimestamp = now;

      this.update(dt);
      this.render();

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  pause() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.pause();
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    this.canvas.removeEventListener('click', this._onClick);
  }
}
