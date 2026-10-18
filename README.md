# BlueCode — Gestor Dinámico de NFC & Códigos QR

> Sistema privado de enlaces dinámicos para tags NFC físicos y códigos QR impresos. Permite cambiar el destino final (URL, WhatsApp, Wi-Fi, vCard, etc.) en tiempo real desde la nube sin tener que reescribir físicamente el chip NFC ni volver a imprimir el papel o sticker.

![BlueCode](public/logo_BC.svg)

---

## ⚡ ¿Cómo funciona la solución?

1. **Link Permanente Fijo:** Creas un enlace dinámico en el gestor (ej: `https://gestor-nfc-qr-2026.web.app/r/mesa-1`).
2. **Lo grabas o imprimes una sola vez:**
   - En el tag NFC físico usando cualquier lector (como *NFC Tools*).
   - O imprimiendo el código QR descargado desde la plataforma.
3. **Cambias el destino cuando quieras:** Desde el panel privado cambias la URL o acción en 1 segundo y el cambio se aplica de inmediato para cualquier persona que acerque el celular o escanee el QR.

---

## 🚀 Características Principales

- **Redirección Ultra-Rápida (< 50ms):** Motor `/r/:slug` optimizado sin dependencias pesadas para que el usuario no sienta demoras al escanear.
- **Múltiples Tipos de Acciones (No solo páginas web):**
  - 🌐 **Web / URL:** Redirige a cualquier sitio, catálogo o menú online.
  - 💬 **WhatsApp Directo:** Abre WhatsApp con número de teléfono y un mensaje predeterminado listo para enviar.
  - 📶 **Red Wi-Fi:** Muestra credenciales de conexión o conexión rápida a red inalámbrica.
  - 👤 **Tarjeta de Contacto Digital (vCard):** Descarga la ficha de contacto directamente en la agenda del teléfono del cliente.
  - 📞 **Llamada Telefónica:** Marca directamente al número configurado.
  - ✉️ **Correo Electrónico:** Prepara un correo con destinatario y asunto.
- **Gestión Masiva en Lote:**
  - Creación masiva por serie numerada (ej: Mesas 1 a 20 con un solo clic).
  - Creación masiva pegando listas de texto o CSV.
  - Barra flotante para cambiar el destino de decenas de tags a la vez.
  - Pausar / Reactivar / Eliminar en lote.
- **Suite de Exportación de Códigos QR:**
  - Descarga individual en **PNG de Alta Resolución (1024×1024 px)** con o sin etiqueta identificadora.
  - Descarga en formato **Vectorial SVG** (para diseño gráfico o imprenta).
  - **Exportar Todos en ZIP:** Empaqueta todos los QRs generados en un archivo comprimido `.zip` en el navegador.
  - **Hoja de Impresión Instantánea:** Genera una plantilla de corte/impresión en segundos optimizada para stickers.
  - **Exportar Inventario CSV:** Reporte de tags, slugs, destinos y conteo de escaneos.
- **Sincronización en Tiempo Real:** Todos los integrantes del equipo ven los cambios en vivo gracias a Firebase Realtime Database.
- **Acceso Privado:** Enlace directo privado (`/equipo-4x9k`) con bloqueo por clave compartida si se ingresa por la raíz.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Vanilla HTML5, CSS3 moderno (arquitectura minimalista Obsidian / BlueCode), JavaScript moderno.
- **Backend & Hosting:** [Firebase Hosting](https://firebase.google.com/docs/hosting) + [Firebase Realtime Database](https://firebase.google.com/docs/database).
- **Herramientas de Cliente:**
  - `qrcode-generator`: Generador de código QR client-side sin APIs externas.
  - `JSZip`: Empaquetado masivo de archivos ZIP en memoria.

---

## 📦 Estructura del Proyecto

```text
├── public/
│   ├── index.html        # Panel de administración privado BlueCode
│   ├── redirect.html     # Motor ultra-rápido de redirección (/r/:slug)
│   └── logo_BC.svg       # Logo vectorial oficial de BlueCode
├── database.rules.json   # Reglas de seguridad de Firebase Realtime Database
├── firebase.json         # Configuración de Hosting, rutas y rewrites
├── .firebaserc           # Alias del proyecto en Firebase
├── .gitignore            # Archivos ignorados por Git
└── README.md             # Documentación del proyecto
```

---

## 💻 Despliegue

Para desplegar nuevas versiones en Firebase:

```bash
# 1. Iniciar sesión en Firebase (si no lo has hecho)
firebase login

# 2. Desplegar reglas de base de datos y hosting
firebase deploy --project gestor-nfc-qr-2026
```

---

## 🔒 Acceso en Producción

- **Panel del Equipo:** [https://gestor-nfc-qr-2026.web.app/equipo-4x9k](https://gestor-nfc-qr-2026.web.app/equipo-4x9k)
- **Ejemplo de Redirección:** [https://gestor-nfc-qr-2026.web.app/r/tag-ejemplo](https://gestor-nfc-qr-2026.web.app/r/tag-ejemplo)
