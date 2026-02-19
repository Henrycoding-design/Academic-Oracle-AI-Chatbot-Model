// src/services/raceModels.ts

const raceModels = async (
  tasks: (() => Promise<{ model: string; text: string }>)[],
  timeoutMs: number = 50000 // abort if no model responds within 25 seconds
): Promise<{ model: string; text: string }> => {

  return new Promise((resolve, reject) => {
    let settled = false;

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
        .catch(() => {
          // ignore individual failure
        });
    });
  });
};

export {raceModels};
