export interface GenerationResponse {
  generationId: string;
  yearStart: string;
  yearEnd: string;
}

export interface GenerationRequest {
  yearStart: string;
  yearEnd: string;
}
