/**
 * 知识库相关路由
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/knowledge
 * 获取知识文档列表
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;

    // TODO: 实现文档列表查询
    // const docs = await documentService.list({ category, status });

    res.json({
      success: true,
      data: {
        documents: []
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
 * POST /api/knowledge/upload
 * 上传知识文档
 */
router.post('/upload', async (req: Request, res: Response) => {
  try {
    // TODO: 实现文件上传
    // const document = await documentService.upload(req.file, req.body);

    res.json({
      success: true,
      message: '文档上传成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
