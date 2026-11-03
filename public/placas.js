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
    ],
    bluecode: [
      { id: "qr", label: "Código QR", x: 585, y: 545, w: 280, h: 340, cx: 725, cy: 715 },
      { id: "nfc", label: "Ilustración NFC", x: 145, y: 535, w: 335, h: 335, cx: 310, cy: 730 },
      { id: "hero", label: "Logo BlueCode", x: 130, y: 205, w: 215, h: 145, cx: 238, cy: 275 },
      { id: "title", label: "Título BLUE CODE", x: 350, y: 205, w: 530, h: 145, cx: 615, cy: 275 },
      { id: "brand", label: "Sello BlueCode", x: 260, y: 910, w: 480, h: 70, cx: 500, cy: 948 }
    ],
    comida1: [
      { id: "qr", label: "Código QR", x: 620, y: 515, w: 280, h: 365, cx: 760, cy: 714 },
      { id: "nfc", label: "Ilustración NFC", x: 145, y: 540, w: 370, h: 330, cx: 338, cy: 720 },
      { id: "hero", label: "Icono Burger & Fries", x: 365, y: 30, w: 270, h: 175, cx: 500, cy: 118 },
      { id: "title", label: "Título BURGER & CO.", x: 110, y: 215, w: 780, h: 175, cx: 500, cy: 305 },
      { id: "brand", label: "Sello BlueCode", x: 260, y: 910, w: 480, h: 70, cx: 500, cy: 945 }
    ],
    comida2: [
      { id: "qr", label: "Código QR", x: 620, y: 515, w: 280, h: 365, cx: 760, cy: 714 },
      { id: "nfc", label: "Ilustración NFC", x: 145, y: 540, w: 370, h: 330, cx: 338, cy: 720 },
      { id: "hero", label: "Icono Burger & Fries", x: 365, y: 30, w: 270, h: 175, cx: 500, cy: 118 },
      { id: "title", label: "Título BURGER & CO.", x: 110, y: 215, w: 780, h: 175, cx: 500, cy: 305 },
      { id: "brand", label: "Sello BlueCode", x: 260, y: 910, w: 480, h: 70, cx: 500, cy: 945 }
    ],
    leburre: [
      { id: "qr", label: "Código QR", x: 588, y: 538, w: 264, h: 322, cx: 720, cy: 690 },
      { id: "nfc", label: "Ilustración NFC", x: 92, y: 538, w: 380, h: 318, cx: 280, cy: 690 },
      { id: "hero", label: "Mascota Le Burré", x: 398, y: 20, w: 204, h: 204, cx: 500, cy: 122 },
      { id: "title", label: "Título LE BURRÉ", x: 150, y: 230, w: 700, h: 222, cx: 500, cy: 330 },
      { id: "brand", label: "Sello BlueCode", x: 290, y: 902, w: 420, h: 62, cx: 500, cy: 934 }
    ]
  };

  let customQrLogoImage = null;
  const customHeaderBgImages = { global: null };
  let onAssetsReadyCallback = null;

  const headerAssets = {
    comida1: typeof Image !== "undefined" ? new Image() : null,
    comida2: typeof Image !== "undefined" ? new Image() : null,
    burgerIcon: typeof Image !== "undefined" ? new Image() : null,
    leburreLogo: typeof Image !== "undefined" ? new Image() : null,
    leburreBg: typeof Image !== "undefined" ? new Image() : null,
    leburreGreca: typeof Image !== "undefined" ? new Image() : null,
    leburreEmblema: typeof Image !== "undefined" ? new Image() : null
  };

  function notifyAssetsReady() {
    if (typeof onAssetsReadyCallback === "function") {
      onAssetsReadyCallback();
    }
  }

  if (headerAssets.comida1) {
    headerAssets.comida1.onload = notifyAssetsReady;
    headerAssets.comida1.src = "/header_comida1.png?v=2";
  }
  if (headerAssets.comida2) {
    headerAssets.comida2.onload = notifyAssetsReady;
    headerAssets.comida2.src = "/header_comida2.png?v=2";
  }
  if (headerAssets.burgerIcon) {
    headerAssets.burgerIcon.onload = notifyAssetsReady;
    headerAssets.burgerIcon.src = "/icon_burger_fries.png?v=2";
  }
  if (headerAssets.leburreLogo) {
    headerAssets.leburreLogo.onload = notifyAssetsReady;
    headerAssets.leburreLogo.src = "/logo_leburre.png?v=1";
  }
  if (headerAssets.leburreBg) {
    headerAssets.leburreBg.onload = notifyAssetsReady;
    headerAssets.leburreBg.src = "/bg_leburre.png?v=1";
  }
  if (headerAssets.leburreGreca) {
    headerAssets.leburreGreca.onload = notifyAssetsReady;
    headerAssets.leburreGreca.src = "/greca_leburre.png?v=1";
  }
  if (headerAssets.leburreEmblema) {
    headerAssets.leburreEmblema.onload = notifyAssetsReady;
    headerAssets.leburreEmblema.src = "/emblema_leburre.png?v=1";
  }

  function setOnAssetsLoaded(fn) {
    onAssetsReadyCallback = fn;
  }

  function setCustomQrLogoImage(imgElementOrNull) {
    customQrLogoImage = imgElementOrNull || null;
  }

  function setCustomHeaderBgImage(motifOrGlobal, imgElementOrNull) {
    const key = motifOrGlobal || "global";
    customHeaderBgImages[key] = imgElementOrNull || null;
    if (imgElementOrNull) {
      customHeaderBgImages.global = imgElementOrNull;
    }
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

  // Luminancia relativa WCAG de un color hex (0 = negro, 1 = blanco)
  function hexRelativeLuminance(hex) {
    const clean = String(hex || "").replace("#", "").trim();
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
    const ch = [0, 2, 4].map(function (i) {
      const v = parseInt(clean.substring(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  /**
   * Guardián de escaneabilidad: los lectores QR necesitan tinta oscura sobre fondo claro.
   * Si el color elegido no alcanza `minRatio` de contraste contra blanco, se oscurece
   * conservando el tono (ej: Oro Maíz #F2B705 → oro tostado legible).
   */
  function ensureQrInkContrast(hex, minRatio) {
    const target = minRatio || 4.5;
    const lum = hexRelativeLuminance(hex);
    if (lum === null) return hex;
    if (1.05 / (lum + 0.05) >= target) return hex;
    const clean = hex.replace("#", "");
    let r = parseInt(clean.substring(0, 2), 16);
    let g = parseInt(clean.substring(2, 4), 16);
    let b = parseInt(clean.substring(4, 6), 16);
    for (let i = 0; i < 40; i++) {
      r = Math.round(r * 0.94);
      g = Math.round(g * 0.94);
      b = Math.round(b * 0.94);
      const out = "#" + [r, g, b].map(function (v) { return v.toString(16).padStart(2, "0"); }).join("");
      if (1.05 / (hexRelativeLuminance(out) + 0.05) >= target) return out;
    }
    return "#111111";
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

  function drawBurgerBadgeIcon(ctx, cx, cy, size, fillCol) {
    ctx.save();
    const s = size / 100;
    ctx.translate(cx, cy);
    ctx.scale(s, s);
    ctx.fillStyle = fillCol || "#843511";
    ctx.strokeStyle = fillCol || "#843511";

    // Pan superior (domo)
    ctx.beginPath();
    ctx.arc(0, -4, 34, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Semillas de sésamo blancas en el pan superior
    ctx.fillStyle = "#FFFFFF";
    const seeds = [[-13, -21], [0, -25], [13, -21], [-6, -13], [7, -13]];
    for (let i = 0; i < seeds.length; i++) {
      ctx.beginPath();
      ctx.arc(seeds[i][0], seeds[i][1], 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lechuga / queso ondulado
    ctx.beginPath();
    ctx.moveTo(-36, 3);
    ctx.quadraticCurveTo(-24, -2, -18, 4);
    ctx.quadraticCurveTo(-12, 9, -6, 3);
    ctx.quadraticCurveTo(0, -2, 6, 4);
    ctx.quadraticCurveTo(12, 10, 18, 4);
    ctx.quadraticCurveTo(24, -2, 36, 3);
    ctx.lineWidth = 5.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Carne (patty)
    ctx.fillStyle = fillCol || "#843511";
    roundRectPath(ctx, -35, 10, 70, 11, 5.5);
    ctx.fill();

    // Pan inferior
    roundRectPath(ctx, -32, 24, 64, 11, [3, 3, 7, 7]);
    ctx.fill();

    ctx.restore();
  }

  // Icono vectorial grande de Hamburguesa + Papas Fritas para el encabezado de Comida 1 y 2
  function drawBurgerFriesHeroIcon(ctx, cx, cy, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = color || "#FFFFFF";
    ctx.strokeStyle = color || "#FFFFFF";
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    // --- HAMBURGUESA IZQUIERDA (x: -115 a +10) ---
    // Domo pan superior
    ctx.beginPath();
    ctx.arc(-52, -18, 62, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Semillas (recortadas en color oscuro)
    ctx.save();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#221818";
    const hSeeds = [[-76, -52], [-52, -60], [-28, -52], [-64, -36], [-40, -36]];
    for (let i = 0; i < hSeeds.length; i++) {
      ctx.beginPath();
      ctx.arc(hSeeds[i][0], hSeeds[i][1], 4.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Lechuga ondulada
    ctx.beginPath();
    ctx.moveTo(-114, -4);
    ctx.quadraticCurveTo(-98, -12, -82, -2);
    ctx.quadraticCurveTo(-66, 8, -52, -3);
    ctx.quadraticCurveTo(-36, -12, -20, -2);
    ctx.quadraticCurveTo(-6, 8, 8, -3);
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();

    // Carne
    roundRectPath(ctx, -114, 12, 124, 20, 10);
    ctx.fill();

    // Pan inferior
    roundRectPath(ctx, -110, 40, 118, 24, [4, 4, 14, 14]);
    ctx.fill();

    // --- PAPAS FRITAS DERECHA (x: +16 a +115) ---
    const fries = [
      { x: 24, y: -62, w: 11, h: 48, rot: -0.14 },
      { x: 40, y: -76, w: 11, h: 58, rot: -0.06 },
      { x: 56, y: -84, w: 12, h: 64, rot: 0 },
      { x: 73, y: -76, w: 11, h: 58, rot: 0.06 },
      { x: 89, y: -62, w: 11, h: 48, rot: 0.14 }
    ];
    for (let f = 0; f < fries.length; f++) {
      ctx.save();
      ctx.translate(fries[f].x + fries[f].w / 2, fries[f].y + fries[f].h);
      ctx.rotate(fries[f].rot);
      roundRectPath(ctx, -fries[f].w / 2, -fries[f].h, fries[f].w, fries[f].h, 4);
      ctx.fill();
      ctx.restore();
    }

    // Caja de papas fritas
    ctx.beginPath();
    ctx.moveTo(14, -20);
    ctx.lineTo(36, -20);
    ctx.quadraticCurveTo(64, 4, 92, -20);
    ctx.lineTo(114, -20);
    ctx.lineTo(104, 62);
    ctx.quadraticCurveTo(64, 54, 24, 62);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // ============================================================================
  // LIBRERÍA UNIVERSAL DE ICONOS VECTORIALES (PARA CABECERA Y CENTRO DEL QR)
  // Soporta: menu, burger, pizza, coffee, cocktail, icecream, barber, store,
  //          wifi, whatsapp, instagram, tiktok, google, bluecode, star, custom
  // ============================================================================
  function drawLibraryVectorGlyph(ctx, type, cx, cy, size, fgColor, cutoutColor) {
    const col = fgColor || "#FFFFFF";
    const cut = cutoutColor || "#1B1A1A";
    const s = size / 100;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(s, s);
    ctx.fillStyle = col;
    ctx.strokeStyle = col;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (type === "pizza") {
      // Porción de pizza triangular con borde de queso y pepperonis
      ctx.beginPath();
      ctx.moveTo(0, 38);
      ctx.lineTo(-34, -24);
      ctx.quadraticCurveTo(0, -40, 34, -24);
      ctx.closePath();
      ctx.fill();

      // Línea separadora del borde superior (corteza)
      ctx.strokeStyle = cut;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.quadraticCurveTo(0, -26, 29, -14);
      ctx.moveTo(-29, -14);
      ctx.quadraticCurveTo(0, -26, 29, -14);
      ctx.stroke();

      // Pepperonis recortados
      ctx.fillStyle = cut;
      const peps = [[-10, -4, 6.5], [11, -6, 6], [0, 12, 6.5], [-6, 23, 4.5]];
      for (let i = 0; i < peps.length; i++) {
        ctx.beginPath();
        ctx.arc(peps[i][0], peps[i][1], peps[i][2], 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === "coffee") {
      // Taza de café caliente con plato y ondas de vapor
      // Vapor superior
      ctx.lineWidth = 5.5;
      const steamX = [-14, 0, 14];
      for (let i = 0; i < steamX.length; i++) {
        const sx = steamX[i];
        ctx.beginPath();
        ctx.moveTo(sx, -16);
        ctx.quadraticCurveTo(sx - 5, -26, sx, -34);
        ctx.quadraticCurveTo(sx + 5, -40, sx, -46);
        ctx.stroke();
      }
      // Asa derecha
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(24, 4, 12, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      // Cuerpo de la taza
      ctx.beginPath();
      ctx.moveTo(-28, -10);
      ctx.lineTo(24, -10);
      ctx.lineTo(20, 14);
      ctx.quadraticCurveTo(18, 28, 0, 28);
      ctx.quadraticCurveTo(-22, 28, -24, 14);
      ctx.closePath();
      ctx.fill();
      // Plato inferior
      roundRectPath(ctx, -36, 33, 68, 7, 3.5);
      ctx.fill();
    } else if (type === "cocktail") {
      // Copa Martini / Bar con rodaja cítrica y aceituna
      // Rodaja en el borde
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.arc(24, -28, 12, 0, Math.PI * 2);
      ctx.stroke();
      // Copa triangular
      ctx.beginPath();
      ctx.moveTo(-34, -26);
      ctx.lineTo(34, -26);
      ctx.lineTo(0, 12);
      ctx.closePath();
      ctx.fill();
      // Palillo con aceituna
      ctx.strokeStyle = cut;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-10, -22);
      ctx.lineTo(6, -2);
      ctx.stroke();
      ctx.fillStyle = cut;
      ctx.beginPath();
      ctx.arc(-2, -12, 5, 0, Math.PI * 2);
      ctx.fill();
      // Tallo y base de la copa
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, 38);
      ctx.stroke();
      roundRectPath(ctx, -22, 35, 44, 7, 3.5);
      ctx.fill();
    } else if (type === "icecream") {
      // Cono de helado con bolas y cereza
      // Cono inferior
      ctx.beginPath();
      ctx.moveTo(-20, 4);
      ctx.lineTo(20, 4);
      ctx.lineTo(0, 44);
      ctx.closePath();
      ctx.fill();
      // Textura waffle en el cono
      ctx.strokeStyle = cut;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-12, 10);
      ctx.lineTo(8, 28);
      ctx.moveTo(12, 10);
      ctx.lineTo(-8, 28);
      ctx.stroke();
      // Bolas de helado
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(-12, -4, 15, 0, Math.PI * 2);
      ctx.arc(12, -4, 15, 0, Math.PI * 2);
      ctx.arc(0, -18, 17, 0, Math.PI * 2);
      ctx.fill();
      // Cereza arriba
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(0, -37, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = col;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.quadraticCurveTo(10, -48, 14, -44);
      ctx.stroke();
    } else if (type === "barber") {
      // Tijeras de barbería cruzadas
      ctx.lineWidth = 7;
      // Hoja 1
      ctx.beginPath();
      ctx.moveTo(-24, 18);
      ctx.lineTo(26, -34);
      ctx.stroke();
      // Hoja 2
      ctx.beginPath();
      ctx.moveTo(24, 18);
      ctx.lineTo(-26, -34);
      ctx.stroke();
      // Aros de los dedos
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(-24, 28, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(24, 28, 12, 0, Math.PI * 2);
      ctx.stroke();
      // Tornillo central
      ctx.fillStyle = cut;
      ctx.beginPath();
      ctx.arc(0, -6, 3.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "store") {
      // Bolsa de compras / Tienda con estrella central
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(0, -18, 15, Math.PI, 0, false);
      ctx.stroke();
      roundRectPath(ctx, -30, -18, 60, 56, [6, 6, 14, 14]);
      ctx.fill();
      drawStar(ctx, 0, 10, 14, 6.5, cut);
    } else if (type === "tiktok") {
      // Nota musical estilo TikTok
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(6, -34);
      ctx.lineTo(6, 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8, 16, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, -34);
      ctx.quadraticCurveTo(12, -16, 30, -14);
      ctx.stroke();
    } else if (type === "wifi") {
      ctx.lineWidth = 8;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 24, i * 19, -Math.PI * 0.78, -Math.PI * 0.22);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 26, 7.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "whatsapp") {
      // Burbuja de chat con teléfono adentro
      ctx.beginPath();
      ctx.arc(0, -2, 34, 0.18 * Math.PI, 1.92 * Math.PI, false);
      ctx.lineTo(28, 28);
      ctx.lineTo(10, 24);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = cut;
      ctx.lineWidth = 7.5;
      ctx.beginPath();
      ctx.arc(0, -2, 16, 0.15 * Math.PI, 1.35 * Math.PI);
      ctx.stroke();
    } else if (type === "instagram") {
      ctx.lineWidth = 7.5;
      roundRectPath(ctx, -32, -32, 64, 64, 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(18, -18, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "burrito") {
      // Burrito cilíndrico artesanal enrollado con marcas de grill al comal
      roundRectPath(ctx, -18, -32, 36, 64, 18);
      ctx.fill();
      ctx.strokeStyle = cut;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-14, -12);
      ctx.lineTo(14, -6);
      ctx.moveTo(-14, 4);
      ctx.lineTo(14, 10);
      ctx.moveTo(-14, 20);
      ctx.lineTo(14, 26);
      ctx.stroke();
    } else if (type === "taco") {
      // Taco mexicano semicircular doblado al comal con relleno artesanal
      ctx.beginPath();
      ctx.arc(0, 10, 34, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = cut;
      ctx.beginPath();
      ctx.arc(-14, -6, 5, 0, Math.PI * 2);
      ctx.arc(0, -10, 6, 0, Math.PI * 2);
      ctx.arc(14, -6, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "pepper" || type === "chili") {
      // Ají / Chile picante mexicano con curvatura y llama de fuego
      ctx.beginPath();
      ctx.moveTo(-6, -26);
      ctx.bezierCurveTo(24, -18, 28, 12, 10, 32);
      ctx.bezierCurveTo(-14, 28, -26, 4, -12, -24);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = cut;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-6, -26);
      ctx.quadraticCurveTo(-14, -36, -2, -40);
      ctx.stroke();
    } else if (type === "google") {
      drawStar(ctx, 0, 0, 34, 15, col);
    } else if (type === "star") {
      drawStar(ctx, 0, 0, 36, 16, col);
    } else {
      // Por defecto: Cubiertos (menu)
      roundRectPath(ctx, -24, -34, 5, 26, 2.5);
      ctx.fill();
      roundRectPath(ctx, -15, -34, 5, 26, 2.5);
      ctx.fill();
      roundRectPath(ctx, -6, -34, 5, 26, 2.5);
      ctx.fill();
      roundRectPath(ctx, -24, -12, 23, 12, 5);
      ctx.fill();
      roundRectPath(ctx, -16, -2, 8, 36, 4);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(16, -18, 12, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      roundRectPath(ctx, 12, -4, 8, 38, 4);
      ctx.fill();
    }

    ctx.restore();
  }

  // Dibuja cualquier icono de la librería dentro del centro del QR
  function drawExtendedBadgeIcon(ctx, type, cx, cy, size, mainFill) {
    const r = size * 0.46;
    if (type === "leburre") {
      const leburreLogoImg = headerAssets.leburreLogo;
      if (leburreLogoImg && leburreLogoImg.complete && leburreLogoImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = "#FAF6EE";
        ctx.fill();
        ctx.clip();
        ctx.drawImage(leburreLogoImg, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
        return;
      }
    }
    const badgeColors = {
      leburre: "#7A0C0C",
      burrito: "#D97706",
      taco: "#B45309",
      pepper: "#DC2626",
      pizza: "#D9381E",
      coffee: "#6F4E37",
      cocktail: "#7C3AED",
      icecream: "#EC4899",
      barber: "#1E293B",
      store: "#0D9488",
      tiktok: "#111111"
    };
    const bgCol = badgeColors[type] || (typeof mainFill === "string" ? mainFill : "#1B1A1A");
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = bgCol;
    ctx.fill();
    drawLibraryVectorGlyph(ctx, type, cx, cy, size * 0.72, "#FFFFFF", bgCol);
    ctx.restore();
  }

  // Dibuja cualquier icono de la librería como Icono Hero Superior de una placa
  function drawCustomHeroIconOverride(ctx, heroIcon, cx, cy, color, cutoutColor) {
    if (!heroIcon || heroIcon === "none") return;
    if (heroIcon === "leburre") {
      const leburreLogoImg = headerAssets.leburreLogo;
      const hasLeburre = Boolean(leburreLogoImg && leburreLogoImg.complete && leburreLogoImg.naturalWidth > 0);
      if (hasLeburre) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.52)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;
        const r = 84;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = cutoutColor || "#F2B705";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = "#FAF6EE";
        ctx.fill();
        ctx.clip();
        ctx.drawImage(leburreLogoImg, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
        return;
      }
    }
    if (heroIcon === "burger") {
      const burgerIconImg = headerAssets.burgerIcon;
      const hasBurgerIcon = Boolean(burgerIconImg && burgerIconImg.complete && burgerIconImg.naturalWidth > 0);
      if (hasBurgerIcon && color === "#FFFFFF") {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.48)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
        ctx.drawImage(burgerIconImg, cx - 130, cy - 85, 260, 170);
        ctx.restore();
      } else {
        drawBurgerFriesHeroIcon(ctx, cx, cy + 8, color);
      }
      return;
    }
    if (heroIcon === "bluecode") {
      drawBlueCodeLogo(ctx, cx - 95, cy - 52, 104);
      return;
    }
    if (heroIcon === "custom" && customQrLogoImage) {
      ctx.save();
      const s = 148;
      ctx.shadowColor = "rgba(0,0,0,0.32)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      ctx.drawImage(customQrLogoImage, cx - s / 2, cy - s / 2, s, s);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    drawLibraryVectorGlyph(ctx, heroIcon, cx, cy, 165, color, cutoutColor || "#1B1A1A");
    ctx.restore();
  }

  // Dibuja el Fondo Superior (Cabecera en Onda) Reemplazable en cualquier plantilla
  // flatBottomY (opcional): cabecera rectangular hasta esa Y en lugar de onda (la usa Le Burré)
  function drawReplaceableWaveHeader(ctx, motif, data, defaultAccent, defaultSubWave, flatBottomY) {
    const mode = data.headerBgMode || "original";
    const accentColor = data.accentColor || defaultAccent || "#1B1A1A";
    const subWave = defaultSubWave || "#DCE8F3";

    function traceSubWavePath() {
      ctx.beginPath();
      if (flatBottomY) {
        ctx.rect(0, 0, 1000, flatBottomY);
        return;
      }
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 492);
      ctx.bezierCurveTo(760, 505, 520, 365, 0, 542);
      ctx.closePath();
    }

    function traceMainWavePath() {
      ctx.beginPath();
      if (flatBottomY) {
        ctx.rect(0, 0, 1000, flatBottomY);
        return;
      }
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 472);
      ctx.bezierCurveTo(760, 485, 520, 342, 0, 520);
      ctx.closePath();
    }

    function drawImageCoverInWave(img, overlayAlpha) {
      traceSubWavePath();
      ctx.fillStyle = "#FAD9C8";
      ctx.fill();

      ctx.save();
      traceMainWavePath();
      ctx.clip();
      const targetW = 1000;
      const targetH = 525;
      const iw = img.naturalWidth || img.width || 1000;
      const ih = img.naturalHeight || img.height || 525;
      const scale = Math.max(targetW / iw, targetH / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (targetW - dw) / 2;
      const dy = (targetH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);

      if (overlayAlpha > 0) {
        const vig = ctx.createLinearGradient(0, 0, 0, targetH);
        vig.addColorStop(0, "rgba(0,0,0," + (overlayAlpha * 0.75).toFixed(2) + ")");
        vig.addColorStop(0.65, "rgba(0,0,0," + overlayAlpha.toFixed(2) + ")");
        vig.addColorStop(1, "rgba(0,0,0," + Math.min(0.85, overlayAlpha * 1.15).toFixed(2) + ")");
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, targetW, targetH);
      }
      ctx.restore();
    }

    // 1. Imagen personalizada subida por el usuario
    const customImg = customHeaderBgImages[motif] || customHeaderBgImages.global;
    if (mode === "custom-image" && customImg) {
      drawImageCoverInWave(customImg, 0.38);
      return true;
    }

    // 2. Fondos ilustrados de Comida 1 o Comida 2 elegidos explícitamente
    if (mode === "comida1" && headerAssets.comida1 && headerAssets.comida1.complete && headerAssets.comida1.naturalWidth > 0) {
      ctx.drawImage(headerAssets.comida1, 0, 0, 1000, 550);
      return true;
    }
    if (mode === "comida2" && headerAssets.comida2 && headerAssets.comida2.complete && headerAssets.comida2.naturalWidth > 0) {
      ctx.drawImage(headerAssets.comida2, 0, 0, 1000, 550);
      return true;
    }

    // 3. Fondo auténtico Le Burré (Carmesí Tex-Mex + Greca Mexicana)
    if (mode === "leburre") {
      traceSubWavePath();
      ctx.fillStyle = "#F2B705";
      ctx.fill();

      ctx.save();
      traceMainWavePath();
      ctx.clip();
      const grad = ctx.createLinearGradient(0, 0, 0, 480);
      grad.addColorStop(0, "#360505");
      grad.addColorStop(0.55, "#560808");
      grad.addColorStop(1, "#7A0C0C");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 525);

      if (headerAssets.leburreBg && headerAssets.leburreBg.complete && headerAssets.leburreBg.naturalWidth > 0) {
        ctx.globalAlpha = 0.35;
        ctx.drawImage(headerAssets.leburreBg, 0, 0, 1000, 525);
        ctx.globalAlpha = 1.0;
      }
      ctx.restore();

      if (headerAssets.leburreGreca && headerAssets.leburreGreca.complete && headerAssets.leburreGreca.naturalWidth > 0) {
        ctx.save();
        const gw = headerAssets.leburreGreca.naturalWidth || headerAssets.leburreGreca.width || 366;
        const gh = headerAssets.leburreGreca.naturalHeight || headerAssets.leburreGreca.height || 55;
        const tH = 26;
        const tW = (gw / gh) * tH;
        for (let x = 0; x < 1000; x += tW - 1) {
          ctx.drawImage(headerAssets.leburreGreca, x, 442, tW, tH);
        }
        ctx.restore();
      }
      return true;
    }

    // 4. Onda Neón BlueCode
    if (mode === "bluecode-glow") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 495);
      ctx.bezierCurveTo(660, 535, 350, 430, 0, 598);
      ctx.closePath();
      ctx.fillStyle = "#060A14";
      ctx.fill();

      ctx.save();
      ctx.clip();
      const glow = ctx.createRadialGradient(180, 110, 20, 220, 180, 540);
      glow.addColorStop(0, "rgba(8, 101, 245, 0.28)");
      glow.addColorStop(0.55, "rgba(8, 124, 245, 0.1)");
      glow.addColorStop(1, "rgba(6, 10, 20, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1000, 620);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-10, 599);
      ctx.bezierCurveTo(350, 431, 660, 536, 1010, 496);
      const waveGrad = ctx.createLinearGradient(0, 500, 1000, 500);
      waveGrad.addColorStop(0, "#0550C8");
      waveGrad.addColorStop(0.5, "#0865F5");
      waveGrad.addColorStop(1, "#08D0E6");
      ctx.strokeStyle = waveGrad;
      ctx.lineWidth = 10;
      ctx.shadowColor = "rgba(8, 101, 245, 0.55)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
      return true;
    }

    // 4. Degradados Premium para Cabecera Superior
    const gradients = {
      "dark-gold": { sub: "#F3E5AB", stops: [[0, "#0B0D13"], [0.6, "#1C1917"], [1, "#785A28"]] },
      "fire-ember": { sub: "#FED7AA", stops: [[0, "#7F1D1D"], [0.55, "#B91C1C"], [1, "#EA580C"]] },
      "coffee-warm": { sub: "#F5EBE6", stops: [[0, "#27150E"], [0.55, "#4A2511"], [1, "#7C3F1C"]] },
      "ig-sunset": { sub: "#FCE7F3", stops: [[0, "#F58529"], [0.45, "#DD2A7B"], [1, "#8134AF"]] },
      "emerald-fresh": { sub: "#D1FAE5", stops: [[0, "#064E3B"], [0.55, "#047857"], [1, "#0D9488"]] }
    };

    if (gradients[mode]) {
      const gCfg = gradients[mode];
      traceSubWavePath();
      ctx.fillStyle = gCfg.sub;
      ctx.fill();

      traceMainWavePath();
      const grad = ctx.createLinearGradient(0, 0, 1000, 480);
      for (let i = 0; i < gCfg.stops.length; i++) {
        grad.addColorStop(gCfg.stops[i][0], gCfg.stops[i][1]);
      }
      ctx.fillStyle = grad;
      ctx.fill();
      return true;
    }

    if (mode === "solid-custom") {
      traceSubWavePath();
      ctx.fillStyle = subWave;
      ctx.fill();

      traceMainWavePath();
      ctx.fillStyle = accentColor;
      ctx.fill();
      return true;
    }

    return false;
  }

  // Comprueba si una celda (r, c) pertenece a uno de los 3 ojos buscadores (7x7)
  // Coordenadas de los patrones de alineación por versión QR (ISO/IEC 18004, Anexo E)
  const ALIGNMENT_POSITION_TABLE = [
    [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
    [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78],
    [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90]
  ];

  function getAlignmentPatternCenters(count) {
    const version = (count - 17) / 4;
    const pos = ALIGNMENT_POSITION_TABLE[version - 1] || [];
    const centers = [];
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        if (isFinderPattern(pos[i], pos[j], count)) continue;
        centers.push([pos[i], pos[j]]);
      }
    }
    return centers;
  }

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

      // Núcleo 3x3 completo con puntas de escudo: un rombo rompía la proporción 1:1:3:1:1
      // que los lectores usan para localizar los ojos (0% de lectura en jsQR).
      roundRectPath(ctx, x + innerOffset, y + innerOffset, innerSize, innerSize, [cell * 0.25, cell * 1.1, cell * 0.25, cell * 1.1]);
      ctx.fill();
    } else {
      ctx.strokeRect(ringX, ringY, ringDim, ringDim);
      ctx.fillRect(x + innerOffset, y + innerOffset, innerSize, innerSize);
    }

    ctx.restore();
  }

  // Descripción neutra del color del QR (sólido o degradado lineal), compartida por canvas y SVG
  function getQrPaintSpec(x, y, size, opts) {
    const mode = opts.qrColorMode || "solid";
    const baseColor = opts.color || "#111111";
    const diagonal = { x1: x, y1: y, x2: x + size, y2: y + size };

    if (mode === "grad-bc") {
      return Object.assign({ stops: [[0, "#0865F5"], [0.55, "#0696EE"], [1, "#00B4D8"]] }, diagonal);
    }
    if (mode === "grad-ig") {
      return { x1: x, y1: y + size, x2: x + size, y2: y, stops: [[0, "#F58529"], [0.5, "#DD2A7B"], [1, "#8134AF"]] };
    }
    if (mode === "grad-gold") {
      return Object.assign({ stops: [[0, "#1E1B18"], [0.55, "#6E5022"], [1, "#8F6A1F"]] }, diagonal);
    }
    if (mode === "grad-custom" && opts.color2) {
      return Object.assign({ stops: [[0, ensureQrInkContrast(baseColor)], [1, ensureQrInkContrast(opts.color2)]] }, diagonal);
    }
    return { solid: ensureQrInkContrast(baseColor) };
  }

  function buildQrFillStyle(ctx, x, y, size, opts) {
    const spec = getQrPaintSpec(x, y, size, opts);
    if (spec.solid) return spec.solid;
    const g = ctx.createLinearGradient(spec.x1, spec.y1, spec.x2, spec.y2);
    spec.stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }

  // Colores de los 3 ojos [arriba-izq, arriba-der, abajo-izq]; null = usar el color principal
  function resolveQrEyeColors(opts) {
    const mode = opts.eyeColorMode || "match";
    if (mode === "bc-blue") return ["#0865F5", "#0865F5", "#0865F5"];
    if (mode === "google-multi") return ["#4285F4", "#EA4335", "#34A853"];
    if (mode === "custom" && opts.eyeColor) {
      const c = ensureQrInkContrast(opts.eyeColor);
      return [c, c, c];
    }
    return [null, null, null];
  }

  // Zona de silencio mínima (en módulos) entre el QR y cualquier trazo oscuro del marco
  const QUIET_MODULES = 3.2;

  /**
   * Geometría del QR dentro de su caja (x, y, size) según el marco elegido.
   * Única fuente de verdad para el dibujo en canvas y la exportación SVG.
   */
  function computeQrLayout(x, y, size, count, frameStyle) {
    if (frameStyle === "scan-bottom") {
      const bottomBarH = size * 0.13;
      const frameLw = size * 0.022;
      const pillH = bottomBarH * 0.88;
      const qrSize = (size - pillH - frameLw / 2) / (1 + (2 * QUIET_MODULES) / count);
      const quiet = (QUIET_MODULES * qrSize) / count;
      const pillW = size * 0.68;
      return {
        qrX: x + (size - qrSize) / 2,
        qrY: y + frameLw / 2 + quiet,
        qrSize: qrSize,
        frame: {
          type: "scan-bottom",
          lineWidth: frameLw,
          rect: [x, y, size, size - bottomBarH * 0.35, size * 0.07],
          pill: [x + (size - pillW) / 2, y + size - pillH, pillW, pillH],
          fontPx: Math.round(pillH * 0.54),
          textX: x + size / 2,
          textY: y + size - pillH / 2 + 1
        }
      };
    }
    if (frameStyle === "corners") {
      const cornerLw = size * 0.024;
      const qrSize = (size - cornerLw) / (1 + (2 * QUIET_MODULES) / count);
      const pad = (size - qrSize) / 2;
      const cLen = size * 0.14;
      return {
        qrX: x + pad,
        qrY: y + pad,
        qrSize: qrSize,
        frame: {
          type: "corners",
          lineWidth: cornerLw,
          polylines: [
            [[x, y + cLen], [x, y], [x + cLen, y]],
            [[x + size - cLen, y], [x + size, y], [x + size, y + cLen]],
            [[x, y + size - cLen], [x, y + size], [x + cLen, y + size]],
            [[x + size - cLen, y + size], [x + size, y + size], [x + size, y + size - cLen]]
          ]
        }
      };
    }
    return { qrX: x, qrY: y, qrSize: size, frame: null };
  }

  /**
   * Modelo lógico del QR (independiente del tamaño): matriz, módulos reservados para logo,
   * ojos y patrones de alineación. Compartido por canvas y SVG.
   */
  function buildQrModel(url, opts) {
    const qr = qrcode(0, "H");
    qr.addData(url || "https://gestor-nfc-qr-2026.web.app");
    qr.make();
    const count = qr.getModuleCount();
    const logoType = opts.centerLogo && opts.centerLogo !== "none" ? opts.centerLogo : null;
    const clearHalf = logoType ? count * 0.105 : 0;
    const centerIdx = (count - 1) / 2;

    function isUnderLogo(r, c) {
      return Boolean(logoType) && Math.abs(r - centerIdx) <= clearHalf && Math.abs(c - centerIdx) <= clearHalf;
    }

    // Patrones de alineación (5x5): se dibujan siempre sólidos aunque la trama sea decorativa,
    // porque estrellas/diamantes/puntos impedían que el lector corrigiera la perspectiva.
    const alignCenters = getAlignmentPatternCenters(count).filter(function (p) {
      return !isUnderLogo(p[0], p[1]);
    });

    function isAlignmentModule(r, c) {
      for (let i = 0; i < alignCenters.length; i++) {
        if (Math.abs(r - alignCenters[i][0]) <= 2 && Math.abs(c - alignCenters[i][1]) <= 2) return true;
      }
      return false;
    }

    function isSkipped(r, c) {
      if (r < 0 || c < 0 || r >= count || c >= count) return true;
      if (isFinderPattern(r, c, count)) return true;
      if (isUnderLogo(r, c)) return true;
      return !qr.isDark(r, c);
    }

    return {
      count: count,
      logoType: logoType,
      alignCenters: alignCenters,
      isSkipped: isSkipped,
      isAlignmentModule: isAlignmentModule
    };
  }

  // Caja del logo central (21.5% del QR), misma aritmética para canvas y SVG
  function getQrLogoBox(qrX, qrY, qrSize) {
    const size = qrSize * 0.215;
    const bx = qrX + (qrSize - size) / 2;
    const by = qrY + (qrSize - size) / 2;
    return { x: bx, y: by, size: size, cx: bx + size / 2, cy: by + size / 2 };
  }

  // Logo central del QR (placa blanca + icono) dentro de la caja de getQrLogoBox
  function drawQrCenterLogo(ctx, logoType, logoShape, box, mainFill) {
    const bx = box.x;
    const by = box.y;
    const cx = box.cx;
    const cy = box.cy;
    const boxSize = box.size;

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
    } else if (logoType === "burger") {
      drawBurgerBadgeIcon(ctx, cx, cy, boxSize * 0.84, typeof mainFill === "string" ? mainFill : "#843511");
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
    } else if (logoType && logoType !== "none") {
      drawExtendedBadgeIcon(ctx, logoType, cx, cy, boxSize * 0.86, mainFill);
    }
  }

  /**
   * MOTOR QR ULTRA-PERSONALIZABLE Y 100% ESCANEABLE (NIVEL H - 30% TOLERANCIA)
   */
  function drawQrMatrix(ctx, url, x, y, size, opts) {
    if (typeof qrcode !== "function") return;
    opts = opts || {};

    const style = opts.qrStyle || "classic";
    const eyeStyle = opts.qrEyeStyle || "square";
    const logoShape = opts.logoShape || "rounded";
    const frameStyle = opts.frameStyle || "none";

    const model = buildQrModel(url, opts);
    const count = model.count;
    const logoType = model.logoType;
    const isSkipped = model.isSkipped;

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
    const layout = computeQrLayout(x, y, size, count, frameStyle);
    const qrX = layout.qrX;
    const qrY = layout.qrY;
    const qrSize = layout.qrSize;
    const frame = layout.frame;

    if (frame && frame.type === "scan-bottom") {
      roundRectPath(ctx, frame.rect[0], frame.rect[1], frame.rect[2], frame.rect[3], frame.rect[4]);
      ctx.strokeStyle = mainFill;
      ctx.lineWidth = frame.lineWidth;
      ctx.stroke();

      roundRectPath(ctx, frame.pill[0], frame.pill[1], frame.pill[2], frame.pill[3], frame.pill[3] / 2);
      ctx.fillStyle = mainFill;
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 " + frame.fontPx + "px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(opts.frameText || "ESCANÉAME", frame.textX, frame.textY);
    } else if (frame && frame.type === "corners") {
      // save/restore: el lineJoin redondo del visor no debe redondear los ojos ni la alineación
      ctx.save();
      ctx.strokeStyle = mainFill;
      ctx.lineWidth = frame.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      frame.polylines.forEach(function (pts) {
        ctx.moveTo(pts[0][0], pts[0][1]);
        ctx.lineTo(pts[1][0], pts[1][1]);
        ctx.lineTo(pts[2][0], pts[2][1]);
      });
      ctx.stroke();
      ctx.restore();
    }

    const cell = qrSize / count;

    // 1. Dibujar los 3 Ojos Buscadores
    const eyeColors = resolveQrEyeColors(opts);
    drawCustomFinderEye(ctx, qrX, qrY, cell, eyeColors[0] || mainFill, eyeStyle);
    drawCustomFinderEye(ctx, qrX + (count - 7) * cell, qrY, cell, eyeColors[1] || mainFill, eyeStyle);
    drawCustomFinderEye(ctx, qrX, qrY + (count - 7) * cell, cell, eyeColors[2] || mainFill, eyeStyle);

    // 2. Dibujar los módulos de datos
    ctx.fillStyle = mainFill;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (isSkipped(r, c) || model.isAlignmentModule(r, c)) continue;

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
          const hr = cell * 0.6;
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
          const or = cell * 0.56;
          const ir = cell * 0.34;
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

    // 2b. Patrones de alineación sólidos (anillo 5x5 + núcleo 1x1), redondeados según la forma de ojos
    const alignRound = eyeStyle === "square" ? 0 : cell * 0.9;
    for (let i = 0; i < model.alignCenters.length; i++) {
      const ax = qrX + (model.alignCenters[i][1] - 2) * cell;
      const ay = qrY + (model.alignCenters[i][0] - 2) * cell;
      ctx.save();
      ctx.strokeStyle = mainFill;
      ctx.fillStyle = mainFill;
      ctx.lineWidth = cell;
      roundRectPath(ctx, ax + cell * 0.5, ay + cell * 0.5, cell * 4, cell * 4, alignRound);
      ctx.stroke();
      if (eyeStyle === "circle") {
        ctx.beginPath();
        ctx.arc(ax + cell * 2.5, ay + cell * 2.5, cell * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(ax + cell * 2, ay + cell * 2, cell, cell);
      }
      ctx.restore();
    }

    // 3. Dibujar el Logo Central
    if (logoType) {
      const box = getQrLogoBox(qrX, qrY, qrSize);
      drawQrCenterLogo(ctx, logoType, logoShape, box, mainFill);
    }

    ctx.restore();
  }

  // ============================================================================
  // EXPORTACIÓN VECTORIAL SVG (misma geometría que drawQrMatrix)
  // ============================================================================
  function svgNum(n) {
    return String(Math.round(n * 1000) / 1000);
  }

  function svgEscape(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Equivalente SVG de roundRectPath (mismo recorte de radios a la mitad del lado)
  function svgRoundRectD(x, y, w, h, r) {
    let tl, tr, br, bl;
    if (Array.isArray(r)) {
      const maxR = Math.min(w / 2, h / 2);
      tl = Math.min(r[0] || 0, maxR);
      tr = Math.min(r[1] || 0, maxR);
      br = Math.min(r[2] || 0, maxR);
      bl = Math.min(r[3] || 0, maxR);
    } else {
      tl = tr = br = bl = Math.min(r || 0, w / 2, h / 2);
    }
    const n = svgNum;
    const arc = function (rad, ex, ey) {
      return rad > 0 ? "A" + n(rad) + " " + n(rad) + " 0 0 1 " + n(ex) + " " + n(ey) : "L" + n(ex) + " " + n(ey);
    };
    return "M" + n(x + tl) + " " + n(y) +
      "L" + n(x + w - tr) + " " + n(y) + arc(tr, x + w, y + tr) +
      "L" + n(x + w) + " " + n(y + h - br) + arc(br, x + w - br, y + h) +
      "L" + n(x + bl) + " " + n(y + h) + arc(bl, x, y + h - bl) +
      "L" + n(x) + " " + n(y + tl) + arc(tl, x + tl, y) + "Z";
  }

  function svgCircleD(cx, cy, r) {
    const n = svgNum;
    return "M" + n(cx - r) + " " + n(cy) + "a" + n(r) + " " + n(r) + " 0 1 0 " + n(r * 2) + " 0" +
      "a" + n(r) + " " + n(r) + " 0 1 0 " + n(-r * 2) + " 0Z";
  }

  // Ojo buscador en SVG: espejo exacto de drawCustomFinderEye
  function svgFinderEye(x, y, cell, paint, eyeStyle) {
    const ringX = x + cell * 0.5;
    const ringY = y + cell * 0.5;
    const ringDim = 6 * cell;
    const ix = x + 2 * cell;
    const iy = y + 2 * cell;
    const inner = 3 * cell;
    let ringD;
    let coreD;
    if (eyeStyle === "circle") {
      ringD = svgCircleD(x + 3.5 * cell, y + 3.5 * cell, 3 * cell);
      coreD = svgCircleD(x + 3.5 * cell, y + 3.5 * cell, 1.5 * cell);
    } else if (eyeStyle === "rounded") {
      ringD = svgRoundRectD(ringX, ringY, ringDim, ringDim, cell * 1.65);
      coreD = svgRoundRectD(ix, iy, inner, inner, cell * 0.85);
    } else if (eyeStyle === "leaf") {
      ringD = svgRoundRectD(ringX, ringY, ringDim, ringDim, [cell * 2.3, cell * 0.45, cell * 2.3, cell * 0.45]);
      coreD = svgRoundRectD(ix, iy, inner, inner, [cell * 1.25, cell * 0.25, cell * 1.25, cell * 0.25]);
    } else if (eyeStyle === "shield") {
      ringD = svgRoundRectD(ringX, ringY, ringDim, ringDim, [cell * 0.4, cell * 2.0, cell * 0.4, cell * 2.0]);
      coreD = svgRoundRectD(ix, iy, inner, inner, [cell * 0.25, cell * 1.1, cell * 0.25, cell * 1.1]);
    } else {
      ringD = svgRoundRectD(ringX, ringY, ringDim, ringDim, 0);
      coreD = svgRoundRectD(ix, iy, inner, inner, 0);
    }
    return '<path d="' + ringD + '" fill="none" stroke="' + paint + '" stroke-width="' + svgNum(cell) + '"/>' +
      '<path d="' + coreD + '" fill="' + paint + '"/>';
  }

  // Path de un módulo de datos según la trama (espejo del bucle de drawQrMatrix)
  function svgModuleD(style, mx, my, cell, model, r, c) {
    const n = svgNum;
    if (style === "dots") return svgCircleD(mx + cell / 2, my + cell / 2, cell * 0.45);
    if (style === "rounded") return svgRoundRectD(mx + cell * 0.04, my + cell * 0.04, cell * 0.92, cell * 0.92, cell * 0.34);
    if (style === "liquid") {
      const up = !model.isSkipped(r - 1, c);
      const down = !model.isSkipped(r + 1, c);
      const rad = cell * 0.44;
      // En vector se solapa una fracción de módulo (no 0.3 px) para que las barras sean continuas a cualquier escala
      const ov = cell * 0.02;
      return svgRoundRectD(mx + cell * 0.07, my - (up ? ov : 0), cell * 0.86, cell + (up ? ov : 0) + (down ? ov : 0),
        [up ? 0 : rad, up ? 0 : rad, down ? 0 : rad, down ? 0 : rad]);
    }
    if (style === "diamond") {
      const cx = mx + cell / 2;
      const cy = my + cell / 2;
      const hr = cell * 0.6;
      return "M" + n(cx) + " " + n(cy - hr) + "L" + n(cx + hr) + " " + n(cy) + "L" + n(cx) + " " + n(cy + hr) + "L" + n(cx - hr) + " " + n(cy) + "Z";
    }
    if (style === "star") {
      const cx = mx + cell / 2;
      const cy = my + cell / 2;
      let d = "";
      for (let k = 0; k < 8; k++) {
        const ang = (k * Math.PI) / 4;
        const rad = k % 2 === 0 ? cell * 0.56 : cell * 0.34;
        d += (k === 0 ? "M" : "L") + n(cx + Math.cos(ang) * rad) + " " + n(cy + Math.sin(ang) * rad);
      }
      return d + "Z";
    }
    // Clásico: celdas con un solape mínimo para evitar líneas finas entre módulos vecinos
    const s = cell * 1.01;
    return "M" + n(mx) + " " + n(my) + "h" + n(s) + "v" + n(s) + "h" + n(-s) + "Z";
  }

  /**
   * Genera un SVG vectorial idéntico al QR del canvas: trama, ojos, patrones de alineación,
   * colores/degradados y marco son 100% vectoriales; el logo central (iconos dibujados en canvas
   * o imagen subida) se incrusta como PNG de alta resolución en su placa blanca.
   * options: { size (unidades del viewBox), margin, widthMm }
   */
  function buildStyledQrSvg(url, opts, options) {
    if (typeof qrcode !== "function") return "";
    opts = opts || {};
    options = options || {};
    const total = options.size || 2048;
    const margin = options.margin == null ? 140 : options.margin;
    const widthMm = options.widthMm || 80;
    const x = margin;
    const y = margin;
    const size = total - margin * 2;

    const style = opts.qrStyle || "classic";
    const eyeStyle = opts.qrEyeStyle || "square";
    const logoShape = opts.logoShape || "rounded";
    const model = buildQrModel(url, opts);
    const count = model.count;
    const layout = computeQrLayout(x, y, size, count, opts.frameStyle || "none");
    const qrX = layout.qrX;
    const qrY = layout.qrY;
    const qrSize = layout.qrSize;
    const cell = qrSize / count;

    const spec = getQrPaintSpec(x, y, size, opts);
    const defs = [];
    let mainPaint = spec.solid;
    if (!spec.solid) {
      defs.push('<linearGradient id="qrInk" gradientUnits="userSpaceOnUse" x1="' + svgNum(spec.x1) + '" y1="' + svgNum(spec.y1) +
        '" x2="' + svgNum(spec.x2) + '" y2="' + svgNum(spec.y2) + '">' +
        spec.stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"/>'; }).join("") +
        "</linearGradient>");
      mainPaint = "url(#qrInk)";
    }

    const parts = [];
    parts.push('<rect width="' + total + '" height="' + total + '" fill="#FFFFFF"/>');

    // Marco
    const frame = layout.frame;
    if (frame && frame.type === "scan-bottom") {
      parts.push('<path d="' + svgRoundRectD(frame.rect[0], frame.rect[1], frame.rect[2], frame.rect[3], frame.rect[4]) +
        '" fill="none" stroke="' + mainPaint + '" stroke-width="' + svgNum(frame.lineWidth) + '"/>');
      parts.push('<path d="' + svgRoundRectD(frame.pill[0], frame.pill[1], frame.pill[2], frame.pill[3], frame.pill[3] / 2) + '" fill="' + mainPaint + '"/>');
      parts.push('<text x="' + svgNum(frame.textX) + '" y="' + svgNum(frame.textY) + '" fill="#FFFFFF" font-family="\'Plus Jakarta Sans\', Arial, sans-serif" font-weight="800" font-size="' +
        frame.fontPx + '" text-anchor="middle" dominant-baseline="central">' + svgEscape(opts.frameText || "ESCANÉAME") + "</text>");
    } else if (frame && frame.type === "corners") {
      const d = frame.polylines.map(function (pts) {
        return "M" + pts.map(function (p) { return svgNum(p[0]) + " " + svgNum(p[1]); }).join("L");
      }).join("");
      parts.push('<path d="' + d + '" fill="none" stroke="' + mainPaint + '" stroke-width="' + svgNum(frame.lineWidth) +
        '" stroke-linecap="round" stroke-linejoin="round"/>');
    }

    // Ojos
    const eyeColors = resolveQrEyeColors(opts);
    parts.push(svgFinderEye(qrX, qrY, cell, eyeColors[0] || mainPaint, eyeStyle));
    parts.push(svgFinderEye(qrX + (count - 7) * cell, qrY, cell, eyeColors[1] || mainPaint, eyeStyle));
    parts.push(svgFinderEye(qrX, qrY + (count - 7) * cell, cell, eyeColors[2] || mainPaint, eyeStyle));

    // Módulos de datos: un único path para todo el cuerpo
    let modulesD = "";
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (model.isSkipped(r, c) || model.isAlignmentModule(r, c)) continue;
        modulesD += svgModuleD(style, qrX + c * cell, qrY + r * cell, cell, model, r, c);
      }
    }
    parts.push('<path d="' + modulesD + '" fill="' + mainPaint + '"/>');

    // Patrones de alineación
    const alignRound = eyeStyle === "square" ? 0 : cell * 0.9;
    model.alignCenters.forEach(function (p) {
      const ax = qrX + (p[1] - 2) * cell;
      const ay = qrY + (p[0] - 2) * cell;
      parts.push('<path d="' + svgRoundRectD(ax + cell * 0.5, ay + cell * 0.5, cell * 4, cell * 4, alignRound) +
        '" fill="none" stroke="' + mainPaint + '" stroke-width="' + svgNum(cell) + '"/>');
      const coreD = eyeStyle === "circle" ? svgCircleD(ax + cell * 2.5, ay + cell * 2.5, cell * 0.55) : svgRoundRectD(ax + cell * 2, ay + cell * 2, cell, cell, 0);
      parts.push('<path d="' + coreD + '" fill="' + mainPaint + '"/>');
    });

    // Logo central rasterizado a alta resolución sobre fondo transparente
    if (model.logoType && typeof document !== "undefined") {
      const box = getQrLogoBox(qrX, qrY, qrSize);
      const bleed = box.size * 0.18;
      const area = box.size + bleed * 2;
      // ~640 px cubren el logo a más de 800 DPI en una impresión de 8 cm sin inflar el archivo
      const px = 640;
      const k = px / area;
      const lc = document.createElement("canvas");
      lc.width = px;
      lc.height = px;
      const lctx = lc.getContext("2d");
      lctx.scale(k, k);
      lctx.translate(-(box.x - bleed), -(box.y - bleed));
      const logoFill = spec.solid || spec.stops[0][1];
      drawQrCenterLogo(lctx, model.logoType, logoShape, box, logoFill);
      const logoUri = lc.toDataURL("image/png");
      // xlink:href: lo entienden navegadores, Illustrator, Inkscape y visores antiguos (una sola copia del logo)
      parts.push('<image x="' + svgNum(box.x - bleed) + '" y="' + svgNum(box.y - bleed) + '" width="' + svgNum(area) + '" height="' + svgNum(area) +
        '" xlink:href="' + logoUri + '"/>');
    }

    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + total + " " + total + '" width="' + widthMm + 'mm" height="' + widthMm + 'mm">' +
      "<title>" + svgEscape(url) + "</title>" +
      (defs.length ? "<defs>" + defs.join("") + "</defs>" : "") +
      parts.join("") +
      "</svg>";
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
      if (motif === "comida1" || motif === "comida2") return "burger";
      if (motif === "leburre") return "leburre";
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

  // Detecta si un texto visual fue contaminado por autocompletado de URL del navegador o pegado por error
  function isUrlLikeString(str) {
    if (!str) return false;
    const s = String(str).trim();
    return /^(https?:\/\/|www\.|wa\.me\/|t\.me\/|mailto:|tel:)/i.test(s) ||
      s.indexOf("://") !== -1 ||
      /\.(com|net|org|io|app|co|me|es|pe|mx|ar|cl)\//i.test(s) ||
      /\.web\.app/i.test(s);
  }

  function cleanVisualText(val, fallback) {
    const s = String(val == null ? "" : val).trim();
    if (!s || isUrlLikeString(s)) return fallback;
    return s;
  }

  function cleanVisualDisplayText(val, fallback, maxLen) {
    const s = cleanVisualText(val, fallback);
    if (maxLen && s.length > maxLen) {
      return s.slice(0, maxLen).trim();
    }
    return s;
  }

  // Dibuja texto ajustando automáticamente el tamaño de fuente para que NUNCA se salga de su ancho máximo
  function drawFittedText(ctx, text, x, y, maxWidth, baseSize, minSize, fontWeight, fontFamily) {
    const str = String(text == null ? "" : text);
    if (!str) return;
    const weight = fontWeight || "800";
    const family = fontFamily || "'Plus Jakarta Sans', Arial, sans-serif";
    const floorSize = minSize || Math.max(14, Math.round(baseSize * 0.45));
    let sz = baseSize;
    while (sz > floorSize) {
      ctx.font = weight + " " + sz + "px " + family;
      if (ctx.measureText(str).width <= maxWidth) break;
      sz -= 2;
    }
    ctx.font = weight + " " + sz + "px " + family;
    ctx.fillText(str, x, y, maxWidth);
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

    const caption = cleanVisualText(data.qrCaptionText, "SCAN QR CODE");
    const slugText = cleanVisualText(data.slug, "TAG-ID").toUpperCase();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    let curY = topY;

    if (caption) {
      ctx.fillStyle = textColor || "#181818";
      drawFittedText(ctx, caption, centerX, curY, 280, 24, 15, "800", "'Plus Jakarta Sans', Arial, sans-serif");
      curY += 28;
    }

    if (mode === "bottom-text-id") {
      ctx.fillStyle = textColor || "#333333";
      ctx.globalAlpha = 0.78;
      drawFittedText(ctx, "ID: " + slugText, centerX, curY, 280, 19, 13, "600", "'JetBrains Mono', monospace");
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
    const titleColor = data.titleColor || textColor;
    const subtitleColor = data.subtitleColor || textColor;
    const nfcColor = data.nfcColor || textColor;
    const nfcTextColor = data.nfcTextColor || nfcColor || textColor;
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

      if (data.headerBgMode && data.headerBgMode !== "original") {
        ctx.save();
        roundRectPath(ctx, 118, 40, 764, 850, 36);
        ctx.clip();
        drawReplaceableWaveHeader(ctx, "google", data, accentColor, "#DCE8F3");
        ctx.restore();
      }

      roundRectPath(ctx, 2, 2, 996, 996, 75);
      ctx.strokeStyle = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Grupo HERO: Anillo Google + 5 Estrellas (o Icono de la Librería)
      withGroupTransform(ctx, data, "hero", 500, 290, function () {
        if (data.heroIcon && data.heroIcon !== "original") {
          drawCustomHeroIconOverride(ctx, data.heroIcon, 500, 122, data.headerBgMode && data.headerBgMode !== "original" ? "#FFFFFF" : accentColor, bgColor);
        } else {
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
        }
      });

      // Grupo NFC: Ilustración teléfono y mano
      withGroupTransform(ctx, data, "nfc", 326, 706, function () {
        drawUnifiedMenuNfcIllustration(ctx, 326, 706, 0.88, nfcColor, darkBg ? bgColor : "#FFFFFF");
      });
    }

    if (showText) {
      // Grupo TITLE: Textos dentro del círculo
      withGroupTransform(ctx, data, "title", 500, 250, function () {
        ctx.save();
        ctx.fillStyle = titleColor;
        ctx.textAlign = "center";
        const line1 = cleanVisualText(data.titleLine1 || data.googleLine1, "Valóranos");
        const line2 = cleanVisualText(data.titleLine2 || data.googleLine2, "en");
        const line3 = cleanVisualText(data.titleLine3, "Google");

        drawFittedText(ctx, line1, 500, 195, 320, 49, 24, "700", "'Plus Jakarta Sans', Arial, sans-serif");
        drawFittedText(ctx, line2, 500, 249, 320, 45, 22, "700", "'Plus Jakarta Sans', Arial, sans-serif");

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
          ctx.fillStyle = data.borderStyle === "accent" ? accentColor : "#4285F4";
          drawFittedText(ctx, line3, 500, 329, 320, 68, 28, "800", "'Plus Jakarta Sans', Arial, sans-serif");
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
    const titleColor = data.titleColor || textColor;
    const subtitleColor = data.subtitleColor || textColor;
    const nfcColor = data.nfcColor || textColor;
    const nfcTextColor = data.nfcTextColor || nfcColor || textColor;
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

      if (data.headerBgMode && data.headerBgMode !== "original") {
        ctx.save();
        roundRectPath(ctx, 56, 56, 888, 888, 62);
        ctx.clip();
        drawReplaceableWaveHeader(ctx, "instagram", data, accentColor, "#FCE7F3");
        ctx.restore();
      }

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
        if (data.heroIcon && data.heroIcon !== "original") {
          const heroCol = (data.headerBgMode && data.headerBgMode !== "original") ? "#FFFFFF" : accentColor;
          drawCustomHeroIconOverride(ctx, data.heroIcon, 500, 248, heroCol, bgColor);
        } else {
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
        }
      });

      withGroupTransform(ctx, data, "nfc", 332, 682, function () {
        drawUnifiedMenuNfcIllustration(ctx, 332, 682, 0.86, nfcColor, darkBg ? bgColor : "#FFFFFF");
      });
    }

    if (showText) {
      withGroupTransform(ctx, data, "title", 500, 455, function () {
        ctx.save();
        ctx.fillStyle = titleColor;
        ctx.textAlign = "center";

        const igTitle = cleanVisualText(data.titleScript || data.igTitle, "Instagram");
        const igSub = cleanVisualText(data.subtitle || data.igSubtitle, "¡Acerca tu móvil y síguenos!");

        drawFittedText(ctx, igTitle, 500, 446, 680, 78, 38, "400", "'Grand Hotel', 'Brush Script MT', cursive");
        ctx.fillStyle = subtitleColor;
        drawFittedText(ctx, igSub, 500, 504, 680, 33, 18, "500", "'Plus Jakarta Sans', Arial, sans-serif");
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
    const hasRichHeaderBg = Boolean(data.headerBgMode && data.headerBgMode !== "original" && data.headerBgMode !== "solid-custom");
    const darkHeader = hasRichHeaderBg || isHexDark(accentColor);
    const headerContentColor = darkHeader ? "#FFFFFF" : "#111827";
    const titleColor = data.titleColor || headerContentColor;
    const subtitleColor = data.subtitleColor || (darkHeader ? "rgba(255,255,255,0.88)" : "#4B5563");
    const nfcColor = data.nfcColor || textColor;
    const nfcTextColor = data.nfcTextColor || nfcColor || textColor;

    roundRectPath(ctx, 0, 0, 1000, 1000, 82);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1000, 1000);

      if (!drawReplaceableWaveHeader(ctx, "menu", data, accentColor, waveSubColor)) {
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
      }

      roundRectPath(ctx, 2, 2, 996, 996, 80);
      ctx.strokeStyle = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Grupo HERO: Tenedor y cuchara superiores (o Icono de la Librería)
      withGroupTransform(ctx, data, "hero", 500, 120, function () {
        if (data.heroIcon && data.heroIcon !== "original" && data.heroIcon !== "menu") {
          drawCustomHeroIconOverride(ctx, data.heroIcon, 500, 120, headerContentColor, accentColor);
        } else {
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
        }
      });

      // Grupo NFC: Ilustración teléfono y mano (+ texto en arco cuando se arrastra junto)
      withGroupTransform(ctx, data, "nfc", 338, 720, function () {
        drawUnifiedMenuNfcIllustration(ctx, 338, 732, 0.96, nfcColor, darkBg ? bgColor : "#FFFFFF");
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
          nfcTextColor
        );
      });
    }

    if (showText) {
      withGroupTransform(ctx, data, "title", 500, 315, function () {
        ctx.save();
        ctx.textAlign = "center";

        const menuTitle = cleanVisualDisplayText(data.titleMain || data.menuTitle, "MENU", 35);
        const menuSub = cleanVisualDisplayText(data.subtitle || data.menuSubtitle, "VIEW OUR MENU ONLINE", 45);

        ctx.fillStyle = titleColor;
        let baseSz = 96;
        let minSz = 36;
        if (menuTitle.length > 18) {
          baseSz = 48; minSz = 22;
        } else if (menuTitle.length > 11) {
          baseSz = 62; minSz = 28;
        } else if (menuTitle.length > 6) {
          baseSz = 76; minSz = 32;
        }
        drawFittedText(ctx, menuTitle, 500, 314, 760, baseSz, minSz, "800", "'Plus Jakarta Sans', Arial, sans-serif");
        ctx.fillStyle = subtitleColor;
        drawFittedText(ctx, menuSub, 500, 368, 740, 32, 16, "500", "'Plus Jakarta Sans', Arial, sans-serif");
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
          const cleanCap = cleanVisualText(data.qrCaptionText, "SCAN QR").toUpperCase();
          drawFittedText(ctx, cleanCap, 760, 578, 280, 29, 16, "800", "'Plus Jakarta Sans', Arial, sans-serif");

          if (captionMode === "bottom-text-id") {
            ctx.fillStyle = textColor;
            ctx.globalAlpha = 0.82;
            const cleanSlugVal = cleanVisualText(data.slug, "TAG-ID").toUpperCase();
            drawFittedText(ctx, cleanSlugVal, 760, 868, 280, 21, 13, "600", "'JetBrains Mono', monospace");
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

  // ============================================================================
  // 4. RENDERIZADOR PLACA BLUE CODE CORPORATIVO (Blue Code.png)
  // ============================================================================
  function renderBlueCodePlaque(ctx, W, H, data, layerFilter) {
    const S = W / 1000;
    ctx.save();
    ctx.scale(S, S);

    const showBg = !layerFilter || layerFilter === "all" || layerFilter === "bg";
    const showIcons = !layerFilter || layerFilter === "all" || layerFilter === "icons";
    const showText = !layerFilter || layerFilter === "all" || layerFilter === "text";
    const showBrand = !layerFilter || layerFilter === "all" || layerFilter === "brand";
    const showQr = !layerFilter || layerFilter === "all" || layerFilter === "qr";

    const bgColor = data.bgColor || "#FFFFFF";
    const textColor = data.textColor || "#181818";
    const accentColor = data.accentColor || "#060A14";
    const waveStrokeColor = data.waveSubColor || "#0865F5";
    const darkBg = isHexDark(bgColor);
    const hasRichHeaderBg = Boolean(data.headerBgMode && data.headerBgMode !== "original" && data.headerBgMode !== "solid-custom");
    const darkHeader = hasRichHeaderBg || isHexDark(accentColor);
    const headerPrimaryColor = darkHeader ? "#FFFFFF" : "#0F172A";
    const titleColor = data.titleColor || headerPrimaryColor;
    const subtitleColor = data.subtitleColor || "#087CF5";
    const nfcColor = data.nfcColor || textColor;
    const nfcTextColor = data.nfcTextColor || nfcColor || textColor;

    roundRectPath(ctx, 0, 0, 1000, 1000, 82);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1000, 1000);

      if (!drawReplaceableWaveHeader(ctx, "bluecode", data, accentColor, "#DCE8F3")) {
        // Encabezado oscuro con onda S corporativa
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1000, 0);
        ctx.lineTo(1000, 495);
        ctx.bezierCurveTo(660, 535, 350, 430, 0, 598);
        ctx.closePath();
        ctx.fillStyle = accentColor;
        ctx.fill();

        // Brillo radial azul sutil en esquina superior izquierda (idéntico a Blue Code.png)
        if (darkHeader) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(1000, 0);
          ctx.lineTo(1000, 495);
          ctx.bezierCurveTo(660, 535, 350, 430, 0, 598);
          ctx.closePath();
          ctx.clip();

          const glow = ctx.createRadialGradient(180, 110, 20, 220, 180, 540);
          glow.addColorStop(0, "rgba(8, 101, 245, 0.25)");
          glow.addColorStop(0.55, "rgba(8, 124, 245, 0.08)");
          glow.addColorStop(1, "rgba(6, 10, 20, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, 1000, 620);
          ctx.restore();
        }

        // Línea luminosa azul en la curva S
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(-10, 599);
        ctx.bezierCurveTo(350, 431, 660, 536, 1010, 496);
        const waveGrad = ctx.createLinearGradient(0, 500, 1000, 500);
        waveGrad.addColorStop(0, "#0550C8");
        waveGrad.addColorStop(0.5, waveStrokeColor);
        waveGrad.addColorStop(1, "#0696EE");
        ctx.strokeStyle = data.borderStyle === "accent" ? accentColor : waveGrad;
        ctx.lineWidth = 10;
        ctx.shadowColor = "rgba(8, 101, 245, 0.52)";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      roundRectPath(ctx, 2, 2, 996, 996, 80);
      ctx.strokeStyle = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Grupo HERO: Logo oficial BC en el encabezado (o Icono de la Librería)
      withGroupTransform(ctx, data, "hero", 238, 275, function () {
        if (data.heroIcon && data.heroIcon !== "original" && data.heroIcon !== "bluecode") {
          drawCustomHeroIconOverride(ctx, data.heroIcon, 238, 275, headerPrimaryColor, accentColor);
        } else if (data.heroIcon !== "none") {
          drawBlueCodeLogo(ctx, 134, 219, 112);
        }
      });

      // Grupo NFC: Ilustración teléfono y mano + arco "Tap your phone"
      withGroupTransform(ctx, data, "nfc", 310, 730, function () {
        drawUnifiedMenuNfcIllustration(ctx, 306, 748, 0.90, nfcColor, darkBg ? bgColor : "#FFFFFF");
        drawArcText(
          ctx,
          data.arcText || "Tap your phone",
          0,
          310,
          810,
          224,
          (-124 * Math.PI) / 180,
          (-56 * Math.PI) / 180,
          31,
          nfcTextColor
        );
      });
    }

    if (showText) {
      // Grupo TITLE: "BLUE CODE" en una sola línea (o 2 líneas si el subtítulo es largo)
      withGroupTransform(ctx, data, "title", 615, 275, function () {
        ctx.save();
        const w1 = cleanVisualDisplayText(data.titleMain, "BLUE", 24);
        const w2 = cleanVisualDisplayText(data.subtitle, "CODE", 24);

        if (w1.length + w2.length <= 13) {
          ctx.font = "800 94px 'Plus Jakarta Sans', Arial, sans-serif";
          ctx.textBaseline = "alphabetic";
          const w1Width = ctx.measureText(w1).width;
          const w2Width = w2 ? ctx.measureText(w2).width : 0;
          const spaceW = w2 ? 22 : 0;
          const totalW = w1Width + spaceW + w2Width;
          const startX = Math.max(352, 622 - totalW / 2);

          ctx.textAlign = "left";
          ctx.fillStyle = titleColor;
          ctx.fillText(w1, startX, 309);

          if (w2) {
            ctx.fillStyle = subtitleColor;
            ctx.fillText(w2, startX + w1Width + spaceW, 309);
          }
        } else {
          ctx.textAlign = "center";
          ctx.fillStyle = titleColor;
          drawFittedText(ctx, w1, 620, 275, 520, 78, 34, "800", "'Plus Jakarta Sans', Arial, sans-serif");

          ctx.fillStyle = subtitleColor;
          drawFittedText(ctx, w2, 620, 332, 520, 34, 18, "700", "'Plus Jakarta Sans', Arial, sans-serif");
        }
        ctx.restore();
      });

      ctx.save();
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.font = "500 38px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("or", 506, 735);
      ctx.restore();
    }

    if (showQr) {
      withGroupTransform(ctx, data, "qr", 725, 715, function () {
        const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
        const captionMode = data.qrCaptionMode || "bottom-text";
        const isClean = captionMode === "clean";
        const hasId = captionMode === "bottom-text-id";
        const qrSize = isClean ? 256 : (hasId ? 228 : 244);
        const qrX = 725 - qrSize / 2;
        const qrY = isClean ? 592 : 596;

        const qrOpts = buildQrOptionsFromData("bluecode", data, "#111111", darkBg || data.qrBoxCard);
        if (!data.frameStyle || data.frameStyle === "none") {
          qrOpts.frameStyle = "corners";
        }

        drawQrMatrix(ctx, targetUrl, qrX, qrY, qrSize, qrOpts);

        if (!isClean) {
          ctx.save();
          ctx.fillStyle = textColor;
          ctx.textAlign = "center";
          const bcCap = cleanVisualText(data.qrCaptionText, "Scan QR code");
          drawFittedText(ctx, bcCap, 725, 572, 280, 31, 16, "500", "'Plus Jakarta Sans', Arial, sans-serif");

          if (hasId) {
            ctx.globalAlpha = 0.82;
            const bcSlug = cleanVisualText(data.slug, "TAG-ID").toUpperCase();
            drawFittedText(ctx, bcSlug, 725, qrY + qrSize + 30, 280, 20, 13, "600", "'JetBrains Mono', monospace");
          }
          ctx.restore();
        }
      });
    }

    if (showBrand) {
      withGroupTransform(ctx, data, "brand", 500, 948, function () {
        drawPoweredByBlueCodeFooter(ctx, 500, 956, {
          lowercase: true,
          fontSize: 25,
          brandFontSize: 28,
          logoHeight: 30,
          prefixColor: darkBg ? "rgba(255,255,255,0.78)" : "#333333",
          brandColor: darkBg ? "#FFFFFF" : "#0F172A"
        });
      });
    }

    if (!layerFilter || layerFilter === "all") {
      drawSelectionOverlayIfActive(ctx, "bluecode", data);
    }

    ctx.restore();
  }

  // ============================================================================
  // 5 & 6. RENDERIZADOR PLACAS COMIDA 1 Y COMIDA 2 (BURGER & CO.)
  // ============================================================================
  function renderComidaPlaque(ctx, W, H, data, layerFilter, variant) {
    const S = W / 1000;
    ctx.save();
    ctx.scale(S, S);

    const showBg = !layerFilter || layerFilter === "all" || layerFilter === "bg";
    const showIcons = !layerFilter || layerFilter === "all" || layerFilter === "icons";
    const showText = !layerFilter || layerFilter === "all" || layerFilter === "text";
    const showBrand = !layerFilter || layerFilter === "all" || layerFilter === "brand";
    const showQr = !layerFilter || layerFilter === "all" || layerFilter === "qr";

    const isComida2 = variant === "comida2";
    const defaultAccent = isComida2 ? "#1E1E1E" : "#C8102E";
    const bgColor = data.bgColor || "#FFFFFF";
    const textColor = data.textColor || "#1B1A1A";
    const accentColor = data.accentColor || defaultAccent;
    const peachWaveColor = "#FAD9C8";
    const darkBg = isHexDark(bgColor);
    const hasRichHeaderBg = Boolean(data.headerBgMode && data.headerBgMode !== "original" && data.headerBgMode !== "solid-custom");
    const darkHeader = hasRichHeaderBg || isHexDark(accentColor);
    const headerContentColor = darkHeader ? "#FFFFFF" : "#111827";
    const titleColor = data.titleColor || headerContentColor;
    const subtitleColor = data.subtitleColor || (darkHeader ? "rgba(255,255,255,0.88)" : "#4B5563");
    const nfcColor = data.nfcColor || textColor;
    const nfcTextColor = data.nfcTextColor || nfcColor || textColor;

    const titleMain = cleanVisualText(data.titleMain, "BURGER & CO.");
    const subtitle = cleanVisualText(data.subtitle, "Sabor al instante");
    const headerImg = isComida2 ? headerAssets.comida2 : headerAssets.comida1;
    const hasLoadedImg = Boolean(headerImg && headerImg.complete && headerImg.naturalWidth > 0);
    const burgerIconImg = headerAssets.burgerIcon;
    const hasBurgerIcon = Boolean(burgerIconImg && burgerIconImg.complete && burgerIconImg.naturalWidth > 0);

    roundRectPath(ctx, 0, 0, 1000, 1000, 82);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1000, 1000);

      if (!drawReplaceableWaveHeader(ctx, variant, data, accentColor, peachWaveColor)) {
        if (hasLoadedImg) {
          // SIEMPRE dibujamos el fondo ilustrado limpio (sin texto ni icono pegados),
          // para que al mover o editar textos/iconos NUNCA desaparezcan las hamburguesas
          ctx.drawImage(headerImg, 0, 0, 1000, 550);

          // Si el usuario eligió un color personalizado de cabecera, aplicamos un tinte suave manteniendo el arte de fondo
          if (data.borderStyle === "accent" && accentColor.toLowerCase() !== defaultAccent.toLowerCase()) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(1000, 0);
            ctx.lineTo(1000, 472);
            ctx.bezierCurveTo(760, 485, 520, 342, 0, 520);
            ctx.closePath();
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.72;
            ctx.fill();
            ctx.restore();
          }
        } else {
          // Fallback vectorial instantáneo mientras termina de cargar la imagen
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(1000, 0);
          ctx.lineTo(1000, 492);
          ctx.bezierCurveTo(760, 505, 520, 365, 0, 542);
          ctx.closePath();
          ctx.fillStyle = peachWaveColor;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(1000, 0);
          ctx.lineTo(1000, 472);
          ctx.bezierCurveTo(760, 485, 520, 342, 0, 520);
          ctx.closePath();
          ctx.fillStyle = accentColor;
          ctx.fill();
        }
      }

      roundRectPath(ctx, 2, 2, 996, 996, 80);
      ctx.strokeStyle = darkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      withGroupTransform(ctx, data, "hero", 500, 118, function () {
        if (data.heroIcon && data.heroIcon !== "original" && data.heroIcon !== "burger") {
          drawCustomHeroIconOverride(ctx, data.heroIcon, 500, 118, headerContentColor, accentColor);
        } else if (data.heroIcon !== "none") {
          if (hasBurgerIcon && darkHeader) {
            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.52)";
            ctx.shadowBlur = 16;
            ctx.shadowOffsetY = 6;
            ctx.drawImage(burgerIconImg, 368.75, 32.5, 259.375, 168.75);
            ctx.restore();
          } else {
            drawBurgerFriesHeroIcon(ctx, 500, 128, headerContentColor);
          }
        }
      });

      withGroupTransform(ctx, data, "nfc", 338, 720, function () {
        drawUnifiedMenuNfcIllustration(ctx, 338, 732, 0.96, nfcColor, darkBg ? bgColor : "#FFFFFF");
        drawArcText(
          ctx,
          data.arcText || "TAP YOUR PHONE",
          3,
          342,
          795,
          228,
          (-126 * Math.PI) / 180,
          (-54 * Math.PI) / 180,
          33,
          nfcTextColor
        );
      });
    }

    if (showText) {
      withGroupTransform(ctx, data, "title", 500, 305, function () {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = titleColor;
        ctx.shadowColor = "rgba(0,0,0,0.72)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;

        let baseSz = 90;
        let minSz = 36;
        if (titleMain.length > 18) {
          baseSz = 48; minSz = 22;
        } else if (titleMain.length > 11) {
          baseSz = 62; minSz = 28;
        } else if (titleMain.length > 6) {
          baseSz = 76; minSz = 32;
        }
        drawFittedText(ctx, titleMain, 500, 296, 760, baseSz, minSz, "800", "'Plus Jakarta Sans', Arial, sans-serif");

        ctx.shadowColor = "rgba(0,0,0,0.78)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = subtitleColor;
        drawFittedText(ctx, subtitle, 500, 360, 740, 34, 18, "500", "'Plus Jakarta Sans', Arial, sans-serif");
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
        ctx.shadowColor = "rgba(132, 53, 17, 0.12)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        roundRectPath(ctx, boxX, boxY, boxSize, boxSize, 18);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.restore();

        roundRectPath(ctx, boxX, boxY, boxSize, boxSize, 18);
        ctx.strokeStyle = "#F5D0C5";
        ctx.lineWidth = 3.5;
        ctx.stroke();

        drawQrMatrix(
          ctx,
          targetUrl,
          boxX + qrPad,
          boxY + qrPad,
          qrSize,
          buildQrOptionsFromData(variant, data, "#843511", false)
        );

        if (!isClean) {
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = textColor;
          ctx.font = "500 25px 'Plus Jakarta Sans', Arial, sans-serif";
          ctx.fillText("OR", 760, 542);
          const foodCap = cleanVisualText(data.qrCaptionText, "SCAN QR").toUpperCase();
          drawFittedText(ctx, foodCap, 760, 578, 280, 29, 16, "800", "'Plus Jakarta Sans', Arial, sans-serif");

          if (captionMode === "bottom-text-id") {
            ctx.fillStyle = textColor;
            ctx.globalAlpha = 0.85;
            const foodSlug = cleanVisualText(data.slug, "BURGER-AND-CO").toUpperCase();
            drawFittedText(ctx, foodSlug, 760, 868, 280, 21, 13, "600", "'JetBrains Mono', monospace");
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
      drawSelectionOverlayIfActive(ctx, variant, data);
    }

    ctx.restore();
  }

  // ============================================================================
  // 7. RENDERIZADOR PLACA LE BURRÉ (COCINA ARTESANAL TEX-MEX & 7 SALSAS)
  // ============================================================================
  // Texto centrado con espaciado entre letras (canvas.letterSpacing cuando existe, manual si no)
  function drawSpacedText(ctx, text, cx, y, spacingPx) {
    const str = String(text || "");
    if ("letterSpacing" in ctx) {
      const prev = ctx.letterSpacing;
      ctx.letterSpacing = spacingPx + "px";
      // El espaciado también se añade tras la última letra: se compensa para centrar ópticamente
      ctx.fillText(str, cx + spacingPx / 2, y);
      ctx.letterSpacing = prev;
      return;
    }
    const chars = str.split("");
    const widths = chars.map(function (ch) { return ctx.measureText(ch).width; });
    const total = widths.reduce(function (a, b) { return a + b; }, 0) + spacingPx * (chars.length - 1);
    const prevAlign = ctx.textAlign;
    ctx.textAlign = "left";
    let curX = cx - total / 2;
    for (let i = 0; i < chars.length; i++) {
      ctx.fillText(chars[i], curX, y);
      curX += widths[i] + spacingPx;
    }
    ctx.textAlign = prevAlign;
  }

  // Destello de 4 puntas (ornamento de cantina)
  function drawSparkle(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx - r, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - r);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /**
   * PLACA LE BURRÉ v2 — "Cantina Carmesí & Papel"
   * Mitad superior carmesí con mascota, título y subtítulo en caligrafía;
   * tarjeta de papel crema con greca mexicana que aloja NFC + QR en tinta oscura
   * (máximo contraste para que el QR se lea a la primera).
   */
  function renderLeburrePlaque(ctx, W, H, data, layerFilter) {
    const S = W / 1000;
    ctx.save();
    ctx.scale(S, S);

    const showBg = !layerFilter || layerFilter === "all" || layerFilter === "bg";
    const showIcons = !layerFilter || layerFilter === "all" || layerFilter === "icons";
    const showText = !layerFilter || layerFilter === "all" || layerFilter === "text";
    const showBrand = !layerFilter || layerFilter === "all" || layerFilter === "brand";
    const showQr = !layerFilter || layerFilter === "all" || layerFilter === "qr";

    const bgColor = data.bgColor || "#7A0C0C";
    const accentColor = data.accentColor || "#F2B705";
    const darkBg = isHexDark(bgColor);
    const hasRichHeaderBg = Boolean(data.headerBgMode && data.headerBgMode !== "original" && data.headerBgMode !== "solid-custom");
    const darkHeader = darkBg || hasRichHeaderBg;
    const titleColor = data.titleColor || (darkHeader ? "#FFFFFF" : "#1B1A1A");
    const subtitleColor = data.subtitleColor || accentColor;

    // Tarjeta de papel: crema sobre fondos oscuros, blanca sobre fondos claros
    const paperColor = darkBg ? "#FBF4E4" : "#FFFFFF";
    // Tinta dentro del papel: siempre oscura para leerse sobre crema
    const inkColor = darkBg ? bgColor : ensureQrInkContrast(accentColor, 4.5);
    const nfcColor = ensureQrInkContrast(data.nfcColor || inkColor, 3.2);
    const nfcTextColor = ensureQrInkContrast(data.nfcTextColor || nfcColor, 3.2);
    const captionColor = ensureQrInkContrast(inkColor, 4.5);

    const titleMain = cleanVisualText(data.titleMain, "LE BURRÉ");
    const subtitle = cleanVisualText(data.subtitle, "Carta Oficial & 7 Salsas");
    const arcText = cleanVisualText(data.arcText, "TOCA CON TU MÓVIL");

    const logoImg = headerAssets.leburreLogo;
    const hasLogoImg = Boolean(logoImg && logoImg.complete && logoImg.naturalWidth > 0);
    const bgImg = headerAssets.leburreBg;
    const hasBgImg = Boolean(bgImg && bgImg.complete && bgImg.naturalWidth > 0);
    const grecaImg = headerAssets.leburreGreca;
    const hasGrecaImg = Boolean(grecaImg && grecaImg.complete && grecaImg.naturalWidth > 0);

    // Geometría de la tarjeta de papel
    const PX = 58;
    const PY = 492;
    const PW = 884;
    const PH = 382;
    const PR = 34;
    const GRECA_H = 24;

    roundRectPath(ctx, 0, 0, 1000, 1000, 82);
    ctx.clip();

    if (showBg) {
      // 1. Fondo carmesí con luz cálida desde arriba y viñeta en bordes
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 1000, 1000);

      // "leburre" ya es la cabecera nativa de esta placa; el resto de cabeceras se dibuja tras el papel
      // Recorte recto bajo el papel: así el borde ondulado de la cabecera no asoma por encima de la tarjeta
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 1000, PY + PR);
      ctx.clip();
      const customHeader = data.headerBgMode !== "leburre" && drawReplaceableWaveHeader(ctx, "leburre", data, accentColor, accentColor, PY + PR);
      ctx.restore();

      if (customHeader) {
        // Velo para que el título blanco se lea sobre fotos o degradados claros
        const veil = ctx.createLinearGradient(0, 0, 0, 500);
        veil.addColorStop(0, "rgba(0, 0, 0, 0.28)");
        veil.addColorStop(1, "rgba(0, 0, 0, 0.42)");
        ctx.fillStyle = veil;
        ctx.fillRect(0, 0, 1000, 500);
      } else {
        if (hasBgImg && darkBg) {
          ctx.save();
          ctx.globalAlpha = 0.11;
          ctx.drawImage(bgImg, 0, 0, 1000, 1000);
          ctx.restore();
        }
        const glow = ctx.createRadialGradient(500, 250, 30, 500, 420, 720);
        glow.addColorStop(0, darkBg ? "rgba(255, 196, 80, 0.20)" : "rgba(255,255,255,0.35)");
        glow.addColorStop(0.55, "rgba(0, 0, 0, 0)");
        glow.addColorStop(1, darkBg ? "rgba(0, 0, 0, 0.42)" : "rgba(0,0,0,0.06)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 1000, 1000);
      }

      // 2. Tarjeta de papel con sombra suave
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 10;
      roundRectPath(ctx, PX, PY, PW, PH, PR);
      ctx.fillStyle = paperColor;
      ctx.fill();
      ctx.restore();

      if (!darkBg) {
        roundRectPath(ctx, PX, PY, PW, PH, PR);
        ctx.strokeStyle = "rgba(0,0,0,0.10)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 3. Greca mexicana recta coronando el papel (recortada a sus esquinas)
      ctx.save();
      roundRectPath(ctx, PX, PY, PW, PH, PR);
      ctx.clip();
      if (hasGrecaImg) {
        const gw = grecaImg.naturalWidth || 366;
        const gh = grecaImg.naturalHeight || 55;
        const tW = (gw / gh) * GRECA_H;
        for (let gx = PX; gx < PX + PW; gx += tW - 0.5) {
          ctx.drawImage(grecaImg, gx, PY, tW, GRECA_H);
        }
      } else {
        ctx.fillStyle = accentColor;
        ctx.fillRect(PX, PY, PW, GRECA_H);
      }
      ctx.fillStyle = accentColor;
      ctx.fillRect(PX, PY + GRECA_H, PW, 4);
      ctx.restore();

      // 4. Separador vertical punteado con "ó" entre NFC y QR
      ctx.save();
      ctx.strokeStyle = inkColor;
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([2, 9]);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(500, PY + 62);
      ctx.lineTo(500, 650);
      ctx.moveTo(500, 714);
      ctx.lineTo(500, PY + PH - 34);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(500, 682, 22, 0, Math.PI * 2);
      ctx.fillStyle = inkColor;
      ctx.fill();
      ctx.font = "700 23px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillStyle = paperColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("o", 500, 679);
      ctx.restore();

      // 5. Marco dorado fino doble + destellos en esquinas
      ctx.save();
      roundRectPath(ctx, 14, 14, 972, 972, 70);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      roundRectPath(ctx, 26, 26, 948, 948, 60);
      ctx.strokeStyle = darkBg ? "rgba(242, 183, 5, 0.35)" : "rgba(0,0,0,0.12)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
      drawSparkle(ctx, 58, 58, 11, accentColor);
      drawSparkle(ctx, 942, 58, 11, accentColor);
      drawSparkle(ctx, 58, 942, 11, accentColor);
      drawSparkle(ctx, 942, 942, 11, accentColor);
    }

    if (showIcons) {
      // Mascota Le Burré en medallón dorado (o icono de la librería)
      withGroupTransform(ctx, data, "hero", 500, 122, function () {
        if (data.heroIcon === "none") return;
        const isMascot = !data.heroIcon || data.heroIcon === "original" || data.heroIcon === "leburre";
        const r = 86;

        // Medallón dorado común: mascota o cualquier icono de la librería
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 8;
        ctx.beginPath();
        ctx.arc(500, 122, r + 9, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(500, 122, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FBF4E4";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(500, 122, r, 0, Math.PI * 2);
        ctx.clip();
        if (isMascot && hasLogoImg) {
          ctx.drawImage(logoImg, 500 - r, 122 - r, r * 2, r * 2);
        } else if (isMascot) {
          drawLibraryVectorGlyph(ctx, "burrito", 500, 122, 120, bgColor, accentColor);
        } else {
          // Las imágenes (burger, BlueCode, logo subido) llenan su caja; los glifos vectoriales ocupan ~70%
          const isImageIcon = data.heroIcon === "burger" || data.heroIcon === "bluecode" || data.heroIcon === "custom";
          const iconScale = isImageIcon ? 0.62 : 0.98;
          ctx.translate(500, 122);
          ctx.scale(iconScale, iconScale);
          drawCustomHeroIconOverride(ctx, data.heroIcon, 0, 0, darkBg ? bgColor : "#1B1A1A", "#FBF4E4");
        }
        ctx.restore();
      });

      // Bloque NFC dentro del papel
      withGroupTransform(ctx, data, "nfc", 280, 690, function () {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = nfcTextColor;
        ctx.font = "800 25px 'Plus Jakarta Sans', Arial, sans-serif";
        let arcSize = 25;
        while (arcSize > 16 && ctx.measureText(arcText.toUpperCase()).width + arcText.length * 2.5 > 360) {
          arcSize -= 1;
          ctx.font = "800 " + arcSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
        }
        drawSpacedText(ctx, arcText.toUpperCase(), 280, 568, 2.5);
        ctx.restore();

        drawUnifiedMenuNfcIllustration(ctx, 296, 694, 0.74, nfcColor, paperColor);

        // Sello "7 SALSAS DE AUTOR"
        ctx.save();
        const pillW = 236;
        const pillH = 36;
        const pillY = 806;
        roundRectPath(ctx, 280 - pillW / 2, pillY, pillW, pillH, pillH / 2);
        ctx.fillStyle = nfcColor;
        ctx.fill();
        ctx.font = "800 14.5px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillStyle = paperColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        drawSpacedText(ctx, "7 SALSAS DE AUTOR", 280, pillY + pillH / 2 + 1, 1.6);
        drawSparkle(ctx, 280 - pillW / 2 + 22, pillY + pillH / 2, 7, accentColor);
        drawSparkle(ctx, 280 + pillW / 2 - 22, pillY + pillH / 2, 7, accentColor);
        ctx.restore();
      });
    }

    if (showText) {
      withGroupTransform(ctx, data, "title", 500, 330, function () {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        // Eyebrow espaciado con filetes y destellos
        const eyebrow = "COCINA ARTESANAL TEX-MEX";
        ctx.font = "800 15px 'Plus Jakarta Sans', Arial, sans-serif";
        ctx.fillStyle = accentColor;
        drawSpacedText(ctx, eyebrow, 500, 256, 4.2);
        const eyebrowHalf = (ctx.measureText(eyebrow).width + 4.2 * eyebrow.length) / 2;
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(500 - eyebrowHalf - 92, 251); ctx.lineTo(500 - eyebrowHalf - 32, 251);
        ctx.moveTo(500 + eyebrowHalf + 32, 251); ctx.lineTo(500 + eyebrowHalf + 92, 251);
        ctx.stroke();
        ctx.globalAlpha = 1;
        drawSparkle(ctx, 500 - eyebrowHalf - 16, 251, 7, accentColor);
        drawSparkle(ctx, 500 + eyebrowHalf + 16, 251, 7, accentColor);

        // Título principal
        ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = titleColor;
        drawFittedText(ctx, titleMain, 500, 358, 820, 112, 48, "800", "'Plus Jakarta Sans', Arial, sans-serif");

        // Subtítulo caligráfico
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = subtitleColor;
        drawFittedText(ctx, subtitle, 500, 432, 760, 52, 26, "400", "'Grand Hotel', 'Plus Jakarta Sans', cursive");
        ctx.restore();
      });
    }

    if (showQr) {
      withGroupTransform(ctx, data, "qr", 720, 690, function () {
        const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app/r/leburre";
        const captionMode = data.qrCaptionMode || "bottom-text";
        const isClean = captionMode === "clean";
        const withId = captionMode === "bottom-text-id";
        const boxSize = isClean ? 266 : withId ? 226 : 240;
        const boxX = 720 - boxSize / 2;
        const boxY = isClean ? 560 : 548;
        const qrPad = Math.round(boxSize * 0.075);
        const qrSize = boxSize - qrPad * 2;

        ctx.save();
        ctx.shadowColor = "rgba(60, 10, 10, 0.20)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 4;
        roundRectPath(ctx, boxX, boxY, boxSize, boxSize, 22);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.restore();
        roundRectPath(ctx, boxX, boxY, boxSize, boxSize, 22);
        ctx.strokeStyle = captionColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        drawQrMatrix(ctx, targetUrl, boxX + qrPad, boxY + qrPad, qrSize, buildQrOptionsFromData("leburre", data, "#7A0C0C", false));

        if (!isClean) {
          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = captionColor;
          const caption = cleanVisualText(data.qrCaptionText, "VER CARTA & SALSAS").toUpperCase();
          const capY = boxY + boxSize + 34;
          ctx.font = "800 19px 'Plus Jakarta Sans', Arial, sans-serif";
          let capSize = 19;
          while (capSize > 13 && ctx.measureText(caption).width + caption.length * 1.8 > 330) {
            capSize -= 1;
            ctx.font = "800 " + capSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
          }
          drawSpacedText(ctx, caption, 720, capY, 1.8);
          if (withId) {
            ctx.globalAlpha = 0.6;
            const slug = cleanVisualText(data.slug, "LE-BURRE").toUpperCase();
            drawFittedText(ctx, slug, 720, capY + 24, 300, 15, 11, "600", "'JetBrains Mono', monospace");
          }
          ctx.restore();
        }
      });
    }

    if (showBrand) {
      withGroupTransform(ctx, data, "brand", 500, 934, function () {
        drawPoweredByBlueCodeFooter(ctx, 500, 944, {
          lowercase: true,
          fontSize: 25,
          brandFontSize: 28,
          logoHeight: 30,
          prefixColor: darkBg ? "rgba(251, 244, 228, 0.82)" : "#222222",
          brandColor: darkBg ? "#FBF4E4" : "#1B1A1A"
        });
      });
    }

    if (!layerFilter || layerFilter === "all") {
      drawSelectionOverlayIfActive(ctx, "leburre", data);
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
    } else if (motif === "bluecode") {
      renderBlueCodePlaque(ctx, widthPx, heightPx, data, layerFilter);
    } else if (motif === "comida1" || motif === "comida2") {
      renderComidaPlaque(ctx, widthPx, heightPx, data, layerFilter, motif);
    } else if (motif === "leburre") {
      renderLeburrePlaque(ctx, widthPx, heightPx, data, layerFilter);
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
    // La página respeta la proporción del lienzo (con etiqueta es más alto que ancho);
    // antes se forzaba a cuadrado y el QR salía achatado verticalmente.
    const heightCm = cm * (qrCanvas.height / qrCanvas.width);
    const doc = new jsPDF({
      orientation: "p",
      unit: "cm",
      format: [cm, heightCm],
      compress: true
    });
    const imgData = qrCanvas.toDataURL("image/png", 1.0);
    doc.addImage(imgData, "PNG", 0, 0, cm, heightCm);
    const sizeLabel = cm + "x" + (Math.round(heightCm * 10) / 10) + "cm";
    doc.save("QR_Individual_BlueCode_" + (slug || "TAG") + "_" + sizeLabel + ".pdf");
    if (notifyFn) notifyFn("¡PDF Individual del QR (" + sizeLabel.replace("x", " × ").replace("cm", " cm") + ") descargado!");
  }

  window.BlueCodePlaqueStudio = {
    cmToPx: cmToPx,
    cmToPx300: cmToPx300,
    drawBlueCodeLogo: drawBlueCodeLogo,
    drawQrMatrix: drawQrMatrix,
    buildStyledQrSvg: buildStyledQrSvg,
    setCustomQrLogoImage: setCustomQrLogoImage,
    setCustomHeaderBgImage: setCustomHeaderBgImage,
    onAssetsLoaded: setOnAssetsLoaded,
    getTransformedHitBoxes: getTransformedHitBoxes,
    renderPlaqueToCanvas: renderPlaqueToCanvas,
    exportLayeredPsdFile: exportLayeredPsdFile,
    exportPlaquesToPdf: exportPlaquesToPdf,
    exportSingleQrCanvasToPdf: exportSingleQrCanvasToPdf
  };
})();
