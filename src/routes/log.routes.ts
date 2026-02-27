/**
 * 问答日志相关路由
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/logs
 * 查询问答日志
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate, intent, page = '1', limit = '20' } = req.query;

    // 调用 Log Service
    const logService = (await import('../services/log.service')).logService;
    
    const result = await logService.query({
      userId: userId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      intent: intent as string,
      page: Number(page),
      limit: Number(limit)
    });

    res.json({
      success: true,
      data: {
        logs: result.logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total
        }
      }
    });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/logs/export
 * 导出问答日志
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;

    // TODO: 实现日志导出
    // const buffer = await logService.export({ userId, startDate, endDate });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=qa_logs.xlsx');
    
    res.json({
      success: true,
      message: '导出功能待实现'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
