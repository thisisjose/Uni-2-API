// src/data/mockEvents.js

const mockEvents = [
    {
        _id: '1', 
        title: 'Conferencia de IA',
        description: 'Explorando el futuro del Machine Learning y la IA.',
        date: new Date('2025-12-10T10:00:00Z'),
        location: 'Auditorio Principal',
        participants: [{ userId: '101', userName: 'Alice', joinedAt: new Date() }],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: '60c72b2f9c1d4a0004e0e0e2', 
        title: 'Taller de Desarrollo Web',
        description: 'Construyendo una aplicación full-stack con MERN.',
        date: new Date('2025-11-25T15:30:00Z'),
        location: 'Sala de Cómputo B',
        participants: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    },

    {
        _id: '2', 
        title: 'Networking para Startups',
        description: 'Sesión para conectar emprendedores y programadores. Incluye pizza gratis.',
        date: new Date('2025-11-30T18:00:00Z'),
        location: 'Espacio Co-working TechHub',
        participants: [{ userId: '102', userName: 'Bob', joinedAt: new Date() }, { userId: '103', userName: 'Charlie', joinedAt: new Date() }],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '60c72b2f9c1d4a0004e0e0e3', 
        title: 'Webinar: Seguridad en APIs',
        description: 'Aprende a proteger tus endpoints de Express contra ataques comunes.',
        date: new Date('2025-12-05T19:00:00Z'),
        location: 'Online (Zoom)',
        participants: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '3',
        title: 'Hackatón Anual Uni-2',
        description: '24 horas para construir el futuro de la educación con tecnología.',
        date: new Date('2026-01-20T09:00:00Z'),
        location: 'Campus Central - Pabellón D',
        participants: [],
        status: 'cancelled', 
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '60c72b2f9c1d4a0004e0e0e4', 
        title: 'Clase Magistral de Bases de Datos NoSQL',
        description: 'Profundizando en esquemas y consultas avanzadas de MongoDB.',
        date: new Date('2025-10-15T14:00:00Z'),
        location: 'Laboratorio de Sistemas 1',
        participants: [{ userId: '104', userName: 'Diana', joinedAt: new Date() }],
        status: 'completed', 
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

module.exports = mockEvents;