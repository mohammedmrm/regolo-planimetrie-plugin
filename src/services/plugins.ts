/* eslint-disable @typescript-eslint/no-explicit-any */
// both these interfaces are declared in san regolo f/e too
// (this code is actualy copied from that project)

import { Err } from "@/types";
import { Job } from "@/types/planimetrie";
import { reportsService } from "./resources";

export interface PluginInterface {
  currentJob(): Promise<Job>;
  jobComplete(jobId: number | undefined, answer: any): Promise<Job>;
  startWorking?: (jobId: number, returnUrl?: string) => void;
  standalone?: boolean;
}

export function pluginInterface(): PluginInterface {
  if (typeof window === "undefined") {
    console.error("ssr enabled, cannot find plugins interface");
  }

  const p = window?.parent as any;

  if (p && p.plugins) {
    return p.plugins as PluginInterface;
  }

  console.error("plugins undefined, using fake callback");

  return {
    currentJob() {
      console.log("standalone plugin: job complete");
      const err: Err = {
        codiceErrore: "GD1002",
        messaggioErrore: "No container found",
      };
      return Promise.reject(err);
    },
    jobComplete: (jobId: number, answer: unknown) => {
      console.log("standalone plugin: job complete", jobId, answer);
      const err: Err = {
        codiceErrore: "GD1002",
        messaggioErrore: "No container found",
      };
      return Promise.reject(err);
    },

    standalone: true,
  };
}

export function jobCompleted(
  jobId: number,
  data: any,
  regoloInterface: PluginInterface
) {
  regoloInterface.jobComplete(jobId, data);
}

export function setupJob(token: string): Promise<Job> {
  return reportsService.redeemJob(token);
}

export function authHeaders() {
  const jwt = localStorage.getItem("jwt");

  if (jwt) {
    return {
      Authorization: `Bearer ${jwt}`,
    };
  }
  return {};
}
