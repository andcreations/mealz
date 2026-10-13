import { 
  ChunkedUserNotificationChunk,
  ChunkedUserNotificationType,
} from '../types';

export interface BuildNotificationChunksOutput {
  chunks: ChunkedUserNotificationChunk[];
  bold: (text: string) => void;
  normal: (text: string) => void;
  code: (text: string) => void;
  newLine: () => void;
}

export function buildNotificationChunks(): BuildNotificationChunksOutput {
  const chunks: ChunkedUserNotificationChunk[] = [];
  const bold = (text: string) => {
    chunks.push({
      type: ChunkedUserNotificationType.Bold,
      text,
    });
  }
  const normal = (text: string) => {  
    chunks.push({
      type: ChunkedUserNotificationType.Normal,
      text,
    });
  }
  const code = (text: string) => {
    chunks.push({
      type: ChunkedUserNotificationType.Code,
      text,
    });
  }
  const newLine = () => normal('\n');

  return {
    chunks,
    bold,
    normal,
    code,
    newLine,
  };
}
