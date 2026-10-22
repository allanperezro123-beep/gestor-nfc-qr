/**
 * BlueCode — Estudio Generador de Placas NFC & QR (Google Review, Instagram, Menú)
 * Renderizado 100% fiel a 300 DPI, exportación PDF a escala real en cm,
 * Script Editable para Adobe Photoshop (.JSX) y archivo .PSD multicapa.
 */
(function () {
  "use strict";

  // Caminos vectoriales oficiales de logo_BC.svg (viewBox 0 0 600 354)
  const BC_PATHS = [
    "M 83 68 H 230 C 269 68 296 89 307 121 C 311 132 310 141 304 151 L 261 199 Q 258 202 261 206 L 304 254 C 311 264 310 274 306 285 C 294 313 268 327 230 327 H 83 Q 79 327 79 323 V 72 Q 79 68 83 68 Z M 141 118 Q 138 118 138 122 V 166 Q 138 170 142 170 H 222 C 240 170 251 160 251 144 C 251 128 240 118 222 118 Z M 142 218 Q 138 218 138 222 V 273 Q 138 277 142 277 H 226 C 244 277 256 266 256 247 C 256 229 244 218 226 218 Z",
    "M 254 202 L 344 100 C 365 76 385 66 412 66 H 564 Q 568 66 565 70 L 523 116 Q 520 119 515 119 H 416 C 398 119 385 126 372 140 L 318 201 Q 315 205 319 209 L 372 263 C 385 277 398 284 416 284 H 520 Q 524 284 527 288 L 565 333 Q 568 337 563 337 H 416 C 386 337 364 327 343 305 L 254 209 Q 251 205 254 202 Z",
    "M 411 145 Q 420 145 426 151 L 441 166 Q 447 172 441 178 L 405 205 L 441 243 Q 447 249 441 255 L 427 263 Q 419 269 411 263 L 360 213 Q 353 206 360 198 L 401 152 Q 405 145 411 145 Z",
    "M 487 145 Q 478 145 472 152 L 466 159 Q 460 165 466 171 L 494 205 L 466 239 Q 460 245 466 251 L 472 258 Q 478 265 487 265 Q 493 265 499 258 L 538 213 Q 545 205 538 197 L 499 152 Q 493 145 487 145 Z"
  ];

  // Dibuja el logo vectorial oficial de BlueCode en cualquier contexto Canvas 2D
  function drawBlueCodeLogo(ctx, x, y, height, opts) {
    opts = opts || {};
    const scale = height / 354;
    const width = 600 * scale;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    let fillStyle;
    if (opts.solidColor) {
      fillStyle = opts.solidColor;
    } else {
      const grad = ctx.createLinearGradient(78, 180, 566, 180);
      grad.addColorStop(0, "#0865F5");
      grad.addColorStop(0.28, "#087CF5");
      grad.addColorStop(0.53, "#079AF0");
      grad.addColorStop(0.76, "#04B9EA");
      grad.addColorStop(1, "#08D0E6");
      fillStyle = grad;
    }

    ctx.fillStyle = fillStyle;
    for (let i = 0; i < BC_PATHS.length; i++) {
      const p = new Path2D(BC_PATHS[i]);
      if (opts.outlineColor) {
        ctx.strokeStyle = opts.outlineColor;
        ctx.lineWidth = opts.outlineWidth || 16;
        ctx.lineJoin = "round";
        ctx.stroke(p);
      }
      ctx.fill(p, "evenodd");
    }
    ctx.restore();
    return width;
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

  // Dibuja el código QR en las coordenadas indicadas (en espacio 1000x1000)
  function drawQrMatrix(ctx, url, x, y, size, opts) {
    opts = opts || {};
    const ecLevel = opts.centerLogo ? "H" : "M";
    const qr = window.qrcode(0, ecLevel);
    qr.addData(url || "https://gestor-nfc-qr-2026.web.app");
    qr.make();
    const count = qr.getModuleCount();
    const cell = size / count;

    ctx.save();
    if (opts.bgWhite) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x, y, size, size);
    }

    ctx.fillStyle = opts.color || "#111111";
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          // Si lleva logo central (Google G), dejar libre el cuadro central
          if (opts.centerLogo) {
            const centerStart = count * 0.36;
            const centerEnd = count * 0.64;
            if (r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
              continue;
            }
          }
          ctx.fillRect(
            x + c * cell,
            y + r * cell,
            Math.ceil(cell + 0.35),
            Math.ceil(cell + 0.35)
          );
        }
      }
    }

    if (opts.centerLogo === "google") {
      const boxSize = size * 0.25;
      const bx = x + (size - boxSize) / 2;
      const by = y + (size - boxSize) / 2;
      roundRectPath(ctx, bx, by, boxSize, boxSize, boxSize * 0.18);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      drawGoogleGIcon(ctx, bx + boxSize / 2, by + boxSize / 2, boxSize * 0.36);
    }

    ctx.restore();
  }

  // Ícono oficial 'G' de Google multicolor para el centro del QR
  function drawGoogleGIcon(ctx, cx, cy, r) {
    ctx.save();
    ctx.lineWidth = r * 0.42;
    ctx.lineCap = "butt";

    // Rojo superior
    ctx.beginPath();
    ctx.strokeStyle = "#EA4335";
    ctx.arc(cx, cy, r, -Math.PI * 0.78, -Math.PI * 0.18);
    ctx.stroke();

    // Amarillo izquierdo
    ctx.beginPath();
    ctx.strokeStyle = "#FBBC05";
    ctx.arc(cx, cy, r, Math.PI * 0.78, Math.PI * 1.22);
    ctx.stroke();

    // Verde inferior
    ctx.beginPath();
    ctx.strokeStyle = "#34A853";
    ctx.arc(cx, cy, r, Math.PI * 0.18, Math.PI * 0.78);
    ctx.stroke();

    // Azul derecho + barra horizontal
    ctx.beginPath();
    ctx.strokeStyle = "#4285F4";
    ctx.arc(cx, cy, r, -Math.PI * 0.02, Math.PI * 0.22);
    ctx.stroke();

    ctx.fillStyle = "#4285F4";
    ctx.fillRect(cx, cy - r * 0.2, r * 1.18, r * 0.4);
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

  // ============================================================================
  // 1. RENDERIZADOR PLACA GOOGLE REVIEW (Idéntico al 100% a google.png)
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

    // Recorte general con esquinas redondeadas de placa acrílica
    roundRectPath(ctx, 0, 0, 1000, 1000, 76);
    ctx.clip();

    if (showBg) {
      // Fondo blanco base
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 1000, 1000);

      // Segmento Rojo Izquierdo (Trapecio diagonal igual a google.png)
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

      // Tarjeta blanca interior con esquinas inferiores redondeadas (cubre uniones internas)
      roundRectPath(ctx, 120, 40, 760, 850, 36);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      // Sutil bisel exterior para acabado limpio de impresión
      roundRectPath(ctx, 2, 2, 996, 996, 75);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Anillo superior de 4 colores de Google (cx=500, cy=255, r=196)
      const cx = 500, cy = 255, r = 196;
      ctx.save();
      ctx.lineWidth = 22;
      ctx.lineCap = "butt";

      // Azul (arriba-izquierda: 172° a 270°)
      ctx.beginPath();
      ctx.strokeStyle = "#4285F4";
      ctx.arc(cx, cy, r, (172 * Math.PI) / 180, (270 * Math.PI) / 180);
      ctx.stroke();

      // Rojo (arriba-derecha: 270° a 8°)
      ctx.beginPath();
      ctx.strokeStyle = "#EA4335";
      ctx.arc(cx, cy, r, (270 * Math.PI) / 180, (368 * Math.PI) / 180);
      ctx.stroke();

      // Amarillo (abajo-derecha: 8° a 90°)
      ctx.beginPath();
      ctx.strokeStyle = "#FBBC05";
      ctx.arc(cx, cy, r, (8 * Math.PI) / 180, (90 * Math.PI) / 180);
      ctx.stroke();

      // Verde (abajo-izquierda: 90° a 172°)
      ctx.beginPath();
      ctx.strokeStyle = "#34A853";
      ctx.arc(cx, cy, r, (90 * Math.PI) / 180, (172 * Math.PI) / 180);
      ctx.stroke();
      ctx.restore();

      // 5 Estrellas doradas (y = 510)
      const starX = [392, 446, 500, 554, 608];
      for (let i = 0; i < starX.length; i++) {
        drawStar(ctx, starX[i], 512, 21, 10, "#FBC02D");
      }

      // Círculo NFC inferior izquierdo (cx = 312, cy = 695, r = 136)
      ctx.save();
      ctx.beginPath();
      ctx.arc(312, 695, 136, 0, Math.PI * 2);
      ctx.strokeStyle = "#181818";
      ctx.lineWidth = 6.5;
      ctx.stroke();

      // Ondas NFC dentro del círculo (arriba-izquierda, abriendo hacia la izquierda)
      for (let w = 1; w <= 3; w++) {
        ctx.beginPath();
        ctx.arc(278, 635, w * 18, (132 * Math.PI) / 180, (228 * Math.PI) / 180);
        ctx.strokeStyle = "#181818";
        ctx.lineWidth = 6.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Teléfono + Mano tocando pantalla dentro del círculo NFC
      // Cuerpo del teléfono
      roundRectPath(ctx, 294, 584, 66, 114, 9);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#181818";
      ctx.stroke();

      // Pantalla interior del teléfono
      ctx.strokeRect(302, 600, 50, 80);
      // Altavoz superior
      ctx.beginPath();
      ctx.moveTo(320, 592);
      ctx.lineTo(334, 592);
      ctx.stroke();

      // Mano estilizada tocando el teléfono (con puño en esquina inferior derecha)
      ctx.beginPath();
      ctx.moveTo(352, 660);
      ctx.quadraticCurveTo(330, 635, 326, 646);
      ctx.quadraticCurveTo(322, 656, 344, 686);
      ctx.lineTo(356, 735);
      ctx.lineTo(385, 760);
      ctx.lineTo(418, 728);
      ctx.lineTo(395, 695);
      ctx.lineTo(384, 642);
      ctx.quadraticCurveTo(372, 622, 360, 628);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineJoin = "round";
      ctx.lineWidth = 6;
      ctx.stroke();

      // Puño de la camisa
      ctx.beginPath();
      ctx.moveTo(375, 755);
      ctx.lineTo(418, 718);
      ctx.lineTo(432, 734);
      ctx.lineTo(390, 772);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (showText) {
      // Texto dentro del anillo Google
      ctx.save();
      ctx.fillStyle = "#202124";
      ctx.textAlign = "center";
      ctx.font = "700 49px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.googleLine1 || "Valóranos", 500, 198);
      ctx.font = "700 45px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.googleLine2 || "en", 500, 252);

      // Palabra "Google" con colores oficiales letra por letra
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
        ctx.fillText(gLetters[i].ch, curX, 332);
        curX += widths[i];
      }

      // Texto "NFC" dentro del círculo izquierdo
      ctx.fillStyle = "#181818";
      ctx.textAlign = "center";
      ctx.font = "800 50px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("NFC", 282, 762);
      ctx.restore();
    }

    if (showQr) {
      // Código QR con la 'G' de Google al centro (x=555, y=555, size=255)
      drawQrMatrix(ctx, data.url, 555, 555, 255, {
        centerLogo: "google",
        color: "#111111"
      });
    }

    if (showBrand) {
      // Footer: "Powered by" en el lado amarillo + Logo BC y "BlueCode" en el lado verde
      ctx.save();
      ctx.fillStyle = "#181818";
      ctx.font = "700 28px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Powered by", 448, 952);

      // Caja blanca suave tipo píldora o contorno limpio para el logo BlueCode sobre el verde
      drawBlueCodeLogo(ctx, 480, 916, 52, {
        outlineColor: "#FFFFFF",
        outlineWidth: 20
      });

      ctx.fillStyle = "#0F172A";
      ctx.font = "800 36px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 4;
      ctx.strokeText("BlueCode", 574, 954);
      ctx.fillText("BlueCode", 574, 954);
      ctx.restore();
    }

    ctx.restore();
  }

  // ============================================================================
  // 2. RENDERIZADOR PLACA INSTAGRAM (Idéntico al 100% a instagram.png)
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
      // Marco exterior con el degradado vibrante de Instagram
      const igBorderGrad = ctx.createLinearGradient(0, 0, 1000, 1000);
      igBorderGrad.addColorStop(0, "#FFE033");
      igBorderGrad.addColorStop(0.22, "#FF7A1A");
      igBorderGrad.addColorStop(0.5, "#FF0069");
      igBorderGrad.addColorStop(0.78, "#E0009B");
      igBorderGrad.addColorStop(1, "#9B2DEF");
      ctx.fillStyle = igBorderGrad;
      ctx.fillRect(0, 0, 1000, 1000);

      // Brillo acrílico superior derecho (igual a la foto)
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

      // Marco fino negro interior con abertura inferior central para el logo BlueCode
      ctx.save();
      ctx.strokeStyle = "#181818";
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";
      roundRectPath(ctx, 114, 114, 772, 766, 44);
      ctx.stroke();

      // Tapar el segmento central inferior del marco negro (x=360 a 640, y=870..890)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(355, 868, 290, 26);
      ctx.restore();
    }

    if (showIcons) {
      // Ícono central de cámara de Instagram (x=408, y=168, w=184, h=184)
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

      // Lente circular central
      ctx.beginPath();
      ctx.arc(500, 260, 44, 0, Math.PI * 2);
      ctx.stroke();

      // Punto superior derecho de la cámara
      ctx.beginPath();
      ctx.arc(548, 212, 11, 0, Math.PI * 2);
      ctx.fillStyle = camGrad;
      ctx.fill();

      // 3 Ondas rosas a la izquierda y 3 a la derecha del logo de Instagram
      ctx.strokeStyle = "#E11D74";
      ctx.lineWidth = 11;
      ctx.lineCap = "round";
      const waveRadii = [58, 92, 126];
      for (let i = 0; i < waveRadii.length; i++) {
        // Izquierda
        ctx.beginPath();
        ctx.arc(405, 260, waveRadii[i], (142 * Math.PI) / 180, (218 * Math.PI) / 180);
        ctx.stroke();
        // Derecha
        ctx.beginPath();
        ctx.arc(595, 260, waveRadii[i], (-38 * Math.PI) / 180, (38 * Math.PI) / 180);
        ctx.stroke();
      }
      ctx.restore();

      // Recuadro inferior izquierdo con 4 esquinas negras (x=212..452, y=548..788)
      ctx.save();
      ctx.strokeStyle = "#141414";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const bx1 = 212, by1 = 548, bx2 = 452, by2 = 788, bl = 56;

      // Arriba-Izquierda
      ctx.beginPath();
      ctx.moveTo(bx1, by1 + bl);
      ctx.lineTo(bx1, by1);
      ctx.lineTo(bx1 + bl, by1);
      ctx.stroke();
      // Arriba-Derecha
      ctx.beginPath();
      ctx.moveTo(bx2 - bl, by1);
      ctx.lineTo(bx2, by1);
      ctx.lineTo(bx2, by1 + bl);
      ctx.stroke();
      // Abajo-Izquierda
      ctx.beginPath();
      ctx.moveTo(bx1, by2 - bl);
      ctx.lineTo(bx1, by2);
      ctx.lineTo(bx1 + bl, by2);
      ctx.stroke();
      // Abajo-Derecha
      ctx.beginPath();
      ctx.moveTo(bx2 - bl, by2);
      ctx.lineTo(bx2, by2);
      ctx.lineTo(bx2, by2 - bl);
      ctx.stroke();

      // Óvalo NFC dentro de las esquinas
      ctx.beginPath();
      ctx.ellipse(305, 642, 68, 50, 0, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#141414";
      ctx.stroke();

      // 3 ondas dentro del óvalo mirando a la derecha
      for (let w = 1; w <= 3; w++) {
        ctx.beginPath();
        ctx.arc(282, 642, w * 13, (-42 * Math.PI) / 180, (42 * Math.PI) / 180);
        ctx.lineWidth = 6.5;
        ctx.stroke();
      }

      // Teléfono con mano en silueta negra a la derecha del óvalo
      // Mano / palma negra detrás
      ctx.beginPath();
      ctx.moveTo(395, 635);
      ctx.quadraticCurveTo(426, 650, 434, 725);
      ctx.lineTo(405, 754);
      ctx.lineTo(364, 725);
      ctx.closePath();
      ctx.fillStyle = "#141414";
      ctx.fill();

      // Cuerpo blanco del smartphone
      roundRectPath(ctx, 352, 610, 52, 108, 7);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = "#141414";
      ctx.stroke();

      // 4 dedos sujetando el borde izquierdo del teléfono
      ctx.fillStyle = "#141414";
      const fingerY = [632, 652, 672, 692];
      for (let f = 0; f < fingerY.length; f++) {
        ctx.beginPath();
        ctx.ellipse(351, fingerY[f], 8, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (showText) {
      ctx.save();
      ctx.fillStyle = "#141414";
      ctx.textAlign = "center";

      // Título "Instagram" en tipografía cursiva script idéntica
      ctx.font = "400 78px 'Grand Hotel', 'Brush Script MT', cursive";
      ctx.fillText(data.igTitle || "Instagram", 500, 446);

      // Subtítulo "¡Acerca tu móvil y síguenos!"
      ctx.font = "500 33px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.igSubtitle || "¡Acerca tu móvil y síguenos!", 500, 504);

      // Texto "NFC" dentro del recuadro de esquinas
      ctx.font = "600 28px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("NFC", 268, 752);
      ctx.restore();
    }

    if (showQr) {
      // Código QR derecho (x=545, y=548, size=240)
      drawQrMatrix(ctx, data.url, 545, 548, 240, {
        color: "#141414"
      });
    }

    if (showBrand) {
      // Branding en el hueco inferior del marco: "Powered by" + Logo BC + "BlueCode" + 5 estrellitas
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#555555";
      ctx.font = "600 18px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("Powered by", 500, 845);

      drawBlueCodeLogo(ctx, 392, 855, 38);

      ctx.fillStyle = "#111111";
      ctx.font = "800 34px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("BlueCode", 464, 886);

      // 5 mini estrellas doradas debajo (igual al estilo tapstar de la referencia)
      const miniStars = [475, 492, 509, 526, 543];
      for (let s = 0; s < miniStars.length; s++) {
        drawStar(ctx, miniStars[s], 904, 6, 3, "#F59E0B");
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // ============================================================================
  // 3. RENDERIZADOR PLACA MENÚ (Idéntico al 100% a Menu.png)
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
      // Fondo inferior blanco
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

      // Cabecera superior negra/carbón con curva suave idéntica a Menu.png
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1000, 0);
      ctx.lineTo(1000, 472);
      ctx.bezierCurveTo(760, 485, 520, 342, 0, 520);
      ctx.closePath();
      ctx.fillStyle = "#1B1A1A";
      ctx.fill();

      // Borde exterior sutil para corte
      roundRectPath(ctx, 2, 2, 996, 996, 80);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (showIcons) {
      // Ícono superior de Tenedor y Cuchara blancos (x=455..545, y=42..205)
      ctx.save();
      ctx.fillStyle = "#FFFFFF";

      // Tenedor (izquierda, cx=466)
      // Dientes del tenedor
      roundRectPath(ctx, 442, 42, 9, 48, 4);
      ctx.fill();
      roundRectPath(ctx, 461, 42, 9, 48, 4);
      ctx.fill();
      roundRectPath(ctx, 480, 42, 9, 48, 4);
      ctx.fill();
      // Base de la cabeza del tenedor
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

      // Cuchara (derecha, cx=536)
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

      // Ilustración inferior izquierda: Óvalo NFC + Teléfono inclinado con Mano (cx=340, cy=735)
      ctx.save();
      ctx.strokeStyle = "#1B1A1A";
      ctx.lineWidth = 8.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Arco ovalado izquierdo
      ctx.beginPath();
      ctx.ellipse(275, 742, 112, 98, 0, (32 * Math.PI) / 180, (325 * Math.PI) / 180);
      ctx.stroke();

      // 3 ondas NFC dentro del óvalo
      for (let w = 1; w <= 3; w++) {
        ctx.beginPath();
        ctx.arc(235, 742, w * 24, (-36 * Math.PI) / 180, (36 * Math.PI) / 180);
        ctx.stroke();
      }

      // Teléfono inclinado (-9 grados) con mano
      ctx.save();
      ctx.translate(405, 705);
      ctx.rotate((-9 * Math.PI) / 180);

      // Cuerpo del teléfono
      roundRectPath(ctx, -44, -84, 88, 168, 14);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();

      // Altavoz superior
      ctx.beginPath();
      ctx.moveTo(-12, -68);
      ctx.lineTo(12, -68);
      ctx.lineWidth = 6;
      ctx.stroke();

      // Texto "NFC" en la pantalla del teléfono
      ctx.fillStyle = "#1B1A1A";
      ctx.font = "800 24px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("NFC", 0, -32);

      // 4 dedos sujetando el lado izquierdo del teléfono
      ctx.lineWidth = 7.5;
      const fy = [-18, 4, 26, 48];
      for (let i = 0; i < fy.length; i++) {
        roundRectPath(ctx, -60, fy[i] - 9, 26, 18, 9);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.stroke();
      }

      // Pulgar y mano a la derecha + puño
      ctx.beginPath();
      ctx.moveTo(44, -22);
      ctx.quadraticCurveTo(62, -30, 68, -4);
      ctx.lineTo(86, 58);
      ctx.lineTo(106, 68);
      ctx.lineTo(88, 118);
      ctx.lineTo(24, 92);
      ctx.quadraticCurveTo(36, 76, 44, 52);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();

      // Puño rectangular inclinado
      ctx.beginPath();
      ctx.moveTo(86, 54);
      ctx.lineTo(116, 66);
      ctx.lineTo(96, 128);
      ctx.lineTo(66, 116);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    }

    if (showText) {
      ctx.save();
      ctx.textAlign = "center";

      // "MENU" gigante blanco
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 124px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.menuTitle || "MENU", 500, 322);

      // "VIEW OUR MENU ONLINE"
      ctx.font = "400 34px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText(data.menuSubtitle || "VIEW OUR MENU ONLINE", 500, 386);

      // Texto curvo "TAP YOUR PHONE" sobre la ilustración NFC
      drawArcText(
        ctx,
        data.menuTapText || "TAP YOUR PHONE",
        3,
        345,
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
      ctx.fillText("OR", 760, 546);
      ctx.font = "800 30px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.fillText("SCAN QR", 760, 582);

      // Código ID debajo del QR
      ctx.fillStyle = "#333333";
      ctx.font = "500 21px 'JetBrains Mono', monospace";
      ctx.fillText((data.slug || "TAG-ID").toUpperCase(), 760, 868);
      ctx.restore();
    }

    if (showQr) {
      // Tarjeta blanca con sombra suave para el QR (x=648, y=605, w=224, h=224)
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.12)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      roundRectPath(ctx, 648, 605, 224, 224, 16);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.restore();

      roundRectPath(ctx, 648, 605, 224, 224, 16);
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 3;
      ctx.stroke();

      drawQrMatrix(ctx, data.url, 666, 623, 188, {
        color: "#1B1A1A"
      });
    }

    if (showBrand) {
      // Footer: "powered by" + Logo BC + "BlueCode" (reemplaza a nuubiz.cards)
      ctx.save();
      ctx.fillStyle = "#222222";
      ctx.font = "500 28px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("powered by", 468, 954);

      drawBlueCodeLogo(ctx, 480, 922, 42);

      ctx.fillStyle = "#111111";
      ctx.font = "800 30px 'Plus Jakarta Sans', Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("BlueCode", 558, 954);
      ctx.restore();
    }

    ctx.restore();
  }

  // Función unificada de dibujo por tipo
  function renderPlaqueToCanvas(canvas, motif, widthPx, heightPx, data, layerFilter) {
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext("2d");
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
  // GENERADOR DE SCRIPT EDITABLE PARA ADOBE PHOTOSHOP (.JSX a 300 DPI)
  // ============================================================================
  function generatePhotoshopJsx(configs, widthCm, heightCm) {
    const dpi = 300;
    const W = Math.round((widthCm / 2.54) * dpi);
    const H = Math.round((heightCm / 2.54) * dpi);

    // Pre-calculamos la matriz booleana del QR de cada motivo para que Photoshop dibuje el QR real en su propia capa
    const serializedConfigs = configs.map(function (c) {
      const ec = c.motif === "google" ? "H" : "M";
      const qr = window.qrcode(0, ec);
      qr.addData(c.url || "https://gestor-nfc-qr-2026.web.app");
      qr.make();
      const count = qr.getModuleCount();
      const rows = [];
      for (let r = 0; r < count; r++) {
        let bits = "";
        for (let col = 0; col < count; col++) {
          if (c.motif === "google") {
            const cs = count * 0.36, ce = count * 0.64;
            if (r >= cs && r <= ce && col >= cs && col <= ce) {
              bits += "0";
              continue;
            }
          }
          bits += qr.isDark(r, col) ? "1" : "0";
        }
        rows.push(bits);
      }
      return {
        motif: c.motif,
        slug: c.slug,
        url: c.url,
        qrRows: rows,
        googleLine1: c.googleLine1 || "Valóranos",
        googleLine2: c.googleLine2 || "en",
        igTitle: c.igTitle || "Instagram",
        igSubtitle: c.igSubtitle || "¡Acerca tu móvil y síguenos!",
        menuTitle: c.menuTitle || "MENU",
        menuSubtitle: c.menuSubtitle || "VIEW OUR MENU ONLINE",
        menuTapText: c.menuTapText || "TAP YOUR PHONE"
      };
    });

    return `// ============================================================================
// Script Editable para Adobe Photoshop — Generador Oficial BlueCode NFC & QR
// Dimensiones físicas: ${widthCm} x ${heightCm} cm @ 300 DPI (${W} x ${H} px)
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
    var doc = app.documents.add(W, H, 300, docName, NewDocumentMode.RGB, DocumentFill.WHITE);

    var grpMarco = doc.layerSets.add();
    grpMarco.name = "1_Marco_y_Fondo";

    var grpGraficos = doc.layerSets.add();
    grpGraficos.name = "2_Iconos_y_Guias_NFC";

    var grpQR = doc.layerSets.add();
    grpQR.name = "3_Codigo_QR_Dinamico";

    var grpBrand = doc.layerSets.add();
    grpBrand.name = "4_Powered_By_BlueCode";

    var grpTextos = doc.layerSets.add();
    grpTextos.name = "5_Textos_Editables";

    if (cfg.motif === "google") {
        // Marco multicolor Google
        createPolygonLayer(grpMarco, "Segmento_Izq_Rojo", [[0, sY(340)], [sX(122), sY(515)], [0, sY(540)]], "#EA4335");
        createPolygonLayer(grpMarco, "Segmento_Inf_Izq_Amarillo", [[0, sY(540)], [sX(122), sY(515)], [sX(122), sY(888)], [sX(465), sY(888)], [sX(465), sY(1000)], [0, sY(1000)]], "#FBBC05");
        createPolygonLayer(grpMarco, "Segmento_Inf_Der_Verde", [[sX(465), sY(888)], [sX(880), sY(888)], [sX(975), sY(1000)], [sX(465), sY(1000)]], "#34A853");
        createPolygonLayer(grpMarco, "Segmento_Der_Azul", [[sX(878), sY(422)], [sX(1000), sY(396)], [sX(1000), sY(1000)], [sX(975), sY(1000)], [sX(878), sY(888)]], "#4285F4");
        createRectLayer(grpMarco, "Interior_Blanco", sX(120), sY(40), sX(880), sY(888), "#FFFFFF");

        // Guía NFC y QR
        createRectLayer(grpGraficos, "Zona_Circulo_NFC", sX(176), sY(559), sX(448), sY(831), "#F1F5F9");
        createRectLayer(grpQR, "Fondo_Guia_QR", sX(550), sY(550), sX(815), sY(815), "#FFFFFF");
        drawQrLayer(grpQR, "QR_Generado_" + cfg.slug, cfg.qrRows, sX(555), sY(555), sX(255), "#111111");

        // Branding BlueCode
        createTextLayer(grpBrand, "Powered_By", "Powered by", sX(395), sY(952), sPt(13), "#181818", true, Justification.RIGHT);
        createRectLayer(grpBrand, "Logo_BC_Icon", sX(480), sY(916), sX(560), sY(966), "#0865F5");
        createTextLayer(grpBrand, "BlueCode_Brand", "BlueCode", sX(574), sY(954), sPt(17), "#0F172A", true, Justification.LEFT);

        // Textos editables
        createTextLayer(grpTextos, "Titulo_Valoranos", cfg.googleLine1, sX(500), sY(198), sPt(22), "#202124", true);
        createTextLayer(grpTextos, "Subtitulo_En", cfg.googleLine2, sX(500), sY(252), sPt(20), "#202124", true);
        createTextLayer(grpTextos, "Texto_Google", "Google", sX(500), sY(332), sPt(34), "#4285F4", true);
        createTextLayer(grpTextos, "Estrellas_5", "★ ★ ★ ★ ★", sX(500), sY(518), sPt(28), "#FBC02D", true);
        createTextLayer(grpTextos, "Texto_NFC", "NFC", sX(282), sY(762), sPt(22), "#181818", true);
    } else if (cfg.motif === "instagram") {
        // Marco degradado Instagram
        createRectLayer(grpMarco, "Marco_Superior_Rosa_Naranja", 0, 0, W, sY(500), "#FF0069");
        createRectLayer(grpMarco, "Marco_Inferior_Magenta_Violeta", 0, sY(500), W, H, "#A334FA");
        createRectLayer(grpMarco, "Tarjeta_Blanca_Interior", sX(56), sY(56), sX(944), sY(944), "#FFFFFF");
        createRectLayer(grpMarco, "Linea_Marco_Negro", sX(114), sY(114), sX(886), sY(880), "#181818");
        createRectLayer(grpMarco, "Fondo_Interior_Blanco", sX(120), sY(120), sX(880), sY(874), "#FFFFFF");

        // Iconos y QR
        createRectLayer(grpGraficos, "Icono_Camara_Instagram", sX(412), sY(172), sX(588), sY(348), "#E1306C");
        createRectLayer(grpGraficos, "Recuadro_NFC_Izq", sX(212), sY(548), sX(452), sY(788), "#F8FAFC");
        drawQrLayer(grpQR, "QR_Generado_" + cfg.slug, cfg.qrRows, sX(545), sY(548), sX(240), "#141414");

        // Branding BlueCode
        createRectLayer(grpBrand, "Hueco_Inferior_Blanco", sX(355), sY(840), sX(645), sY(915), "#FFFFFF");
        createTextLayer(grpBrand, "Powered_By", "Powered by", sX(500), sY(852), sPt(9), "#555555", false);
        createRectLayer(grpBrand, "Logo_BC_Icon", sX(392), sY(858), sX(454), sY(894), "#0865F5");
        createTextLayer(grpBrand, "BlueCode_Brand", "BlueCode", sX(464), sY(888), sPt(16), "#111111", true, Justification.LEFT);

        // Textos editables
        createTextLayer(grpTextos, "Titulo_Instagram", cfg.igTitle, sX(500), sY(446), sPt(34), "#141414", true);
        createTextLayer(grpTextos, "Subtitulo_Siguenos", cfg.igSubtitle, sX(500), sY(504), sPt(15), "#141414", false);
        createTextLayer(grpTextos, "Texto_NFC", "NFC", sX(268), sY(752), sPt(13), "#141414", true);
    } else {
        // Placa Menú
        createRectLayer(grpMarco, "Fondo_Blanco", 0, 0, W, H, "#FFFFFF");
        createPolygonLayer(grpMarco, "Banda_Celeste_Curva", [[0, 0], [W, 0], [W, sY(492)], [sX(520), sY(445)], [0, sY(542)]], "#DCE8F3");
        createPolygonLayer(grpMarco, "Cabecera_Negra_Menu", [[0, 0], [W, 0], [W, sY(472)], [sX(520), sY(425)], [0, sY(520)]], "#1B1A1A");

        // Iconos y QR
        createRectLayer(grpGraficos, "Icono_Cubiertos_Blanco", sX(442), sY(42), sX(560), sY(200), "#FFFFFF");
        createRectLayer(grpGraficos, "Zona_Ilustracion_NFC", sX(165), sY(615), sX(515), sY(850), "#F8FAFC");
        createRectLayer(grpQR, "Tarjeta_QR_Blanca", sX(648), sY(605), sX(872), sY(829), "#FFFFFF");
        drawQrLayer(grpQR, "QR_Generado_" + cfg.slug, cfg.qrRows, sX(666), sY(623), sX(188), "#1B1A1A");

        // Branding BlueCode
        createTextLayer(grpBrand, "Powered_By", "powered by", sX(468), sY(954), sPt(13), "#222222", false, Justification.RIGHT);
        createRectLayer(grpBrand, "Logo_BC_Icon", sX(480), sY(922), sX(548), sY(962), "#0865F5");
        createTextLayer(grpBrand, "BlueCode_Brand", "BlueCode", sX(558), sY(954), sPt(14), "#111111", true, Justification.LEFT);

        // Textos editables
        createTextLayer(grpTextos, "Titulo_MENU", cfg.menuTitle, sX(500), sY(322), sPt(56), "#FFFFFF", true);
        createTextLayer(grpTextos, "Subtitulo_VIEW_ONLINE", cfg.menuSubtitle, sX(500), sY(386), sPt(15), "#FFFFFF", false);
        createTextLayer(grpTextos, "Texto_TAP_YOUR_PHONE", cfg.menuTapText, sX(345), sY(585), sPt(15), "#1B1A1A", true);
        createTextLayer(grpTextos, "Texto_OR", "OR", sX(760), sY(546), sPt(12), "#1B1A1A", false);
        createTextLayer(grpTextos, "Texto_SCAN_QR", "SCAN QR", sX(760), sY(582), sPt(14), "#1B1A1A", true);
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
    alert("¡Listo! Se generaron " + configs.length + " documento(s) editables BlueCode (${widthCm}x${heightCm} cm @ 300 DPI).");
}

main();
`;
  }

  // ============================================================================
  // EXPORTADOR DIRECTO A ARCHIVO .PSD MULTICAPA (usando ag-psd si está cargado)
  // ============================================================================
  function exportLayeredPsdFile(motif, cfg, widthCm, heightCm, notifyFn) {
    if (!window.agPsd || !window.agPsd.writePsd) {
      notifyFn("Librería PSD cargando, descargando script .JSX editable...");
      return false;
    }
    const dpi = 300;
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
        { name: "2_Iconos_NFC_y_Estrellas", canvas: makeLayerCanvas("icons") },
        { name: "3_Powered_By_BlueCode", canvas: makeLayerCanvas("brand") },
        { name: "4_Textos_Principales", canvas: makeLayerCanvas("text") },
        { name: "5_Codigo_QR_Editable", canvas: makeLayerCanvas("qr") }
      ]
    };

    // Canvas compuesto principal para previsualización del PSD
    const compositeCanvas = document.createElement("canvas");
    renderPlaqueToCanvas(compositeCanvas, motif, W, H, cfg, "all");
    psd.canvas = compositeCanvas;

    const buffer = window.agPsd.writePsd(psd);
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Placa_BlueCode_" + motif.toUpperCase() + "_" + cfg.slug + "_" + widthCm + "x" + heightCm + "cm.psd";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    return true;
  }

  // ============================================================================
  // EXPORTADOR A PDF DE IMPRESIÓN A ESCALA REAL EN CM (300 DPI)
  // ============================================================================
  function exportPlaquesToPdf(queueItems, widthCm, heightCm, pdfMode, notifyFn) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("La librería PDF aún está cargando. Intenta en 1 segundo.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const dpi = 300;
    const pxW = Math.min(2000, Math.round((widthCm / 2.54) * dpi));
    const pxH = Math.min(2000, Math.round((heightCm / 2.54) * dpi));

    // Pre-renderizar cada diseño único en alta resolución (300 DPI)
    const workCanvas = document.createElement("canvas");

    if (pdfMode === "exact") {
      // 1 Página por placa con el tamaño exacto en cm (ej: 10 x 10 cm)
      const orient = widthCm > heightCm ? "l" : "p";
      const doc = new jsPDF({
        orientation: orient,
        unit: "cm",
        format: [widthCm, heightCm],
        compress: true
      });

      let pageIdx = 0;
      for (let i = 0; i < queueItems.length; i++) {
        const item = queueItems[i];
        renderPlaqueToCanvas(workCanvas, item.motif, pxW, pxH, item, "all");
        const imgData = workCanvas.toDataURL("image/png");

        for (let c = 0; c < item.copies; c++) {
          if (pageIdx > 0) {
            doc.addPage([widthCm, heightCm], orient);
          }
          doc.addImage(imgData, "PNG", 0, 0, widthCm, heightCm, undefined, "FAST");
          pageIdx++;
        }
      }

      doc.save("Placas_BlueCode_" + widthCm + "x" + heightCm + "cm_EscalaReal.pdf");
      if (notifyFn) notifyFn("¡PDF 1:1 (" + widthCm + "×" + heightCm + " cm) descargado!");
      return;
    }

    // Modo Hoja de Impresión con Guías de Corte (elige A4 o A3/Tabloide automáticamente si la placa es grande)
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

    // Expandir cola según número de copias
    const expanded = [];
    for (let i = 0; i < queueItems.length; i++) {
      const it = queueItems[i];
      renderPlaqueToCanvas(workCanvas, it.motif, pxW, pxH, it, "all");
      const imgData = workCanvas.toDataURL("image/png");
      for (let c = 0; c < it.copies; c++) {
        expanded.push({
          motif: it.motif,
          slug: it.slug,
          imgData: imgData
        });
      }
    }

    const totalGridW = cols * widthCm + (cols - 1) * gap;
    const startX = Math.max(margin, (pageW - totalGridW) / 2);
    const startY = margin + 1.1;

    for (let idx = 0; idx < expanded.length; idx++) {
      const slot = idx % perPage;
      if (idx > 0 && slot === 0) {
        doc.addPage([pageW, pageH], pageW > pageH ? "l" : "p");
      }

      // Cabecera técnica en cada página
      if (slot === 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(20, 20, 20);
        doc.text(
          "BlueCode — Placas NFC & QR | Medida Real: " + widthCm + " x " + heightCm + " cm (300 DPI - No escalar al imprimir)",
          pageW / 2,
          margin + 0.4,
          { align: "center" }
        );
      }

      const col = slot % cols;
      const row = Math.floor(slot / cols);
      const x = startX + col * (widthCm + gap);
      const y = startY + row * (heightCm + gap);

      // Imagen de la placa en su medida exacta en cm
      doc.addImage(expanded[idx].imgData, "PNG", x, y, widthCm, heightCm, undefined, "FAST");

      // Marcas de corte profesionales (Crop Marks) en las 4 esquinas
      doc.setDrawColor(140, 140, 140);
      doc.setLineWidth(0.02);
      const cmLen = 0.25;
      // Arriba-Izq
      doc.line(x - cmLen, y, x, y);
      doc.line(x, y - cmLen, x, y);
      // Arriba-Der
      doc.line(x + widthCm, y, x + widthCm + cmLen, y);
      doc.line(x + widthCm, y - cmLen, x + widthCm, y);
      // Abajo-Izq
      doc.line(x - cmLen, y + heightCm, x, y + heightCm);
      doc.line(x, y + heightCm, x, y + heightCm + cmLen);
      // Abajo-Der
      doc.line(x + widthCm, y + heightCm, x + widthCm + cmLen, y + heightCm);
      doc.line(x + widthCm, y + heightCm, x + widthCm, y + heightCm + cmLen);
    }

    doc.save("Placas_BlueCode_HojaImpresion_" + widthCm + "x" + heightCm + "cm.pdf");
    if (notifyFn) notifyFn("¡PDF con guías de corte (" + expanded.length + " placas de " + widthCm + "×" + heightCm + " cm) descargado!");
  }

  // Exponer API global para index.html
  window.BlueCodePlaqueStudio = {
    renderPlaqueToCanvas: renderPlaqueToCanvas,
    generatePhotoshopJsx: generatePhotoshopJsx,
    exportLayeredPsdFile: exportLayeredPsdFile,
    exportPlaquesToPdf: exportPlaquesToPdf
  };
})();
