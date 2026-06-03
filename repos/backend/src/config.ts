export class GlobalConfig {
  static app = {
    port: 3001,
    prefix: '/api',
    cors: {
      allowedOrigins: (process.env.CORS_ORIGINS ?? '*').split(','),
    },
  };

  static oidc = {
    audience: process.env.OIDC_AUDIENCE ?? '',
    issuer: process.env.OIDC_ISSUER ?? '',
    jwksUrl: process.env.OIDC_JWKS ?? '',
  };
}
