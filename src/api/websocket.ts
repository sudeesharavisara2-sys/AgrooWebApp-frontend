import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL, tokenStorage } from './client';
import type { ChatMessageRequest, ChatMessageResponse } from '../types';

// The backend exposes STOMP over SockJS. Adjust the endpoint below if your
// WebSocketConfig registers a different path (commonly "/ws").
const WS_ENDPOINT = `${API_BASE_URL}/ws`;

export class ChatSocket {
  private client: Client;
  private connected = false;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT) as unknown as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${tokenStorage.getToken() || ''}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });
  }

  connect(onConnected?: () => void) {
    this.client.onConnect = () => {
      this.connected = true;
      onConnected?.();
    };
    this.client.activate();
  }

  disconnect() {
    this.connected = false;
    this.client.deactivate();
  }

  isConnected() {
    return this.connected;
  }

  subscribeToGroup(groupId: number, onMessage: (msg: ChatMessageResponse) => void) {
    return this.client.subscribe(`/topic/group/${groupId}`, (message: IMessage) => {
      onMessage(JSON.parse(message.body) as ChatMessageResponse);
    });
  }

  subscribeToTyping(groupId: number, onTyping: (text: string) => void) {
    return this.client.subscribe(`/topic/group/${groupId}/typing`, (message: IMessage) => {
      onTyping(message.body);
    });
  }

  sendMessage(groupId: number, payload: ChatMessageRequest) {
    this.client.publish({
      destination: `/app/chat/${groupId}/send`,
      body: JSON.stringify(payload),
    });
  }

  sendTyping(groupId: number, username: string) {
    this.client.publish({
      destination: `/app/chat/${groupId}/typing`,
      body: username,
    });
  }
}
