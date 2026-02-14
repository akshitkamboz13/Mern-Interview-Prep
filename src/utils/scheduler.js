
/**
 * Generates a schedule of notification times for a single day based on weights and constraints.
 * 
 * Weights:
 * - 00:00 - 06:00: Weight 1 (Sleep - minimal)
 * - 06:00 - 09:00: Weight 3 (Morning - medium)
 * - 09:00 - 17:00: Weight 2 (Work - lowish)
 * - 17:00 - 23:59: Weight 5 (Evening - High)
 * 
 * Constraints:
 * - Minimum 30 minutes gap between notifications.
 * - Maximum count is capped (e.g. 20).
 * 
 * @param {number} count - Desired number of notifications per day.
 * @returns {number[]} - Array of timestamps (for today) representing scheduled times.
 */
export const generateDailySchedule = (count) => {
    // 1. Clamp count
    const SAFE_MAX = 20;
    const n = Math.min(Math.max(1, count), SAFE_MAX);

    // 2. Define Weights
    const weights = [
        { start: 0, end: 6, weight: 1 },   // 00-06
        { start: 6, end: 9, weight: 3 },   // 06-09
        { start: 9, end: 17, weight: 2 },  // 09-17
        { start: 17, end: 24, weight: 5 }  // 17-24
    ];

    // Helper to get random time within a range
    const getRandomTime = (startHour, endHour) => {
        const start = new Date();
        start.setHours(startHour, 0, 0, 0);
        const end = new Date();
        end.setHours(endHour, 0, 0, 0);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // We generate exactly N times based on weights, then check valididity.
    // If invalid, we retry. This preserves the probability distribution independent of time sorting.

    // Create weighted probability distribution for hour selection
    let hourPool = [];
    for (let h = 0; h < 24; h++) {
        const entry = weights.find(r => h >= r.start && h < r.end);
        if (entry) {
            for (let i = 0; i < entry.weight; i++) {
                hourPool.push(h);
            }
        }
    }

    const MIN_GAP_MS = 30 * 60 * 1000;
    let schedule = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 50;

    while (attempts < MAX_ATTEMPTS) {
        attempts++;
        let candidates = [];

        // Generate N candidates
        for (let i = 0; i < n; i++) {
            const hour = hourPool[Math.floor(Math.random() * hourPool.length)];
            const minute = Math.floor(Math.random() * 60);
            const time = new Date(); // Today
            time.setHours(hour, minute, 0, 0);
            candidates.push(time);
        }

        // Sort
        candidates.sort((a, b) => a - b);

        // Validate Gaps
        let isValid = true;
        for (let i = 1; i < candidates.length; i++) {
            if (candidates[i] - candidates[i - 1] < MIN_GAP_MS) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            schedule = candidates;
            break;
        }
    }

    // Fallback: If we couldn't find a perfect weighted schedule in retries, 
    // fall back to a safer, more uniform approach or just reduced count to ensure we return SOMETHING.
    // Let's try a simple uniform spread if weighted fails.
    if (schedule.length === 0) {
        console.warn("Scheduler: Could not generate valid weighted schedule, falling back to uniform.");
        const step = (24 * 60) / n; // minutes per slot
        for (let i = 0; i < n; i++) {
            const t = new Date();
            t.setHours(0, 0, 0, 0);
            // Add i * step + random offset
            const offset = (i * step) + (Math.random() * (step * 0.5));
            t.setMinutes(offset);
            schedule.push(t);
        }
    }

    // Return timestamps
    return schedule.map(d => d.getTime());
};

/**
 * Checks if a notification should trigger now based on schedule.
 * @param {object} settings - The notification settings object.
 * @returns {boolean} - True if notification should fire.
 */
export const shouldTriggerNotification = (notificationSettings) => {
    if (!notificationSettings.enabled || !notificationSettings.schedule || notificationSettings.schedule.length === 0) return false;

    const now = Date.now();
    // Check if we hit a scheduled time that hasn't been "handled" roughly
    // We need a way to track "handled" or "lastNotified".
    // If (now > scheduledTime) AND (scheduledTime > lastNotified)

    // Find the latest scheduled time that is in the past
    const pastScheduledTimes = notificationSettings.schedule.filter(t => t <= now);
    if (pastScheduledTimes.length === 0) return false;

    const latestPastSchedule = pastScheduledTimes[pastScheduledTimes.length - 1];

    // If we haven't notified for this specific scheduled time yet
    // We compare with lastNotified.
    // If lastNotified is < latestPastSchedule, then we missed it (or just reached it) and should fire.
    // We allow a "grace period" if needed, but "any time after" ensures persistent catch-up (unless too old?)
    // Let's say we only care if it's within the last hour? Or just "if not sent".
    // "If not sent" is better.

    const lastNotified = notificationSettings.lastNotified || 0;

    // To avoid spamming multiple if user opens app after 5 hours:
    // Only fire ONE notification if multiple were missed.
    // So we just check if the *latest* one pending is done.

    return latestPastSchedule > lastNotified;
};
