/**
 * Knowledge Service - 知识库服务
 * 
 * 管理文档上传、解析、分块、向量化
 */

import db from '../models/database';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export interface KnowledgeDocument {
  id: number;
  title: string;
  category: string;
  filePath: string;
  version: string;
  status: number;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  id: number;
  documentId: number;
  content: string;
  chunkIndex: number;
  pageNumber?: number;
  section?: string;
  embedding?: number[];
}

class KnowledgeService {
  /**
   * 上传文档
   */
  async upload(file: Express.Multer.File, title: string, category: string): Promise<KnowledgeDocument> {
    console.log(`📤 上传文档：${title} (${category})`);

    // 1. 保存文件
    const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    // 2. 插入数据库
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO knowledge_docs (title, category, file_path, version, status, chunk_count)
         VALUES (?, ?, ?, '1.0', 1, 0)`,
        [title, category, filePath],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    }).then(async (id) => {
      return await this.getById(id as number);
    });
  }

  /**
   * 获取文档列表
   */
  async list(category?: string, status?: number): Promise<KnowledgeDocument[]> {
    let sql = 'SELECT * FROM knowledge_docs WHERE 1=1';
    const params: any[] = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (status !== undefined) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as KnowledgeDocument[]);
      });
    });
  }

  /**
   * 获取文档详情
   */
  async getById(id: number): Promise<KnowledgeDocument> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM knowledge_docs WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as KnowledgeDocument);
      });
    });
  }

  /**
   * 更新文档状态
   */
  async updateStatus(id: number, status: number): Promise<void> {
    const stmt = db.prepare(`
      UPDATE knowledge_docs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(status, id);
    console.log(`✅ 文档${id}状态已更新为${status}`);
  }

  /**
   * 删除文档
   */
  async delete(id: number): Promise<void> {
    // 1. 获取文档信息
    const doc = await this.getById(id);
    
    // 2. 删除文件
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    // 3. 删除数据库记录
    const stmt = db.prepare('DELETE FROM knowledge_docs WHERE id = ?');
    stmt.run(id);

    console.log(`✅ 文档${id}已删除`);
  }

  /**
   * 文档分块（简化版）
   */
  private async chunkDocument(filePath: string): Promise<DocumentChunk[]> {
    // TODO: 实现 PDF 解析和分块
    // 暂时返回空数组
    return [];
  }

  /**
   * 保存分块
   */
  private async saveChunks(documentId: number, chunks: DocumentChunk[]): Promise<void> {
    const stmt = db.prepare(`
      INSERT INTO document_chunks (document_id, content, chunk_index, page_number, section)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((chunks: DocumentChunk[]) => {
      for (const chunk of chunks) {
        stmt.run(
          documentId,
          chunk.content,
          chunk.chunkIndex,
          chunk.pageNumber || null,
          chunk.section || null
        );
      }
    });

    insertMany(chunks);

    // 更新文档的 chunk_count
    const updateStmt = db.prepare(`
      UPDATE knowledge_docs SET chunk_count = ? WHERE id = ?
    `);
    updateStmt.run(chunks.length, documentId);
  }
}

export const knowledgeService = new KnowledgeService();
export default knowledgeService;
