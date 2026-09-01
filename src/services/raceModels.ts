// src/services/raceModels.ts

type RaceResult = { model: string; text: string };

const raceModels = async (
  tasks: (() => Promise<RaceResult>)[],
  isValid: (result: RaceResult) => boolean | Promise<boolean> = async () => true,
  timeoutMs: number = 60000 // abort if no model responds within 60 seconds
): Promise<RaceResult> => {

  return new Promise((resolve, reject) => {
    let settled = false;
    let countCompleted = 0;
    let lastError: unknown = null;

    const timeout = setTimeout(() => {
      
      if (!settled) {
        console.warn("[Race] Timeout", {
          timeoutMs,
          completed: countCompleted,
          total: tasks.length,
        });

        settled = true;
        reject(new Error("Race timeout"));
      }
    }, timeoutMs);

    tasks.forEach(task => {
      task()
        .then(async result => {
          if (settled) return;

          try {
            const valid = await isValid(result);

            if (settled) return;

            if (valid) {
              settled = true;
              clearTimeout(timeout);
              resolve(result);
              return;
            }

            countCompleted++;
            lastError = new Error(`Model ${result.model} returned an invalid race response`);
            console.warn(`Race model ${result.model} failed response validation`);
          } catch (error) {
            countCompleted++;
            lastError = error;
            console.warn("Race validation check error:", error);
          }

          if (countCompleted === tasks.length && !settled) {
            settled = true;
            clearTimeout(timeout);
            const aggregateError = new Error("All models in race failed");
            (aggregateError as Error & { cause?: unknown }).cause = lastError;
            reject(aggregateError);
          }
        })
        .catch(error => {
          if (settled) return;

          countCompleted++;
          lastError = error;
          console.warn("Race model execution failed:", error);

          if (countCompleted === tasks.length) {
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
