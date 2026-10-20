import { api, ApiResponse } from '@/lib/api-client';

export const chatService = {
  async getChannels(): Promise<ApiResponse<any>> {
    return api.get('/chat/channels');
  },

  async createChannel(data: { name: string; description?: string; type: string; member_ids?: number[] }): Promise<ApiResponse<any>> {
    return api.post('/chat/channels', data);
  },

  async getMessages(channelId: number | string): Promise<ApiResponse<any>> {
    return api.get(`/chat/channels/${channelId}/messages`);
  },

  async sendMessage(channelId: number | string, data: { content?: string; type?: string; file_path?: string }): Promise<ApiResponse<any>> {
    return api.post(`/chat/channels/${channelId}/messages`, data);
  },

  async reactToMessage(messageId: number | string, emoji: string): Promise<ApiResponse<any>> {
    return api.post(`/chat/messages/${messageId}/react`, { emoji });
  },
};
