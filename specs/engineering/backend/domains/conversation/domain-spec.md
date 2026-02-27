# Conversation Domain - 会话领域规格

**版本：** v1.0  
**日期：** 2026-02-27  
**状态：** 已确认

---

## 1. Domain 概述

**领域名称：** 会话（Conversation）  
**职责：** 管理多轮对话上下文，支持话题追踪和切换

---

## 2. 核心实体

### 2.1 Conversation（会话）

```typescript
interface Conversation {
  id: string;           // 会话 ID
  userId: string;       // 用户 ID
  messages: Message[];  // 消息列表
  currentTopic?: string; // 当前话题
  status: ConversationStatus; // 状态
  createdAt: Date;      // 创建时间
  updatedAt: Date;      // 更新时间
}

type ConversationStatus = 'ACTIVE' | 'CLOSED' | 'TRANSFERRED';
```

### 2.2 Message（消息）

```typescript
interface Message {
  id: string;           // 消息 ID
  conversationId: string; // 会话 ID
  role: 'USER' | 'ASSISTANT' | 'HUMAN'; // 角色
  content: string;      // 消息内容
  metadata?: {
    intent?: string;    // 意图
    sources?: string[]; // 来源
    confidence?: number; // 置信度
  };
  createdAt: Date;      // 创建时间
}
```

---

## 3. 值对象

### 3.1 Topic（话题）

```typescript
interface Topic {
  name: string;         // 话题名称（如"年假"）
  keywords: string[];   // 关键词
  relatedTopics: string[]; // 相关话题
}
```

### 3.2 TurnContext（轮次上下文）

```typescript
interface TurnContext {
  turnIndex: number;    // 轮次序号
  lastUserMessage: string; // 上一轮用户消息
  lastAssistantMessage: string; // 上一轮 AI 消息
  topicHistory: string[]; // 话题历史
}
```

---

## 4. 聚合根

### Conversation 聚合

```
Conversation (聚合根)
│
├── Message (实体)
│
└── Topic (值对象)
```

**不变量：**
- 会话必须有至少一条消息
- 消息必须按时间顺序排列
- 会话最多保留最近 50 条消息（超出截断）

---

## 5. 领域服务

### 5.1 Conversation Service

**职责：** 管理会话生命周期

```typescript
interface ConversationService {
  // 创建会话
  create(userId: string): Promise<Conversation>;
  
  // 添加消息
  addMessage(conversationId: string, message: Message): Promise<void>;
  
  // 获取会话
  getConversation(conversationId: string): Promise<Conversation | null>;
  
  // 关闭会话
  closeConversation(conversationId: string): Promise<void>;
  
  // 转人工
  transferToHuman(conversationId: string): Promise<void>;
}
```

### 5.2 Context Management Service

**职责：** 管理对话上下文

```typescript
interface ContextService {
  // 获取上下文
  getContext(conversationId: string): Promise<TurnContext>;
  
  // 更新话题
  updateTopic(conversationId: string, topic: string): Promise<void>;
  
  // 检测话题切换
  detectTopicSwitch(messages: Message[]): Promise<boolean>;
}
```

---

## 6. 领域事件

### 6.1 ConversationStarted（会话已开始）

```typescript
interface ConversationStartedEvent {
  conversationId: string;
  userId: string;
  timestamp: Date;
}
```

### 6.2 MessageAdded（消息已添加）

```typescript
interface MessageAddedEvent {
  messageId: string;
  conversationId: string;
  role: string;
  timestamp: Date;
}
```

### 6.3 ConversationTransferred（会话已转接）

```typescript
interface ConversationTransferredEvent {
  conversationId: string;
  fromAgent: string;    // "AI"
  toAgent: string;      // "HUMAN"
  timestamp: Date;
}
```

---

## 7. 仓库接口

### Conversation Repository

```typescript
interface ConversationRepository {
  save(conversation: Conversation): Promise<void>;
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  delete(id: string): Promise<void>;
}
```

---

## 8. 与 F-001 的关联

| User Story | Domain 覆盖 |
|-----------|-----------|
| US-002：多轮对话 | ✅ ConversationContext |
| US-004：转人工 | ✅ transferToHuman |
| US-006：问答日志 | ✅ Message 存储 |

---

**✅ Conversation Domain 规格创建完成！**

---

## 📊 Domain 设计汇总

| Domain | 状态 | 文件 |
|--------|------|------|
| QA Domain | ✅ 完成 | `domains/qa/domain-spec.md` |
| Knowledge Domain | ✅ 完成 | `domains/knowledge/domain-spec.md` |
| Conversation Domain | ✅ 完成 | `domains/conversation/domain-spec.md` |

下一步：创建共享 Domain 索引，然后提交 Git
