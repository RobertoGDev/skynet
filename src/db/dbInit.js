// Inicialización de la base de datos SQLite para Skynet
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Asegurarnos que el directorio existe
const dbDir = path.join(process.cwd(), 'src', 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Ruta a la base de datos
const dbPath = path.join(dbDir, 'skynet_users.db');
const db = new Database(dbPath);

// Creación de tabla de usuarios si no existe
function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      rank TEXT DEFAULT 'tech-com operative',
      access_level INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(createTableQuery);
  
  // Verificar si ya existen usuarios
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  
  // Si no hay usuarios, crear uno por defecto
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('resistance', 10);
    const insertDefaultUser = db.prepare(`
      INSERT INTO users (username, password, rank, access_level) 
      VALUES (?, ?, ?, ?)
    `);
    
    // Usuarios predeterminados con temática Terminator
    const defaultUsers = [
      { username: 'john.connor', password: hashedPassword, rank: 'resistance leader', access_level: 5 },
      { username: 'kyle.reese', password: hashedPassword, rank: 'sergeant', access_level: 4 },
      { username: 'miles.dyson', password: hashedPassword, rank: 'cyberdyne scientist', access_level: 4 },
      { username: 'tech.com', password: hashedPassword, rank: 'tech-com operative', access_level: 3 },
    ];
    
    defaultUsers.forEach(user => {
      insertDefaultUser.run(
        user.username, 
        user.password,
        user.rank,
        user.access_level
      );
    });
    
    console.log('Base de datos inicializada con usuarios predeterminados');
  }
}

// Función para verificar credenciales
function verifyUser(username, password) {
  const query = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = query.get(username);
  
  if (!user) return null;
  
  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) return null;
  
  return {
    id: user.id,
    username: user.username,
    rank: user.rank,
    accessLevel: user.access_level
  };
}

// Inicializar la base de datos
initializeDatabase();

module.exports = {
  db,
  verifyUser
};