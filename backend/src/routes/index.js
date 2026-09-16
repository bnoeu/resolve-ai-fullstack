const { Router } = require('express');
const authRoutes = require('./auth.routes');
const ocorrenciasRoutes = require('./ocorrencias.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/ocorrencias', ocorrenciasRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
