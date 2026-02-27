# QA Domain - 问答领域规格

**版本：** v1.0  
**日期：** 2026-02-27  
**状态：** 已确认

---

## 1. Domain 概述

**领域名称：** 问答（QA）  
**职责：** 处理用户提问，生成 AI 回答，记录问答日志

---

## 2. 核心实体

### 2.1 Question（问题）

```typescript
interface Question {
  id: string;           // 问题 ID
  userId: string;       // 提问用户 ID
  sessionId: string;    // 会话 ID
  content: string;      // 问题内容
  intent?: string;      // 识别的意图
  createdAt: Date;      // 提问时间
}
```

### 2.2 Answer（回答）

```typescript
interface Answer {
  id: string;           // 回答 ID
  questionId: string;   // 关联问题 ID
  content: string;      // 回答内容
  sources?: string[];   // 来源文档 IDs
  confidence: number;   // 置信度 (0-1)
  createdAt: Date;      // 回答时间
}
```

### 2.3 Feedback（反馈）

```typescript
interface Feedback {
  id: string;           // 反馈 ID
  answerId: string;     // 关联回答 ID
  isHelpful: boolean;   // 是否有用
  comment?: string;     // 反馈备注
  createdAt: Date;      // 反馈时间
}
```

---

## 3. 值对象

### 3.1 Intent（意图）

```typescript
type IntentType = 
  | 'ANNUAL_LEAVE'      // 年假
  | 'SOCIAL_INSURANCE'  // 社保
  | 'REIMBURSEMENT'     // 报销
  | 'ATTENDANCE'        // 考勤
  | 'RECRUITMENT'       // 招聘
  | 'TRAINING'          // 培训
  | 'OTHER';            // 其他

interface Intent {
  type: IntentType;     // 意图类型
  confidence: number;   // 置信度
}
```

### 3.2 ConversationContext（对话上下文）

```typescript
interface ConversationContext {
  sessionId: string;          // 会话 ID
  history: Question[];        // 历史问题（最近 5 轮）
  currentTopic?: string;      // 当前话题
}
```

---

## 4. 聚合根

### QA Session 聚合

```
QA Session (聚合根)
│
├── Question (实体)
│   └── Answer (实体)
│       └── Feedback (实体)
│
└── ConversationContext (值对象)
```

**不变量：**
- 一个 Session 必须有至少一个 Question
- Answer 必须关联一个 Question
- Feedback 必须关联一个 Answer

---

## 5. 领域服务

### 5.1 QA Service

**职责：** 处理问答流程

```typescript
interface QAService {
  // 提问并获取回答
  ask(question: Question): Promise<Answer>;
  
  // 提交反馈
  submitFeedback(feedback: Feedback): Promise<void>;
  
  // 获取会话历史
  getSessionHistory(sessionId: string): Promise<Question[]>;
}
```

### 5.2 Intent Recognition Service

**职责：** 识别问题意图

```typescript
interface IntentService {
  // 识别意图
  recognize(question: string): Promise<Intent>;
}
```

### 5.3 RAG Service

**职责：** 检索增强生成

```typescript
interface RAGService {
  // 基于问题检索文档并生成回答
  generate(question: string, context?: ConversationContext): Promise<Answer>;
}
```

---

## 6. 领域事件

### 6.1 QuestionAsked（问题已提问）

```typescript
interface QuestionAskedEvent {
  questionId: string;
  userId: string;
  content: string;
  timestamp: Date;
}
```

### 6.2 AnswerGenerated（回答已生成）

```typescript
interface AnswerGeneratedEvent {
  answerId: string;
  questionId: string;
  confidence: number;
  timestamp: Date;
}
```

### 6.3 FeedbackSubmitted（反馈已提交）

```typescript
interface FeedbackSubmittedEvent {
  feedbackId: string;
  answerId: string;
  isHelpful: boolean;
  timestamp: Date;
}
```

---

## 7. 仓库接口

### Question Repository

```typescript
interface QuestionRepository {
  save(question: Question): Promise<void>;
  findById(id: string): Promise<Question | null>;
  findBySessionId(sessionId: string): Promise<Question[]>;
}
```

### Answer Repository

```typescript
interface AnswerRepository {
  save(answer: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  findByQuestionId(questionId: string): Promise<Answer | null>;
}
```

---

## 8. 与 F-001 的关联

| User Story | Domain 覆盖 |
|-----------|-----------|
| US-001：口语化提问 | ✅ Intent Recognition |
| US-002：多轮对话 | ✅ ConversationContext |
| US-003：模糊查询 | ✅ Intent Recognition |
| US-004：转人工 | ✅ 低置信度处理 |
| US-006：问答日志 | ✅ Question/Answer 存储 |

---

**✅ QA Domain 规格创建完成！**

下一步：Knowledge Domain + Conversation Domain
