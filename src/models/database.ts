/**
 * 数据库配置和初始化
 */

import sqlite3 from 'sqlite3';
import path from 'path';

// 数据库路径
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/hr_copilot.db');

// 创建数据库连接
const db = new sqlite3.Database(DB_PATH);

// 启用外键
db.run('PRAGMA foreign_keys = ON');

// 初始化数据库表
export function initDatabase(): void {
  console.log('📦 初始化数据库...');

  const createTables = () => {
    // 用户表
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        department_id INTEGER,
        role VARCHAR(50) DEFAULT 'EMPLOYEE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 会话表
    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_id VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 问答记录表
    db.exec(`
      CREATE TABLE IF NOT EXISTS qa_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT,
        intent VARCHAR(100),
        confidence REAL,
        feedback INTEGER,
        sources TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
      )
    `);

    // 知识库文档表
    db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_docs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100),
        file_path VARCHAR(500) NOT NULL,
        version VARCHAR(50) DEFAULT '1.0',
        status INTEGER DEFAULT 1,
        chunk_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 文档分块表
    db.exec(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        page_number INTEGER,
        section VARCHAR(200),
        embedding BLOB,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES knowledge_docs(id)
      )
    `);

    // 创建索引
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
      CREATE INDEX IF NOT EXISTS idx_qa_logs_conversation ON qa_logs(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_qa_logs_created ON qa_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_knowledge_docs_category ON knowledge_docs(category);
      CREATE INDEX IF NOT EXISTS idx_document_chunks_document ON document_chunks(document_id);
    `);

    console.log('✅ 数据库初始化完成');
  };

  createTables();
}

// 导出数据库实例
export default db;
