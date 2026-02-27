/**
 * 聊天相关路由
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * POST /api/chat
 * 发送消息，获取 AI 回答
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, userId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'message 和 sessionId 是必填参数'
      });
    }

    // 调用 QA Service
    const qaService = (await import('../services/qa.service')).qaService;
    
    const result = await qaService.ask({
      id: uuidv4(),
      userId: userId || 'anonymous',
      sessionId,
      content: message,
      createdAt: new Date()
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/chat/feedback
 * 提交反馈（有用/无用）
 */
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { logId, isHelpful, comment } = req.body;

    if (!logId || isHelpful === undefined) {
      return res.status(400).json({
        success: false,
        error: 'logId 和 isHelpful 是必填参数'
      });
    }

    // 调用 QA Service
    const qaService = (await import('../services/qa.service')).qaService;
    await qaService.submitFeedback(logId, isHelpful, comment);

    res.json({
      success: true,
      message: '反馈已提交'
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/chat/transfer
 * 转接人工客服
 */
router.post('/transfer', async (req: Request, res: Response) => {
  try {
    const { sessionId, reason } = req.body;

    // TODO: 实现转人工逻辑
    // await transferService.transfer({ sessionId, reason });

    res.json({
      success: true,
      message: '正在转接人工客服...'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
