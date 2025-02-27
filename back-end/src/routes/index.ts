import { Router } from 'express';
import nursingRoutes from './nursing';

const router = Router();

router.use('/nursing', nursingRoutes);

export default router;