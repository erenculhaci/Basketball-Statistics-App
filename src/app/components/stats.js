import { Table } from "antd";
import { useMemo } from "react";

export const columnHeaders = [
  { id: "bib", label: "#" },
  { id: "label", label: "Name" },
  { id: "pointsTwoMade", label: "2SB", code: "İki Sayı Başarılı" },
  { id: "pointsTwoAttempted", label: "2SD", code: "İki Sayı Deneme" },
  { id: "pointsTwoPercentage", label: "2S%", code: "İki Sayı Yüzdesi" },
  { id: "pointsThreeMade", label: "3SB", code: "Üç Sayı Başarılı" },
  { id: "pointsThreeAttempted", label: "3SD", code: "Üç Sayı Deneme" },
  { id: "pointsThreePercentage", label: "3S%", code: "Üç Sayı Yüzdesi" },
  { id: "freeThrowsMade", label: "BSA", code: "Başarılı Serbest Atış" },
  { id: "freeThrowsAttempted", label: "SA", code: "Serbest Atış Deneme" },
  { id: "freeThrowsPercentage", label: "SA%", code: "Serbest Atış Yüzdesi" },
  { id: "reboundsOffensive", label: "HR", code: "Hücum Ribaundu" },
  { id: "reboundsDefensive", label: "SR", code: "Savunma Ribaundu" },
  { id: "steals", label: "TÇ", code: "Top Çalma" },
  { id: "blocks", label: "BL", code: "Blok" },
  { id: "foulsTotal", label: "FA", code: "Faul" },
  { id: "points", label: "PT", code: "Points" },
];

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const Stats = ({ match }) => {
  const columns = columnHeaders.map((item) => {
    return {
      title: item.label,
      dataIndex: item.id === "label" ? "personName" : item.id,
      id: item.id,
    };
  });

  function compileStatsFromEvents(pbpEvents, players) {
    const defaultPlayerStats = {
      assists: 0,
      blocks: 0,
      efficiency: 0,
      fieldGoalsAttempted: 0,
      fieldGoalsMade: 0,
      foulsDrawn: 0,
      foulsTotal: 0,
      freeThrowsAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsPercentage: 0,
      minutes: "PT0M",
      plusMinus: null,
      points: 0,
      pointsThreeAttempted: 0,
      pointsThreeMade: 0,
      pointsThreePercentage: 0,
      pointsTwoAttempted: 0,
      pointsTwoMade: 0,
      pointsTwoPercentage: 0,
      rebounds: 0,
      reboundsDefensive: 0,
      reboundsOffensive: 0,
      steals: 0,
      turnovers: 0,
    };

    const alteredPlayers = players.map((player) => {
      return {
        ...player,
        statistics: { ...defaultPlayerStats },
      };
    });

    let allEvents = pbpEvents[1].events;
    if (pbpEvents[2]?.events) {
      allEvents = allEvents.concat(pbpEvents[2].events);
    }
    if (pbpEvents[3]?.events) {
      allEvents = allEvents.concat(pbpEvents[3].events);
    }
    if (pbpEvents[4]?.events) {
      allEvents = allEvents.concat(pbpEvents[4].events);
    }

    allEvents.forEach((event) => {
      let index = -1;
      for (let i = 0; i < alteredPlayers.length; i++) {
        if (alteredPlayers[i].personId === event.personId) {
          index = i;
          break;
        }
      }

      if (index === -1) {
        return;
      }

      const player = { ...alteredPlayers[index] };

      if (event.desc.includes("Asist")) {
        player.statistics = {
          ...player.statistics,
          assists: player.statistics.assists + 1,
        };
      } else if (event.desc.includes("Blok")) {
        player.statistics = {
          ...player.statistics,
          blocks: player.statistics.blocks + 1,
        };
      } else if (event.desc === "Kişisel Faul" || event.desc === "Hücum Faul") {
        player.statistics = {
          ...player.statistics,
          foulsDrawn: player.statistics.foulsDrawn + 1,
          foulsTotal: player.statistics.foulsTotal + 1,
        };
      } else if (event.desc === "Alınan Faul") {
        player.statistics = {
          ...player.statistics,
          foulsTotal: player.statistics.foulsTotal + 1,
        };
      } else if (event.desc.includes("Top Çalma")) {
        player.statistics = {
          ...player.statistics,
          steals: player.statistics.steals + 1,
        };
      } else if (event.desc.includes("Top Kaybı")) {
        player.statistics = {
          ...player.statistics,
          turnovers: player.statistics.turnovers + 1,
        };
      } else if (
        event.desc.includes("İki Sayı") ||
        event.desc.includes("2 Sayı")
      ) {
        const newPointsTwoAttempted = player.statistics.pointsTwoAttempted + 1;
        const newPointsTwoMade = event.success
          ? player.statistics.pointsTwoMade + 1
          : player.statistics.pointsTwoMade;

        const pointsTwoPercentage =
          newPointsTwoAttempted !== 0
            ? ((newPointsTwoMade / newPointsTwoAttempted) * 100).toFixed(2)
            : 0;

        const newFieldGoalsAttempted =
          player.statistics.fieldGoalsAttempted + 1;
        const newFieldGoalsMade = event.success
          ? player.statistics.fieldGoalsMade + 1
          : player.statistics.fieldGoalsMade;

        const fieldGoalsPercentage =
          newFieldGoalsAttempted !== 0
            ? ((newFieldGoalsMade / newFieldGoalsAttempted) * 100).toFixed(2)
            : 0;

        player.statistics = {
          ...player.statistics,
          pointsTwoAttempted: newPointsTwoAttempted,
          fieldGoalsAttempted: newFieldGoalsAttempted,
          pointsTwoMade: newPointsTwoMade,
          fieldGoalsMade: newFieldGoalsMade,
          points: event.success
            ? player.statistics.points + 2
            : player.statistics.points,
          pointsTwoPercentage: pointsTwoPercentage,
          fieldGoalsPercentage: fieldGoalsPercentage,
        };
      } else if (
        event.desc.includes("Üç Sayı") ||
        event.desc.includes("3 Sayı")
      ) {
        const newPointsThreeAttempted =
          player.statistics.pointsThreeAttempted + 1;
        const newPointsThreeMade = event.success
          ? player.statistics.pointsThreeMade + 1
          : player.statistics.pointsThreeMade;

        const newFieldGoalsAttempted =
          player.statistics.fieldGoalsAttempted + 1;
        const newFieldGoalsMade = event.success
          ? player.statistics.fieldGoalsMade + 1
          : player.statistics.fieldGoalsMade;

        const fieldGoalsPercentage =
          newFieldGoalsAttempted !== 0
            ? ((newFieldGoalsMade / newFieldGoalsAttempted) * 100).toFixed(2)
            : 0;

        const pointsThreePercentage =
          newPointsThreeAttempted !== 0
            ? ((newPointsThreeMade / newPointsThreeAttempted) * 100).toFixed(2)
            : 0;

        player.statistics = {
          ...player.statistics,
          pointsThreeAttempted: newPointsThreeAttempted,
          fieldGoalsAttempted: newFieldGoalsAttempted,
          pointsThreeMade: newPointsThreeMade,
          fieldGoalsMade: newFieldGoalsMade,
          points: event.success
            ? player.statistics.points + 3
            : player.statistics.points,
          pointsThreePercentage: pointsThreePercentage,
          fieldGoalsPercentage: fieldGoalsPercentage,
        };
      } else if (event.desc.includes("Serbest Atış")) {
        const newFreeThrowsMade = event.success
          ? player.statistics.freeThrowsMade + 1
          : player.statistics.freeThrowsMade;
        const newFreeThrowsAttempted =
          player.statistics.freeThrowsAttempted + 1;
        const newFieldGoalsAttempted =
          player.statistics.fieldGoalsAttempted + 1;
        const newFieldGoalsMade = event.success
          ? player.statistics.fieldGoalsMade + 1
          : player.statistics.fieldGoalsMade;

        const freeThrowsPercentage =
          newFreeThrowsAttempted !== 0
            ? ((newFreeThrowsMade / newFreeThrowsAttempted) * 100).toFixed(2)
            : 0;

        const fieldGoalsPercentage =
          newFieldGoalsAttempted !== 0
            ? ((newFieldGoalsMade / newFieldGoalsAttempted) * 100).toFixed(2)
            : 0;

        player.statistics = {
          ...player.statistics,
          freeThrowsAttempted: newFreeThrowsAttempted,
          freeThrowsMade: newFreeThrowsMade,
          points: event.success
            ? player.statistics.points + 1
            : player.statistics.points,
          freeThrowsPercentage: freeThrowsPercentage,
          fieldGoalsPercentage: fieldGoalsPercentage,
        };
      } else if (event.desc.includes("Ribaund")) {
        player.statistics = {
          ...player.statistics,
          rebounds: player.statistics.rebounds + 1,
        };
        if (event.desc.includes("Savunma")) {
          player.statistics = {
            ...player.statistics,
            reboundsDefensive: player.statistics.reboundsDefensive + 1,
          };
        } else if (event.desc.includes("Hücum")) {
          player.statistics = {
            ...player.statistics,
            reboundsOffensive: player.statistics.reboundsOffensive + 1,
          };
        }
      }

      if (player.bib === 14) {
        console.log("Updated Player Statistics: ", player.statistics);
      }

      alteredPlayers[index] = {
        ...alteredPlayers[index],
        statistics: player.statistics,
      };
    });

    return alteredPlayers;
  }

  const homeDataSource = useMemo(() => {
    const source = compileStatsFromEvents(
      match.pbp,
      match.statistics.home.persons
    );

    return source.map((item) => {
      return { ...item, ...item.statistics, id: item.personId };
    });
  }, [match]);

  const awayDataSource = useMemo(() => {
    const source = compileStatsFromEvents(
      match.pbp,
      match.statistics.away.persons
    );

    return source.map((item) => {
      return { ...item, ...item.statistics, id: item.personId };
    });
  }, [match]);

  return (
    <div className="w-full overflow-auto stats-container">
      <div className="mt-4 text-2xl font-medium stats-header">Home</div>
      <Table
        className="mt-4 custom-dark-table"
        pagination={false}
        columns={columns}
        dataSource={homeDataSource}
      />

      <div className="mt-10 text-2xl font-medium stats-header">Away</div>
      <Table
        className="mt-4 custom-dark-table"
        pagination={false}
        columns={columns}
        dataSource={awayDataSource}
      />
    </div>
  );
};
