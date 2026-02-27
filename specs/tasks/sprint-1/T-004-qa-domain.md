# T-004：QA Domain 实现

**优先级：** P0  
**估算工时：** 8 小时  
**状态：** 待开始  
**负责人：** 麒麟  
**关联 US：** US-001, US-002, US-003

---

## 1. 任务描述

**作为** 后端开发者  
**我想要** 实现 QA Domain 核心逻辑  
**以便于** 处理用户提问并生成 AI 回答

---

## 2. 验收标准

- [ ] 实现 Question 和 Answer 实体
- [ ] 实现 QAService.ask() 方法
- [ ] 实现 IntentService.recognize() 方法
- [ ] 实现 RAGService.generate() 方法
- [ ] 实现问答日志存储
- [ ] 编写单元测试（覆盖率 >80%）

---

## 3. 技术说明

### 核心接口

```typescript
// QA Service
class QAService {
  async ask(question: Question): Promise<Answer> {
    // 1. 意图识别
    const intent = await this.intentService.recognize(question.content);
    
    // 2. RAG 检索 + 生成
    const answer = await this.ragService.generate(question.content);
    
    // 3. 存储日志
    await this.saveLog(question, answer);
    
    return answer;
  }
}

// Intent Service
class IntentService {
  async recognize(question: string): Promise<Intent> {
    // 使用 LLM 或规则匹配识别意图
  }
}

// RAG Service
class RAGService {
  async generate(question: string): Promise<Answer> {
    // 1. 向量化问题
    const embedding = await this.embeddingService.generate(question);
    
    // 2. 检索相似文档
    const results = await this.vectorSearchService.search({ query: question });
    
    // 3. LLM 生成回答
    const answer = await this.llm.generate(question, results);
    
    return answer;
  }
}
```

---

## 4. 依赖任务

- [x] T-001：后端项目初始化
- [x] T-002：数据库表创建
- [x] T-003：API Gateway 搭建
- [ ] T-005：Knowledge Domain 实现（并行）
- [ ] T-006：Conversation Domain 实现（并行）

---

## 5. 完成定义（DoD）

- [ ] 代码通过 ESLint 检查
- [ ] 单元测试通过（覆盖率 >80%）
- [ ] 集成测试通过
- [ ] 代码提交到 Git

---

**✅ T-004 任务创建完成！**
