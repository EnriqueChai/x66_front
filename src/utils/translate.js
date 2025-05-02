// 科技文献常用术语的中英文对照字典
const technicalTerms = {
  // 基础领域
  '人工智能': 'artificial intelligence',
  '机器学习': 'machine learning',
  '深度学习': 'deep learning',
  '神经网络': 'neural network',
  '大数据': 'big data',
  '数据挖掘': 'data mining',
  '计算机视觉': 'computer vision',
  '自然语言处理': 'natural language processing',
  '强化学习': 'reinforcement learning',
  '图神经网络': 'graph neural network',
  '知识图谱': 'knowledge graph',
  '生物信息学': 'bioinformatics',
  '量子计算': 'quantum computing',
  '大语言模型': 'large language model',

  // AI与ML
  '卷积神经网络': 'convolutional neural network',
  '循环神经网络': 'recurrent neural network',
  '生成对抗网络': 'generative adversarial network',
  '变换器': 'transformer',
  '自注意力': 'self-attention',
  '迁移学习': 'transfer learning',
  '元学习': 'meta learning',
  '联邦学习': 'federated learning',
  '对比学习': 'contrastive learning',
  '表示学习': 'representation learning',
  '图嵌入': 'graph embedding',
  '预训练模型': 'pre-trained model',
  '语义分割': 'semantic segmentation',
  '目标检测': 'object detection',
  
  // 其他学科
  '生物医学': 'biomedical',
  '医学影像': 'medical imaging',
  '可解释性': 'explainability',
  '可信赖人工智能': 'trustworthy AI',
  '智能机器人': 'intelligent robotics',
  '无人驾驶': 'autonomous driving',
  '物联网': 'Internet of Things',
  '区块链': 'blockchain',
  '云计算': 'cloud computing',
  '边缘计算': 'edge computing',
  '分布式系统': 'distributed systems',
  '推荐系统': 'recommendation system',
  '信息检索': 'information retrieval',
  '网络安全': 'cybersecurity'
};

// 检测文本中是否包含中文
export const isChinese = (text) => {
  return /[\u4e00-\u9fa5]/.test(text);
};

// 将中文关键词转换为英文
export const translateToEnglish = (text) => {
  // 如果不是中文或为空，直接返回原文
  if (!text || !isChinese(text)) {
    return text;
  }
  
  // 先尝试在字典中查找完整匹配
  if (technicalTerms[text]) {
    return technicalTerms[text];
  }

  // 如果没有完整匹配，检查是否包含字典中的术语并替换
  let translatedText = text;
  Object.keys(technicalTerms).forEach(term => {
    if (text.includes(term)) {
      // 使用正则表达式确保替换的是完整词汇
      const regex = new RegExp(term, 'g');
      translatedText = translatedText.replace(regex, technicalTerms[term]);
    }
  });

  return translatedText;
}; 