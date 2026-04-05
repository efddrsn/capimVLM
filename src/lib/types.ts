export interface DentalCondition {
  nome_tecnico: string;
  nome_popular: string;
  regiao: string;
  severidade_estimada: 'leve' | 'moderada' | 'severa';
  descricao_paciente: string;
  urgencia: 'pode esperar' | 'agende em breve' | 'procure atendimento urgente';
  consequencia_sem_tratamento: string;
}

export interface AnalysisResult {
  condicoes_identificadas: DentalCondition[];
  saude_geral_visivel: 'boa' | 'atenção' | 'preocupante';
  score_saude: number; // 0-10
  observacoes_positivas: string[];
  limitacoes_da_analise: string[];
}

export interface ValidationResult {
  isValid: boolean;
  qualityScore: number;
  feedback: string;
  isOralCavity: boolean;
}

export interface QualityCheck {
  id: string;
  label: string;
  passed: boolean;
  feedback: string;
  icon: string;
}

export interface PricingEntry {
  procedimento: string;
  faixa_min: number;
  faixa_max: number;
  fatores: string;
  cobertura_convenio: string;
}

export interface PricingTable {
  [condition: string]: {
    capitais: PricingEntry;
    interior: PricingEntry;
  };
}

export interface Clinic {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  avaliacao: number;
  especialidades: string[];
  telefone: string;
  whatsapp: string;
  dias_disponivel: number;
  latitude: number;
  longitude: number;
}

export type AnalysisStep = 'idle' | 'capturing' | 'validating' | 'analyzing' | 'generating' | 'done' | 'error';

export type OverlayRegion = 'frontal' | 'lateral-direita' | 'lateral-esquerda' | 'superior' | 'inferior' | 'extra';

export interface PhotoStep {
  id: string;
  label: string;
  shortTip: string;
  region: OverlayRegion;
  optional?: boolean;
}

export interface CapturedPhoto {
  stepId: string;
  dataUrl: string;
  base64: string;
}

export const PHOTO_STEPS: PhotoStep[] = [
  { id: 'frente', label: 'Frente', shortTip: 'Cerre os dentes, puxe os lábios', region: 'frontal' },
  { id: 'direito', label: 'Lado direito', shortTip: 'Puxe a bochecha direita', region: 'lateral-direita' },
  { id: 'esquerdo', label: 'Lado esquerdo', shortTip: 'Puxe a bochecha esquerda', region: 'lateral-esquerda' },
  { id: 'superior', label: 'De cima', shortTip: 'Abra a boca, incline a cabeça', region: 'superior' },
  { id: 'inferior', label: 'De baixo', shortTip: 'Abra a boca, queixo para baixo', region: 'inferior' },
  { id: 'extra', label: 'Extra', shortTip: 'Close da área que preocupa', region: 'extra', optional: true },
];
