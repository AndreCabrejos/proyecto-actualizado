const { sequelize } = require('./db/models');

async function checkColumns() {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Channels'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Columnas en la tabla Channels:');
    results.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkColumns();
