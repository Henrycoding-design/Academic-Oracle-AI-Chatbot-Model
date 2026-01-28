
export interface AttachmentMeta {
  name: string;
  type: string;   // mime or extension
  size: number;
}

export interface Message {
  role: "user" | "model";
  content: string;
  attachment?: AttachmentMeta;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  content: string;
};

export type OracleResponse = {
  answer: string;
  memory?: string;
  model: string;
};

export class InvalidAIResponseError extends Error {
  constructor(message = "Invalid AI JSON response") {
    super(message);
    this.name = "InvalidAIResponseError";
  }
}

export class InvalidAPIError extends Error {
  constructor(message = "Invalid API") {
    super(message);
    this.name = "InvalidAPIError";
  }
}
