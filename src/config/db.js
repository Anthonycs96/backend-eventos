// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// // Carga las variables del archivo .env
// dotenv.config();

// // Configura la conexión a la base de datos local
// const sequelize = new Sequelize(
//     process.env.DB_NAME,          // Nombre de la base de datos
//     process.env.DB_USER,          // Usuario
//     process.env.DB_PASSWORD,      // Contraseña
//     {
//         host: process.env.DB_HOST, // Host (localhost)
//         port: process.env.DB_PORT, // Puerto (3306 para MySQL)
//         dialect: 'mysql',          // Dialecto
//         logging: (msg) => console.log(`[Sequelize]: ${msg}`), // Log de consultas (opcional)
//     }
// );

// // Prueba la conexión a la base de datos
// const testConnection = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Conexión exitosa a la base de datos');
//     } catch (error) {
//         console.error('Error al conectar a la base de datos:', error.message);
//     }
// };

// testConnection();

// export default sequelize;
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Configuración de la conexión con la URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',       // Indica que usas MySQL
    dialectOptions: {
        ssl: {
            require: true,  // Asegúrate de usar SSL
            rejectUnauthorized: false, // Permitir certificados autofirmados
        },
    },
    // logging: console.log,   // Opcional: logs de Sequelize
    logging: false,   // Opcional: logs de Sequelize
});

// Probar la conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    }
})();

export default sequelize;
