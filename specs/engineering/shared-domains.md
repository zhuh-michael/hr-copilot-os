# HR Co-Pilot OS - 共享 Domain 规格

**版本：** v1.0  
**日期：** 2026-02-27  
**状态：** 已确认

---

## 共享 Domain 列表

| Domain | 职责 | 路径 |
|--------|------|------|
| **User** | 用户管理 | `domains/user/` |
| **Auth** | 认证鉴权 | `domains/auth/` |
| **Notification** | 通知服务 | `domains/notification/` |

---

## User Domain（用户）

### 核心实体

```typescript
interface User {
  id: string;           // 用户 ID
  employeeId: string;   // 工号
  name: string;         // 姓名
  departmentId: string; // 部门 ID
  role: UserRole;       // 角色
  createdAt: Date;
}

type UserRole = 'EMPLOYEE' | 'HR_ADMIN' | 'SUPER_ADMIN';
```

### 职责
- 用户信息管理
- 角色权限
- 部门关联

---

## Auth Domain（认证）

### 核心实体

```typescript
interface AuthToken {
  token: string;        // JWT Token
  userId: string;       // 用户 ID
  expiresAt: Date;      // 过期时间
  scopes: string[];     // 权限范围
}
```

### 职责
- JWT Token 生成和验证
- 权限校验
- 会话管理

---

## Notification Domain（通知）

### 核心实体

```typescript
interface Notification {
  id: string;           // 通知 ID
  userId: string;       // 接收用户 ID
  type: NotificationType; // 类型
  content: string;      // 内容
  isRead: boolean;      // 已读状态
  createdAt: Date;
}

type NotificationType = 'SYSTEM' | 'QA_FEEDBACK' | 'TRANSFER_ALERT';
```

### 职责
- 系统通知
- 转人工告警
- 反馈提醒

---

## Domain 关系图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│     QA      │────▶│ Conversation│◀────│  Knowledge  │
│   Domain    │     │   Domain    │     │   Domain    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │    Auth     │     │Notification │
│   Domain    │     │   Domain    │     │   Domain    │
└─────────────┘     └─────────────┘     └─────────────┘
      (共享 Domain，被多个核心 Domain 依赖)
```

---

**✅ 共享 Domain 索引创建完成！**
