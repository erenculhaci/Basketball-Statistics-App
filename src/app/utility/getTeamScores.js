export const getPBPEvents = (pbpData) => {
  try {
    let allEvents = pbpData[1].events;
    if (pbpData[2]?.events) {
      allEvents = allEvents.concat(pbpData[2].events);
    }
    if (pbpData[3]?.events) {
      allEvents = allEvents.concat(pbpData[3].events);
    }
    if (pbpData[4]?.events) {
      allEvents = allEvents.concat(pbpData[4].events);
    }
    return allEvents;
  } catch {
    return [];
  }
};

export const getTeamScoresFromPBP = (pbpData) => {
  try {
    let allEvents = getPBPEvents(pbpData);
    let entities = {};
    allEvents.forEach((item) => {
      if (
        (item.desc.includes("2 Sayı") || item.desc.includes("İki Sayı")) &&
        item.success
      ) {
        entities[item.entityId] = (entities[item.entityId] ?? 0) + 2;
      } else if (
        (item.desc.includes("3 Sayı") || item.desc.includes("Üç Sayı")) &&
        item.success
      ) {
        entities[item.entityId] = (entities[item.entityId] ?? 0) + 3;
      } else if (
        (item.desc.includes("1 Sayı") || item.desc.includes("Serbest")) &&
        item.success
      ) {
        entities[item.entityId] = (entities[item.entityId] ?? 0) + 1;
      }
    });
    return entities;
  } catch {
    return {};
  }
};

export const getTeamScoresFromPBPEvents = (allEvents) => {
  try {
    let entities = {};
    allEvents.forEach((item) => {
      if (
        (item.desc.includes("2 Sayı") || item.desc.includes("İki Sayı")) &&
        item.success
      ) {
        entities[item.entityId] = (entities[item.entityId] ?? 0) + 2;
      } else if (
        (item.desc.includes("3 Sayı") || item.desc.includes("Üç Sayı")) &&
        item.success
      ) {
        entities[item.entityId] = (entities[item.entityId] ?? 0) + 3;
      } else if (
        (item.desc.includes("1 Sayı") || item.desc.includes("Serbest")) &&
        item.success
      ) {
        entities[item.entityId] = (entities[item.entityId] ?? 0) + 1;
      }
    });
    return entities;
  } catch {
    return {};
  }
};
