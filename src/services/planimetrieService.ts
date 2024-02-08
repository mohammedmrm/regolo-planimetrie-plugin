import {
  PLANIMETRIA_DETAILS_RESPONSE,
  PLANIMETRIA_DETAILS_RESPONSE_SCHEMA,
  PLANIMETRIE_RESPONSE,
  PLANIMETRIE_RESPONSE_SCHEMA,
  SearchRequest,
} from '@/types/planimetrie';
import { HttpClient } from './httpClient';

export class PlanimetrieService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getPlanimetrie(filter?: SearchRequest): Promise<PLANIMETRIE_RESPONSE> {
    const f = {
      ...filter,
      operation: [{ area: 'sister', famiglia: 'catasto', prodotto: 'planimetria' }],
    };
    const _url = `backoffice_san_regolo/jobs`;
    return this.http.post(_url, f, PLANIMETRIE_RESPONSE_SCHEMA);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPlanimetriaDetails(job_id: number): Promise<PLANIMETRIA_DETAILS_RESPONSE> {
    const _url = `backoffice_san_regolo/jobs`;
    return this.http.post(_url, { id: job_id }, PLANIMETRIA_DETAILS_RESPONSE_SCHEMA);
  }
}
