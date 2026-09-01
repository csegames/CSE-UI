export interface GraphQLServiceOptions {
  readonly getBearerToken: () => string | null;
  readonly getServiceUrl: () => Promise<URL | null>;
}
