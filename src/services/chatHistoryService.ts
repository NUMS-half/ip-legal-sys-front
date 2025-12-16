import { Role } from "../types";
import type { Message, ChatSessionSummary } from "../types";

// Mock Data Store
const MOCK_SESSIONS: ChatSessionSummary[] = [
  {
    id: "session-1",
    title: "软件著作权申请流程",
    updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    preview: "请问软件著作权申请需要哪些材料？"
  },
  {
    id: "session-2",
    title: "商标侵权判定标准",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    preview: "如何判断我的商标是否被侵权？"
  },
  {
    id: "session-3",
    title: "专利年费缴纳规定",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    preview: "专利年费如果不交会怎么样？"
  }
];

const MOCK_MESSAGES_MAP: Record<string, Message[]> = {
  "session-1": [
    {
      id: "s1-m1",
      role: Role.User,
      content: "请问软件著作权申请需要哪些材料？",
      timestamp: Date.now() - 1000 * 60 * 60 * 2.1
    },
    {
      id: "s1-m2",
      role: Role.Model,
      content: "申请软件著作权（软著）通常需要准备以下材料：\n\n1. **软件著作权登记申请表**：在线填写并打印签字盖章。\n2. **身份证明文件**：\n   - 个人：身份证复印件。\n   - 企业：营业执照副本复印件（需加盖公章）。\n3. **源代码**：\n   - 提供前后各连续30页，共60页。\n   - 不足60页的需全部提交。\n4. **说明文档**：\n   - 用户手册、操作说明书或设计说明书（任选一种），也是前后各30页。\n\n建议您访问中国版权保护中心官网查看最新要求。",
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      citations: [{ title: "中国版权保护中心 - 登记指南", uri: "https://www.ccopyright.com.cn/" }]
    }
  ],
  "session-2": [
    {
      id: "s2-m1",
      role: Role.User,
      content: "我收到了一封律师函，说我的Logo侵犯了他们的商标权，我该怎么判断是否真的侵权？",
      timestamp: Date.now() - 1000 * 60 * 60 * 24.1
    },
    {
      id: "s2-m2",
      role: Role.Model,
      content: "收到侵权警告需冷静应对。商标侵权的判定主要依据《商标法》第五十七条，核心标准是**“混淆可能性”**。\n\n主要考量因素包括：\n1. **商标近似度**：您的Logo与对方商标在文字、图形、读音、含义上是否相似。\n2. **商品/服务类别**：双方使用的商品或服务是否属于同一种或类似类别。\n3. **显著性与知名度**：对方商标的知名度越高，保护范围通常越宽。\n\n建议您：\n- 立即停止使用涉嫌侵权的标识（暂时的）。\n- 寻求专业知识产权律师进行比对分析。\n- 调查对方商标的权利状态（是否有效、是否连续使用）。",
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      citations: [{ title: "中华人民共和国商标法 - 第五十七条", uri: "http://www.npc.gov.cn/" }]
    }
  ],
  "session-3": [
    {
      id: "s3-m1",
      role: Role.User,
      content: "专利年费如果不交会怎么样？有宽限期吗？",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3.1
    },
    {
      id: "s3-m2",
      role: Role.Model,
      content: "如果不按时缴纳专利年费，可能会导致专利权终止。\n\n关于宽限期（滞纳期）：\n1. **6个月宽限期**：在应当缴纳年费期满之日起6个月内，可以补缴，但需要缴纳滞纳金。\n   - 超过规定期限1个月内，不收滞纳金。\n   - 超过1个月，滞纳金金额按月递增（通常为全额年费的5%~25%）。\n2. **终止**：如果期满6个月仍未缴纳，专利权将自应当缴纳年费期满之日起终止。\n\n如果是因不可抗力导致未缴纳，在收到终止通知书后2个月内可以申请恢复权利。",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
      citations: [{ title: "专利审查指南 - 年费缴纳", uri: "https://www.cnipa.gov.cn/" }]
    }
  ]
};

const MOCK_DELAY = 600; // Simulate slightly faster latency for DB reads

/**
 * Fetches the list of chat history sessions.
 * Replace the implementation with a backend API call.
 */
export const fetchChatHistoryList = async (): Promise<ChatSessionSummary[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // Real Backend Example:
  // const res = await fetch('/api/history/sessions');
  // return await res.json();
  
  return MOCK_SESSIONS;
};

/**
 * Fetches the specific messages for a given session ID.
 * Replace the implementation with a backend API call.
 */
export const fetchChatSessionDetails = async (sessionId: string): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  // Real Backend Example:
  // const res = await fetch(`/api/history/sessions/${sessionId}`);
  // return await res.json();

  return MOCK_MESSAGES_MAP[sessionId] || [];
};
