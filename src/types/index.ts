export interface Err {
  messaggioErrore?: string;
  codiceErrore: string;
}
export interface Filter {
  users?: number[];
  states?: ("a" | "u" | "c" | "s" | "d" | "x")[];
  operation?: {
    area?: string;
    famiglia?: string;
    prodotto?: string;
    convention?: string | null;
  }[];
  assigned?: boolean;
  workable_only?: boolean;
  created_from?: string;
  created_to?: string;
  assigned_from?: string;
  assigned_to?: string;
}
export interface Paginate {
  from_index?: number;
  to_index?: number;
}
