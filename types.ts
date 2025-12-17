
export interface SystemStatus {
  message: string;
  load: number;
  stability: string;
  neuralLink: string;
}

export interface ClockState {
  time: Date;
  battery: number;
}
