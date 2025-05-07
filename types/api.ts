export type RouteParamsContext<T extends string> = {
    params: Record<T, string>;
  };
  
  export type IdContext = RouteParamsContext<'id'>;