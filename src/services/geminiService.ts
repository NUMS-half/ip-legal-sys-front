import type { Message, Citation } from "../types";

// Mock configuration
const MOCK_DELAY = 1500; // Simulate network latency (ms)

/**
 * Mock implementation of sendMessageToLegalBot.
 * Replaces the real Gemini API call with simulated local backend responses.
 */
export const sendMessageToLegalBot = async (
  _history: Message[],
  userMessage: string
): Promise<{ text: string; citations: Citation[] }> => {
  
  // 1. Simulate Network Delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // 2. Keyword matching to generate context-aware mock responses
  const lowerMsg = userMessage.toLowerCase();
  
  let mockText = "";
  let mockCitations: Citation[] = [];

  if (lowerMsg.includes("商标") || lowerMsg.includes("trademark")) {
    mockText = `【模拟本地模型回复】关于商标注册问题：

根据《中华人民共和国商标法》相关规定，申请注册商标应当具备显著特征，便于识别，并不得与他人在先取得的合法权利相冲突。

建议流程：
1. **商标查询**：在申请前进行近似查询，降低被驳回风险。
2. **提交申请**：向国家知识产权局商标局提交申请书及相关材料。
3. **形式审查与实质审查**：通常需要9个月左右的时间。
4. **公告与核准**：初审公告期为3个月，无异议后核准注册。

请注意，这只是模拟的法律建议，实际操作请咨询专业律师。`;
    
    mockCitations = [
      { title: "中华人民共和国商标法 - 中国人大网", uri: "http://www.npc.gov.cn/npc/c30834/201905/75ef71816f584e0c83a5477215444655.shtml" },
      { title: "商标注册申请指南 - 国家知识产权局", uri: "https://www.cnipa.gov.cn/" }
    ];

  } else if (lowerMsg.includes("专利") || lowerMsg.includes("patent")) {
    mockText = `【模拟本地模型回复】关于专利申请：

在中国，专利分为发明专利、实用新型专利和外观设计专利三种。

- **发明专利**：保护期限20年，要求具有突出的实质性特点和显著进步。
- **实用新型**：保护期限10年，主要针对产品的形状、构造提出的适于实用的新技术方案。
- **外观设计**：保护期限15年，针对产品的外观设计。

申请专利需要向国家知识产权局提交说明书、权利要求书等文件。`;

    mockCitations = [
        { title: "中华人民共和国专利法 (2020修正)", uri: "https://www.cnipa.gov.cn/art/2020/11/23/art_98_155167.html" }
    ];

  } else if (lowerMsg.includes("著作权") || lowerMsg.includes("版权") || lowerMsg.includes("copyright")) {
    mockText = `【模拟本地模型回复】关于著作权（版权）：

著作权自作品创作完成之日起自动产生，但进行著作权登记可以作为权利归属的初步证明，在维权时非常有帮助。

中国版权保护中心负责软件著作权和其他作品著作权的登记工作。一般登记流程包括：填表、提交材料、受理、审查、发证。

软件著作权通常需要提供源代码的前后各30页以及用户手册。`;
    
    mockCitations = [
        { title: "中国版权保护中心 - 著作权登记", uri: "https://www.ccopyright.com.cn/" }
    ];

  } else {
    // Default Generic Response
    mockText = `【模拟本地模型回复】收到您的问题："${userMessage}"。

这是一个模拟的回复，用于测试前端与本地模型的连接。

在实际接入本地模型后，这里将显示经过微调的法律大模型生成的专业回答。目前系统运行正常，您可以继续测试其他界面交互功能。

(Mock Data Generated)`;
    
    mockCitations = [];
  }

  return {
    text: mockText,
    citations: mockCitations
  };
};