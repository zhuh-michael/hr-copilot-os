# HR Co-Pilot OS

智能 HR 问答机器人 - 基于 RAG 架构的企业级 HR 智能助手

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置 API Key 等
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问服务

- 首页：http://localhost:3000/
- 健康检查：http://localhost:3000/api/health

---

## 📚 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/chat` | POST | 发送消息，获取 AI 回答 |
| `/api/chat/feedback` | POST | 提交反馈 |
| `/api/faq` | GET | 获取常见问题 |
| `/api/logs` | GET | 查询问答日志 |
| `/api/knowledge/upload` | POST | 上传制度文档 |

---

## 🏗️ 技术架构

- **前端**: Vue 3 + TypeScript + Element Plus
- **后端**: Node.js + Express + TypeScript
- **AI**: LangChain + RAG 架构
- **数据库**: SQLite（开发）/ PostgreSQL（生产）
- **向量库**: Chroma / Milvus

---

## 📁 项目结构

```
hr-copilot-os/
├── src/
│   ├── controllers/     # 控制器
│   ├── services/        # 服务层
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数
│   └── index.ts         # 入口文件
├── specs/               # SDD 规格文档
├── tests/               # 测试文件
├── uploads/             # 上传文件
├── data/                # 数据库文件
└── package.json
```

---

## 📊 SDD 流程状态

| 阶段 | 状态 |
|------|------|
| 阶段 0: 产品初始化 | ✅ 完成 |
| 阶段 1: 需求分解 | ✅ 完成 |
| 阶段 2: UI 设计 | ✅ 完成 |
| 阶段 3: 架构设计 | ✅ 完成 |
| 阶段 4: Domain 设计 | ✅ 完成 |
| 阶段 5: 任务规划 | ✅ 完成 |
| 阶段 6: 实现与验证 | 🔄 进行中 |

---

## 📝 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint + Prettier 代码规范
- 单元测试覆盖率 >80%
- Commit Message 遵循 Conventional Commits

---

## 📄 License

MIT
