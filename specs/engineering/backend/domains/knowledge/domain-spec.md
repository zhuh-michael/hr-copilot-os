# Knowledge Domain - 知识库领域规格

**版本：** v1.0  
**日期：** 2026-02-27  
**状态：** 已确认

---

## 1. Domain 概述

**领域名称：** 知识库（Knowledge）  
**职责：** 管理制度文档，支持向量化存储和检索

---

## 2. 核心实体

### 2.1 KnowledgeDocument（知识文档）

```typescript
interface KnowledgeDocument {
  id: string;           // 文档 ID
  title: string;        // 文档标题
  category: string;     // 分类（如"休假政策"）
  filePath: string;     // 文件存储路径
  version: string;      // 版本号
  status: DocumentStatus; // 状态（启用/禁用）
  chunks: DocumentChunk[]; // 分块列表
  createdAt: Date;      // 创建时间
  updatedAt: Date;      // 更新时间
}

type DocumentStatus = 'ACTIVE' | 'INACTIVE';
```

### 2.2 DocumentChunk（文档分块）

```typescript
interface DocumentChunk {
  id: string;           // 分块 ID
  documentId: string;   // 关联文档 ID
  content: string;      // 分块内容
  embedding: number[];  // 向量表示
  chunkIndex: number;   // 分块序号
  metadata: {
    pageNumber?: number; // 页码
    section?: string;    // 章节
  };
}
```

---

## 3. 值对象

### 3.1 DocumentCategory（文档分类）

```typescript
type DocumentCategory =
  | 'ANNUAL_LEAVE'      // 年假
  | 'SICK_LEAVE'        // 病假
  | 'SOCIAL_INSURANCE'  // 社保
  | 'REIMBURSEMENT'     // 报销
  | 'ATTENDANCE'        // 考勤
  | 'RECRUITMENT'       // 招聘
  | 'TRAINING'          // 培训
  | 'COMPENSATION'      // 薪酬
  | 'OTHER';            // 其他
```

### 3.2 SearchQuery（搜索查询）

```typescript
interface SearchQuery {
  query: string;        // 查询文本
  categories?: string[]; // 分类过滤
  limit: number;        // 返回数量限制
  threshold: number;    // 相似度阈值
}
```

### 3.3 SearchResult（搜索结果）

```typescript
interface SearchResult {
  chunk: DocumentChunk; // 匹配的分块
  score: number;        // 相似度分数
  document: KnowledgeDocument; // 关联文档
}
```

---

## 4. 聚合根

### Knowledge Base 聚合

```
Knowledge Base (聚合根)
│
├── KnowledgeDocument (实体)
│   └── DocumentChunk (实体)
│
└── DocumentCategory (值对象)
```

**不变量：**
- 文档必须有至少一个分块
- 分块的 chunkIndex 必须连续
- 文档标题在同一分类下唯一

---

## 5. 领域服务

### 5.1 Document Management Service

**职责：** 管理文档生命周期

```typescript
interface DocumentService {
  // 上传文档
  upload(file: File, category: string): Promise<KnowledgeDocument>;
  
  // 更新文档
  update(documentId: string, file: File): Promise<KnowledgeDocument>;
  
  // 删除文档
  delete(documentId: string): Promise<void>;
  
  // 获取文档列表
  list(category?: string): Promise<KnowledgeDocument[]>;
}
```

### 5.2 Vector Search Service

**职责：** 向量相似度检索

```typescript
interface VectorSearchService {
  // 相似度搜索
  search(query: SearchQuery): Promise<SearchResult[]>;
  
  // 添加向量
  addEmbedding(chunkId: string, embedding: number[]): Promise<void>;
  
  // 删除向量
  removeEmbedding(chunkId: string): Promise<void>;
}
```

### 5.3 Chunking Service

**职责：** 文档分块

```typescript
interface ChunkingService {
  // 将文档内容分块
  chunk(content: string, options?: ChunkOptions): Promise<DocumentChunk[]>;
}

interface ChunkOptions {
  maxChunkSize: number;  // 最大分块大小（默认 500 字）
  overlap: number;       // 重叠大小（默认 50 字）
}
```

### 5.4 Embedding Service

**职责：** 文本向量化

```typescript
interface EmbeddingService {
  // 生成向量
  generate(text: string): Promise<number[]>;
}
```

---

## 6. 领域事件

### 6.1 DocumentUploaded（文档已上传）

```typescript
interface DocumentUploadedEvent {
  documentId: string;
  title: string;
  category: string;
  chunkCount: number;
  timestamp: Date;
}
```

### 6.2 DocumentUpdated（文档已更新）

```typescript
interface DocumentUpdatedEvent {
  documentId: string;
  oldVersion: string;
  newVersion: string;
  timestamp: Date;
}
```

### 6.3 DocumentDeleted（文档已删除）

```typescript
interface DocumentDeletedEvent {
  documentId: string;
  title: string;
  timestamp: Date;
}
```

---

## 7. 仓库接口

### Document Repository

```typescript
interface DocumentRepository {
  save(document: KnowledgeDocument): Promise<void>;
  findById(id: string): Promise<KnowledgeDocument | null>;
  findByCategory(category: string): Promise<KnowledgeDocument[]>;
  delete(id: string): Promise<void>;
}
```

### Chunk Repository

```typescript
interface ChunkRepository {
  save(chunk: DocumentChunk): Promise<void>;
  findById(id: string): Promise<DocumentChunk | null>;
  findByDocumentId(documentId: string): Promise<DocumentChunk[]>;
}
```

---

## 8. 与 F-001 的关联

| User Story | Domain 覆盖 |
|-----------|-----------|
| US-001~003：问答 | ✅ 向量检索 |
| US-005：上传文档 | ✅ DocumentService |
| US-006：问答日志 | ✅ 文档关联 |

---

**✅ Knowledge Domain 规格创建完成！**
