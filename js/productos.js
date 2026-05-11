// ====================================================
// CONFIGURACIÓN DEL NEGOCIO — editá estos valores
// ====================================================
const NOMBRE_NEGOCIO   = "Planeta G";
const WHATSAPP_NEGOCIO = "50760000000";   // con código de país, sin +
const YAPPY_NUMERO     = "50760000000";
const DIRECCION_LOCAL  = "Calle Principal #1, Ciudad de Panamá";
const PASSWORD_ADMIN   = "admin123";

// ====================================================
// CATÁLOGO DE PRODUCTOS
// Para agregar un producto: copiá un bloque y editalo
// Campos: id (único), nombre, categoria, precio, imagen
// Categorías válidas: Belicas | Dandys | Exclusivas | F1 | Longhorns | Pants | T-shirts
// Imágenes: colocá los archivos en /img/gorras/
// ====================================================
const productos = [
  // ——— BÉLICAS ———
  { id: 1,  nombre: "Bélica Classic Black",     categoria: "Belicas",    precio: 25.00, imagen: "img/gorras/belica-classic-black.jpg"  },
  { id: 2,  nombre: "Bélica Urban Camo",         categoria: "Belicas",    precio: 28.00, imagen: "img/gorras/belica-urban-camo.jpg"      },
  { id: 3,  nombre: "Bélica Street Gray",        categoria: "Belicas",    precio: 26.00, imagen: "img/gorras/belica-street-gray.jpg"     },

  // ——— DANDYS ———
  { id: 4,  nombre: "Dandy Gold Edition",        categoria: "Dandys",     precio: 35.00, imagen: "img/gorras/dandy-gold.jpg"             },
  { id: 5,  nombre: "Dandy Street White",        categoria: "Dandys",     precio: 32.00, imagen: "img/gorras/dandy-street-white.jpg"     },

  // ——— EXCLUSIVAS ———
  { id: 6,  nombre: "Exclusiva Limited #1",      categoria: "Exclusivas", precio: 55.00, imagen: "img/gorras/exclusiva-1.jpg"            },
  { id: 7,  nombre: "Exclusiva Premium Red",     categoria: "Exclusivas", precio: 60.00, imagen: "img/gorras/exclusiva-red.jpg"          },

  // ——— F1 ———
  { id: 8,  nombre: "F1 Racing Team",            categoria: "F1",         precio: 40.00, imagen: "img/gorras/f1-racing-team.jpg"         },
  { id: 9,  nombre: "F1 Speed Black",            categoria: "F1",         precio: 38.00, imagen: "img/gorras/f1-speed-black.jpg"         },

  // ——— LONGHORNS ———
  { id: 10, nombre: "Longhorn Classic Brown",    categoria: "Longhorns",  precio: 30.00, imagen: "img/gorras/longhorn-classic.jpg"       },
  { id: 11, nombre: "Longhorn Vintage Beige",    categoria: "Longhorns",  precio: 33.00, imagen: "img/gorras/longhorn-vintage.jpg"       },

  // ——— PANTS ———
  { id: 12, nombre: "Pants Urban Cargo",         categoria: "Pants",      precio: 45.00, imagen: "img/gorras/pants-cargo.jpg"            },
  { id: 13, nombre: "Pants Street Jogger",       categoria: "Pants",      precio: 40.00, imagen: "img/gorras/pants-jogger.jpg"           },

  // ——— T-SHIRTS ———
  { id: 14, nombre: "T-Shirt Logo Classic",      categoria: "T-shirts",   precio: 20.00, imagen: "img/gorras/tshirt-logo.jpg"            },
  { id: 15, nombre: "T-Shirt Streetwear Black",  categoria: "T-shirts",   precio: 22.00, imagen: "img/gorras/tshirt-streetwear.jpg"      },
];
