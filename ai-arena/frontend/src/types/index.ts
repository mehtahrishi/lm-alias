export type ModelCategory = "FAST" | "SMART" | "STANDARD";
export type ModelProvider = "OpenAI" | "Google" | "Anthropic" | "Groq" | "OpenRouter" | "Grok" | "Mistral";

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
