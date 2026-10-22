/**
 * BlueCode — Estudio Generador de Placas NFC & QR y Motor de QR Único Personalizable (v5.0 - 600 DPI Ultra-HD)
 * - Logo BlueCode vectorial puro sin contornos blancos
 * - Ilustración NFC unificada (estilo Menú) en las 3 tarjetas
 * - Personalización total de colores por tarjeta (Fondo, Textos/NFC, Acentos/Marcos y Temas Rápidos)
 * - Modo QR Clean (limpio) o QR con Texto Inferior / ID personalizable
 * - Drag & Drop interactivo + Zoom para mover y escalar cualquier elemento directamente sobre la placa
 * - Exportación PDF Individual y Masiva en cm reales (600 DPI) y .PSD Multicapa para Adobe Photoshop
 */
(function () {
  "use strict";

  // Caminos vectoriales oficiales de logo_BC.svg (viewBox 0 0 600 354, área útil x:78..568, y:66..337)
  const BC_PATHS = [
    "M 83 68 H 230 C 269 68 296 89 307 121 C 311 132 310 141 304 151 L 261 199 Q 258 202 261 206 L 304 254 C 311 264 310 274 306 285 C 294 313 268 327 230 327 H 83 Q 79 327 79 323 V 72 Q 79 68 83 68 Z M 141 118 Q 138 118 138 122 V 166 Q 138 170 142 170 H 222 C 240 170 251 160 251 144 C 251 128 240 118 222 118 Z M 142 218 Q 138 218 138 222 V 273 Q 138 277 142 277 H 226 C 244 277 256 266 256 247 C 256 229 244 218 226 218 Z",
    "M 254 202 L 344 100 C 365 76 385 66 412 66 H 564 Q 568 66 565 70 L 523 116 Q 520 119 515 119 H 416 C 398 119 385 126 372 140 L 318 201 Q 315 205 319 209 L 372 263 C 385 277 398 284 416 284 H 520 Q 524 284 527 288 L 565 333 Q 568 337 563 337 H 416 C 386 337 364 327 343 305 L 254 209 Q 251 205 254 202 Z",
    "M 411 145 Q 420 145 426 151 L 441 166 Q 447 172 441 178 L 405 205 L 441 243 Q 447 249 441 255 L 427 263 Q 419 269 411 263 L 360 213 Q 353 206 360 198 L 401 152 Q 405 145 411 145 Z",
    "M 487 145 Q 478 145 472 152 L 466 159 Q 460 165 466 171 L 494 205 L 466 239 Q 460 245 466 251 L 472 258 Q 478 265 487 265 Q 493 265 499 258 L 538 213 Q 545 205 538 197 L 499 152 Q 493 145 487 145 Z"
  ];

  // Cajas base (en espacio 1000x1000) de los elementos interactivos de cada placa para Drag & Drop
  const BASE_HIT_BOXES = {
    google: [
      { id: "qr", label: "Código QR", x: 545, y: 535, w: 290, h: 325, cx: 690, cy: 685 },
      { id: "nfc", label: "Ilustración NFC", x: 155, y: 560, w: 325, h: 280, cx: 326, cy: 706 },
      { id: "title", label: "Título Principal", x: 280, y: 135, w: 440, h: 225, cx: 500, cy: 250 },
      { id: "hero", label: "Anillo y Estrellas", x: 285, y: 45, w: 430, h: 495, cx: 500, cy: 290 },
      { id: "brand", label: "Sello BlueCode", x: 250, y: 905, w: 500, h: 75, cx: 500, cy: 942 }
    ],
    menu: [
      { id: "qr", label: "Código QR", x: 620, y: 515, w: 280, h: 365, cx: 760, cy: 714 },
      { id: "nfc", label: "Ilustración NFC", x: 145, y: 540, w: 370, h: 330, cx: 338, cy: 720 },
      { id: "hero", label: "Icono Cubiertos", x: 410, y: 30, w: 180, h: 185, cx: 500, cy: 120 },
      { id: "title", label: "Título MENU", x: 180, y: 215, w: 640, h: 195, cx: 500, cy: 315 },
      { id: "brand", label: "Sello BlueCode", x: 260, y: 910, w: 480, h: 70, cx: 500, cy: 945 }
    ],
    instagram: [
      { id: "qr", label: "Código QR", x: 540, y: 525, w: 276, h: 305, cx: 678, cy: 668 },
      { id: "nfc", label: "Ilustración NFC", x: 165, y: 545, w: 325, h: 275, cx: 332, cy: 682 },
      { id: "hero", label: "Icono Instagram", x: 265, y: 145, w: 470, h: 225, cx: 500, cy: 260 },
      { id: "title", label: "Título y Subtítulo", x: 170, y: 375, w: 660, h: 150, cx: 500, cy: 455 },
      { id: "brand", label: "Sello BlueCode", x: 310, y: 820, w: 380, h: 95, cx: 500, cy: 868 }
    ]
  };

  let customQrLogoImage = null;

  function setCustomQrLogoImage(imgElementOrNull) {
    customQrLogoImage = imgElementOrNull || null;
  }

  function cmToPx(cm, dpi) {
    const d = dpi || 600;
    return Math.round((cm / 2.54) * d);
  }

  function cmToPx300(cm) {
    return Math.round((cm / 2.54) * 300);
  }

  // Detecta si un color hex es oscuro para ajustar contrastes automáticamente
  function isHexDark(hex) {
    if (!hex || typeof hex !== "string") return false;
    const clean = hex.replace("#", "").trim();
    if (clean.length !== 6) return false;
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum < 0.45;
  }

  // Obtiene la transformación (dx, dy, scale) de un grupo dentro de data.layout
  function getGroupOffset(data, groupId) {
    const lay = (data && data.layout && data.layout[groupId]) || null;
    return {
      x: lay && typeof lay.x === "number" ? lay.x : 0,
      y: lay && typeof lay.y === "number" ? lay.y : 0,
      scale: lay && typeof lay.scale === "number" ? lay.scale : 1
    };
  }

  // Aplica traslación y escala alrededor del centro (cx, cy) de un elemento
  function withGroupTransform(ctx, data, groupId, cx, cy, drawFn) {
    const off = getGroupOffset(data, groupId);
    ctx.save();
    if (off.x !== 0 || off.y !== 0) {
      ctx.translate(off.x, off.y);
    }
    if (off.scale && off.scale !== 1) {
      ctx.translate(cx, cy);
      ctx.scale(off.scale, off.scale);
      ctx.translate(-cx, -cy);
    }
    drawFn();
    ctx.restore();
  }

  // Devuelve las cajas interactivas transformadas para detección de clic/arrastre en el canvas
  function getTransformedHitBoxes(motif, data) {
    const list = BASE_HIT_BOXES[motif] || BASE_HIT_BOXES.google;
    return list.map(function (b) {
      const off = getGroupOffset(data, b.id);
      const sc = off.scale || 1;
      const w = b.w * sc;
      const h = b.h * sc;
      const cx = b.cx + off.x;
      const cy = b.cy + off.y;
      return {
        id: b.id,
        label: b.label,
        x: cx - w / 2,
        y: cy - h / 2,
        w: w,
        h: h,
        cx: cx,
        cy: cy,
        scale: sc
      };
    });
  }

  // Rectángulo con esquinas redondeadas individuales [tl, tr, br, bl] o radio único
  function roundRectPath(ctx, x, y, w, h, r) {
    let tl, tr, br, bl;
    if (Array.isArray(r)) {
      const maxR = Math.min(w / 2, h / 2);
      tl = Math.min(r[0] || 0, maxR);
      tr = Math.min(r[1] || 0, maxR);
      br = Math.min(r[2] || 0, maxR);
      bl = Math.min(r[3] || 0, maxR);
    } else {
      const rr = Math.min(r || 0, w / 2, h / 2);
      tl = tr = br = bl = rr;
    }
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + w - tr, y);
    ctx.arcTo(x + w, y, x + w, y + tr, tr);
    ctx.lineTo(x + w, y + h - br);
    ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
    ctx.lineTo(x + bl, y + h);
    ctx.arcTo(x, y + h, x, y + h - bl, bl);
    ctx.lineTo(x, y + tl);
    ctx.arcTo(x, y, x + tl, y, tl);
    ctx.closePath();
  }

  /**
   * Dibuja el logo vectorial oficial de BlueCode de forma 100% nítida,
   * SIN ningún contorno blanco grueso ni bordes deformes.
   */
  function drawBlueCodeLogo(ctx, x, y, height, opts) {
    opts = opts || {};
    const scale = height / 271;
    const width = 490 * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-78, -66);

    if (opts.solidColor) {
      ctx.fillStyle = opts.solidColor;
    } else {
      const grad = ctx.createLinearGradient(78, 180, 566, 180);
      grad.addColorStop(0, "#0865F5");
      grad.addColorStop(0.28, "#087CF5");
      grad.addColorStop(0.53, "#079AF0");
      grad.addColorStop(0.76, "#04B9EA");
      grad.addColorStop(1, "#08D0E6");
      ctx.fillStyle = grad;
    }

    for (let i = 0; i < BC_PATHS.length; i++) {
      const p = new Path2D(BC_PATHS[i]);
      ctx.fill(p, "evenodd");
    }

    ctx.restore();
    return width;
  }

  /**
   * Dibuja el pie "Powered by [Logo BC] BlueCode" limpio y proporcionado.
   */
  function drawPoweredByBlueCodeFooter(ctx, centerX, baselineY, opts) {
    opts = opts || {};
    const prefixText = opts.lowercase ? "powered by" : "Powered by";
    const fontSize = opts.fontSize || 27;
    const brandFontSize = opts.brandFontSize || 31;
    const logoHeight = opts.logoHeight || 34;
    const prefixColor = opts.prefixColor || "#222222";
    const brandColor = opts.brandColor || "#0F172A";
    const logoSolid = opts.logoSolidColor || null;

    ctx.save();
    ctx.font = "500 " + fontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
    const pwWidth = ctx.measureText(prefixText).width;

    ctx.font = "800 " + brandFontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
    const bcTextWidth = ctx.measureText("BlueCode").width;

    const logoWidth = (490 / 271) * logoHeight;
    const gap1 = fontSize * 0.42;
    const gap2 = fontSize * 0.28;
    const totalW = pwWidth + gap1 + logoWidth + gap2 + bcTextWidth;

    let startX = centerX - totalW / 2;

    ctx.fillStyle = prefixColor;
    ctx.font = "600 " + fontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(prefixText, startX, baselineY);
    startX += pwWidth + gap1;

    const logoY = baselineY - logoHeight * 0.86;
    drawBlueCodeLogo(ctx, startX, logoY, logoHeight, { solidColor: logoSolid });
    startX += logoWidth + gap2;

    ctx.fillStyle = brandColor;
    ctx.font = "800 " + brandFontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("BlueCode", startX, baselineY);

    ctx.restore();
  }

  // Estrella de 5 puntas
  function drawStar(ctx, cx, cy, outerR, innerR, fillStyle) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? outerR : innerR;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.lineJoin = "round";
    ctx.lineWidth = outerR * 0.12;
    ctx.strokeStyle = fillStyle;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /**
   * ILUSTRACIÓN UNIFICADA NFC (Idéntica a la imagen de Menú para las 3 tarjetas)
   */
  function drawUnifiedMenuNfcIllustration(ctx, cx, cy, scale, strokeColor, fillBodyColor) {
    const col = strokeColor || "#181818";
    const bodyFill = fillBodyColor || "#FFFFFF";
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    ctx.strokeStyle = col;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. Gran óvalo NFC izquierdo abierto hacia donde entra el teléfono
    ctx.lineWidth = 8.5;
    ctx.beginPath();
    ctx.ellipse(-62, 10, 114, 96, 0, (28 * Math.PI) / 180, (330 * Math.PI) / 180);
    ctx.stroke();

    // 2. 4 ondas curvas NFC dentro del óvalo
    const waveX = -114;
    const waveY = 10;
    const radii = [22, 42, 62, 82];
    for (let i = 0; i < radii.length; i++) {
      ctx.beginPath();
      const ang = (30 + i * 2) * (Math.PI / 180);
      ctx.arc(waveX, waveY, radii[i], -ang, ang);
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // 3. Smartphone inclinado (-9 grados) + mano sosteniéndolo
    ctx.save();
    ctx.translate(64, -22);
    ctx.rotate((-9 * Math.PI) / 180);

    ctx.lineWidth = 8;
    roundRectPath(ctx, -44, -84, 88, 168, 15);
    ctx.fillStyle = bodyFill;
    ctx.fill();
    ctx.stroke();

    // Altavoz superior
    ctx.beginPath();
    ctx.moveTo(-11, -69);
    ctx.lineTo(11, -69);
    ctx.lineWidth = 6;
    ctx.stroke();

    // Texto "NFC" nítido dentro de la pantalla del teléfono
    ctx.fillStyle = col;
    ctx.font = "800 24px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NFC", 0, -34);

    // 4 dedos redondeados sujetando el borde izquierdo
    ctx.lineWidth = 7.5;
    const fingerY = [-18, 4, 26, 48];
    for (let f = 0; f < fingerY.length; f++) {
      ctx.save();
      ctx.translate(-46, fingerY[f]);
      ctx.rotate((-8 * Math.PI) / 180);
      roundRectPath(ctx, -16, -9, 28, 18, 9);
      ctx.fillStyle = bodyFill;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Pulgar apoyado en el lado derecho + línea de la palma hacia la muñeca
    ctx.beginPath();
    ctx.moveTo(42, 32);
    ctx.lineTo(35, -14);
    ctx.quadraticCurveTo(34, -32, 48, -32);
    ctx.quadraticCurveTo(62, -32, 68, -6);
    ctx.lineTo(84, 52);
    ctx.lineTo(98, 60);
    ctx.lineTo(74, 108);
    ctx.lineTo(54, 98);
    ctx.quadraticCurveTo(36, 106, 22, 84);
    ctx.fillStyle = bodyFill;
    ctx.fill();
    ctx.lineWidth = 7.5;
    ctx.stroke();

    // Puño de la manga en ángulo
    ctx.beginPath();
    ctx.moveTo(86, 54);
    ctx.lineTo(112, 66);
    ctx.lineTo(90, 122);
    ctx.lineTo(64, 110);
    ctx.closePath();
    ctx.fillStyle = bodyFill;
    ctx.fill();
    ctx.lineWidth = 7.5;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  // ============================================================================
  // ICONOS PARA EL CENTRO DEL CÓDIGO QR
  // ============================================================================
  function drawGoogleGIcon(ctx, cx, cy, r) {
    ctx.save();
    ctx.lineWidth = r * 0.42;
    ctx.lineCap = "butt";

    ctx.beginPath();
    ctx.strokeStyle = "#EA4335";
    ctx.arc(cx, cy, r, -Math.PI * 0.78, -Math.PI * 0.18);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#FBBC05";
    ctx.arc(cx, cy, r, Math.PI * 0.78, Math.PI * 1.22);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#34A853";
    ctx.arc(cx, cy, r, Math.PI * 0.18, Math.PI * 0.78);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#4285F4";
    ctx.arc(cx, cy, r, -Math.PI * 0.02, Math.PI * 0.22);
    ctx.stroke();

    ctx.fillStyle = "#4285F4";
    ctx.fillRect(cx, cy - r * 0.2, r * 1.18, r * 0.4);
    ctx.restore();
  }

  function drawInstagramBadgeIcon(ctx, cx, cy, size) {
    ctx.save();
    const r = size * 0.46;
    const grad = ctx.createLinearGradient(cx - r, cy + r, cx + r, cy - r);
    grad.addColorStop(0, "#FEDA75");
    grad.addColorStop(0.28, "#FA7E1E");
    grad.addColorStop(0.6, "#D62976");
    grad.addColorStop(1, "#962FBF");

    roundRectPath(ctx, cx - r, cy - r, r * 2, r * 2, r * 0.46);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = size * 0.075;
    roundRectPath(ctx, cx - r * 0.68, cy - r * 0.68, r * 1.36, r * 1.36, r * 0.34);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + r * 0.38, cy - r * 0.38, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.restore();
  }

  function drawMenuBadgeIcon(ctx, cx, cy, size) {
    ctx.save();
    const r = size * 0.46;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1B1A1A";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    const s = size / 100;
    ctx.translate(cx, cy);
    ctx.scale(s, s);
    roundRectPath(ctx, -20, -28, 4.5, 22, 2);
    ctx.fill();
    roundRectPath(ctx, -13, -28, 4.5, 22, 2);
    ctx.fill();
    roundRectPath(ctx, -6, -28, 4.5, 22, 2);
    ctx.fill();
    roundRectPath(ctx, -20, -10, 18.5, 10, 4);
    ctx.fill();
    roundRectPath(ctx, -14, -2, 6.5, 30, 3);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(14, -15, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    roundRectPath(ctx, 10.5, -4, 7, 32, 3);
    ctx.fill();
    ctx.restore();
  }

  function drawWhatsappBadgeIcon(ctx, cx, cy, size) {
    ctx.save();
    const r = size * 0.46;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#25D366";
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = size * 0.095;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.48, 0.15 * Math.PI, 1.38 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawWifiBadgeIcon(ctx, cx, cy, size) {
    ctx.save();
    const r = size * 0.46;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0865F5";
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = size * 0.075;
    ctx.lineCap = "round";
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.35, i * r * 0.24, -Math.PI * 0.78, -Math.PI * 0.22);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.38, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.restore();
  }

  // Comprueba si una celda (r, c) pertenece a uno de los 3 ojos buscadores (7x7)
  function isFinderPattern(r, c, count) {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= count - 7) return true;
    if (r >= count - 7 && c < 7) return true;
    return false;
  }

  /**
   * Dibuja uno de los 3 ojos buscadores (7x7 módulos) con formas únicas:
   * - 'square': Cuadrado clásico
   * - 'rounded': Esquinas redondeadas modernas
   * - 'circle': Anillo circular perfecto + núcleo circular
   * - 'leaf': Hoja / Gota asimétrica
   * - 'shield': Escudo / Diamante redondeado
   */
  function drawCustomFinderEye(ctx, x, y, cell, fillStyle, eyeStyle) {
    const outerSize = 7 * cell;
    const innerOffset = 2 * cell;
    const innerSize = 3 * cell;
    const ringStroke = cell;
    const ringX = x + cell * 0.5;
    const ringY = y + cell * 0.5;
    const ringDim = 6 * cell;

    ctx.save();
    ctx.strokeStyle = fillStyle;
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = ringStroke;

    if (eyeStyle === "circle") {
      const cx = x + outerSize / 2;
      const cy = y + outerSize / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 3 * cell, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 1.5 * cell, 0, Math.PI * 2);
      ctx.fill();
    } else if (eyeStyle === "rounded") {
      roundRectPath(ctx, ringX, ringY, ringDim, ringDim, cell * 1.65);
      ctx.stroke();

      roundRectPath(ctx, x + innerOffset, y + innerOffset, innerSize, innerSize, cell * 0.85);
      ctx.fill();
    } else if (eyeStyle === "leaf") {
      const rBig = cell * 2.3;
      const rSmall = cell * 0.45;
      roundRectPath(ctx, ringX, ringY, ringDim, ringDim, [rBig, rSmall, rBig, rSmall]);
      ctx.stroke();

      roundRectPath(ctx, x + innerOffset, y + innerOffset, innerSize, innerSize, [cell * 1.25, cell * 0.25, cell * 1.25, cell * 0.25]);
      ctx.fill();
    } else if (eyeStyle === "shield") {
      roundRectPath(ctx, ringX, ringY, ringDim, ringDim, [cell * 0.4, cell * 2.0, cell * 0.4, cell * 2.0]);
      ctx.stroke();

      const cx = x + outerSize / 2;
      const cy = y + outerSize / 2;
      const d = 1.65 * cell;
      ctx.beginPath();
      ctx.moveTo(cx, cy - d);
      ctx.lineTo(cx + d, cy);
      ctx.lineTo(cx, cy + d);
      ctx.lineTo(cx - d, cy);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeRect(ringX, ringY, ringDim, ringDim);
      ctx.fillRect(x + innerOffset, y + innerOffset, innerSize, innerSize);
    }

    ctx.restore();
  }

  function buildQrFillStyle(ctx, x, y, size, opts) {
    const mode = opts.qrColorMode || "solid";
    const baseColor = opts.color || "#111111";

    if (mode === "grad-bc") {
      const g = ctx.createLinearGradient(x, y, x + size, y + size);
      g.addColorStop(0, "#0865F5");
      g.addColorStop(0.55, "#0696EE");
      g.addColorStop(1, "#00B4D8");
      return g;
    }
    if (mode === "grad-ig") {
      const g = ctx.createLinearGradient(x, y + size, x + size, y);
      g.addColorStop(0, "#F58529");
      g.addColorStop(0.5, "#DD2A7B");
      g.addColorStop(1, "#8134AF");
      return g;
    }
    if (mode === "grad-gold") {
      const g = ctx.createLinearGradient(x, y, x + size, y + size);
      g.addColorStop(0, "#1E1B18");
      g.addColorStop(0.55, "#785A28");
      g.addColorStop(1, "#B48327");
      return g;
    }
    if (mode === "grad-custom" && opts.color2) {
      const g = ctx.createLinearGradient(x, y, x + size, y + size);
      g.addColorStop(0, baseColor);
      g.addColorStop(1, opts.color2);
      return g;
    }
    return baseColor;
  }

  /**
   * MOTOR QR ULTRA-PERSONALIZABLE Y 100% ESCANEABLE (NIVEL H - 30% TOLERANCIA)
   */
  function drawQrMatrix(ctx, url, x, y, size, opts) {
    if (typeof qrcode !== "function") return;
    opts = opts || {};

    const logoType = opts.centerLogo && opts.centerLogo !== "none" ? opts.centerLogo : null;
    const style = opts.qrStyle || "classic";
    const eyeStyle = opts.qrEyeStyle || "square";
    const logoShape = opts.logoShape || "rounded";
    const frameStyle = opts.frameStyle || "none";

    const qr = qrcode(0, "H");
    qr.addData(url || "https://gestor-nfc-qr-2026.web.app");
    qr.make();
    const count = qr.getModuleCount();

    let qrX = x;
    let qrY = y;
    let qrSize = size;

    ctx.save();
    if (opts.bgWhite) {
      const padBg = size * 0.055;
      if (opts.bgShadow) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.14)";
        ctx.shadowBlur = size * 0.06;
        ctx.shadowOffsetY = size * 0.018;
        roundRectPath(ctx, x - padBg, y - padBg, size + padBg * 2, size + padBg * 2, opts.bgRadius || size * 0.06);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.restore();
      } else {
        roundRectPath(ctx, x - padBg, y - padBg, size + padBg * 2, size + padBg * 2, opts.bgRadius || size * 0.06);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }
    }

    const mainFill = buildQrFillStyle(ctx, x, y, size, opts);

    if (frameStyle === "scan-bottom") {
      const pad = size * 0.055;
      const bottomBarH = size * 0.13;
      qrSize = size - pad * 2 - bottomBarH;
      qrX = x + (size - qrSize) / 2;
      qrY = y + pad;

      roundRectPath(ctx, x, y, size, size - bottomBarH * 0.35, size * 0.07);
      ctx.strokeStyle = mainFill;
      ctx.lineWidth = size * 0.022;
      ctx.stroke();

      const pillW = size * 0.68;
      const pillH = bottomBarH * 0.88;
      const pillX = x + (size - pillW) / 2;
      const pillY = y + size - pillH;
      roundRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fillStyle = mainFill;
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 " + Math.round(pillH * 0.54) + "px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(opts.frameText || "ESCANÉAME", x + size / 2, pillY + pillH / 2 + 1);
    } else if (frameStyle === "corners") {
      const pad = size * 0.06;
      qrX = x + pad;
      qrY = y + pad;
      qrSize = size - pad * 2;
      const cLen = size * 0.14;
      ctx.strokeStyle = mainFill;
      ctx.lineWidth = size * 0.024;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x, y + cLen); ctx.lineTo(x, y); ctx.lineTo(x + cLen, y);
      ctx.moveTo(x + size - cLen, y); ctx.lineTo(x + size, y); ctx.lineTo(x + size, y + cLen);
      ctx.moveTo(x, y + size - cLen); ctx.lineTo(x, y + size); ctx.lineTo(x + cLen, y + size);
      ctx.moveTo(x + size - cLen, y + size); ctx.lineTo(x + size, y + size); ctx.lineTo(x + size, y + size - cLen);
      ctx.stroke();
    }

    const cell = qrSize / count;
    const clearHalf = logoType ? count * 0.105 : 0;
    const centerIdx = (count - 1) / 2;

    function isSkipped(r, c) {
      if (r < 0 || c < 0 || r >= count || c >= count) return true;
      if (isFinderPattern(r, c, count)) return true;
      if (logoType && Math.abs(r - centerIdx) <= clearHalf && Math.abs(c - centerIdx) <= clearHalf) return true;
      return !qr.isDark(r, c);
    }

    // 1. Dibujar los 3 Ojos Buscadores
    const eyeColorMode = opts.eyeColorMode || "match";
    let eyeTopLeft = mainFill;
    let eyeTopRight = mainFill;
    let eyeBottomLeft = mainFill;

    if (eyeColorMode === "bc-blue") {
      eyeTopLeft = eyeTopRight = eyeBottomLeft = "#0865F5";
    } else if (eyeColorMode === "google-multi") {
      eyeTopLeft = "#4285F4";
      eyeTopRight = "#EA4335";
      eyeBottomLeft = "#34A853";
    } else if (eyeColorMode === "custom" && opts.eyeColor) {
      eyeTopLeft = eyeTopRight = eyeBottomLeft = opts.eyeColor;
    }

    drawCustomFinderEye(ctx, qrX, qrY, cell, eyeTopLeft, eyeStyle);
    drawCustomFinderEye(ctx, qrX + (count - 7) * cell, qrY, cell, eyeTopRight, eyeStyle);
    drawCustomFinderEye(ctx, qrX, qrY + (count - 7) * cell, cell, eyeBottomLeft, eyeStyle);

    // 2. Dibujar los módulos de datos
    ctx.fillStyle = mainFill;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (isSkipped(r, c)) continue;

        const mx = qrX + c * cell;
        const my = qrY + r * cell;

        if (style === "dots") {
          ctx.beginPath();
          ctx.arc(mx + cell / 2, my + cell / 2, cell * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (style === "rounded") {
          roundRectPath(ctx, mx + cell * 0.04, my + cell * 0.04, cell * 0.92, cell * 0.92, cell * 0.34);
          ctx.fill();
        } else if (style === "liquid") {
          const up = !isSkipped(r - 1, c);
          const down = !isSkipped(r + 1, c);
          const rad = cell * 0.44;
          const rTL = up ? 0 : rad;
          const rTR = up ? 0 : rad;
          const rBR = down ? 0 : rad;
          const rBL = down ? 0 : rad;
          roundRectPath(
            ctx,
            mx + cell * 0.07,
            my - (up ? 0.3 : 0),
            cell * 0.86,
            cell + (up ? 0.3 : 0) + (down ? 0.3 : 0),
            [rTL, rTR, rBR, rBL]
          );
          ctx.fill();
        } else if (style === "diamond") {
          const cx = mx + cell / 2;
          const cy = my + cell / 2;
          const hr = cell * 0.52;
          ctx.beginPath();
          ctx.moveTo(cx, cy - hr);
          ctx.lineTo(cx + hr, cy);
          ctx.lineTo(cx, cy + hr);
          ctx.lineTo(cx - hr, cy);
          ctx.closePath();
          ctx.fill();
        } else if (style === "star") {
          const cx = mx + cell / 2;
          const cy = my + cell / 2;
          const or = cell * 0.54;
          const ir = cell * 0.24;
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const ang = (k * Math.PI) / 4;
            const rad = k % 2 === 0 ? or : ir;
            const px = cx + Math.cos(ang) * rad;
            const py = cy + Math.sin(ang) * rad;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(mx, my, cell + 0.35, cell + 0.35);
        }
      }
    }

    // 3. Dibujar el Logo Central
    if (logoType) {
      const boxSize = qrSize * 0.215;
      const bx = qrX + (qrSize - boxSize) / 2;
      const by = qrY + (qrSize - boxSize) / 2;
      const cx = bx + boxSize / 2;
      const cy = by + boxSize / 2;

      ctx.save();
      if (logoShape === "circle") {
        ctx.beginPath();
        ctx.arc(cx, cy, boxSize * 0.54, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, boxSize * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = mainFill;
        ctx.lineWidth = boxSize * 0.045;
        ctx.stroke();
      } else if (logoShape === "rounded") {
        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = boxSize * 0.08;
        roundRectPath(ctx, bx, by, boxSize, boxSize, boxSize * 0.24);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        roundRectPath(ctx, bx + boxSize * 0.03, by + boxSize * 0.03, boxSize * 0.94, boxSize * 0.94, boxSize * 0.21);
        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.lineWidth = boxSize * 0.03;
        ctx.stroke();
      } else {
        roundRectPath(ctx, bx, by, boxSize, boxSize, boxSize * 0.16);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }
      ctx.restore();

      if (logoType === "bluecode") {
        const logoH = boxSize * 0.46;
        const logoW = (490 / 271) * logoH;
        drawBlueCodeLogo(ctx, cx - logoW / 2, cy - logoH / 2, logoH);
      } else if (logoType === "google") {
        drawGoogleGIcon(ctx, cx, cy, boxSize * 0.34);
      } else if (logoType === "instagram") {
        drawInstagramBadgeIcon(ctx, cx, cy, boxSize * 0.86);
      } else if (logoType === "menu") {
        drawMenuBadgeIcon(ctx, cx, cy, boxSize * 0.86);
      } else if (logoType === "whatsapp") {
        drawWhatsappBadgeIcon(ctx, cx, cy, boxSize * 0.86);
      } else if (logoType === "wifi") {
        drawWifiBadgeIcon(ctx, cx, cy, boxSize * 0.86);
      } else if (logoType === "star") {
        drawStar(ctx, cx, cy, boxSize * 0.38, boxSize * 0.18, "#F59E0B");
      } else if (logoType === "custom" && customQrLogoImage) {
        ctx.save();
        const pad = boxSize * 0.12;
        if (logoShape === "circle") {
          ctx.beginPath();
          ctx.arc(cx, cy, (boxSize - pad * 2) / 2, 0, Math.PI * 2);
          ctx.clip();
        } else {
          roundRectPath(ctx, bx + pad, by + pad, boxSize - pad * 2, boxSize - pad * 2, boxSize * 0.14);
          ctx.clip();
        }
        ctx.drawImage(customQrLogoImage, bx + pad, by + pad, boxSize - pad * 2, boxSize - pad * 2);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // Texto en arco (para "TAP YOUR PHONE" en la placa Menú)
  function drawArcText(ctx, text, boldPrefixLen, cx, cy, radius, startAngle, endAngle, fontSize, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const totalAngle = endAngle - startAngle;
    const step = totalAngle / Math.max(1, text.length - 1);

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const angle = startAngle + i * step;
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.rotate(angle + Math.PI / 2);
      ctx.font = (i < boldPrefixLen ? "800 " : "500 ") + fontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  function resolvePlaqueQrLogo(motif, data) {
    const requested = data.qrCenterLogo || "auto";
    if (requested === "none") return null;
    if (requested === "auto") {
      if (motif === "google") return "google";
      return "bluecode";
    }
    return requested;
  }

  function buildQrOptionsFromData(motif, data, defaultColor, forceWhiteCard) {
    return {
      centerLogo: resolvePlaqueQrLogo(motif, data),
      qrStyle: data.qrStyle || "classic",
      qrEyeStyle: data.qrEyeStyle || "square",
      qrColorMode: data.qrColorMode || "solid",
      color: data.qrColor || defaultColor || "#111111",
      color2: data.qrColor2 || "#0865F5",
      eyeColorMode: data.eyeColorMode || "match",
      eyeColor: data.eyeColor || "#0865F5",
      logoShape: data.logoShape || "rounded",
      frameStyle: data.frameStyle || "none",
      frameText: data.frameText || "ESCANÉAME",
      bgWhite: Boolean(forceWhiteCard),
      bgShadow: Boolean(forceWhiteCard),
      bgRadius: 20
    };
  }

  /**
   * Dibuja el bloque de texto opcional debajo del QR según `data.qrCaptionMode`:
   * - 'clean': No dibuja nada (QR 100% limpio)
   * - 'bottom-text': Dibuja solo el texto personalizado debajo del QR
   * - 'bottom-text-id': Dibuja el texto personalizado + el ID del tag debajo
   */
  function drawQrBottomCaption(ctx, centerX, topY, data, textColor) {
    const mode = data.qrCaptionMode || "clean";
    if (mode === "clean") return;

    const caption = (data.qrCaptionText || "").trim();
    const slugText = (data.slug || "TAG-ID").toUpperCase();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    let curY = topY;

    if (caption) {
      ctx.fillStyle = textColor || "#181818";
      ctx.font = "800 24px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(caption, centerX, curY);
      curY += 28;
    }

    if (mode === "bottom-text-id") {
      ctx.fillStyle = textColor || "#333333";
      ctx.globalAlpha = 0.78;
      ctx.font = "600 19px 'JetBrains Mono', monospace";
      ctx.fillText("ID: " + slugText, centerX, curY);
    }
    ctx.restore();
  }

  // Dibuja el indicador interactivo de selección / arrastre (SOLO en la vista previa en pantalla)
  function drawSelectionOverlayIfActive(ctx, motif, data) {
    if (!data || !data.__activeDragGroup) return;
    const boxes = getTransformedHitBoxes(motif, data);
    const active = boxes.find(function (b) { return b.id === data.__activeDragGroup; });
    if (!active) return;

    ctx.save();
    ctx.strokeStyle = "#08D0E6";
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 6]);
    roundRectPath(ctx, active.x - 8, active.y - 8, active.w + 16, active.h + 16, 16);
    ctx.stroke();
    ctx.setLineDash([]);

    // Etiqueta flotante superior
    const tagText = "✥ " + active.label + " (" + Math.round((active.scale || 1) * 100) + "%)";
    ctx.font = "700 20px 'Plus Jakarta Sans', Arial, sans-serif";
    const tw = ctx.measureText(tagText).width + 24;
    const tx = Math.max(20, Math.min(980 - tw, active.cx - tw / 2));
    const ty = Math.max(16, active.y - 42);
    roundRectPath(ctx, tx, ty, tw, 30, 8);
    ctx.fillStyle = "#0865F5";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tagText, tx + tw / 2, ty + 15);
    ctx.restore();
  }

  // ============================================================================
  // 1. RENDERIZADOR PLACA GOOGLE REVIEW
  // ============================================================================
  function renderGooglePlaque(ctx, W, H, data, layerFilter) {
    const S = W / 1000;
    ctx.save();
    ctx.scale(S, S);

    const showBg = !layerFilter || layerFilter === "all" || layerFilter === "bg";
    const showIcons = !layerFilter || layerFilter === "all" || layerFilter === "icons";
    const showText = !layerFilter || layerFilter === "all" || layerFilter === "text";
    const showBrand = !layerFilter || layerFilter === "all" || layerFilter === "brand";
    const showQr = !layerFilter || layerFilter === "all" || layerFilter === "qr";

    const bgColor = data.bgColor || "#FFFFFF";
    const textColor = data.textColor || "#202124";
    const accentColor = data.accentColor || "#FBC02D";
    const darkBg = isHexDark(bgColor);

    roundRectPath(ctx, 0, 0, 1000, 1000, 76);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1000, 1000);

      const useCustomBorder = data.borderStyle === "accent";
      ctx.beginPath();
      ctx.moveTo(0, 340);
      ctx.lineTo(122, 515);
      ctx.lineTo(0, 540);
      ctx.closePath();
      ctx.fillStyle = useCustomBorder ? accentColor : "#EA4335";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 540);
      ctx.lineTo(122, 515);
      ctx.lineTo(122, 888);
      ctx.lineTo(465, 888);
      ctx.lineTo(465, 1000);
      ctx.lineTo(0, 1000);
      ctx.closePath();
      ctx.fillStyle = useCustomBorder ? accentColor : "#FBBC05";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(465, 888);
      ctx.lineTo(880, 888);
      ctx.lineTo(975, 1000);
      ctx.lineTo(465, 1000);
      ctx.closePath();
      ctx.fillStyle = useCustomBorder ? accentColor : "#34A853";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(878, 422);
      ctx.lineTo(1000, 396);
      ctx.lineTo(1000, 1000);
      ctx.lineTo(975, 1000);
      ctx.lineTo(878, 888);
      ctx.closePath();
      ctx.fillStyle = useCustomBorder ? accentColor : "#4285F4";
      ctx.fill();

      roundRectPath(ctx, 118, 40, 764, 850, 36);
      ctx.fillStyle = bgColor;
      ctx.fill();

      roundRectPath(ctx, 2, 2, 996, 996, 75);
      ctx.strokeStyle = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Grupo HERO: Anillo Google + 5 Estrellas
      withGroupTransform(ctx, data, "hero", 500, 290, function () {
        const cx = 500, cy = 252, r = 194;
        const useCustomRing = data.borderStyle === "accent";
        ctx.save();
        ctx.lineWidth = 22;
        ctx.lineCap = "butt";

        ctx.beginPath();
        ctx.strokeStyle = useCustomRing ? accentColor : "#4285F4";
        ctx.arc(cx, cy, r, (172 * Math.PI) / 180, (270 * Math.PI) / 180);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = useCustomRing ? accentColor : "#EA4335";
        ctx.arc(cx, cy, r, (270 * Math.PI) / 180, (368 * Math.PI) / 180);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = useCustomRing ? accentColor : "#FBBC05";
        ctx.arc(cx, cy, r, (8 * Math.PI) / 180, (90 * Math.PI) / 180);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = useCustomRing ? accentColor : "#34A853";
        ctx.arc(cx, cy, r, (90 * Math.PI) / 180, (172 * Math.PI) / 180);
        ctx.stroke();
        ctx.restore();

        const starX = [392, 446, 500, 554, 608];
        for (let i = 0; i < starX.length; i++) {
          drawStar(ctx, starX[i], 508, 21, 10, accentColor);
        }
      });

      // Grupo NFC: Ilustración teléfono y mano
      withGroupTransform(ctx, data, "nfc", 326, 706, function () {
        drawUnifiedMenuNfcIllustration(ctx, 326, 706, 0.88, textColor, darkBg ? bgColor : "#FFFFFF");
      });
    }

    if (showText) {
      // Grupo TITLE: Textos dentro del círculo
      withGroupTransform(ctx, data, "title", 500, 250, function () {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        const line1 = data.titleLine1 || data.googleLine1 || "Valóranos";
        const line2 = data.titleLine2 || data.googleLine2 || "en";
        const line3 = data.titleLine3 || "Google";

        ctx.font = "700 49px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillText(line1, 500, 195);
        ctx.font = "700 45px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillText(line2, 500, 249);

        if (line3.toLowerCase() === "google" && data.borderStyle !== "accent") {
          const gLetters = [
            { ch: "G", color: "#4285F4" },
            { ch: "o", color: "#EA4335" },
            { ch: "o", color: "#FBBC05" },
            { ch: "g", color: "#4285F4" },
            { ch: "l", color: "#34A853" },
            { ch: "e", color: "#EA4335" }
          ];
          ctx.font = "700 76px 'Plus Jakarta Sans', Arial, sans-serif";
          ctx.textAlign = "left";
          let totalGW = 0;
          const widths = gLetters.map(function (item) {
            const w = ctx.measureText(item.ch).width;
            totalGW += w;
            return w;
          });
          let curX = 500 - totalGW / 2;
          for (let i = 0; i < gLetters.length; i++) {
            ctx.fillStyle = gLetters[i].color;
            ctx.fillText(gLetters[i].ch, curX, 329);
            curX += widths[i];
          }
        } else {
          ctx.font = "800 68px 'Plus Jakarta Sans', Arial, sans-serif";
          ctx.fillStyle = data.borderStyle === "accent" ? accentColor : "#4285F4";
          ctx.fillText(line3, 500, 329);
        }
        ctx.restore();
      });
    }

    if (showQr) {
      withGroupTransform(ctx, data, "qr", 690, 685, function () {
        const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
        const captionMode = data.qrCaptionMode || "clean";
        const hasCaption = captionMode !== "clean";
        const hasId = captionMode === "bottom-text-id";
        const qrSize = hasId ? 216 : (hasCaption ? 228 : 250);
        const qrY = hasId ? 540 : (hasCaption ? 546 : 560);
        const qrX = 690 - qrSize / 2;

        drawQrMatrix(
          ctx,
          targetUrl,
          qrX,
          qrY,
          qrSize,
          buildQrOptionsFromData("google", data, "#111111", darkBg || data.qrBoxCard)
        );

        drawQrBottomCaption(ctx, 690, qrY + qrSize + (darkBg ? 38 : 30), data, textColor);
      });
    }

    if (showBrand) {
      withGroupTransform(ctx, data, "brand", 500, 942, function () {
        ctx.save();
        const borderIsDark = data.borderStyle === "accent" && isHexDark(accentColor);
        ctx.fillStyle = borderIsDark ? "#FFFFFF" : "#181818";
        ctx.font = "700 26px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("Powered by", 448, 954);

        roundRectPath(ctx, 476, 913, 252, 58, 29);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        drawBlueCodeLogo(ctx, 494, 924, 36);

        ctx.fillStyle = "#0F172A";
        ctx.font = "800 30px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("BlueCode", 568, 953);
        ctx.restore();
      });
    }

    if (!layerFilter || layerFilter === "all") {
      drawSelectionOverlayIfActive(ctx, "google", data);
    }

    ctx.restore();
  }

  // ============================================================================
  // 2. RENDERIZADOR PLACA INSTAGRAM
  // ============================================================================
  function renderInstagramPlaque(ctx, W, H, data, layerFilter) {
    const S = W / 1000;
    ctx.save();
    ctx.scale(S, S);

    const showBg = !layerFilter || layerFilter === "all" || layerFilter === "bg";
    const showIcons = !layerFilter || layerFilter === "all" || layerFilter === "icons";
    const showText = !layerFilter || layerFilter === "all" || layerFilter === "text";
    const showBrand = !layerFilter || layerFilter === "all" || layerFilter === "brand";
    const showQr = !layerFilter || layerFilter === "all" || layerFilter === "qr";

    const bgColor = data.bgColor || "#FFFFFF";
    const textColor = data.textColor || "#141414";
    const accentColor = data.accentColor || "#E11D74";
    const darkBg = isHexDark(bgColor);

    roundRectPath(ctx, 0, 0, 1000, 1000, 88);
    ctx.clip();

    if (showBg) {
      if (data.borderStyle === "accent") {
        ctx.fillStyle = accentColor;
      } else {
        const igBorderGrad = ctx.createLinearGradient(0, 0, 1000, 1000);
        igBorderGrad.addColorStop(0, "#FFE033");
        igBorderGrad.addColorStop(0.22, "#FF7A1A");
        igBorderGrad.addColorStop(0.5, "#FF0069");
        igBorderGrad.addColorStop(0.78, "#E0009B");
        igBorderGrad.addColorStop(1, "#9B2DEF");
        ctx.fillStyle = igBorderGrad;
      }
      ctx.fillRect(0, 0, 1000, 1000);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(860, 32);
      ctx.quadraticCurveTo(915, 32, 938, 52);
      ctx.strokeStyle = "rgba(255,255,255,0.88)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      roundRectPath(ctx, 56, 56, 888, 888, 62);
      ctx.fillStyle = bgColor;
      ctx.fill();

      ctx.save();
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";
      roundRectPath(ctx, 114, 114, 772, 766, 44);
      ctx.stroke();

      ctx.fillStyle = bgColor;
      ctx.fillRect(345, 868, 310, 26);
      ctx.restore();
    }

    if (showIcons) {
      withGroupTransform(ctx, data, "hero", 500, 260, function () {
        ctx.save();
        let camStroke;
        if (data.borderStyle === "accent") {
          camStroke = accentColor;
        } else {
          const camGrad = ctx.createLinearGradient(408, 352, 592, 168);
          camGrad.addColorStop(0, "#FEDA75");
          camGrad.addColorStop(0.28, "#FA7E1E");
          camGrad.addColorStop(0.6, "#D62976");
          camGrad.addColorStop(1, "#962FBF");
          camStroke = camGrad;
        }

        ctx.strokeStyle = camStroke;
        ctx.lineWidth = 17;
        roundRectPath(ctx, 412, 172, 176, 176, 46);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(500, 260, 44, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(548, 212, 11, 0, Math.PI * 2);
        ctx.fillStyle = camStroke;
        ctx.fill();

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 11;
        ctx.lineCap = "round";
        const waveRadii = [58, 92, 126];
        for (let i = 0; i < waveRadii.length; i++) {
          ctx.beginPath();
          ctx.arc(405, 260, waveRadii[i], (142 * Math.PI) / 180, (218 * Math.PI) / 180);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(595, 260, waveRadii[i], (-38 * Math.PI) / 180, (38 * Math.PI) / 180);
          ctx.stroke();
        }
        ctx.restore();
      });

      withGroupTransform(ctx, data, "nfc", 332, 682, function () {
        drawUnifiedMenuNfcIllustration(ctx, 332, 682, 0.86, textColor, darkBg ? bgColor : "#FFFFFF");
      });
    }

    if (showText) {
      withGroupTransform(ctx, data, "title", 500, 455, function () {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";

        ctx.font = "400 78px 'Grand Hotel', 'Brush Script MT', cursive";
        ctx.fillText(data.titleScript || data.igTitle || "Instagram", 500, 446);

        ctx.font = "500 33px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillText(data.subtitle || data.igSubtitle || "¡Acerca tu móvil y síguenos!", 500, 504);
        ctx.restore();
      });
    }

    if (showQr) {
      withGroupTransform(ctx, data, "qr", 678, 668, function () {
        const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
        const captionMode = data.qrCaptionMode || "clean";
        const hasCaption = captionMode !== "clean";
        const hasId = captionMode === "bottom-text-id";
        const qrSize = hasId ? 204 : (hasCaption ? 218 : 240);
        const qrX = 678 - qrSize / 2;
        const qrY = hasId ? 528 : (hasCaption ? 536 : 548);

        drawQrMatrix(
          ctx,
          targetUrl,
          qrX,
          qrY,
          qrSize,
          buildQrOptionsFromData("instagram", data, "#141414", darkBg || data.qrBoxCard)
        );

        drawQrBottomCaption(ctx, 678, qrY + qrSize + (darkBg ? 34 : 26), data, textColor);
      });
    }

    if (showBrand) {
      withGroupTransform(ctx, data, "brand", 500, 868, function () {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = darkBg ? "rgba(255,255,255,0.75)" : "#555555";
        ctx.font = "600 18px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillText("Powered by", 500, 842);

        const logoH = 34;
        const logoW = (490 / 271) * logoH;
        ctx.font = "800 31px 'Plus Jakarta Sans', Arial, sans-serif";
        const txtW = ctx.measureText("BlueCode").width;
        const gap = 10;
        const totalW = logoW + gap + txtW;
        const startX = 500 - totalW / 2;

        drawBlueCodeLogo(ctx, startX, 853, logoH);

        ctx.fillStyle = textColor;
        ctx.textAlign = "left";
        ctx.fillText("BlueCode", startX + logoW + gap, 881);

        const miniStars = [468, 484, 500, 516, 532];
        for (let s = 0; s < miniStars.length; s++) {
          drawStar(ctx, miniStars[s], 903, 6, 3, "#F59E0B");
        }
        ctx.restore();
      });
    }

    if (!layerFilter || layerFilter === "all") {
      drawSelectionOverlayIfActive(ctx, "instagram", data);
    }

    ctx.restore();
  }

  // ============================================================================
  // 3. RENDERIZADOR PLACA MENÚ
  // ============================================================================
  function renderMenuPlaque(ctx, W, H, data, layerFilter) {
    const S = W / 1000;
    ctx.save();
    ctx.scale(S, S);

    const showBg = !layerFilter || layerFilter === "all" || layerFilter === "bg";
    const showIcons = !layerFilter || layerFilter === "all" || layerFilter === "icons";
    const showText = !layerFilter || layerFilter === "all" || layerFilter === "text";
    const showBrand = !layerFilter || layerFilter === "all" || layerFilter === "brand";
    const showQr = !layerFilter || layerFilter === "all" || layerFilter === "qr";

    const bgColor = data.bgColor || "#FFFFFF";
    const textColor = data.textColor || "#1B1A1A";
    const accentColor = data.accentColor || "#1B1A1A";
    const waveSubColor = data.waveSubColor || "#DCE8F3";
    const darkBg = isHexDark(bgColor);
    const darkHeader = isHexDark(accentColor);
    const headerContentColor = darkHeader ? "#FFFFFF" : "#111827";

    roundRectPath(ctx, 0, 0, 1000, 1000, 82);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1000, 1000);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 492);
      ctx.bezierCurveTo(760, 505, 520, 365, 0, 542);
      ctx.closePath();
      ctx.fillStyle = waveSubColor;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 472);
      ctx.bezierCurveTo(760, 485, 520, 342, 0, 520);
      ctx.closePath();
      ctx.fillStyle = accentColor;
      ctx.fill();

      roundRectPath(ctx, 2, 2, 996, 996, 80);
      ctx.strokeStyle = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Grupo HERO: Tenedor y cuchara superiores
      withGroupTransform(ctx, data, "hero", 500, 120, function () {
        ctx.save();
        ctx.fillStyle = headerContentColor;

        roundRectPath(ctx, 442, 42, 9, 48, 4);
        ctx.fill();
        roundRectPath(ctx, 461, 42, 9, 48, 4);
        ctx.fill();
        roundRectPath(ctx, 480, 42, 9, 48, 4);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(442, 82);
        ctx.lineTo(489, 82);
        ctx.quadraticCurveTo(489, 114, 474, 118);
        ctx.lineTo(478, 194);
        ctx.quadraticCurveTo(465, 204, 453, 194);
        ctx.lineTo(457, 118);
        ctx.quadraticCurveTo(442, 114, 442, 82);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(536, 78, 25, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(527, 108);
        ctx.lineTo(545, 108);
        ctx.lineTo(549, 194);
        ctx.quadraticCurveTo(536, 204, 523, 194);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Grupo NFC: Ilustración teléfono y mano (+ texto en arco cuando se arrastra junto)
      withGroupTransform(ctx, data, "nfc", 338, 720, function () {
        drawUnifiedMenuNfcIllustration(ctx, 338, 732, 0.96, textColor, darkBg ? bgColor : "#FFFFFF");
        drawArcText(
          ctx,
          data.arcText || data.menuTapText || "TAP YOUR PHONE",
          3,
          342,
          795,
          228,
          (-126 * Math.PI) / 180,
          (-54 * Math.PI) / 180,
          33,
          textColor
        );
      });
    }

    if (showText) {
      withGroupTransform(ctx, data, "title", 500, 315, function () {
        ctx.save();
        ctx.textAlign = "center";

        ctx.fillStyle = headerContentColor;
        ctx.font = "800 124px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillText(data.titleMain || data.menuTitle || "MENU", 500, 322);

        ctx.font = "400 34px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillText(data.subtitle || data.menuSubtitle || "VIEW OUR MENU ONLINE", 500, 386);
        ctx.restore();
      });
    }

    if (showQr) {
      withGroupTransform(ctx, data, "qr", 760, 714, function () {
        const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
        const captionMode = data.qrCaptionMode || "bottom-text-id";
        const isClean = captionMode === "clean";
        const boxSize = isClean ? 248 : 232;
        const boxX = 760 - boxSize / 2;
        const boxY = isClean ? 580 : 598;
        const qrPad = 18;
        const qrSize = boxSize - qrPad * 2;

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        roundRectPath(ctx, boxX, boxY, boxSize, boxSize, 16);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.restore();

        roundRectPath(ctx, boxX, boxY, boxSize, boxSize, 16);
        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 3;
        ctx.stroke();

        drawQrMatrix(
          ctx,
          targetUrl,
          boxX + qrPad,
          boxY + qrPad,
          qrSize,
          buildQrOptionsFromData("menu", data, "#1B1A1A", false)
        );

        // Si el usuario elige "QR Clean", ocultamos todo texto alrededor del QR
        if (!isClean) {
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = textColor;
          ctx.font = "500 25px 'Plus Jakarta Sans', Arial, sans-serif";
          ctx.fillText("OR", 760, 542);
          ctx.font = "800 29px 'Plus Jakarta Sans', Arial, sans-serif";
          ctx.fillText((data.qrCaptionText || "SCAN QR").toUpperCase(), 760, 578);

          if (captionMode === "bottom-text-id") {
            ctx.fillStyle = textColor;
            ctx.globalAlpha = 0.82;
            ctx.font = "600 21px 'JetBrains Mono', monospace";
            ctx.fillText((data.slug || "TAG-ID").toUpperCase(), 760, 868);
          }
          ctx.restore();
        }
      });
    }

    if (showBrand) {
      withGroupTransform(ctx, data, "brand", 500, 945, function () {
        drawPoweredByBlueCodeFooter(ctx, 500, 954, {
          lowercase: true,
          fontSize: 27,
          brandFontSize: 30,
          logoHeight: 33,
          prefixColor: darkBg ? "rgba(255,255,255,0.78)" : "#222222",
          brandColor: darkBg ? "#FFFFFF" : "#0F172A"
        });
      });
    }

    if (!layerFilter || layerFilter === "all") {
      drawSelectionOverlayIfActive(ctx, "menu", data);
    }

    ctx.restore();
  }

  function renderPlaqueToCanvas(canvas, motif, widthPx, heightPx, data, layerFilter) {
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, widthPx, heightPx);

    if (motif === "google") {
      renderGooglePlaque(ctx, widthPx, heightPx, data, layerFilter);
    } else if (motif === "instagram") {
      renderInstagramPlaque(ctx, widthPx, heightPx, data, layerFilter);
    } else {
      renderMenuPlaque(ctx, widthPx, heightPx, data, layerFilter);
    }
  }

  // ============================================================================
  // EXPORTADOR DIRECTO A ARCHIVO .PSD MULTICAPA EN ALTA RESOLUCIÓN
  // ============================================================================
  function exportLayeredPsdFile(motif, cfg, widthCm, heightCm, notifyFn, customDpi) {
    if (!window.agPsd || !window.agPsd.writePsd) {
      if (notifyFn) notifyFn("Cargando motor Photoshop (.PSD), intenta de nuevo en 1 segundo.");
      return false;
    }
    const cleanCfg = Object.assign({}, cfg, { __activeDragGroup: null });
    const dpi = customDpi ? Math.min(customDpi, 300) : 300;
    const W = Math.round((widthCm / 2.54) * dpi);
    const H = Math.round((heightCm / 2.54) * dpi);

    function makeLayerCanvas(filterName) {
      const c = document.createElement("canvas");
      renderPlaqueToCanvas(c, motif, W, H, cleanCfg, filterName);
      return c;
    }

    const psd = {
      width: W,
      height: H,
      imageResources: {
        resolutionInfo: {
          horizontalResolution: dpi,
          horizontalResolutionUnit: "PPI",
          widthUnit: "Centimeters",
          verticalResolution: dpi,
          verticalResolutionUnit: "PPI",
          heightUnit: "Centimeters"
        }
      },
      children: [
        { name: "1_Fondo_y_Marco", canvas: makeLayerCanvas("bg") },
        { name: "2_Iconos_NFC_Menu_Unificado", canvas: makeLayerCanvas("icons") },
        { name: "3_Powered_By_BlueCode", canvas: makeLayerCanvas("brand") },
        { name: "4_Textos_Principales", canvas: makeLayerCanvas("text") },
        { name: "5_Codigo_QR_Personalizado", canvas: makeLayerCanvas("qr") }
      ]
    };

    const compositeCanvas = document.createElement("canvas");
    renderPlaqueToCanvas(compositeCanvas, motif, W, H, cleanCfg, "all");
    psd.canvas = compositeCanvas;

    const buffer = window.agPsd.writePsd(psd);
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Placa_BlueCode_" + motif.toUpperCase() + "_" + (cfg.slug || "TAG") + "_" + widthCm + "x" + heightCm + "cm.psd";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    if (notifyFn) notifyFn("Archivo Photoshop .PSD multicapa (" + widthCm + "×" + heightCm + " cm) descargado.");
    return true;
  }

  // ============================================================================
  // EXPORTADOR A PDF INDIVIDUAL O MASIVO EN ULTRA ALTA CALIDAD (600 DPI)
  // ============================================================================
  function exportPlaquesToPdf(queueItems, widthCm, heightCm, pdfMode, notifyFn, customDpi, customFileName) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("La librería PDF aún está cargando. Intenta en 1 segundo.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const dpi = customDpi || 600;
    const pxW = Math.min(2800, Math.round((widthCm / 2.54) * dpi));
    const pxH = Math.min(2800, Math.round((heightCm / 2.54) * dpi));

    const workCanvas = document.createElement("canvas");
    const expanded = [];
    const cacheByMotif = {};

    for (let i = 0; i < queueItems.length; i++) {
      const raw = queueItems[i];
      const motif = raw.motif;
      const cfg = Object.assign({}, raw.cfg || raw, { __activeDragGroup: null });
      const copies = raw.copies || 1;
      const cacheKey = JSON.stringify(cfg);

      if (!cacheByMotif[cacheKey]) {
        renderPlaqueToCanvas(workCanvas, motif, pxW, pxH, cfg, "all");
        cacheByMotif[cacheKey] = workCanvas.toDataURL("image/png", 1.0);
      }

      for (let c = 0; c < copies; c++) {
        expanded.push({
          motif: motif,
          slug: cfg.slug || motif.toUpperCase(),
          imgData: cacheByMotif[cacheKey]
        });
      }
    }

    if (expanded.length === 0) {
      if (notifyFn) notifyFn("Selecciona al menos una placa para exportar.");
      return;
    }

    if (pdfMode === "exact") {
      const orient = widthCm > heightCm ? "l" : "p";
      const doc = new jsPDF({
        orientation: orient,
        unit: "cm",
        format: [widthCm, heightCm],
        compress: true
      });

      for (let i = 0; i < expanded.length; i++) {
        if (i > 0) {
          doc.addPage([widthCm, heightCm], orient);
        }
        doc.addImage(expanded[i].imgData, "PNG", 0, 0, widthCm, heightCm);
      }

      const outName = customFileName || ("Placas_BlueCode_" + widthCm + "x" + heightCm + "cm_" + dpi + "DPI_1a1.pdf");
      doc.save(outName);
      if (notifyFn) notifyFn("¡PDF Ultra-HD (" + widthCm + "×" + heightCm + " cm @ " + dpi + " DPI) descargado!");
      return;
    }

    // Modo Hoja de Impresión con Guías de Corte
    const pageW = widthCm > 19 ? 29.7 : 21.0;
    const pageH = heightCm > 26 ? 42.0 : 29.7;
    const margin = 1.0;
    const gap = 0.6;

    const cols = Math.max(1, Math.floor((pageW - margin * 2 + gap) / (widthCm + gap)));
    const rows = Math.max(1, Math.floor((pageH - margin * 2 - 1.0 + gap) / (heightCm + gap)));
    const perPage = cols * rows;

    const doc = new jsPDF({
      orientation: pageW > pageH ? "l" : "p",
      unit: "cm",
      format: [pageW, pageH],
      compress: true
    });

    const totalGridW = cols * widthCm + (cols - 1) * gap;
    const startX = Math.max(margin, (pageW - totalGridW) / 2);
    const startY = margin + 1.1;

    for (let idx = 0; idx < expanded.length; idx++) {
      const slot = idx % perPage;
      if (idx > 0 && slot === 0) {
        doc.addPage([pageW, pageH], pageW > pageH ? "l" : "p");
      }

      if (slot === 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(20, 20, 20);
        doc.text(
          "BlueCode — Placas NFC & QR | Medida Real: " + widthCm + " x " + heightCm + " cm (" + dpi + " DPI Ultra-HD - Imprimir al 100%)",
          pageW / 2,
          margin + 0.4,
          { align: "center" }
        );
      }

      const col = slot % cols;
      const row = Math.floor(slot / cols);
      const x = startX + col * (widthCm + gap);
      const y = startY + row * (heightCm + gap);

      doc.addImage(expanded[idx].imgData, "PNG", x, y, widthCm, heightCm);

      doc.setDrawColor(130, 130, 130);
      doc.setLineWidth(0.02);
      const cmLen = 0.25;
      doc.line(x - cmLen, y, x, y);
      doc.line(x, y - cmLen, x, y);
      doc.line(x + widthCm, y, x + widthCm + cmLen, y);
      doc.line(x + widthCm, y - cmLen, x + widthCm, y);
      doc.line(x - cmLen, y + heightCm, x, y + heightCm);
      doc.line(x, y + heightCm, x, y + heightCm + cmLen);
      doc.line(x + widthCm, y + heightCm, x + widthCm + cmLen, y + heightCm);
      doc.line(x + widthCm, y + heightCm, x + widthCm, y + heightCm + cmLen);
    }

    const outName = customFileName || ("Placas_BlueCode_HojaImpresion_" + widthCm + "x" + heightCm + "cm_" + dpi + "DPI.pdf");
    doc.save(outName);
    if (notifyFn) notifyFn("¡PDF Ultra-HD (" + expanded.length + " placa(s) @ " + dpi + " DPI) descargado!");
  }

  // Exporta un único código QR personalizado a un PDF individual (listo para imprenta)
  function exportSingleQrCanvasToPdf(qrCanvas, slug, sizeCm, notifyFn) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("La librería PDF aún está cargando.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const cm = sizeCm || 8;
    const doc = new jsPDF({
      orientation: "p",
      unit: "cm",
      format: [cm, cm],
      compress: true
    });
    const imgData = qrCanvas.toDataURL("image/png", 1.0);
    doc.addImage(imgData, "PNG", 0, 0, cm, cm);
    doc.save("QR_Individual_BlueCode_" + (slug || "TAG") + "_" + cm + "x" + cm + "cm.pdf");
    if (notifyFn) notifyFn("¡PDF Individual del QR (" + cm + "×" + cm + " cm) descargado!");
  }

  window.BlueCodePlaqueStudio = {
    cmToPx: cmToPx,
    cmToPx300: cmToPx300,
    drawBlueCodeLogo: drawBlueCodeLogo,
    drawQrMatrix: drawQrMatrix,
    setCustomQrLogoImage: setCustomQrLogoImage,
    getTransformedHitBoxes: getTransformedHitBoxes,
    renderPlaqueToCanvas: renderPlaqueToCanvas,
    exportLayeredPsdFile: exportLayeredPsdFile,
    exportPlaquesToPdf: exportPlaquesToPdf,
    exportSingleQrCanvasToPdf: exportSingleQrCanvasToPdf
  };
})();
