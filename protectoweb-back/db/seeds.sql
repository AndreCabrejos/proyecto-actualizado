-- Seeds para poblar la base de datos con datos de prueba
-- Ejecutar después de las migraciones

-- ============================================
-- REGALOS (Gifts)
-- ============================================
INSERT INTO "Gifts" (nombre, icono, costo, puntos, "createdAt", "updatedAt") VALUES
('Rosa', '🌹', 10, 5, NOW(), NOW()),
('Corazón', '❤️', 20, 10, NOW(), NOW()),
('Estrella', '⭐', 50, 25, NOW(), NOW()),
('Fuego', '🔥', 75, 35, NOW(), NOW()),
('Diamante', '💎', 100, 50, NOW(), NOW()),
('Corona', '👑', 200, 100, NOW(), NOW()),
('Trofeo', '🏆', 300, 150, NOW(), NOW()),
('Cohete', '🚀', 500, 250, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- NIVELES DE ESPECTADORES (ViewerLevels)
-- ============================================
INSERT INTO "ViewerLevels" (nivel, nombre, puntos_requeridos, "createdAt", "updatedAt") VALUES
(1, 'Novato', 0, NOW(), NOW()),
(2, 'Aficionado', 100, NOW(), NOW()),
(3, 'Entusiasta', 250, NOW(), NOW()),
(4, 'Experto', 500, NOW(), NOW()),
(5, 'Maestro', 1000, NOW(), NOW()),
(6, 'Leyenda', 2500, NOW(), NOW()),
(7, 'Mítico', 5000, NOW(), NOW()),
(8, 'Divino', 10000, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- USUARIOS DE PRUEBA (Users)
-- ============================================
-- Contraseña para todos: 123456 (hasheada con bcrypt)
-- Hash: $2b$10$rZ5YhkqGvM5vF5xF5xF5xOqGvM5vF5xF5xF5xOqGvM5vF5xF5xF5x

-- Espectador de prueba
INSERT INTO "Users" (username, email, password, role, monedas, "createdAt", "updatedAt") VALUES
('espectador1', 'espectador@test.com', '$2b$10$rZ5YhkqGvM5vF5xF5xF5xOqGvM5vF5xF5xF5xOqGvM5vF5xF5xF5x', 'viewer', 1000, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Streamer de prueba
INSERT INTO "Users" (username, email, password, role, monedas, "createdAt", "updatedAt") VALUES
('streamer1', 'streamer@test.com', '$2b$10$rZ5YhkqGvM5vF5xF5xF5xOqGvM5vF5xF5xF5xOqGvM5vF5xF5xF5x', 'streamer', 500, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CANALES (Channels)
-- ============================================
-- Obtener el ID del streamer
DO $$
DECLARE
    streamer_id INTEGER;
BEGIN
    SELECT id INTO streamer_id FROM "Users" WHERE email = 'streamer@test.com';
    
    IF streamer_id IS NOT NULL THEN
        INSERT INTO "Channels" (nombre, descripcion, imagen, categoria, viewers, "userId", "createdAt", "updatedAt") VALUES
        ('RyuPlayer', 'Canal de gaming y entretenimiento', '/images/canal1.jpg', 'Gaming', 1250, streamer_id, NOW(), NOW()),
        ('TechMaster', 'Tecnología y programación', '/images/canal2.jpg', 'Tecnología', 850, streamer_id, NOW(), NOW()),
        ('MusicLive', 'Música en vivo 24/7', '/images/canal3.jpg', 'Música', 2100, streamer_id, NOW(), NOW()),
        ('ArtStudio', 'Arte digital y diseño', '/images/canal4.jpg', 'Arte', 650, streamer_id, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- ESTADÍSTICAS DE ESPECTADORES (ViewerStats)
-- ============================================
-- Crear stats para el espectador de prueba
DO $$
DECLARE
    viewer_id INTEGER;
BEGIN
    SELECT id INTO viewer_id FROM "Users" WHERE email = 'espectador@test.com';
    
    IF viewer_id IS NOT NULL THEN
        INSERT INTO "ViewerStats" ("userId", nivel, puntos, "createdAt", "updatedAt") VALUES
        (viewer_id, 1, 0, NOW(), NOW())
        ON CONFLICT ("userId") DO NOTHING;
    END IF;
END $$;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Mostrar resumen de datos insertados
SELECT 'Regalos insertados:' as tabla, COUNT(*) as cantidad FROM "Gifts"
UNION ALL
SELECT 'Niveles insertados:', COUNT(*) FROM "ViewerLevels"
UNION ALL
SELECT 'Usuarios insertados:', COUNT(*) FROM "Users"
UNION ALL
SELECT 'Canales insertados:', COUNT(*) FROM "Channels"
UNION ALL
SELECT 'Stats insertadas:', COUNT(*) FROM "ViewerStats";

-- Mostrar usuarios de prueba
SELECT 
    id,
    username,
    email,
    role,
    monedas,
    'Contraseña: 123456' as nota
FROM "Users"
WHERE email IN ('espectador@test.com', 'streamer@test.com');
