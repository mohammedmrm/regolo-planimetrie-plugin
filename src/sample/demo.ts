import planimetria from "./planimetria.json";
import planimetrieStorico from "./planimetrie-storico.json";
import planimetrie from "./planimetrie.json";

export async function fakePromiseResolove(
  data: unknown,
  delay: number = 1000
): Promise<typeof data> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}
export const demoData = { planimetria, planimetrie, planimetrieStorico };
