import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables del archivo .env
dotenv.config();

// Configura la conexión a la base de datos
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: (msg) => console.log(`[Sequelize]: ${msg}`),
});


// Prueba la conexión a la base de datos
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

testConnection();

export default sequelize;
