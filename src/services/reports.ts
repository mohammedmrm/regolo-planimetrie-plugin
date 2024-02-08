import { Job } from "@/types/planimetrie";
import { HttpClient } from "./httpClient";

export class ReportsService {
  _redeemJobRequests: Record<string, Promise<Job>>;
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
    this._redeemJobRequests = {};
  }

  redeemJob(token: string): Promise<Job> {
    let p: Promise<Job> = this._redeemJobRequests[token];

    if (p !== undefined) {
      return p;
    }

    const url = `backoffice_san_regolo/redeem`;

    p = this.http.post(url, {}, Job);

    p.finally(() => {
      delete this._redeemJobRequests[token];
    });

    this._redeemJobRequests[token] = p;

    return p;
  }
}
