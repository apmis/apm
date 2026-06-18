export interface AppConfiguration {
  port: number;
  public: string;
  paginate: { default: number; max: number };
  mongodb: string;
  authentication: {
    secret: string;
    entity: string;
    service: string;
    authStrategies: string[];
    local: {
      usernameField: string;
      passwordField: string;
    };
    jwtOptions: {
      expiresIn: string;
    };
  };
  mongodbClient: any;
  database: any;
  authenticationService: any;
}
