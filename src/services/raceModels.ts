// src/services/raceModels.ts

const raceModels = async (
  tasks: (() => Promise<{ model: string; text: string }>)[],
  timeoutMs: number = 50000 // abort if no model responds within 25 seconds
): Promise<{ model: string; text: string }> => {

  return new Promise((resolve, reject) => {
    let settled = false;
    let countError = 0;
    let lastError: unknown = null;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("Race timeout"));
      }
    }, timeoutMs);

    tasks.forEach(task => {
      task()
        .then(result => {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            resolve(result);
          }
        })
        .catch(error => {
          if (settled) return;

          countError++;
          lastError = error;

          if (countError === tasks.length) {
            settled = true;
            clearTimeout(timeout);
            const aggregateError = new Error("All models in race failed");
            (aggregateError as Error & { cause?: unknown }).cause = lastError;
            reject(aggregateError);
          }
        });
    });
  });
};

export {raceModels};
