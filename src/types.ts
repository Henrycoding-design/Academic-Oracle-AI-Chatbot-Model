
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
};
