# F-001 智能问答机器人 - 技术架构

**版本：** v1.0  
**日期：** 2026-02-27  
**状态：** 已确认

---

## 1. 架构概述

### 1.1 系统上下文

```
┌─────────────────────────────────────────────────────────┐
│                     员工/HR 用户                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              钉钉 / 企业微信 / Web                       │
│                    （前端入口）                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              HR Co-Pilot OS 后端服务                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  API Gateway │  │  对话管理   │  │  知识库     │     │
│  │             │  │  服务       │  │  服务       │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   SQLite/   │ │   向量      │ │   文件      │
│  PostgreSQL │ │   数据库    │ │   存储      │
│  (业务数据) │ │  (Embedding)│ │  (文档)     │
└─────────────┘ └─────────────┘ └─────────────┘
```

---

## 2. 技术栈选型

### 2.1 前端

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Vue 3 + TypeScript | 响应式 + 类型安全 |
| **UI 组件** | Element Plus | 企业级组件库 |
| **状态管理** | Pinia | Vue 3 推荐 |
| **构建工具** | Vite | 快速开发 + 构建 |
| **IM 集成** | 钉钉/企微 SDK | 嵌入工作台 |

### 2.2 后端

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Node.js + Express | 轻量 + 高并发 |
| **语言** | TypeScript | 类型安全 |
| **AI 框架** | LangChain | RAG 流程编排 |
| **向量模型** | text2vec / m3e | 中文文本向量化 |
| **LLM** | 通义千问 / ChatGLM | 大语言模型 |

### 2.3 数据库

| 用途 | 技术 | 说明 |
|------|------|------|
| **业务数据** | SQLite（开发）/ PostgreSQL（生产） | 用户/日志/配置 |
| **向量数据** | Chroma / Milvus | Embedding 存储 + 检索 |
| **文件存储** | 本地文件系统 / OSS | 制度文档存储 |

---

## 3. 核心模块设计

### 3.1 API Gateway

**职责：**
- 统一入口，路由分发
- 认证鉴权（JWT）
- 限流熔断
- 日志记录

**接口列表：**
| 接口 | 方法 | 说明 |
|------|------|------|
| `POST /api/chat` | POST | 发送消息，获取 AI 回答 |
| `POST /api/chat/feedback` | POST | 提交反馈（有用/无用） |
| `GET /api/faq` | GET | 获取常见问题列表 |
| `POST /api/human-transfer` | POST | 转接人工客服 |
| `GET /api/logs` | GET | 查询问答日志（HR） |
| `POST /api/knowledge/upload` | POST | 上传制度文档（HR） |

### 3.2 对话管理服务

**职责：**
- 会话管理（多轮对话上下文）
- 意图识别
- 回复生成
- 转人工逻辑

**流程：**
```
用户提问 → 意图识别 → 检索知识库 → LLM 生成回答 → 返回
                │
                └─ 置信度低 → 转人工
```

### 3.3 知识库服务

**职责：**
- 文档上传解析
- 文本分块（Chunking）
- 向量化（Embedding）
- 相似度检索

**流程：**
```
上传文档 → PDF 解析 → 文本分块 → 向量化 → 存入向量数据库
```

---

## 4. 数据模型

### 4.1 核心表结构

```sql
-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE,
    name VARCHAR(100),
    department_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 对话记录表
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    session_id VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 问答记录表
CREATE TABLE qa_logs (
    id INTEGER PRIMARY KEY,
    conversation_id INTEGER,
    question TEXT,
    answer TEXT,
    feedback INTEGER,  -- 1:有用，0:无用
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- 知识库文档表
CREATE TABLE knowledge_docs (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200),
    file_path VARCHAR(500),
    category VARCHAR(100),
    version VARCHAR(50),
    status INTEGER,  -- 1:启用，0:禁用
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. 安全设计

### 5.1 认证鉴权

- JWT Token 认证
- 权限隔离（员工/HR 管理员）
- API 限流（100 次/分钟）

### 5.2 数据脱敏

- 薪资/身份证等敏感字段自动脱敏
- 问答日志加密存储
- 权限范围内查询

### 5.3 审计日志

- 所有 AI 决策过程留痕
- 文档上传/删除操作记录
- 支持追溯和审计

---

## 6. 部署架构

### 6.1 开发环境

```
单服务器部署：
- Node.js 后端（Docker 容器）
- SQLite 数据库
- 本地文件存储
```

### 6.2 生产环境

```
多服务器部署：
- Nginx（负载均衡）
- Node.js 后端集群（多实例）
- PostgreSQL 数据库（主从）
- 向量数据库（Milvus 集群）
- OSS 文件存储
```

---

## 7. ADR（架构决策记录）

| ADR 编号 | 主题 | 状态 |
|---------|------|------|
| ADR-001 | 选择 Node.js + Express 作为后端框架 | ✅ 已确认 |
| ADR-002 | 选择 RAG 架构作为 AI 方案 | ✅ 已确认 |
| ADR-003 | 选择 SQLite（开发）+ PostgreSQL（生产） | ✅ 已确认 |
| ADR-004 | 选择 Vue 3 + Element Plus 作为前端 | ✅ 已确认 |

详见 `adr/` 目录。

---

**✅ 技术架构创建完成！**

下一步：创建 ADR 文档
