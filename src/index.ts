/**
 * HR Co-Pilot OS - 后端服务入口
 * 
 * @version 1.0.0
 * @author 小五
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './models/database';
import routes from './routes';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app: Application = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 初始化数据库
initDatabase();

// 注册 API 路由
app.use('/api', routes);

// 健康检查接口
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'HR Co-Pilot OS API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 根路径
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'HR Co-Pilot OS',
    version: '1.0.0',
    description: '智能 HR 问答机器人',
    endpoints: {
      health: 'GET /api/health',
      chat: 'POST /api/chat',
      feedback: 'POST /api/chat/feedback',
      transfer: 'POST /api/chat/transfer',
      knowledge: 'GET/POST /api/knowledge',
      logs: 'GET /api/logs'
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 HR Co-Pilot OS 服务器已启动`);
  console.log(`📍 监听端口：http://localhost:${PORT}`);
  console.log(`📊 健康检查：http://localhost:${PORT}/api/health`);
  console.log(`📚 API 文档：http://localhost:${PORT}/`);
});

export default app;
