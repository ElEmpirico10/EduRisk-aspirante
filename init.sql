-- ======================================
-- ENUM para tipo de documento
-- ======================================
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_documento') THEN
      CREATE TYPE tipo_documento AS ENUM ('tarjeta_identidad', 'cedula', 'cedula_extranjera');
   END IF;
END$$;

-- ======================================
-- TABLA FICHA
-- ======================================
CREATE TABLE IF NOT EXISTS Ficha (
    id_ficha SERIAL PRIMARY KEY,
    nombre_ficha VARCHAR(30) NOT NULL,
    codigo_ficha BIGINT NOT NULL UNIQUE
);

-- ======================================
-- TABLA EXAMEN
-- ======================================
CREATE TABLE IF NOT EXISTS Examen (
    id_examen SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    habilitado BOOLEAN DEFAULT FALSE,
    estado VARCHAR(100) NOT NULL,
    id_ficha INT NOT NULL REFERENCES Ficha (id_ficha),
    CONSTRAINT unique_nombre_ficha UNIQUE (nombre, id_ficha)
);

-- ======================================
-- TABLA ASPIRANTE
-- ======================================
CREATE TABLE IF NOT EXISTS Aspirante (
    id_aspirante SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(50) NOT NULL,
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    tipo_tarjeta tipo_documento NOT NULL,
    numero_tarjeta BIGINT NOT NULL,
    contrasena TEXT NOT NULL,
    id_ficha INT NOT NULL REFERENCES Ficha(id_ficha),
    CONSTRAINT unique_email_numero UNIQUE (email, numero_tarjeta)
);

-- ======================================
-- TABLA EXAMEN_ASPIRANTE
-- ======================================
CREATE TABLE IF NOT EXISTS Examen_Aspirante (
    id_examen_aspirante SERIAL PRIMARY KEY,
    id_examen INT NOT NULL REFERENCES Examen(id_examen),
    id_aspirante INT NOT NULL REFERENCES Aspirante(id_aspirante),
    fecha_realizacion TIMESTAMP,
    CONSTRAINT unique_examen_aspirante UNIQUE (id_examen, id_aspirante)
);

-- ======================================
-- TABLA PREGUNTA
-- ======================================
CREATE TABLE IF NOT EXISTS Pregunta (
    id_pregunta SERIAL PRIMARY KEY,
    texto_pregunta TEXT NOT NULL,
    tipo_pregunta VARCHAR(50) NOT NULL,
    contenido TEXT,
    CONSTRAINT unique_pregunta UNIQUE (texto_pregunta, tipo_pregunta)
);

-- ======================================
-- TABLA EXAMEN_PREGUNTA (relación N:M)
-- ======================================
CREATE TABLE IF NOT EXISTS Examen_Pregunta (
    id_examen_pregunta SERIAL PRIMARY KEY,
    id_examen INT NOT NULL REFERENCES Examen(id_examen),
    id_pregunta INT NOT NULL REFERENCES Pregunta(id_pregunta),
    CONSTRAINT unique_examen_pregunta UNIQUE (id_examen, id_pregunta)
);

-- ======================================
-- TABLA RESPUESTA
-- ======================================
CREATE TABLE IF NOT EXISTS Respuesta (
    id_respuesta SERIAL PRIMARY KEY,
    texto_respuesta TEXT,
    valor_respuesta INT,
    id_aspirante INT NOT NULL REFERENCES Aspirante(id_aspirante),
    id_pregunta INT NOT NULL REFERENCES Pregunta(id_pregunta),
    id_examen INT NOT NULL REFERENCES Examen(id_examen),
    CONSTRAINT unique_respuesta UNIQUE (id_aspirante, id_pregunta, id_examen)
);

-- ======================================
-- DATOS DE PRUEBA
-- ======================================

-- INSERT FICHA DE PRUEBA
INSERT INTO Ficha (nombre_ficha, codigo_ficha)
VALUES ('ADSO 2934070', 2934070)
ON CONFLICT (codigo_ficha) DO NOTHING;

-- INSERT ASPIRANTE DE PRUEBA
INSERT INTO Aspirante (
    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    email, tipo_tarjeta, numero_tarjeta, contrasena, id_ficha
) VALUES (
    'Juan', 'Carlos', 'Perez', 'Lopez',
    'juan@example.com', 'cedula', 123456789,
    '$2y$10$p1Zpde4FDfNTJbm9JOphsexRPCsXZ2/XooeZdy1/.EYe/BrdRdXcS',
    1
)
ON CONFLICT (email, numero_tarjeta) DO NOTHING;

-- INSERT EXAMEN DE PRUEBA
INSERT INTO Examen (nombre, fecha_inicio, fecha_fin, habilitado, estado, id_ficha)
VALUES (
    'Examen Diagnóstico ADSO',
    NOW(),
    NOW() + INTERVAL '7 days',
    TRUE,
    'Activo',
    1
)
ON CONFLICT (nombre, id_ficha) DO NOTHING;

-- INSERT PREGUNTAS
INSERT INTO Pregunta (texto_pregunta, tipo_pregunta, contenido) VALUES
('¿Por qué elegiste estudiar ADSO?', 'textarea', 'Explica las razones que te motivaron a elegir Análisis y Desarrollo de Software...'),
('¿Te gustaría trabajar en desarrollo de software en el futuro?', 'radio', '["Sí","No","Tal vez"]'),
('¿Ya has tenido experiencias previas con programación?', 'radio', '["Sí","No","Tal vez"]'),
('¿Qué tanto disfrutas resolver problemas o retos lógicos?', 'select', '["Me encanta, es lo que más disfruto","Me gusta bastante","Me gusta moderadamente","No me gusta mucho","No me gusta para nada"]'),
('¿Lees o investigas sobre tecnología por cuenta propia?', 'radio', '["Sí","No","Tal vez"]'),
('¿Tienes metas claras relacionadas con tu formación en ADSO?', 'textarea', 'Describe qué metas específicas tienes con esta formación y cómo planeas alcanzarlas...')
ON CONFLICT (texto_pregunta, tipo_pregunta) DO NOTHING;

-- VINCULA PREGUNTAS AL EXAMEN
INSERT INTO Examen_Pregunta (id_examen, id_pregunta) VALUES 
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6)
ON CONFLICT (id_examen, id_pregunta) DO NOTHING;

-- ======================================
-- FUNCION: buscar_aspirante
-- ======================================
CREATE OR REPLACE FUNCTION buscar_aspirante(
    p_tipo_tarjeta tipo_documento,
    p_numero_tarjeta BIGINT
)
RETURNS TABLE (
    id_aspirante INT,
    primer_nombre VARCHAR,
    segundo_nombre VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR,
    email VARCHAR,
    tipo_tarjeta tipo_documento,
    numero_tarjeta BIGINT,
    contrasena TEXT,
    id_ficha INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id_aspirante,
        a.primer_nombre,
        a.segundo_nombre,
        a.primer_apellido,
        a.segundo_apellido,
        a.email,
        a.tipo_tarjeta,
        a.numero_tarjeta,
        a.contrasena,
        a.id_ficha
    FROM Aspirante a
    WHERE a.tipo_tarjeta = p_tipo_tarjeta
      AND a.numero_tarjeta = p_numero_tarjeta;
END;
$$ LANGUAGE plpgsql;
