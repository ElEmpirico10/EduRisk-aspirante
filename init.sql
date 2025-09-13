CREATE DATABASE IF NOT EXISTS EduRisk;

USE EduRisk;

-- 1. Crear ENUM para tipo de documento
DROP TYPE IF EXISTS tipo_documento CASCADE;
CREATE TYPE tipo_documento AS ENUM ('tarjeta_identidad', 'cedula', 'cedula_extranjera');

-- ======================================
-- TABLA INSTRUCTOR
-- ======================================
CREATE TABLE Instructor (
    id_instructor SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(50),
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    tipo_tarjeta tipo_documento,  -- aquí usamos el ENUM
    numero_tarjeta BIGINT,
    contrasena VARCHAR
);

-- ======================================
-- TABLA FICHA
-- ======================================
CREATE TABLE Ficha (
    id_ficha SERIAL PRIMARY KEY,
    nombre_ficha VARCHAR(30),
    codigo_ficha BIGINT,
    id_instructor INT,
    CONSTRAINT fk_ficha_instructor FOREIGN KEY (id_instructor) REFERENCES Instructor(id_instructor)
);

-- ======================================
-- TABLA ASPIRANTE
-- ======================================
CREATE TABLE Aspirante (
    id_aspirante SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(50),
    segundo_nombre VARCHAR(50),
    primer_apellido VARCHAR(50),
    segundo_apellido VARCHAR(50),
    email VARCHAR(50),
    tipo_tarjeta tipo_documento,  -- aquí usamos el ENUM
    numero_tarjeta BIGINT,
    contrasena VARCHAR,
    id_ficha INT,
    CONSTRAINT fk_aspirante_ficha FOREIGN KEY (id_ficha) REFERENCES Ficha(id_ficha)
);

-- ======================================
-- TABLA EXAMEN
-- ======================================
CREATE TABLE Examen (
    id_examen SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    habilitado BOOLEAN DEFAULT FALSE,
    estado varchar(100),
    id_instructor INT,
    CONSTRAINT fk_examen_instructor FOREIGN KEY (id_instructor) REFERENCES Instructor(id_instructor)
);

-- ======================================
-- TABLA PREGUNTA
-- ======================================
CREATE TABLE Pregunta (
    id_pregunta SERIAL PRIMARY KEY,
    texto_pregunta VARCHAR,
    tipo_pregunta VARCHAR,
    contenido VARCHAR
);

-- ======================================
-- TABLA EXAMEN_PREGUNTA (relación N:M)
-- ======================================
CREATE TABLE examen_pregunta (
    id_examen_pregunta SERIAL PRIMARY KEY,
    id_examen INT,
    id_pregunta INT,
    CONSTRAINT fk_examenpreg_examen FOREIGN KEY (id_examen) REFERENCES Examen(id_examen),
    CONSTRAINT fk_examenpreg_preg FOREIGN KEY (id_pregunta) REFERENCES Pregunta(id_pregunta)
);

-- ======================================
-- TABLA RESPUESTA
-- ======================================
CREATE TABLE Respuesta (
    id_respuesta SERIAL PRIMARY KEY,
    texto_respuesta VARCHAR,
    valor_respuesta VARCHAR,
    id_aspirante INT,
    id_pregunta INT,
    id_examen INT,
    CONSTRAINT fk_resp_aspirante FOREIGN KEY (id_aspirante) REFERENCES Aspirante(id_aspirante),
    CONSTRAINT fk_resp_preg FOREIGN KEY (id_pregunta) REFERENCES Pregunta(id_pregunta),
    CONSTRAINT fk_resp_examen FOREIGN KEY (id_examen) REFERENCES Examen(id_examen)
);

--======================================
-- funcion para buscar aspirante NOMBRE: buscar_aspirante
--======================================
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

--======================================
-- procedimiento para insertar examen nombre : insertar_examen
--======================================

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
--======================================
-- procedimiento para insertar aspirante nombre : insertar_aspirante
--======================================


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

--======================================
-- procedimiento para insertar ficha nombre : insertar_ficha
--======================================

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
