-- Seeds simplificados para la estructura actual de la base de datos

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
-- CANALES (Channels)
-- ============================================
INSERT INTO "Channels" (nombre, categoria, imagen, viewers, "createdAt", "updatedAt") VALUES
('RyuPlayer', 'Gaming', '/images/canal1.jpg', 1250, NOW(), NOW()),
('TechMaster', 'Tecnología', '/images/canal2.jpg', 850, NOW(), NOW()),
('MusicLive', 'Música', '/images/canal3.jpg', 2100, NOW(), NOW()),
('ArtStudio', 'Arte', '/images/canal4.jpg', 650, NOW(), NOW())
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Regalos insertados:' as tabla, COUNT(*) as cantidad FROM "Gifts"
UNION ALL
SELECT 'Niveles insertados:', COUNT(*) FROM "ViewerLevels"
UNION ALL
SELECT 'Canales insertados:', COUNT(*) FROM "Channels";
