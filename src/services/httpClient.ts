import { Err } from "@/types";
import { error_GD00401, error_GD1003 } from "@/utils/errors";
import { z } from "zod";
const MWError = z.object({
  codiceErrore: z.string(),
  messaggioErrore: z.string().optional(),
  dettagli: z.object({}).passthrough().optional(),
});

const MWResponse = z.object({
  output: MWError.or(z.array(MWError.or(z.any())).length(1)),
});

export class HttpClient {
  baseURL: string | undefined;

  constructor(baseURL: string | undefined) {
    this.baseURL = baseURL;
  }

  private authHeaders() {
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      return {
        Authorization: `Bearer ${jwt}`,
      };
    }
    return { Authorization: "" };
  }

  private prepare_request(input: unknown, headers = {}, method = "POST") {
    const body = {
      richiesta: [input],
      formatoOutput: "JSON",
    };

    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...this.authHeaders(),
      },
      body: JSON.stringify(body),
    };

    return requestOptions;
  }

  private parse_response<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(json: unknown, t: T): TO {
    const mwResp = MWResponse.parse(json);
    const output = mwResp.output;

    if ("codiceErrore" in output) {
      throw output as Err;
    }

    const resp = output[0]; // FIXME: do not cast, use zod instead

    if ("codiceErrore" in resp) {
      throw resp as Err;
    }

    return t.parse(resp);
  }

  post<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(endPoint: string, body: object = {}, t: T): Promise<TO> {
    const _url = this.baseURL + endPoint;

    return fetch(_url, this.prepare_request(body))
      .then((resp) => {
        if (resp.status == 401) {
          throw {
            messaggioErrore: "session expired",
            codiceErrore: "GD00401",
          } as Err;
        }
        return resp.json();
      })
      .then((json) => {
        const resp: TO = this.parse_response(json, t);

        return resp;
      })
      .catch((err) => {
        if (err.codiceErrore !== undefined) {
          throw err as Err;
        }

        throw { codiceErrore: "GD1001", messaggioErrore: err.message } as Err;
      });
  }

  postWithFileUpload<
    TT extends z.ZodRawShape,
    TUN extends z.UnknownKeysParam,
    TCAT extends z.ZodTypeAny,
    TO,
    TI,
    T extends z.ZodObject<TT, TUN, TCAT, TO, TI>
  >(
    endPoint: string,
    formData: FormData,
    t: T,
    onProgress?: (progress: number) => void
  ): Promise<TO> {
    const _url = this.baseURL + endPoint;

    return new Promise<TO>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", _url, true);
      xhr.setRequestHeader("Authorization", this.authHeaders().Authorization);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };

      // Attach a callback to handle the response
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const json = JSON.parse(xhr.responseText);
            const resp: TO = this.parse_response(json, t);
            resolve(resp);
          } catch (parseError) {
            reject(parseError);
          }
        } else if (xhr.status === 401) {
          reject({
            messaggioErrore: "session expired",
            codiceErrore: error_GD00401,
          } as Err);
        } else if (xhr.status === 413) {
          reject({
            messaggioErrore: "Too larg file",
            codiceErrore: error_GD1003,
          } as Err);
        } else {
          reject({
            codiceErrore: "GD1001",
            messaggioErrore: `Unexpected response status: ${xhr.status}`,
          } as Err);
        }
      };

      // Attach a callback to handle network errors
      xhr.onerror = () => {
        reject({
          codiceErrore: "GD1001",
          messaggioErrore: "Network error",
        } as Err);
      };

      // Send the FormData with the file
      xhr.send(formData);
    });
  }
}
