const { User, ViewerStat } = require('./db/models');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  try {
    console.log('👤 Creando usuarios de prueba...\n');

    // Contraseña: 123456
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Crear usuario viewer
    const viewer = await User.findOrCreate({
      where: { email: 'viewer@test.com' },
      defaults: {
        username: 'TestViewer',
        email: 'viewer@test.com',
        password: hashedPassword,
        role: 'viewer',
        monedas: 1000
      }
    });

    if (viewer[1]) {
      await ViewerStat.create({
        userId: viewer[0].id,
        nivel: 1,
        puntos: 0
      });
      console.log('✅ Usuario Viewer creado:');
      console.log('   Email: viewer@test.com');
      console.log('   Contraseña: 123456');
      console.log('   Role: viewer\n');
    } else {
      console.log('ℹ️  Usuario viewer ya existe\n');
    }

    // Crear usuario streamer
    const streamer = await User.findOrCreate({
      where: { email: 'streamer@test.com' },
      defaults: {
        username: 'TestStreamer',
        email: 'streamer@test.com',
        password: hashedPassword,
        role: 'streamer',
        monedas: 500
      }
    });

    if (streamer[1]) {
      await ViewerStat.create({
        userId: streamer[0].id,
        nivel: 1,
        puntos: 0
      });
      console.log('✅ Usuario Streamer creado:');
      console.log('   Email: streamer@test.com');
      console.log('   Contraseña: 123456');
      console.log('   Role: streamer\n');
    } else {
      console.log('ℹ️  Usuario streamer ya existe\n');
    }

    console.log('🎉 Usuarios de prueba listos!');
    console.log('\n📝 Puedes iniciar sesión con:');
    console.log('   Viewer: viewer@test.com / 123456');
    console.log('   Streamer: streamer@test.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
