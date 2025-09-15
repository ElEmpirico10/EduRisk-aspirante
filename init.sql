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
-- TABLA INSTRUCTOR
-- ======================================
CREATE TABLE IF NOT EXISTS Instructor (
    id_instructor SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(50),
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    tipo_tarjeta tipo_documento,
    numero_tarjeta BIGINT,
    contrasena VARCHAR
);

-- ======================================
-- TABLA FICHA
-- ======================================
CREATE TABLE IF NOT EXISTS Ficha (
    id_ficha SERIAL PRIMARY KEY,
    nombre_ficha VARCHAR(30),
    codigo_ficha BIGINT,
    id_instructor INT REFERENCES Instructor(id_instructor)
);

-- ======================================
-- TABLA ASPIRANTE
-- ======================================
CREATE TABLE IF NOT EXISTS Aspirante (
    id_aspirante SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(50),
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    email VARCHAR(50),
    tipo_tarjeta tipo_documento,
    numero_tarjeta BIGINT,
    contrasena VARCHAR,
    id_ficha INT REFERENCES Ficha(id_ficha)
);

-- ======================================
-- TABLA EXAMEN
-- ======================================
CREATE TABLE IF NOT EXISTS Examen (
    id_examen SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    habilitado BOOLEAN DEFAULT FALSE,
    estado VARCHAR(100),
    id_instructor INT REFERENCES Instructor(id_instructor)
);

-- ======================================
-- TABLA PREGUNTA
-- ======================================
CREATE TABLE IF NOT EXISTS Pregunta (
    id_pregunta SERIAL PRIMARY KEY,
    texto_pregunta VARCHAR,
    tipo_pregunta VARCHAR,
    contenido VARCHAR
);

-- ======================================
-- TABLA EXAMEN_PREGUNTA (relación N:M)
-- ======================================
CREATE TABLE IF NOT EXISTS examen_pregunta (
    id_examen_pregunta SERIAL PRIMARY KEY,
    id_examen INT REFERENCES Examen(id_examen),
    id_pregunta INT REFERENCES Pregunta(id_pregunta)
);

-- ======================================
-- TABLA RESPUESTA
-- ======================================
CREATE TABLE IF NOT EXISTS Respuesta (
    id_respuesta SERIAL PRIMARY KEY,
    texto_respuesta VARCHAR,
    valor_respuesta VARCHAR,
    id_aspirante INT REFERENCES Aspirante(id_aspirante),
    id_pregunta INT REFERENCES Pregunta(id_pregunta),
    id_examen INT REFERENCES Examen(id_examen)
);

INSERT INTO aspirante (
    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    email, tipo_tarjeta, numero_tarjeta, contrasena
) VALUES (
    'Juan', 'Carlos', 'Perez', 'Lopez',
    'juan@example.com', 'cedula', 123456789,
    '$2y$10$p1Zpde4FDfNTJbm9JOphsexRPCsXZ2/XooeZdy1/.EYe/BrdRdXcS'
);



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
    contrasena VARCHAR,
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

-- ======================================
-- PROCEDIMIENTO: insertar_examen
-- ======================================
CREATE OR REPLACE PROCEDURE insertar_examen(
    p_nombre        VARCHAR,
    p_fecha_inicio  TIMESTAMP,
    p_fecha_fin     TIMESTAMP,
    p_estado        VARCHAR,
    p_id_instructor INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Examen(
        nombre,
        fecha_inicio,
        fecha_fin,
        habilitado,
        estado,
        id_instructor
    )
    VALUES (
        p_nombre,
        p_fecha_inicio,
        p_fecha_fin,
        FALSE,
        p_estado,
        p_id_instructor
    );
END;
$$;

-- ======================================
-- PROCEDIMIENTO: insertar_aspirante
-- ======================================
CREATE OR REPLACE PROCEDURE insertar_aspirante(
    p_primer_nombre    VARCHAR,
    p_segundo_nombre   VARCHAR,
    p_primer_apellido  VARCHAR,
    p_segundo_apellido VARCHAR,
    p_email            VARCHAR,
    p_tipo_tarjeta     tipo_documento,
    p_numero_tarjeta   BIGINT,
    p_contrasena       VARCHAR,
    p_id_ficha         INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Aspirante(
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        email,
        tipo_tarjeta,
        numero_tarjeta,
        contrasena,
        id_ficha
    )
    VALUES (
        p_primer_nombre,
        p_segundo_nombre,
        p_primer_apellido,
        p_segundo_apellido,
        p_email,
        p_tipo_tarjeta,
        p_numero_tarjeta,
        p_contrasena,
        p_id_ficha
    );
END;
$$;

-- ======================================
-- PROCEDIMIENTO: insertar_ficha
-- ======================================
CREATE OR REPLACE PROCEDURE insertar_ficha(
    p_nombre_ficha VARCHAR,
    p_codigo_ficha BIGINT,
    p_id_instructor INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Ficha(
        nombre_ficha,
        codigo_ficha,
        id_instructor
    )
    VALUES (
        p_nombre_ficha,
        p_codigo_ficha,
        p_id_instructor
    );
END;
$$;
