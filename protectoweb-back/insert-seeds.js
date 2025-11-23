const { sequelize, Gift, ViewerLevel, Channel } = require('./db/models');

async function insertSeeds() {
  try {
    console.log('🌱 Insertando datos de prueba...\n');

    // Insertar Regalos
    const gifts = await Gift.bulkCreate([
      { nombre: 'Rosa', icono: '🌹', costo: 10, puntos: 5 },
      { nombre: 'Corazón', icono: '❤️', costo: 20, puntos: 10 },
      { nombre: 'Estrella', icono: '⭐', costo: 50, puntos: 25 },
      { nombre: 'Fuego', icono: '🔥', costo: 75, puntos: 35 },
      { nombre: 'Diamante', icono: '💎', costo: 100, puntos: 50 },
      { nombre: 'Corona', icono: '👑', costo: 200, puntos: 100 },
      { nombre: 'Trofeo', icono: '🏆', costo: 300, puntos: 150 },
      { nombre: 'Cohete', icono: '🚀', costo: 500, puntos: 250 }
    ], { ignoreDuplicates: true });
    console.log(`✅ ${gifts.length} regalos insertados`);

    // Insertar Niveles
    const levels = await ViewerLevel.bulkCreate([
      { nivel: 1, nombre: 'Novato', puntos_requeridos: 0 },
      { nivel: 2, nombre: 'Aficionado', puntos_requeridos: 100 },
      { nivel: 3, nombre: 'Entusiasta', puntos_requeridos: 250 },
      { nivel: 4, nombre: 'Experto', puntos_requeridos: 500 },
      { nivel: 5, nombre: 'Maestro', puntos_requeridos: 1000 },
      { nivel: 6, nombre: 'Leyenda', puntos_requeridos: 2500 },
      { nivel: 7, nombre: 'Mítico', puntos_requeridos: 5000 },
      { nivel: 8, nombre: 'Divino', puntos_requeridos: 10000 }
    ], { ignoreDuplicates: true });
    console.log(`✅ ${levels.length} niveles insertados`);

    // Insertar Canales
    const channels = await Channel.bulkCreate([
      { nombre: 'RyuPlayer', categoria: 'Gaming', imagen: '/images/canal1.jpg', viewers: 1250 },
      { nombre: 'TechMaster', categoria: 'Tecnología', imagen: '/images/canal2.jpg', viewers: 850 },
      { nombre: 'MusicLive', categoria: 'Música', imagen: '/images/canal3.jpg', viewers: 2100 },
      { nombre: 'ArtStudio', categoria: 'Arte', imagen: '/images/canal4.jpg', viewers: 650 }
    ], { ignoreDuplicates: true });
    console.log(`✅ ${channels.length} canales insertados`);

    console.log('\n🎉 Datos de prueba insertados correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertSeeds();
