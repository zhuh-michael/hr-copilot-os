/**
 * API 路由汇总
 */

import { Router } from 'express';
import chatRoutes from './chat.routes';
import knowledgeRoutes from './knowledge.routes';
import logRoutes from './log.routes';

const router = Router();

// 注册路由
router.use('/chat', chatRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/logs', logRoutes);

export default router;
