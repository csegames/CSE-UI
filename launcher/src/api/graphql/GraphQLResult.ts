export interface GraphQLResult {
  data?: unknown;
  errors?: ReadonlyArray<Error>;
}
