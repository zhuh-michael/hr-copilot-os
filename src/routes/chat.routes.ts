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

    // TODO: 实现 QA Service
    // const answer = await qaService.ask({ message, sessionId, userId });

    res.json({
      success: true,
      data: {
        answer: '这是 AI 回答（待实现）',
        sources: [],
        confidence: 0.95
      }
    });
  } catch (error) {
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
    const { answerId, isHelpful, comment } = req.body;

    // TODO: 实现反馈提交
    // await feedbackService.submit({ answerId, isHelpful, comment });

    res.json({
      success: true,
      message: '反馈已提交'
    });
  } catch (error) {
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
