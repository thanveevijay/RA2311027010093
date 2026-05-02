function selectTasks(tasks, maxHours) {
  const n = tasks.length;

  const dp = Array(n + 1).fill().map(() =>
    Array(maxHours + 1).fill(0)
  );


  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          Impact + dp[i - 1][w - Duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  
  let w = maxHours;
  const selected = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const task = tasks[i - 1];
      selected.push(task);
      w -= task.Duration;
    }
  }


  const totalDuration = selected.reduce((sum, t) => sum + t.Duration, 0);

  return {
  maxImpact: dp[n][maxHours],
  selectedVehicles: selected,
  totalDuration
};
}

module.exports = { selectTasks };