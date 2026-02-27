/**
 * Log Service - 问答日志服务
 * 
 * 查询、导出问答日志
 */

import db from '../models/database';
import sqlite3 from 'sqlite3';

export interface QALog {
  id: number;
  conversationId: string;
  question: string;
  answer: string;
  intent: string;
  confidence: number;
  feedback: number;
  sources: string;
  createdAt: string;
}

export interface LogQueryParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  intent?: string;
  page?: number;
  limit?: number;
}

class LogService {
  /**
   * 查询问答日志
   */
  async query(params: LogQueryParams): Promise<{ logs: QALog[]; total: number }> {
    const { userId, startDate, endDate, intent, page = 1, limit = 20 } = params;

    // 构建查询条件
    let whereClause = 'WHERE 1=1';
    const whereParams: any[] = [];

    if (userId) {
      whereClause += ' AND c.user_id = ?';
      whereParams.push(userId);
    }

    if (startDate) {
      whereClause += ' AND l.created_at >= ?';
      whereParams.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND l.created_at <= ?';
      whereParams.push(endDate);
    }

    if (intent) {
      whereClause += ' AND l.intent = ?';
      whereParams.push(intent);
    }

    // 查询总数
    const total = await new Promise<number>((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as total FROM qa_logs l
         LEFT JOIN conversations c ON l.conversation_id = c.id
         ${whereClause}`,
        whereParams,
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row?.total || 0);
        }
      );
    });

    // 查询日志
    const offset = (page - 1) * limit;
    const logs = await new Promise<QALog[]>((resolve, reject) => {
      db.all(
        `SELECT l.*, c.user_id, c.session_id
         FROM qa_logs l
         LEFT JOIN conversations c ON l.conversation_id = c.id
         ${whereClause}
         ORDER BY l.created_at DESC
         LIMIT ? OFFSET ?`,
        [...whereParams, limit, offset],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as QALog[]);
        }
      );
    });

    return { logs, total };
  }

  /**
   * 获取日志详情
   */
  async getById(id: number): Promise<QALog | null> {
    const stmt = db.prepare('SELECT * FROM qa_logs WHERE id = ?');
    return stmt.get(id) as QALog | null;
  }

  /**
   * 获取统计数据
   */
  async getStats(startDate?: string, endDate?: string): Promise<any> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      whereClause += ' AND created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND created_at <= ?';
      params.push(endDate);
    }

    // 总问答数
    const totalStmt = db.prepare(`SELECT COUNT(*) as total FROM qa_logs ${whereClause}`);
    const { total } = totalStmt.get(...params) as { total: number };

    // 意图分布
    const intentStmt = db.prepare(`
      SELECT intent, COUNT(*) as count 
      FROM qa_logs 
      ${whereClause}
      GROUP BY intent 
      ORDER BY count DESC
    `);
    const byIntent = intentStmt.all(...params);

    // 反馈统计
    const feedbackStmt = db.prepare(`
      SELECT 
        SUM(CASE WHEN feedback = 1 THEN 1 ELSE 0 END) as helpful,
        SUM(CASE WHEN feedback = 0 THEN 1 ELSE 0 END) as notHelpful,
        SUM(CASE WHEN feedback IS NULL THEN 1 ELSE 0 END) as noFeedback
      FROM qa_logs 
      ${whereClause}
    `);
    const feedback = feedbackStmt.get(...params);

    return {
      total,
      byIntent,
      feedback,
      helpfulRate: feedback['helpful'] / (feedback['helpful'] + feedback['notHelpful']) || 0,
    };
  }
}

export const logService = new LogService();
export default logService;
