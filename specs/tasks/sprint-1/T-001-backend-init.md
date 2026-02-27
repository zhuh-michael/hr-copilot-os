# T-001：后端项目初始化

**优先级：** P0  
**估算工时：** 2 小时  
**状态：** 待开始  
**负责人：** 麒麟

---

## 1. 任务描述

**作为** 后端开发者  
**我想要** 初始化 Node.js + Express 项目  
**以便于** 开始后端 API 开发

---

## 2. 验收标准

- [ ] 创建 package.json，配置依赖（express, typescript, langchain 等）
- [ ] 配置 TypeScript（tsconfig.json）
- [ ] 配置 ESLint + Prettier
- [ ] 创建基础目录结构（src/controllers, src/services, src/models 等）
- [ ] 创建 Hello World 接口（GET /api/health）
- [ ] 配置启动脚本（npm start, npm run dev）

---

## 3. 技术说明

### 依赖列表

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "langchain": "^0.1.0",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 目录结构

```
src/
├── controllers/     # 控制器
├── services/        # 服务层
├── models/          # 数据模型
├── routes/          # 路由
├── middleware/      # 中间件
└── index.ts         # 入口文件
```

---

## 4. 完成定义（DoD）

- [ ] 代码通过 ESLint 检查
- [ ] Hello World 接口可访问
- [ ] README.md 包含启动说明
- [ ] 代码提交到 Git

---

**✅ T-001 任务创建完成！**
