import { z } from 'zod';

export const PLANIMETRIE_SCHEMA = z.object({
  ticket: z.string(),
  richiedente: z.string(),
  comune: z.string(),
  foglio: z.string(),
  particella: z.string(),
  subalterno: z.string(),
  data_richiesta: z.coerce.date(),
  data_evasione: z.coerce.date().nullable(),
  stato: z.string(),
  sezione_urbana: z.string().nullable(),
});
export type PLANIMETRIE = z.infer<typeof PLANIMETRIE_SCHEMA>;
export const ATTACHMENT_SCHEMA = z.object({
  id: z.number(),
  content_type: z.string(),
  length: z.number(),
  filename: z.string(),
  created_on: z.coerce.date(),
  deleted_on: z.coerce.date().nullish(),
});
export type ATTACHMENT = z.infer<typeof ATTACHMENT_SCHEMA>;
export const PLANIMETRIA_SCHEMA = z.object({
  url_documento_ident: z.string().url().optional(),
  url_delega: z.string().url().optional(),
  foglio: z.string(),
  particella: z.string(),
  subalterno: z.string(),
  sezione_urbana: z.string(),
  comune: z.object({
    codice_catastale: z.string(),
    nome: z.string(),
  }),
  provincia: z.object({
    sigla: z.string(),
    nome: z.string(),
  }),
  cf_piva_richiedente: z.string().optional(),
  richiedente: z.string(),
  ticket: z.string(),
  data_richiesta: z.coerce.date(),
  data_evasione: z.coerce.date().nullish(),
  stato: z.string(),
});
export type PLANIMETRIA = z.infer<typeof PLANIMETRIA_SCHEMA>;
export const FILE_SCHEMA = z.string();
export type FILE = z.infer<typeof FILE_SCHEMA>;
export const PLANIMETRIA_POST_REQUEST_SCHEMA = z.object({
  successful: z.boolean(),
  documents: FILE_SCHEMA.array().optional(),
  user_message: z.string({}).optional(),
});
export type PLANIMETRIA_POST_REQUEST = z.infer<typeof PLANIMETRIA_POST_REQUEST_SCHEMA>;
const Operation = z.object({
  id: z.number().int(),
  op_area: z.string(),
  op_famiglia: z.string(),
  op_prodotto: z.string(),
});
const Operator = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  at: z.string().datetime(),
});

export const Job = z.object({
  id: z.number().int(),
  state: z.enum(['u', 'a', 'c', 's', 'd', 'x']),
  convention: z.string().nullable().optional(),
  operation: Operation,

  incoming: PLANIMETRIA_SCHEMA.or(z.any()),
  attachments: ATTACHMENT_SCHEMA.array().optional(),

  outgoing: z.object({}).passthrough().nullish(),
  assignee: Operator.nullable(),

  created_at: z.coerce.date(),
  completed_at: z.coerce.date().optional(),
  codiceErrore: z.string().optional(),
  messaggioErrore: z.string().optional(),
});
export type Job = z.infer<typeof Job>;

export const DOWNLOAD_FILE = z.object({ url: z.string() }).catchall(z.any());
export type DOWNLOAD_FILE = z.infer<typeof DOWNLOAD_FILE>;

export const EMPTY_OBJECT = z.object({}).catchall(z.any());
export type EMPTY_OBJECT = z.infer<typeof EMPTY_OBJECT>;
export const PLANIMETRIE_RESPONSE_SCHEMA = z.object({
  result: Job.array(),
  total: z.number().int().nonnegative(),
});

export type PLANIMETRIE_RESPONSE = z.infer<typeof PLANIMETRIE_RESPONSE_SCHEMA>;
export const PLANIMETRIA_DETAILS_RESPONSE_SCHEMA = z.object({
  result: Job.array(),
  total: z.number().int().nonnegative(),
});
export type PLANIMETRIA_DETAILS_RESPONSE = z.infer<typeof PLANIMETRIA_DETAILS_RESPONSE_SCHEMA>;
const SearchRequest = z
  .object({
    assigned: z.boolean().optional(),
    created_from: z.string().datetime().optional(),
    created_to: z.string().datetime().optional(),
    assigned_from: z.string().datetime().optional(),
    assigned_to: z.string().datetime().optional(),
    from_index: z.number().optional(),
    to_index: z.number().optional(),
    operation: z
      .object({
        area: z.string().optional(),
        famiglia: z.string().optional(),
        prodotto: z.string().optional(),
      })
      .array()
      .optional(),
  })
  .optional();
export type SearchRequest = z.infer<typeof SearchRequest>;
