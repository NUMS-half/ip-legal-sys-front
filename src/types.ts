// Define the role of the message sender
export const Role = {
  User: 'user',
  Model: 'model',
  System: 'system'
} as const;

export type Role = typeof Role[keyof typeof Role];

// Structure for a reference source (simulating RAG chunks)
export interface Citation {
  title: string;
  uri: string;
  snippet?: string;
}

// The message object structure
export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isLoading?: boolean;
  citations?: Citation[]; // RAG sources or Search results
}

// Summary of a chat session for the sidebar list
export interface ChatSessionSummary {
  id: string;
  title: string;
  updatedAt: number; // Timestamp
  preview: string;   // Short preview of the last message
}

// Configuration for the legal bot
export interface AppConfig {
  useSearchGrounding: boolean;
}