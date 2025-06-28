export interface GenerationResponse {
  generationId: number;
  yearStart: string;
  yearEnd: string;
}

export interface GenerationRequest {
  yearStart: string;
  yearEnd: string;
}
