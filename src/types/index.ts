export type ModelCategory = "FAST" | "SMART" | "STANDARD";
export type ModelProvider = "OpenAI" | "Google" | "Anthropic" | "Groq";

export interface AIModel {
    id: string;
    name: string;
    provider: ModelProvider;
    category: ModelCategory;
    description?: string;
    context_window: number;
    max_output_tokens?: number;
    is_active: boolean;
    is_chat?: boolean;
    rpm?: number;
    tpm?: number;
    rpd?: number;
    capabilities?: string[];
}

export interface ScoreBreakdown {
    correctness: number;
    clarity: number;
    relevance: number;
    brevity: number;
}

export interface EvaluationResult {
    model_id: string;
    scores: ScoreBreakdown;
    explanation: string;
    total_score: number;
}
