export const fetchAllEvents = (playbackData) => {
  try {
    let events = playbackData[1]?.events || [];
    for (let i = 2; i <= 4; i++) {
      if (playbackData[i]?.events) {
        events = events.concat(playbackData[i].events);
      }
    }
    return events;
  } catch {
    return [];
  }
};

export const calculateTeamPoints = (playbackData) => {
  try {
    const events = fetchAllEvents(playbackData);
    return computeScores(events);
  } catch {
    return {};
  }
};

export const computeTeamScoresFromEvents = (events) => {
  try {
    return computeScores(events);
  } catch {
    return {};
  }
};

const computeScores = (events) => {
  const scores = {};
  events.forEach((event) => {
    if (isSuccessfulTwoPointer(event)) {
      scores[event.entityId] = (scores[event.entityId] ?? 0) + 2;
    } else if (isSuccessfulThreePointer(event)) {
      scores[event.entityId] = (scores[event.entityId] ?? 0) + 3;
    } else if (isSuccessfulFreeThrow(event)) {
      scores[event.entityId] = (scores[event.entityId] ?? 0) + 1;
    }
  });
  return scores;
};

const isSuccessfulTwoPointer = (event) =>
  (event.desc.includes("2 Sayı") || event.desc.includes("İki Sayı")) &&
  event.success;

const isSuccessfulThreePointer = (event) =>
  (event.desc.includes("3 Sayı") || event.desc.includes("Üç Sayı")) &&
  event.success;

const isSuccessfulFreeThrow = (event) =>
  (event.desc.includes("1 Sayı") || event.desc.includes("Serbest")) &&
  event.success;
