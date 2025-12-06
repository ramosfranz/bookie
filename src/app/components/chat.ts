export interface Message {
  id: string;
  sender: "user" | "other";
  senderName?: string;
  avatar?: string;
  content: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  isGroup?: boolean;
  members?: { id: string; name: string; avatar: string }[];
  messages: Message[];
  sharedHistory?: { title: string; date: string }[];
}
