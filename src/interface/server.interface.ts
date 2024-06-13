import { ServerURL, ServerPriority } from './server.enum';

export interface Server {
  url: ServerURL;
  priority: ServerPriority;
}
