const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Pon aquí tu usuario de MySQL
    password: '',          // Pon aquí tu contraseña de MySQL
    database: 'login'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

// ==========================================
// RUTA API: REGISTRAR UN NUEVO USUARIO (CON ROL)
// ==========================================
app.post('/api/registrar', async (req, res) => {
    const { correo, nombre, contrasena } = req.body;

    console.log("-> Intento de registro recibido:", { correo, nombre });

    if (!correo || !nombre || !contrasena) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en la petición.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(contrasena, salt);

        // El rol se guarda automáticamente como 'pasajero' gracias al DEFAULT de MySQL,
        // pero lo dejamos explícito aquí por si en el futuro quieres registrar admins/choferes directamente.
        const sql = 'INSERT INTO users (correo, nombre, contrasena, rol) VALUES (?, ?, ?, ?)';
        db.query(sql, [correo, nombre, hashContrasena, 'pasajero'], (err, result) => {
            if (err) {
                console.error("[ERROR REAL DE MYSQL]:", err);
                if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                    return res.status(400).json({ error: 'Este correo electrónico ya está registrado en el sistema.' });
                }
                return res.status(500).json({ error: `Error en la base de datos: ${err.message}` });
            }
            res.status(201).json({ mensaje: '¡Usuario registrado con éxito!' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al procesar la contraseña.' });
    }
});

// ==========================================
// RUTA API: VALIDAR INICIO DE SESIÓN (DEVIOLVIENDO ROL)
// ==========================================
app.post('/api/login', (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    const sql = 'SELECT * FROM users WHERE correo = ?';
    db.query(sql, [correo], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor al buscar usuario.' });
        if (results.length === 0) return res.status(404).json({ error: 'El correo electrónico no está registrado.' });

        const usuario = results[0];

        try {
            const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!esValida) return res.status(401).json({ error: 'La contraseña es incorrecta.' });

            // Enviamos el rol ('pasajero', 'chofer' o 'admin') al frontend junto con el nombre
            res.json({ 
                mensaje: 'Acceso concedido', 
                nombre: usuario.nombre,
                rol: usuario.rol 
            });
        } catch (bcryptError) {
            res.status(500).json({ error: 'Hubo un problema al validar tus credenciales de acceso.' });
        }
    });
});

// ==========================================
// RUTA API: VALIDAR INICIO DE SESIÓN
// ==========================================
// ==========================================
// RUTA API: VALIDAR INICIO DE SESIÓN (CORREGIDA)
// ==========================================
app.post('/api/login', (req, res) => {
    const { correo, contrasena } = req.body;

    // 1. Validar que no vengan vacíos en la petición
    if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    const sql = 'SELECT * FROM users WHERE correo = ?';
    db.query(sql, [correo], async (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: 'Error en el servidor al buscar usuario.' });
        }
        
        // 2. Comprobar si el usuario realmente existe en MySQL
        if (results.length === 0) {
            return res.status(404).json({ error: 'El correo electrónico no está registrado.' });
        }

        const usuario = results[0];

        // 3. Validar que la contraseña de la BD exista y no sea nula/incorrecta
        if (!usuario.contrasena) {
            return res.status(500).json({ error: 'Error interno: La contraseña en la base de datos no tiene el formato correcto.' });
        }

        try {
            // Comparamos de forma segura
            const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!esValida) {
                return res.status(401).json({ error: 'La contraseña es incorrecta.' });
            }

            // Si todo está bien, permitimos el acceso
            res.json({ mensaje: 'Acceso concedido', nombre: usuario.nombre, rol: usuario.rol });
        } catch (bcryptError) {
            console.error("Error al comparar con bcrypt:", bcryptError);
            res.status(500).json({ error: 'Hubo un problema al validar tus credenciales de acceso.' });
        }
    });
});

// Arrancar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor de Movilidad Urbana corriendo en http://localhost:3000');
});