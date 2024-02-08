import { z } from "zod";
import { HttpClient } from "./httpClient";

const User = z.object({
  sidebar: z.array(
    z.object({
      title: z.string(),
      id: z.number(),
      link: z.string().startsWith("/"),
      menu_order: z.number(),
      menu_group: z.string().nullable(),
      iframe: z.boolean(),
    })
  ),
  roles: z.array(z.string()).optional(),
  user: z.object({
    id: z.number().int(),
    name: z.string().nullable(),
    sub: z.string(),
  }),
});

export type User = z.infer<typeof User>;

export class AuthService {
  private http: HttpClient;
  private _resolveLoggedUser: Promise<User> | null = null;
  constructor(http: HttpClient) {
    this.http = http;
  }

  resolveLoggedUser(): Promise<User> {
    const user = localStorage.getItem("user");

    if (user) {
      return Promise.resolve(JSON.parse(user));
    }

    if (this._resolveLoggedUser !== null) {
      return this._resolveLoggedUser;
    }

    this._resolveLoggedUser = this.http.post(
      "backoffice_san_regolo/logged_user",
      {},
      User
    );

    this._resolveLoggedUser
      .then((u) => {
        localStorage.setItem("user", JSON.stringify(u));
      })
      .finally(() => {
        this._resolveLoggedUser = null;
      });

    return this._resolveLoggedUser;
  }
}
