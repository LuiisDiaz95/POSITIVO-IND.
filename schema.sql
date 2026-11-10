-- ============================================================
-- BASE DE DATOS: POSITIVO IND.
-- E-commerce de indumentaria
-- PostgreSQL / Supabase
-- ============================================================

-- ============================================================
-- 1. TABLA: CATEGORIA
-- ============================================================

CREATE TABLE public.categoria (
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. TABLA: PRODUCTO
-- ============================================================

CREATE TABLE public.producto (
    id_producto BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    imagen VARCHAR(255) DEFAULT 'default.jpg',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES public.categoria(id_categoria)
        ON DELETE CASCADE
);

-- ============================================================
-- 3. TABLA: TALLES_PRODUCTO
-- ============================================================

CREATE TABLE public.talles_producto (
    id_talle_prod BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    talle VARCHAR(10) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),

    CONSTRAINT fk_talle_producto
        FOREIGN KEY (id_producto)
        REFERENCES public.producto(id_producto)
        ON DELETE CASCADE,

    CONSTRAINT unique_producto_talle
        UNIQUE (id_producto, talle)
);

-- ============================================================
-- 4. TABLA: PEDIDO
-- ============================================================

CREATE TABLE public.pedido (
    id_pedido BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),

    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
        CHECK (
            estado IN (
                'Pendiente',
                'Confirmado',
                'Entregado',
                'Cancelado'
            )
        ),

    fecha_pedido TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TABLA: DETALLE_PEDIDO
-- ============================================================

CREATE TABLE public.detalle_pedido (
    id_detalle BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_producto BIGINT NOT NULL,
    talle_seleccionado VARCHAR(10) NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10, 2) NOT NULL
        CHECK (precio_unitario >= 0),

    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES public.pedido(id_pedido)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto)
        REFERENCES public.producto(id_producto)
);

-- ============================================================
-- 6. ÍNDICES
-- ============================================================

CREATE INDEX idx_producto_categoria
    ON public.producto(id_categoria);

CREATE INDEX idx_talles_producto
    ON public.talles_producto(id_producto);

CREATE INDEX idx_detalle_pedido
    ON public.detalle_pedido(id_pedido);

CREATE INDEX idx_detalle_producto
    ON public.detalle_pedido(id_producto);

CREATE INDEX idx_pedido_fecha
    ON public.pedido(fecha_pedido);

-- ============================================================
-- 7. SEGURIDAD RLS
-- ============================================================

ALTER TABLE public.categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talles_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_pedido ENABLE ROW LEVEL SECURITY;

-- IMPORTANTE:
-- Las tablas quedan protegidas por RLS.
-- No se habilitan políticas públicas de escritura.
-- Configurá políticas específicas antes de conectar el frontend.

-- ============================================================
-- 8. DATOS INICIALES: CATEGORÍAS
-- ============================================================

INSERT INTO public.categoria (nombre, descripcion) VALUES
('Bermudas Mom', 'Bermudas masculinas tiro alto y corte holgado'),
('Jeans Mom', 'Pantalones de jean rígidos corte mom fit'),
('Remeras Boxy', 'Remeras corte boxy fit de algodón pesado'),
('Camisas Lino', 'Camisas de lino para temporada primavera/verano'),
('Camisacos Boxy', 'Camisacos urbanos sobrenivel corte boxy');

-- ============================================================
-- 9. DATOS INICIALES: PRODUCTOS
-- ============================================================

INSERT INTO public.producto
(id_categoria, nombre, descripcion, precio, imagen)
VALUES
(1, 'Bermuda Mom Negra',
 'Bermuda mom rígida negra con desgaste',
 18000.00, 'bermuda_negra.jpg'),

(2, 'Jean Mom Rígido Clásico',
 'Jean azul clásico sin roturas',
 28000.00, 'jean_clasico.jpg'),

(3, 'Remera Boxy Fit Blanca',
 'Remera 100% algodón 24/1 cuello cerrado',
 15000.00, 'remera_blanca.jpg'),

(4, 'Camisa de Lino M/C',
 'Camisa manga corta fresca con botones de madera',
 22000.00, 'camisa_lino.jpg'),

(5, 'Camisaco Boxy Fit',
 'Camisaco estructurado para sobreponer',
 32000.00, 'camisaco_boxy.jpg');

-- ============================================================
-- 10. STOCK INICIAL POR TALLES
-- ============================================================

INSERT INTO public.talles_producto
(id_producto, talle, stock)
VALUES

-- Bermudas (40 a 48)
(1, '40', 5),
(1, '42', 8),
(1, '44', 6),
(1, '46', 4),
(1, '48', 2),

-- Jeans (40 a 48)
(2, '40', 4),
(2, '42', 10),
(2, '44', 8),
(2, '46', 5),
(2, '48', 3),

-- Remeras Boxy (S a XL)
(3, 'S', 6),
(3, 'M', 12),
(3, 'L', 10),
(3, 'XL', 5),

-- Camisas Lino (S a XXL)
(4, 'S', 3),
(4, 'M', 7),
(4, 'L', 8),
(4, 'XL', 4),
(4, 'XXL', 2),

-- Camisacos (S a XL)
(5, 'S', 4),
(5, 'M', 8),
(5, 'L', 6),
(5, 'XL', 3);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================