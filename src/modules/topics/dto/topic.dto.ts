import { Topic } from '../schemas/topic.schema';

export class AddTopicDTO {
  title: string;
  description?: string;
}
export class AddTopicResponseDTO {
  success: boolean;
  error?: string;
  message?: string;
  topic?: Topic;
}
export class GetTopicsResponseDTO {
  success: boolean;
  count: number;
  topics: Topic[];
}

export class DeleteTopicResponseDTO {
  success: boolean;
  message?: string;
  error?: string;
}
