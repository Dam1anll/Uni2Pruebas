
CREATE TABLE IF NOT EXISTS colectas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  objetivo NUMERIC NOT NULL CHECK (objetivo > 0),
  monto_recaudado NUMERIC DEFAULT 0,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now()
);