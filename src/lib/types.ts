export type DetectionCategory = 
  | 'image_pixel' 
  | 'css_beacon' 
  | 'script_tracker' 
  | 'link_prefetch' 
  | 'web_beacon'
  | 'svg_beacon';

export type RiskLevel = 'alto' | 'medio' | 'basso' | 'pulito';

export interface DetectedPixel {
  id: string;
  category: DetectionCategory;
  rawSnippet: string;
  sourceUrl: string;
  elementName: string;
  width?: number | string;
  height?: number | string;
  isDimensionSuspect: boolean;
  isHiddenByStyle: boolean;
  isTransparentGif: boolean;
  provider?: string;
  matchedRule: string;
  extractedParams: Record<string, string>;
  risk: RiskLevel;
  leakInfo: string[];
  explanation: string;
}

export interface AnalysisSummary {
  totalAnalyzedElements: number;
  totalSuspects: number;
  highestRisk: RiskLevel;
  detectedProviders: string[];
  techniquesUsed: string[];
  sanitizedHtml: string;
  hasCssBeacons: boolean;
  hasHiddenImages: boolean;
  hasThirdPartyScripts: boolean;
}

export interface EmailHeaderAnalysis {
  sender?: string;
  mailer?: string;
  feedbackId?: string;
  espDetected?: string;
  messageId?: string;
  hasListUnsubscribe?: boolean;
}

export interface AnalysisResult {
  suspects: DetectedPixel[];
  summary: AnalysisSummary;
  headers?: EmailHeaderAnalysis;
  rawInput: string;
  mode: 'email' | 'web';
}
