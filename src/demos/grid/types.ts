import type { PreparedText } from '@chenglou/pretext';

export interface FeedCardData {
  id: number;
  author: string;
  handle: string;
  avatarColor: string;
  aspectRatio: number;
  gradient: string;
  title: string;
  prompt: string;
  version: string;
  likes: number;
  category: string;
}

export interface PreparedFeedCard extends FeedCardData {
  preparedPrompt: PreparedText;
}
