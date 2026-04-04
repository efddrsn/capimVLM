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
