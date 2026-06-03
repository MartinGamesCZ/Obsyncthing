export class GlobalConfig {
  static app = {
    port: 3001,
    prefix: '/api',
    cors: {
      allowedOrigins: ['http://localhost:3000'],
    },
  };
}
