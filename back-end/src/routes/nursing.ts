import { Router } from 'express';

const router = Router();

router.get('/test', (_req, res) => {
  res.json({ 
    message: 'API EvolP funcionando!',
    timestamp: new Date().toISOString()
  });
});

export default router;