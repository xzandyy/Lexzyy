export type DocumentProcessor = (file: File) => Promise<string>;

export interface ProcessorConfig {
  processor: DocumentProcessor;
  description: string;
}

export type ProcessorRegistry = Record<string, ProcessorConfig>;
