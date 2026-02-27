/**
 * QA Service - 问答服务
 * 
 * 处理用户提问，生成 AI 回答，记录问答日志
 */

import db from '../models/database';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'sqlite3';

export interface Question {
  id: string;
  userId: string;
  sessionId: string;
  content: string;
  intent?: string;
  createdAt: Date;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  sources?: string[];
  confidence: number;
  createdAt: Date;
}

export interface QAResult {
  question: string;
  answer: string;
  sources: string[];
  confidence: number;
  intent?: string;
}

class QAService {
  /**
   * 提问并获取回答
   */
  async ask(question: Question): Promise<QAResult> {
    console.log(`🤔 收到问题：${question.content}`);

    // 1. 意图识别
    const intent = await this.recognizeIntent(question.content);
    console.log(`🎯 识别意图：${intent}`);

    // 2. RAG 检索 + 生成
    const ragResult = await this.generateAnswer(question.content, intent);

    // 3. 记录问答日志
    await this.saveLog(question, ragResult);

    return ragResult;
  }

  /**
   * 识别意图
   */
  private async recognizeIntent(question: string): Promise<string> {
    // TODO: 实现意图识别（使用 LLM 或规则匹配）
    // 暂时使用关键词匹配
    
    const keywords: Record<string, string[]> = {
      ANNUAL_LEAVE: ['年假', '年休假', '带薪休假', '年假余额'],
      SICK_LEAVE: ['病假', '请病假', '病假工资'],
      SOCIAL_INSURANCE: ['社保', '五险一金', '公积金', '医保'],
      REIMBURSEMENT: ['报销', '差旅', '出差', '餐补', '交通补'],
      ATTENDANCE: ['考勤', '迟到', '早退', '打卡', '加班'],
      RECRUITMENT: ['招聘', '面试', '简历', 'offer'],
      TRAINING: ['培训', '学习', '课程'],
      COMPENSATION: ['薪资', '工资', '薪酬', '调薪'],
    };

    for (const [intent, words] of Object.entries(keywords)) {
      if (words.some(word => question.includes(word))) {
        return intent;
      }
    }

    return 'OTHER';
  }

  /**
   * RAG 检索 + 生成回答
   */
  private async generateAnswer(question: string, intent: string): Promise<QAResult> {
    // TODO: 实现 RAG 流程
    // 1. 向量化问题
    // 2. 检索相似文档
    // 3. LLM 生成回答
    
    // 暂时返回模拟回答
    const mockAnswers: Record<string, string> = {
      ANNUAL_LEAVE: '您剩余年假天数请查看个人中心。年假有效期到年底，请及时使用。年假可以分多次使用，每次至少半天。',
      SICK_LEAVE: '请病假需要提供医院证明。病假期间薪资计算：连续工龄<2 年按 60%，2-4 年按 70%，以此类推。',
      SOCIAL_INSURANCE: '公司缴纳比例：养老 16%、医疗 10%、失业 0.5%、工伤 0.5%、生育 1%。公积金：公司 12%，个人 12%。',
      REIMBURSEMENT: '差旅报销标准：一线城市 150 元/天，二线城市 100 元/天。交通实报实销，需保留发票。',
      ATTENDANCE: '工作时间为 9:00-18:00，午休 1 小时。迟到 30 分钟内扣 50 元，超过按旷工处理。',
      RECRUITMENT: '招聘流程：简历筛选→初试→复试→offer→入职。面试结果 3 个工作日内反馈。',
      TRAINING: '公司提供内部培训和外部培训。内部培训通过 HR 助手预约，外部培训需主管审批。',
      COMPENSATION: '薪资每月 10 日发放。调薪每年一次，通常在 Q1 进行。',
      OTHER: '抱歉，我暂时无法回答这个问题。您可以尝试转人工客服获取帮助。',
    };

    return {
      question,
      answer: mockAnswers[intent] || mockAnswers.OTHER,
      sources: [],
      confidence: 0.9,
      intent,
    };
  }

  /**
   * 保存问答日志
   */
  private async saveLog(question: Question, result: QAResult): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO qa_logs (conversation_id, question, answer, intent, confidence, sources, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          question.sessionId,
          question.content,
          result.answer,
          result.intent,
          result.confidence,
          JSON.stringify(result.sources),
          new Date().toISOString()
        ],
        (err) => {
          if (err) reject(err);
          else {
            console.log('✅ 问答日志已保存');
            resolve();
          }
        }
      );
    });
  }

  /**
   * 提交反馈
   */
  async submitFeedback(logId: number, isHelpful: boolean, comment?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE qa_logs SET feedback = ? WHERE id = ?',
        [isHelpful ? 1 : 0, logId],
        (err) => {
          if (err) reject(err);
          else {
            console.log(`✅ 反馈已提交：日志${logId} - ${isHelpful ? '有用' : '无用'}`);
            resolve();
          }
        }
      );
    });
  }
}

export const qaService = new QAService();
export default qaService;
