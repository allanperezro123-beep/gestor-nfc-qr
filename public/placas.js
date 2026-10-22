/**
 * BlueCode — Estudio Generador de Placas NFC & QR y Motor de QR Personalizado Ultra-HD
 * Renderizado vectorial en Canvas 2D a 300 / 600 DPI, exportación PDF a escala real en cm,
 * Script Editable para Adobe Photoshop (.JSX) y archivo .PSD multicapa.
 */
(function () {
  "use strict";

  // Caminos vectoriales oficiales de logo_BC.svg (viewBox 0 0 600 354, recortado al área útil x:78..568, y:66..337)
  const BC_PATHS = [
    "M 83 68 H 230 C 269 68 296 89 307 121 C 311 132 310 141 304 151 L 261 199 Q 258 202 261 206 L 304 254 C 311 264 310 274 306 285 C 294 313 268 327 230 327 H 83 Q 79 327 79 323 V 72 Q 79 68 83 68 Z M 141 118 Q 138 118 138 122 V 166 Q 138 170 142 170 H 222 C 240 170 251 160 251 144 C 251 128 240 118 222 118 Z M 142 218 Q 138 218 138 222 V 273 Q 138 277 142 277 H 226 C 244 277 256 266 256 247 C 256 229 244 218 226 218 Z",
    "M 254 202 L 344 100 C 365 76 385 66 412 66 H 564 Q 568 66 565 70 L 523 116 Q 520 119 515 119 H 416 C 398 119 385 126 372 140 L 318 201 Q 315 205 319 209 L 372 263 C 385 277 398 284 416 284 H 520 Q 524 284 527 288 L 565 333 Q 568 337 563 337 H 416 C 386 337 364 327 343 305 L 254 209 Q 251 205 254 202 Z",
    "M 411 145 Q 420 145 426 151 L 441 166 Q 447 172 441 178 L 405 205 L 441 243 Q 447 249 441 255 L 427 263 Q 419 269 411 263 L 360 213 Q 353 206 360 198 L 401 152 Q 405 145 411 145 Z",
    "M 487 145 Q 478 145 472 152 L 466 159 Q 460 165 466 171 L 494 205 L 466 239 Q 460 245 466 251 L 472 258 Q 478 265 487 265 Q 493 265 499 258 L 538 213 Q 545 205 538 197 L 499 152 Q 493 145 487 145 Z"
  ];

  // Imagen personalizada subida por el usuario para el centro del QR (opcional)
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

  // Helper para rectángulos redondeados
  function roundRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  /**
   * Dibuja el logo vectorial oficial de BlueCode de forma 100% nítida,
   * SIN contornos blancos gruesos ni bordes artificiales, recortado a su caja exacta (490 x 271).
   */
  function drawBlueCodeLogo(ctx, x, y, height, opts) {
    opts = opts || {};
    // Caja exacta del glifo dentro de logo_BC.svg: x=[78..568] (w=490), y=[66..337] (h=271)
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
   * Dibuja el bloque completo "Powered by [Logo BC] BlueCode" centrado y limpio,
   * sin ningún borde blanco exagerado.
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

    // Si estamos sobre fondo de color (ej. placa Google), podemos poner una cápsula blanca limpia opcional
    if (opts.pillBg) {
      const padX = 22;
      const padY = 10;
      const pillH = Math.max(logoHeight, brandFontSize) + padY * 2;
      const pillY = baselineY - brandFontSize * 0.82 - padY;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      roundRectPath(ctx, startX - padX, pillY, totalW + padX * 2, pillH, pillH / 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.restore();
    }

    // 1. "Powered by"
    ctx.fillStyle = prefixColor;
    ctx.font = "600 " + fontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(prefixText, startX, baselineY);
    startX += pwWidth + gap1;

    // 2. Logo vectorial BC (limpio, sin contornos blancos)
    const logoY = baselineY - logoHeight * 0.86;
    drawBlueCodeLogo(ctx, startX, logoY, logoHeight, { solidColor: logoSolid });
    startX += logoWidth + gap2;

    // 3. "BlueCode"
    ctx.fillStyle = brandColor;
    ctx.font = "800 " + brandFontSize + "px 'Plus Jakarta Sans', Arial, sans-serif";
    ctx.fillText("BlueCode", startX, baselineY);

    ctx.restore();
  }

  // Dibuja una estrella de 5 puntas con puntas ligeramente suavizadas
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
   * ILUSTRACIÓN UNIFICADA NFC (Idéntica al diseño de Menu.png para las 3 tarjetas):
   * - Óvalo abierto a la izquierda con 4 ondas curvas NFC en su interior
   * - Smartphone inclinado (-9°) con altavoz y texto "NFC" en la pantalla
   * - Mano en línea limpia sujetando el teléfono (4 dedos a la izquierda, pulgar + palma a la derecha y puño)
   */
  function drawUnifiedMenuNfcIllustration(ctx, cx, cy, scale, strokeColor) {
    const col = strokeColor || "#181818";
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

    // 2. 4 ondas curvas NFC dentro del óvalo (creciendo de izquierda a derecha, igual a Menu.png)
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

    // Cuerpo del smartphone
    ctx.lineWidth = 8;
    roundRectPath(ctx, -44, -84, 88, 168, 15);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    // Ranura del altavoz superior
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

    // 4 dedos redondeados sujetando el borde izquierdo del teléfono
    ctx.lineWidth = 7.5;
    const fingerY = [-18, 4, 26, 48];
    for (let f = 0; f < fingerY.length; f++) {
      ctx.save();
      ctx.translate(-46, fingerY[f]);
      ctx.rotate((-8 * Math.PI) / 180);
      roundRectPath(ctx, -16, -9, 28, 18, 9);
      ctx.fillStyle = "#FFFFFF";
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
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 7.5;
    ctx.stroke();

    // Puño de la manga en ángulo (esquina inferior derecha de la mano)
    ctx.beginPath();
    ctx.moveTo(86, 54);
    ctx.lineTo(112, 66);
    ctx.lineTo(90, 122);
    ctx.lineTo(64, 110);
    ctx.closePath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 7.5;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  // ============================================================================
  // LOGOS CENTRALES PARA EL CÓDIGO QR (100% ESCANEABLES CON NIVEL 'H')
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
    // Mini tenedor y cuchara centrados
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
    const r = size * 0.45;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#25D366";
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = size * 0.09;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.48, 0.2 * Math.PI, 1.35 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  // Comprueba si una celda (r, c) pertenece a uno de los 3 ojos buscadores (7x7) del QR
  function isFinderPattern(r, c, count) {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= count - 7) return true;
    if (r >= count - 7 && c < 7) return true;
    return false;
  }

  // Dibuja un ojo buscador personalizado (7x7 módulos) para estilos redondeados/puntos
  function drawCustomFinderEye(ctx, x, y, cell, color, style) {
    const outerSize = 7 * cell;
    const innerOffset = 2 * cell;
    const innerSize = 3 * cell;
    const radiusOuter = style === "classic" ? 0 : cell * 1.8;
    const radiusInner = style === "classic" ? 0 : cell * 0.9;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = cell;

    // Anillo exterior 7x7 (trazo centrado a 0.5 celdas)
    roundRectPath(ctx, x + cell * 0.5, y + cell * 0.5, outerSize - cell, outerSize - cell, radiusOuter);
    ctx.stroke();

    // Núcleo interior 3x3
    roundRectPath(ctx, x + innerOffset, y + innerOffset, innerSize, innerSize, radiusInner);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Dibuja un código QR de alta precisión y 100% escaneable.
   * Garantiza lectura inmediata usando nivel 'H' (30% redundancia) y limpiando
   * únicamente un máximo del 20% central cuando lleva logo (solo ~4% de los módulos).
   */
  function drawQrMatrix(ctx, url, x, y, size, opts) {
    opts = opts || {};
    const logoType = opts.centerLogo && opts.centerLogo !== "none" ? opts.centerLogo : null;
    // Siempre usamos Nivel H cuando hay logo para garantizar que jamás falle el escaneo
    const ecLevel = "H";
    const qr = window.qrcode(0, ecLevel);
    qr.addData(url || "https://gestor-nfc-qr-2026.web.app");
    qr.make();

    const count = qr.getModuleCount();
    const cell = size / count;
    const style = opts.qrStyle || "classic";
    const fgColor = opts.color || "#111111";

    // Zona central despejada segura (máximo 20.5% del ancho = 4.2% del área total, ultra seguro para EC Level H)
    const clearHalf = logoType ? count * 0.105 : 0;
    const centerIdx = (count - 1) / 2;

    ctx.save();
    if (opts.bgWhite) {
      roundRectPath(ctx, x - cell * 2, y - cell * 2, size + cell * 4, size + cell * 4, opts.bgRadius || 0);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }

    // Si el estilo es rounded o dots, dibujamos los 3 ojos buscadores con esquinas suaves
    const useCustomEyes = style === "rounded" || style === "dots";
    if (useCustomEyes) {
      drawCustomFinderEye(ctx, x, y, cell, fgColor, style);
      drawCustomFinderEye(ctx, x + (count - 7) * cell, y, cell, fgColor, style);
      drawCustomFinderEye(ctx, x, y + (count - 7) * cell, cell, fgColor, style);
    }

    ctx.fillStyle = fgColor;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!qr.isDark(r, c)) continue;
        if (useCustomEyes && isFinderPattern(r, c, count)) continue;

        if (logoType) {
          if (Math.abs(r - centerIdx) <= clearHalf && Math.abs(c - centerIdx) <= clearHalf) {
            continue;
          }
        }

        const mx = x + c * cell;
        const my = y + r * cell;

        if (style === "dots") {
          ctx.beginPath();
          ctx.arc(mx + cell / 2, my + cell / 2, cell * 0.44, 0, Math.PI * 2);
          ctx.fill();
        } else if (style === "rounded") {
          roundRectPath(ctx, mx + cell * 0.04, my + cell * 0.04, cell * 0.92, cell * 0.92, cell * 0.32);
          ctx.fill();
        } else {
          // Clásico ultra nítido sin costuras
          ctx.fillRect(mx, my, cell + 0.35, cell + 0.35);
        }
      }
    }

    // Dibujar el logo central elegido dentro de su escudo blanco protector
    if (logoType) {
      const boxSize = size * 0.215;
      const bx = x + (size - boxSize) / 2;
      const by = y + (size - boxSize) / 2;

      // Fondo blanco protector con borde sutil para aislar el logo de los módulos del QR
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = boxSize * 0.08;
      roundRectPath(ctx, bx, by, boxSize, boxSize, boxSize * 0.22);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.restore();

      const cx = bx + boxSize / 2;
      const cy = by + boxSize / 2;

      if (logoType === "bluecode") {
        const logoH = boxSize * 0.46;
        const logoW = (490 / 271) * logoH;
        drawBlueCodeLogo(ctx, cx - logoW / 2, cy - logoH / 2, logoH);
      } else if (logoType === "google") {
        drawGoogleGIcon(ctx, cx, cy, boxSize * 0.34);
      } else if (logoType === "instagram") {
        drawInstagramBadgeIcon(ctx, cx, cy, boxSize * 0.88);
      } else if (logoType === "menu") {
        drawMenuBadgeIcon(ctx, cx, cy, boxSize * 0.88);
      } else if (logoType === "whatsapp") {
        drawWhatsappBadgeIcon(ctx, cx, cy, boxSize * 0.88);
      } else if (logoType === "custom" && customQrLogoImage) {
        ctx.save();
        const pad = boxSize * 0.12;
        roundRectPath(ctx, bx + pad, by + pad, boxSize - pad * 2, boxSize - pad * 2, boxSize * 0.14);
        ctx.clip();
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

  // Resuelve qué logo central usar según la configuración de la placa
  function resolvePlaqueQrLogo(motif, data) {
    const requested = data.qrCenterLogo || "auto";
    if (requested === "none") return null;
    if (requested === "auto") {
      if (motif === "google") return "google";
      return "bluecode";
    }
    return requested;
  }

  // ============================================================================
  // 1. RENDERIZADOR PLACA GOOGLE REVIEW (Con NFC estilo Menú y Logo BC nítido)
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

    roundRectPath(ctx, 0, 0, 1000, 1000, 76);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 1000, 1000);

      // Segmento Rojo Izquierdo
      ctx.beginPath();
      ctx.moveTo(0, 340);
      ctx.lineTo(122, 515);
      ctx.lineTo(0, 540);
      ctx.closePath();
      ctx.fillStyle = "#EA4335";
      ctx.fill();

      // Segmento Amarillo Inferior-Izquierdo (en L)
      ctx.beginPath();
      ctx.moveTo(0, 540);
      ctx.lineTo(122, 515);
      ctx.lineTo(122, 888);
      ctx.lineTo(465, 888);
      ctx.lineTo(465, 1000);
      ctx.lineTo(0, 1000);
      ctx.closePath();
      ctx.fillStyle = "#FBBC05";
      ctx.fill();

      // Segmento Verde Inferior-Derecho
      ctx.beginPath();
      ctx.moveTo(465, 888);
      ctx.lineTo(880, 888);
      ctx.lineTo(975, 1000);
      ctx.lineTo(465, 1000);
      ctx.closePath();
      ctx.fillStyle = "#34A853";
      ctx.fill();

      // Segmento Azul Derecho
      ctx.beginPath();
      ctx.moveTo(878, 422);
      ctx.lineTo(1000, 396);
      ctx.lineTo(1000, 1000);
      ctx.lineTo(975, 1000);
      ctx.lineTo(878, 888);
      ctx.closePath();
      ctx.fillStyle = "#4285F4";
      ctx.fill();

      // Tarjeta blanca interior
      roundRectPath(ctx, 118, 40, 764, 850, 36);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      // Bisel exterior
      roundRectPath(ctx, 2, 2, 996, 996, 75);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Anillo superior de 4 colores de Google (cx=500, cy=252, r=194)
      const cx = 500, cy = 252, r = 194;
      ctx.save();
      ctx.lineWidth = 22;
      ctx.lineCap = "butt";

      ctx.beginPath();
      ctx.strokeStyle = "#4285F4";
      ctx.arc(cx, cy, r, (172 * Math.PI) / 180, (270 * Math.PI) / 180);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#EA4335";
      ctx.arc(cx, cy, r, (270 * Math.PI) / 180, (368 * Math.PI) / 180);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#FBBC05";
      ctx.arc(cx, cy, r, (8 * Math.PI) / 180, (90 * Math.PI) / 180);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#34A853";
      ctx.arc(cx, cy, r, (90 * Math.PI) / 180, (172 * Math.PI) / 180);
      ctx.stroke();
      ctx.restore();

      // 5 Estrellas doradas
      const starX = [392, 446, 500, 554, 608];
      for (let i = 0; i < starX.length; i++) {
        drawStar(ctx, starX[i], 508, 21, 10, "#FBC02D");
      }

      // Ilustración NFC unificada (mismo diseño limpio que la tarjeta de Menú)
      drawUnifiedMenuNfcIllustration(ctx, 326, 706, 0.88, "#181818");
    }

    if (showText) {
      ctx.save();
      ctx.fillStyle = "#202124";
      ctx.textAlign = "center";
      const line1 = data.titleLine1 || data.googleLine1 || "Valóranos";
      const line2 = data.titleLine2 || data.googleLine2 || "en";
      const line3 = data.titleLine3 || "Google";

      ctx.font = "700 49px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(line1, 500, 195);
      ctx.font = "700 45px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(line2, 500, 249);

      if (line3.toLowerCase() === "google") {
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
        ctx.fillStyle = "#4285F4";
        ctx.fillText(line3, 500, 329);
      }
      ctx.restore();
    }

    if (showQr) {
      const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
      drawQrMatrix(ctx, targetUrl, 565, 560, 250, {
        centerLogo: resolvePlaqueQrLogo("google", data),
        qrStyle: data.qrStyle || "classic",
        color: data.qrColor || "#111111"
      });
    }

    if (showBrand) {
      // Footer limpio sin contorno blanco feo: "Powered by" sobre el amarillo y cápsula/logo limpio sobre el verde
      ctx.save();
      ctx.fillStyle = "#181818";
      ctx.font = "700 26px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("Powered by", 448, 954);

      // Cápsula blanca suave en el lado verde para que el logo BlueCode en su gradiente original luzca 100% nítido y sin bordes deformes
      roundRectPath(ctx, 476, 913, 252, 58, 29);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      drawBlueCodeLogo(ctx, 494, 924, 36);

      ctx.fillStyle = "#0F172A";
      ctx.font = "800 30px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("BlueCode", 568, 953);
      ctx.restore();
    }

    ctx.restore();
  }

  // ============================================================================
  // 2. RENDERIZADOR PLACA INSTAGRAM (Con NFC estilo Menú y Logo BC nítido)
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

    roundRectPath(ctx, 0, 0, 1000, 1000, 88);
    ctx.clip();

    if (showBg) {
      const igBorderGrad = ctx.createLinearGradient(0, 0, 1000, 1000);
      igBorderGrad.addColorStop(0, "#FFE033");
      igBorderGrad.addColorStop(0.22, "#FF7A1A");
      igBorderGrad.addColorStop(0.5, "#FF0069");
      igBorderGrad.addColorStop(0.78, "#E0009B");
      igBorderGrad.addColorStop(1, "#9B2DEF");
      ctx.fillStyle = igBorderGrad;
      ctx.fillRect(0, 0, 1000, 1000);

      // Brillo acrílico superior derecho
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(860, 32);
      ctx.quadraticCurveTo(915, 32, 938, 52);
      ctx.strokeStyle = "rgba(255,255,255,0.88)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Tarjeta blanca interior
      roundRectPath(ctx, 56, 56, 888, 888, 62);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      // Marco fino negro interior con abertura inferior central
      ctx.save();
      ctx.strokeStyle = "#181818";
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";
      roundRectPath(ctx, 114, 114, 772, 766, 44);
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(345, 868, 310, 26);
      ctx.restore();
    }

    if (showIcons) {
      // Ícono central de cámara de Instagram
      ctx.save();
      const camGrad = ctx.createLinearGradient(408, 352, 592, 168);
      camGrad.addColorStop(0, "#FEDA75");
      camGrad.addColorStop(0.28, "#FA7E1E");
      camGrad.addColorStop(0.6, "#D62976");
      camGrad.addColorStop(1, "#962FBF");

      ctx.strokeStyle = camGrad;
      ctx.lineWidth = 17;
      roundRectPath(ctx, 412, 172, 176, 176, 46);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(500, 260, 44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(548, 212, 11, 0, Math.PI * 2);
      ctx.fillStyle = camGrad;
      ctx.fill();

      // 3 Ondas rosas a la izquierda y 3 a la derecha
      ctx.strokeStyle = "#E11D74";
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

      // Ilustración NFC unificada (mismo diseño limpio que la tarjeta de Menú)
      drawUnifiedMenuNfcIllustration(ctx, 332, 682, 0.86, "#141414");
    }

    if (showText) {
      ctx.save();
      ctx.fillStyle = "#141414";
      ctx.textAlign = "center";

      ctx.font = "400 78px 'Grand Hotel', 'Brush Script MT', cursive";
      ctx.fillText(data.titleScript || data.igTitle || "Instagram", 500, 446);

      ctx.font = "500 33px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.subtitle || data.igSubtitle || "¡Acerca tu móvil y síguenos!", 500, 504);
      ctx.restore();
    }

    if (showQr) {
      const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
      drawQrMatrix(ctx, targetUrl, 558, 548, 240, {
        centerLogo: resolvePlaqueQrLogo("instagram", data),
        qrStyle: data.qrStyle || "classic",
        color: data.qrColor || "#141414"
      });
    }

    if (showBrand) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#555555";
      ctx.font = "600 18px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("Powered by", 500, 842);

      // Logo BC + BlueCode centrado en el hueco inferior
      const logoH = 34;
      const logoW = (490 / 271) * logoH;
      ctx.font = "800 31px 'Plus Jakarta Sans', Arial, sans-serif";
      const txtW = ctx.measureText("BlueCode").width;
      const gap = 10;
      const totalW = logoW + gap + txtW;
      const startX = 500 - totalW / 2;

      drawBlueCodeLogo(ctx, startX, 853, logoH);

      ctx.fillStyle = "#111111";
      ctx.textAlign = "left";
      ctx.fillText("BlueCode", startX + logoW + gap, 881);

      const miniStars = [468, 484, 500, 516, 532];
      for (let s = 0; s < miniStars.length; s++) {
        drawStar(ctx, miniStars[s], 903, 6, 3, "#F59E0B");
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // ============================================================================
  // 3. RENDERIZADOR PLACA MENÚ (Idéntico al 100% a Menu.png con Logo BC nítido)
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

    roundRectPath(ctx, 0, 0, 1000, 1000, 82);
    ctx.clip();

    if (showBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 1000, 1000);

      // Franja celeste suave debajo de la curva oscura (#DCE8F3)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 492);
      ctx.bezierCurveTo(760, 505, 520, 365, 0, 542);
      ctx.closePath();
      ctx.fillStyle = "#DCE8F3";
      ctx.fill();

      // Cabecera superior negra/carbón con curva suave
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 472);
      ctx.bezierCurveTo(760, 485, 520, 342, 0, 520);
      ctx.closePath();
      ctx.fillStyle = "#1B1A1A";
      ctx.fill();

      roundRectPath(ctx, 2, 2, 996, 996, 80);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Ícono superior de Tenedor y Cuchara blancos
      ctx.save();
      ctx.fillStyle = "#FFFFFF";

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

      // Ilustración NFC unificada (diseño original de Menu.png)
      drawUnifiedMenuNfcIllustration(ctx, 338, 732, 0.96, "#1B1A1A");
    }

    if (showText) {
      ctx.save();
      ctx.textAlign = "center";

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 124px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.titleMain || data.menuTitle || "MENU", 500, 322);

      ctx.font = "400 34px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.subtitle || data.menuSubtitle || "VIEW OUR MENU ONLINE", 500, 386);

      // Texto curvo "TAP YOUR PHONE" sobre la ilustración NFC
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
        "#1B1A1A"
      );

      // "OR" / "SCAN QR" sobre el QR derecho
      ctx.fillStyle = "#1B1A1A";
      ctx.font = "500 26px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("OR", 760, 542);
      ctx.font = "800 30px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("SCAN QR", 760, 578);

      // Código ID debajo del QR
      ctx.fillStyle = "#333333";
      ctx.font = "600 21px 'JetBrains Mono', monospace";
      ctx.fillText((data.slug || "TAG-ID").toUpperCase(), 760, 868);
      ctx.restore();
    }

    if (showQr) {
      const targetUrl = data.qrUrl || data.url || "https://gestor-nfc-qr-2026.web.app";
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      roundRectPath(ctx, 644, 598, 232, 232, 16);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.restore();

      roundRectPath(ctx, 644, 598, 232, 232, 16);
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 3;
      ctx.stroke();

      drawQrMatrix(ctx, targetUrl, 662, 616, 196, {
        centerLogo: resolvePlaqueQrLogo("menu", data),
        qrStyle: data.qrStyle || "classic",
        color: data.qrColor || "#1B1A1A"
      });
    }

    if (showBrand) {
      drawPoweredByBlueCodeFooter(ctx, 500, 954, {
        lowercase: true,
        fontSize: 27,
        brandFontSize: 30,
        logoHeight: 33
      });
    }

    ctx.restore();
  }

  // Función unificada de dibujo por tipo con suavizado de máxima calidad
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
  // GENERADOR DE SCRIPT EDITABLE PARA ADOBE PHOTOSHOP (.JSX a 300/600 DPI)
  // ============================================================================
  function generatePhotoshopJsx(configs, widthCm, heightCm, customDpi) {
    const dpi = customDpi || 300;
    const W = Math.round((widthCm / 2.54) * dpi);
    const H = Math.round((heightCm / 2.54) * dpi);

    const serializedConfigs = configs.map(function (c) {
      const targetUrl = c.qrUrl || c.url || "https://gestor-nfc-qr-2026.web.app";
      const logoType = resolvePlaqueQrLogo(c.motif, c);
      const qr = window.qrcode(0, "H");
      qr.addData(targetUrl);
      qr.make();
      const count = qr.getModuleCount();
      const clearHalf = logoType ? count * 0.105 : 0;
      const centerIdx = (count - 1) / 2;

      const rows = [];
      for (let r = 0; r < count; r++) {
        let bits = "";
        for (let col = 0; col < count; col++) {
          if (logoType && Math.abs(r - centerIdx) <= clearHalf && Math.abs(col - centerIdx) <= clearHalf) {
            bits += "0";
            continue;
          }
          bits += qr.isDark(r, col) ? "1" : "0";
        }
        rows.push(bits);
      }
      return {
        motif: c.motif,
        slug: c.slug || "TAG",
        url: targetUrl,
        qrColor: (c.qrColor || "#111111").replace("#", ""),
        qrRows: rows,
        googleLine1: c.titleLine1 || c.googleLine1 || "Valóranos",
        googleLine2: c.titleLine2 || c.googleLine2 || "en",
        googleLine3: c.titleLine3 || "Google",
        igTitle: c.titleScript || c.igTitle || "Instagram",
        igSubtitle: c.subtitle || c.igSubtitle || "¡Acerca tu móvil y síguenos!",
        menuTitle: c.titleMain || c.menuTitle || "MENU",
        menuSubtitle: c.subtitle || c.menuSubtitle || "VIEW OUR MENU ONLINE",
        menuTapText: c.arcText || c.menuTapText || "TAP YOUR PHONE"
      };
    });

    return `// ============================================================================
// Script Editable para Adobe Photoshop — Generador Oficial BlueCode NFC & QR
// Dimensiones físicas: ${widthCm} x ${heightCm} cm @ ${dpi} DPI (${W} x ${H} px)
// Instrucciones en Photoshop: Archivo > Secuencias de comandos > Examinar...
// ============================================================================
#target photoshop
app.bringToFront();

function hexToRGB(hex) {
    var c = new SolidColor();
    c.rgb.hexValue = hex.replace("#", "");
    return c;
}

function createPolygonLayer(parent, name, pointsPx, hexColor) {
    var doc = app.activeDocument;
    var layer = parent.artLayers.add();
    layer.name = name;
    doc.selection.select(pointsPx);
    doc.selection.fill(hexToRGB(hexColor));
    doc.selection.deselect();
    return layer;
}

function createRectLayer(parent, name, x1, y1, x2, y2, hexColor) {
    return createPolygonLayer(parent, name, [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], hexColor);
}

function createTextLayer(parent, name, content, xPx, yPx, sizePt, hexColor, isBold, align) {
    var layer = parent.artLayers.add();
    layer.kind = LayerKind.TEXT;
    layer.name = name;
    var ti = layer.textItem;
    ti.contents = content;
    ti.font = isBold ? "Arial-BoldMT" : "ArialMT";
    ti.size = new UnitValue(sizePt, "pt");
    ti.color = hexToRGB(hexColor);
    ti.justification = align || Justification.CENTER;
    ti.position = [new UnitValue(xPx, "px"), new UnitValue(yPx, "px")];
    return layer;
}

function drawQrLayer(parent, name, qrRows, boxX, boxY, boxSize, hexColor) {
    var doc = app.activeDocument;
    var layer = parent.artLayers.add();
    layer.name = name;
    var count = qrRows.length;
    var cell = boxSize / count;
    var color = hexToRGB(hexColor);

    for (var r = 0; r < count; r++) {
        var rowStr = qrRows[r];
        var c = 0;
        while (c < count) {
            if (rowStr.charAt(c) === "1") {
                var startC = c;
                while (c < count && rowStr.charAt(c) === "1") { c++; }
                var x1 = Math.round(boxX + startC * cell);
                var x2 = Math.round(boxX + c * cell);
                var y1 = Math.round(boxY + r * cell);
                var y2 = Math.round(boxY + (r + 1) * cell);
                doc.selection.select([[x1, y1], [x2, y1], [x2, y2], [x1, y2]]);
                doc.selection.fill(color);
            } else {
                c++;
            }
        }
    }
    doc.selection.deselect();
    return layer;
}

function buildPlaqueDocument(cfg, W, H, scalePt) {
    var sX = function(v) { return Math.round((v / 1000) * W); };
    var sY = function(v) { return Math.round((v / 1000) * H); };
    var sPt = function(pt) { return Math.round(pt * scalePt * 10) / 10; };

    var docName = "Placa_BlueCode_" + cfg.motif.toUpperCase() + "_" + cfg.slug + "_${widthCm}x${heightCm}cm";
    var doc = app.documents.add(W, H, ${dpi}, docName, NewDocumentMode.RGB, DocumentFill.WHITE);

    var grpMarco = doc.layerSets.add();
    grpMarco.name = "1_Marco_y_Fondo";

    var grpGraficos = doc.layerSets.add();
    grpGraficos.name = "2_Iconos_NFC_Unificado";

    var grpQR = doc.layerSets.add();
    grpQR.name = "3_Codigo_QR_Dinamico";

    var grpBrand = doc.layerSets.add();
    grpBrand.name = "4_Powered_By_BlueCode";

    var grpTextos = doc.layerSets.add();
    grpTextos.name = "5_Textos_Editables";

    if (cfg.motif === "google") {
        createPolygonLayer(grpMarco, "Segmento_Izq_Rojo", [[0, sY(340)], [sX(122), sY(515)], [0, sY(540)]], "#EA4335");
        createPolygonLayer(grpMarco, "Segmento_Inf_Izq_Amarillo", [[0, sY(540)], [sX(122), sY(515)], [sX(122), sY(888)], [sX(465), sY(888)], [sX(465), sY(1000)], [0, sY(1000)]], "#FBBC05");
        createPolygonLayer(grpMarco, "Segmento_Inf_Der_Verde", [[sX(465), sY(888)], [sX(880), sY(888)], [sX(975), sY(1000)], [sX(465), sY(1000)]], "#34A853");
        createPolygonLayer(grpMarco, "Segmento_Der_Azul", [[sX(878), sY(422)], [sX(1000), sY(396)], [sX(1000), sY(1000)], [sX(975), sY(1000)], [sX(878), sY(888)]], "#4285F4");
        createRectLayer(grpMarco, "Interior_Blanco", sX(118), sY(40), sX(882), sY(888), "#FFFFFF");

        createRectLayer(grpGraficos, "Guia_NFC_Unificado", sX(180), sY(580), sX(460), sY(825), "#F8FAFC");
        createRectLayer(grpQR, "Fondo_Guia_QR", sX(560), sY(555), sX(820), sY(815), "#FFFFFF");
        drawQrLayer(grpQR, "QR_Generado_" + cfg.slug, cfg.qrRows, sX(565), sY(560), sX(250), cfg.qrColor);

        createTextLayer(grpBrand, "Powered_By", "Powered by", sX(440), sY(954), sPt(12), "#181818", true, Justification.RIGHT);
        createRectLayer(grpBrand, "Capsula_Blanca_BC", sX(476), sY(915), sX(728), sY(970), "#FFFFFF");
        createRectLayer(grpBrand, "Logo_BC_Icon", sX(494), sY(924), sX(558), sY(960), "#0865F5");
        createTextLayer(grpBrand, "BlueCode_Brand", "BlueCode", sX(568), sY(953), sPt(14), "#0F172A", true, Justification.LEFT);

        createTextLayer(grpTextos, "Titulo_Valoranos", cfg.googleLine1, sX(500), sY(195), sPt(22), "#202124", true);
        createTextLayer(grpTextos, "Subtitulo_En", cfg.googleLine2, sX(500), sY(249), sPt(20), "#202124", true);
        createTextLayer(grpTextos, "Texto_Google", cfg.googleLine3, sX(500), sY(329), sPt(34), "#4285F4", true);
        createTextLayer(grpTextos, "Estrellas_5", "★ ★ ★ ★ ★", sX(500), sY(514), sPt(28), "#FBC02D", true);
        createTextLayer(grpTextos, "Texto_NFC", "NFC", sX(382), sY(656), sPt(12), "#181818", true);
    } else if (cfg.motif === "instagram") {
        createRectLayer(grpMarco, "Marco_Superior_Rosa_Naranja", 0, 0, W, sY(500), "#FF0069");
        createRectLayer(grpMarco, "Marco_Inferior_Magenta_Violeta", 0, sY(500), W, H, "#A334FA");
        createRectLayer(grpMarco, "Tarjeta_Blanca_Interior", sX(56), sY(56), sX(944), sY(944), "#FFFFFF");
        createRectLayer(grpMarco, "Linea_Marco_Negro", sX(114), sY(114), sX(886), sY(880), "#181818");
        createRectLayer(grpMarco, "Fondo_Interior_Blanco", sX(120), sY(120), sX(880), sY(874), "#FFFFFF");

        createRectLayer(grpGraficos, "Icono_Camara_Instagram", sX(412), sY(172), sX(588), sY(348), "#E1306C");
        createRectLayer(grpGraficos, "Guia_NFC_Unificado", sX(185), sY(565), sX(465), sY(795), "#F8FAFC");
        drawQrLayer(grpQR, "QR_Generado_" + cfg.slug, cfg.qrRows, sX(558), sY(548), sX(240), cfg.qrColor);

        createRectLayer(grpBrand, "Hueco_Inferior_Blanco", sX(345), sY(840), sX(655), sY(915), "#FFFFFF");
        createTextLayer(grpBrand, "Powered_By", "Powered by", sX(500), sY(842), sPt(9), "#555555", false);
        createRectLayer(grpBrand, "Logo_BC_Icon", sX(395), sY(853), sX(456), sY(887), "#0865F5");
        createTextLayer(grpBrand, "BlueCode_Brand", "BlueCode", sX(466), sY(881), sPt(15), "#111111", true, Justification.LEFT);

        createTextLayer(grpTextos, "Titulo_Instagram", cfg.igTitle, sX(500), sY(446), sPt(34), "#141414", true);
        createTextLayer(grpTextos, "Subtitulo_Siguenos", cfg.igSubtitle, sX(500), sY(504), sPt(15), "#141414", false);
        createTextLayer(grpTextos, "Texto_NFC", "NFC", sX(385), sY(635), sPt(12), "#141414", true);
    } else {
        createRectLayer(grpMarco, "Fondo_Blanco", 0, 0, W, H, "#FFFFFF");
        createPolygonLayer(grpMarco, "Banda_Celeste_Curva", [[0, 0], [W, 0], [W, sY(492)], [sX(520), sY(445)], [0, sY(542)]], "#DCE8F3");
        createPolygonLayer(grpMarco, "Cabecera_Negra_Menu", [[0, 0], [W, 0], [W, sY(472)], [sX(520), sY(425)], [0, sY(520)]], "#1B1A1A");

        createRectLayer(grpGraficos, "Icono_Cubiertos_Blanco", sX(442), sY(42), sX(560), sY(200), "#FFFFFF");
        createRectLayer(grpGraficos, "Guia_NFC_Unificado", sX(170), sY(615), sX(510), sY(850), "#F8FAFC");
        createRectLayer(grpQR, "Tarjeta_QR_Blanca", sX(644), sY(598), sX(876), sY(830), "#FFFFFF");
        drawQrLayer(grpQR, "QR_Generado_" + cfg.slug, cfg.qrRows, sX(662), sY(616), sX(196), cfg.qrColor);

        createTextLayer(grpBrand, "Powered_By", "powered by", sX(460), sY(954), sPt(13), "#222222", false, Justification.RIGHT);
        createRectLayer(grpBrand, "Logo_BC_Icon", sX(475), sY(924), sX(535), sY(957), "#0865F5");
        createTextLayer(grpBrand, "BlueCode_Brand", "BlueCode", sX(545), sY(954), sPt(14), "#111111", true, Justification.LEFT);

        createTextLayer(grpTextos, "Titulo_MENU", cfg.menuTitle, sX(500), sY(322), sPt(56), "#FFFFFF", true);
        createTextLayer(grpTextos, "Subtitulo_VIEW_ONLINE", cfg.menuSubtitle, sX(500), sY(386), sPt(15), "#FFFFFF", false);
        createTextLayer(grpTextos, "Texto_TAP_YOUR_PHONE", cfg.menuTapText, sX(342), sY(585), sPt(15), "#1B1A1A", true);
        createTextLayer(grpTextos, "Texto_OR", "OR", sX(760), sY(542), sPt(12), "#1B1A1A", false);
        createTextLayer(grpTextos, "Texto_SCAN_QR", "SCAN QR", sX(760), sY(578), sPt(14), "#1B1A1A", true);
        createTextLayer(grpTextos, "Texto_ID_Slug", cfg.slug.toUpperCase(), sX(760), sY(868), sPt(10), "#333333", false);
    }
}

function main() {
    var oldRuler = app.preferences.rulerUnits;
    var oldType = app.preferences.typeUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    app.preferences.typeUnits = TypeUnits.POINTS;

    var W = ${W};
    var H = ${H};
    var scalePt = ${widthCm} / 10.0;
    var configs = ${JSON.stringify(serializedConfigs, null, 2)};

    for (var i = 0; i < configs.length; i++) {
        buildPlaqueDocument(configs[i], W, H, scalePt);
    }

    app.preferences.rulerUnits = oldRuler;
    app.preferences.typeUnits = oldType;
    alert("¡Listo! Se generaron " + configs.length + " documento(s) editables BlueCode (${widthCm}x${heightCm} cm @ ${dpi} DPI).");
}

main();
`;
  }

  // ============================================================================
  // EXPORTADOR DIRECTO A ARCHIVO .PSD MULTICAPA EN ALTA RESOLUCIÓN
  // ============================================================================
  function exportLayeredPsdFile(motif, cfg, widthCm, heightCm, notifyFn, customDpi) {
    if (!window.agPsd || !window.agPsd.writePsd) {
      if (notifyFn) notifyFn("Librería PSD aún cargando, intenta en 1 segundo.");
      return false;
    }
    const dpi = customDpi || 300;
    const W = Math.round((widthCm / 2.54) * dpi);
    const H = Math.round((heightCm / 2.54) * dpi);

    function makeLayerCanvas(filterName) {
      const c = document.createElement("canvas");
      renderPlaqueToCanvas(c, motif, W, H, cfg, filterName);
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
    renderPlaqueToCanvas(compositeCanvas, motif, W, H, cfg, "all");
    psd.canvas = compositeCanvas;

    const buffer = window.agPsd.writePsd(psd);
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Placa_BlueCode_" + motif.toUpperCase() + "_" + (cfg.slug || "TAG") + "_" + widthCm + "x" + heightCm + "cm_" + dpi + "DPI.psd";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    if (notifyFn) notifyFn("Archivo Photoshop .PSD multicapa (" + W + "×" + H + " px) descargado.");
    return true;
  }

  // ============================================================================
  // EXPORTADOR A PDF DE IMPRESIÓN EN ULTRA ALTA CALIDAD (HASTA 600 DPI)
  // ============================================================================
  function exportPlaquesToPdf(queueItems, widthCm, heightCm, pdfMode, notifyFn, customDpi) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("La librería PDF aún está cargando. Intenta en 1 segundo.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const dpi = customDpi || 600;
    // Hasta 2800x2800 px por placa para calidad fotográfica de imprenta sin pérdida
    const pxW = Math.min(2800, Math.round((widthCm / 2.54) * dpi));
    const pxH = Math.min(2800, Math.round((heightCm / 2.54) * dpi));

    const workCanvas = document.createElement("canvas");

    // Normalizar elementos de la cola (soporta tanto {motif, cfg} como objetos directos con .copies)
    const expanded = [];
    const cacheByMotif = {};

    for (let i = 0; i < queueItems.length; i++) {
      const raw = queueItems[i];
      const motif = raw.motif;
      const cfg = raw.cfg || raw;
      const copies = raw.copies || 1;
      const cacheKey = motif + "_" + (cfg.slug || "") + "_" + (cfg.qrUrl || cfg.url || "") + "_" + (cfg.qrCenterLogo || "") + "_" + (cfg.qrStyle || "") + "_" + (cfg.qrColor || "");

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

      doc.save("Placas_BlueCode_" + widthCm + "x" + heightCm + "cm_" + dpi + "DPI_EscalaReal.pdf");
      if (notifyFn) notifyFn("¡PDF Ultra-HD 1:1 (" + widthCm + "×" + heightCm + " cm @ " + dpi + " DPI) descargado!");
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

      // Guías de corte de precisión
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

    doc.save("Placas_BlueCode_HojaImpresion_" + widthCm + "x" + heightCm + "cm_" + dpi + "DPI.pdf");
    if (notifyFn) notifyFn("¡PDF Ultra-HD con guías (" + expanded.length + " placas @ " + dpi + " DPI) descargado!");
  }

  // Exponer API global para index.html
  window.BlueCodePlaqueStudio = {
    cmToPx: cmToPx,
    cmToPx300: cmToPx300,
    drawBlueCodeLogo: drawBlueCodeLogo,
    drawQrMatrix: drawQrMatrix,
    setCustomQrLogoImage: setCustomQrLogoImage,
    renderPlaqueToCanvas: renderPlaqueToCanvas,
    generatePhotoshopJsx: generatePhotoshopJsx,
    exportLayeredPsdFile: exportLayeredPsdFile,
    exportPlaquesToPdf: exportPlaquesToPdf
  };
})();
