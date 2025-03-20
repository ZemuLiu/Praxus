// Types for IPC messages
export interface IPCMessage {
  type: string;
  payload: any;
}

export interface IPCResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// IPC channels
export const IPC_CHANNELS = {
  CHAT: 'chat',
  TASKS: 'tasks',
  PLANNING: 'planning',
  SETTINGS: 'settings',
} as const;

// Type-safe IPC client
class IPCBridge {
  async sendMessage(channel: keyof typeof IPC_CHANNELS, payload: any): Promise<IPCResponse> {
    try {
      const response = await window.electronAPI.callPraxus(channel, payload);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Typed methods for specific operations
  async chat(message: string) {
    return this.sendMessage(IPC_CHANNELS.CHAT, { message });
  }

  async getTasks() {
    return this.sendMessage(IPC_CHANNELS.TASKS, { action: 'get' });
  }

  async createTask(task: any) {
    return this.sendMessage(IPC_CHANNELS.TASKS, { action: 'create', task });
  }

  async updateTask(taskId: string, updates: any) {
    return this.sendMessage(IPC_CHANNELS.TASKS, { action: 'update', taskId, updates });
  }

  async optimizeSchedule(tasks: any[]) {
    return this.sendMessage(IPC_CHANNELS.PLANNING, { action: 'optimize', tasks });
  }
}

export const ipcBridge = new IPCBridge();