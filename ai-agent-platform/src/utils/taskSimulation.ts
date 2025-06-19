import { Task, Agent } from '../types';

// Mock responses for different agent types
const mockResponses = {
  'deep-research': {
    summary: 'Comprehensive research analysis completed with detailed findings and actionable insights.',
    keyFindings: [
      'Primary trend indicates significant market growth in the target sector',
      'User behavior patterns show strong preference for mobile-first solutions',
      'Competitive landscape reveals opportunities for differentiation',
      'Cost-benefit analysis suggests high ROI potential'
    ],
    recommendations: [
      'Implement user-centric design strategy',
      'Focus on mobile optimization as priority',
      'Develop unique value proposition to stand out',
      'Consider strategic partnerships for market entry'
    ]
  },
  'ai-slides': {
    summary: 'Professional presentation created with compelling visuals and clear narrative structure.',
    keyFindings: [
      'Slide deck optimized for target audience engagement',
      'Visual hierarchy emphasizes key messages effectively',
      'Data visualization enhances comprehension',
      'Narrative flow maintains audience attention'
    ],
    content: {
      slideCount: 15,
      format: 'PowerPoint (.pptx)',
      style: 'Professional',
      themes: ['Executive Summary', 'Market Analysis', 'Strategy', 'Implementation']
    }
  },
  'ai-sheets': {
    summary: 'Data analysis completed with comprehensive spreadsheet and insights dashboard.',
    keyFindings: [
      'Data quality assessment shows 95% accuracy rate',
      'Trend analysis reveals consistent growth patterns',
      'Performance metrics exceed baseline expectations',
      'Predictive models indicate positive outlook'
    ],
    content: {
      rowCount: 1250,
      columnCount: 18,
      charts: 6,
      tables: 4,
      insights: 'Automated analysis with trend predictions and recommendations'
    }
  },
  'call-for-me': {
    summary: 'Phone call completed successfully with requested information obtained.',
    keyFindings: [
      'Reservation confirmed for requested date and time',
      'Contact person provided additional helpful information',
      'Follow-up scheduled as requested',
      'All specified requirements accommodated'
    ],
    content: {
      callDuration: '4 minutes 32 seconds',
      outcome: 'Successful',
      confirmationNumber: 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      nextSteps: 'Confirmation email sent to your address'
    }
  },
  'fact-check': {
    summary: 'Fact-checking analysis completed with source verification and accuracy assessment.',
    keyFindings: [
      'Primary claim verified through multiple reliable sources',
      'Statistical data confirmed with original research',
      'Expert opinions consulted for context',
      'Timeline and causation relationships validated'
    ],
    content: {
      accuracyScore: Math.floor(Math.random() * 30) + 70, // 70-100%
      sourcesChecked: Math.floor(Math.random() * 10) + 5, // 5-15 sources
      credibilityRating: 'High',
      lastUpdated: new Date().toISOString()
    }
  },
  'download-for-me': {
    summary: 'Download task completed with all requested content successfully retrieved.',
    keyFindings: [
      'All specified files downloaded successfully',
      'Content integrity verified',
      'Files organized in structured format',
      'Additional related content identified and included'
    ],
    content: {
      filesDownloaded: Math.floor(Math.random() * 15) + 5,
      totalSize: (Math.random() * 500 + 50).toFixed(1) + ' MB',
      format: 'Various (PDF, DOCX, MP4, JPG)',
      compressionRatio: '85%'
    }
  },
  'ai-chat': {
    summary: 'Conversation completed with helpful responses and actionable guidance.',
    keyFindings: [
      'User questions addressed comprehensively',
      'Practical solutions provided for key challenges',
      'Additional resources suggested for further learning',
      'Follow-up topics identified for future discussion'
    ]
  },
  'image-studio': {
    summary: 'Image generation and processing completed with high-quality visual outputs.',
    keyFindings: [
      'Images generated according to specifications',
      'Visual style consistent with brand guidelines',
      'Resolution and format optimized for intended use',
      'Alternative variations provided for selection'
    ],
    content: {
      imagesCreated: Math.floor(Math.random() * 8) + 3,
      resolution: '2048x2048',
      format: 'PNG, JPG',
      style: 'Professional, high-quality'
    }
  },
  'generate-video': {
    summary: 'Video content creation completed with professional quality output.',
    keyFindings: [
      'Video narrative aligns with specified objectives',
      'Visual and audio elements professionally integrated',
      'Duration optimized for target platform',
      'Call-to-action elements strategically placed'
    ],
    content: {
      duration: Math.floor(Math.random() * 300) + 60 + ' seconds',
      resolution: '1920x1080',
      format: 'MP4',
      features: 'Voiceover, transitions, captions'
    }
  },
  'translation': {
    summary: 'Translation completed with cultural context and linguistic accuracy preserved.',
    keyFindings: [
      'Technical terminology accurately translated',
      'Cultural nuances appropriately adapted',
      'Tone and style maintained across languages',
      'Quality assurance review completed'
    ],
    content: {
      wordCount: Math.floor(Math.random() * 2000) + 500,
      languages: 'Multiple target languages',
      accuracy: '99.2%',
      method: 'AI-assisted with human review'
    }
  }
};

export const simulateTaskExecution = async (
  task: Task, 
  agent: Agent,
  onProgress?: (progress: number) => void
): Promise<Task> => {
  const totalSteps = 8;
  const stepDuration = 800; // milliseconds per step
  
  for (let step = 1; step <= totalSteps; step++) {
    await new Promise(resolve => setTimeout(resolve, stepDuration));
    const progress = (step / totalSteps) * 100;
    onProgress?.(progress);
  }
  
  // Generate mock output based on agent type
  const mockResponse = mockResponses[agent.id as keyof typeof mockResponses] || mockResponses['ai-chat'];
  
  // Create mock files for certain agent types
  const mockFiles: string[] = [];
  if (['deep-research', 'ai-slides', 'ai-sheets', 'download-for-me'].includes(agent.id)) {
    const fileCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < fileCount; i++) {
      mockFiles.push(`file-${Date.now()}-${i}`);
    }
  }
  
  return {
    ...task,
    status: 'completed',
    output: {
      ...mockResponse,
      files: mockFiles
    },
    completedAt: new Date().toISOString(),
    progress: 100
  };
};

export const generateTaskId = (): string => {
  return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const generateFileId = (): string => {
  return 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatTaskDuration = (startTime: string, endTime?: string): string => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  
  if (diffMins > 0) {
    return `${diffMins}m ${diffSecs}s`;
  }
  return `${diffSecs}s`;
};
