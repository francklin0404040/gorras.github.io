# CAPS STORE — Tienda de gorras en GitHub Pages

Sitio web estático para tienda de gorras: catálogo con carrito, pedidos por WhatsApp y panel de admin.

---

## Configuración inicial

Abrí el archivo `js/productos.js` y editá las constantes al principio:

```js
const NOMBRE_NEGOCIO   = "CAPS STORE";         // nombre de tu negocio
const WHATSAPP_NEGOCIO = "50760000000";         // número con código de país, sin +
const YAPPY_NUMERO     = "50760000000";         // número Yappy del negocio
const DIRECCION_LOCAL  = "Calle Principal #1";  // dirección del local
const PASSWORD_ADMIN   = "admin123";            // contraseña del panel admin
```

---

## Agregar / editar productos

En `js/productos.js`, editá el array `productos`:

```js
{ id: 16, nombre: "Mi nueva gorra", categoria: "Exclusivas", precio: 45.00, imagen: "img/gorras/nueva-gorra.jpg" },
```

- **id**: número único (no repetir)
- **categoria**: una de estas: `Belicas | Dandys | Exclusivas | F1 | Longhorns | Pants | T-shirts`
- **imagen**: ruta relativa desde la raíz del proyecto

---

## Agregar fotos de gorras

1. Copiá las imágenes (JPG, PNG o WebP) a la carpeta `img/gorras/`
2. Usá el mismo nombre que pusiste en el campo `imagen` del producto
3. Tamaño recomendado: **800×800 px** (cuadrada), menos de 300 KB

Si una imagen no se encuentra, se muestra automáticamente el emoji 🧢 como placeholder.

---

## Publicar en GitHub Pages

1. Creá un repositorio en GitHub (puede ser público o privado con Pages habilitado)
2. Subí todos los archivos:
   ```
   git init
   git add .
   git commit -m "primer commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En el repositorio → **Settings → Pages** → Source: `Deploy from branch` → `main` → `/ (root)`
4. En unos minutos el sitio estará en `https://TU_USUARIO.github.io/TU_REPO/`

---

## Estructura de archivos

```
/
├── index.html          ← tienda pública
├── admin.html          ← panel de pedidos (con login)
├── css/
│   └── styles.css      ← todos los estilos
├── js/
│   ├── productos.js    ← configuración + catálogo de productos
│   ├── app.js          ← lógica de la tienda y carrito
│   └── admin.js        ← lógica del panel de admin
└── img/
    └── gorras/         ← fotos de los productos
```

---

## Panel de administración

Accedé desde `tu-dominio/admin.html`. La contraseña es la que definiste en `PASSWORD_ADMIN`.

> **Nota de seguridad:** La contraseña es visible en el código fuente. Es suficiente para un negocio pequeño, pero no uses una contraseña importante. Los pedidos se guardan en `localStorage` del navegador — son locales a cada dispositivo.

Funciones del panel:
- Ver todos los pedidos con detalles completos
- Cambiar estado: **Nuevo → En proceso → Completado**
- Filtrar por estado y tipo de entrega
- Ver estadísticas y ventas completadas
- Eliminar pedidos
- Clic en el número de WhatsApp del cliente abre chat directo

---

## Métodos de pago disponibles

| Entrega | Opciones de pago |
|---------|-----------------|
| Retiro en local | Efectivo o Yappy al retirar |
| Delivery propio | Efectivo al recibir o Yappy |
| Envío por empresa | Yappy antes del envío (obligatorio) |
