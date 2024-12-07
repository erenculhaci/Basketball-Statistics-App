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

const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

export const Stats = ({ match }) => {
  const columns = useMemo(
    () =>
      columnHeaders.map((item) => ({
        title: item.label,
        dataIndex: item.id === "label" ? "personName" : item.id,
        id: item.id,
      })),
    []
  );

  const compileStatsFromEvents = (pbpEvents, players) => {
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

    const updatedPlayers = players.map((player) => ({
      ...player,
      statistics: { ...defaultPlayerStats },
    }));

    const allEvents = [
      ...(pbpEvents[1]?.events || []),
      ...(pbpEvents[2]?.events || []),
      ...(pbpEvents[3]?.events || []),
      ...(pbpEvents[4]?.events || []),
    ];

    allEvents.forEach((event) => {
      const playerIndex = updatedPlayers.findIndex((p) => p.personId === event.personId);
      if (playerIndex === -1) return;

      const player = { ...updatedPlayers[playerIndex] };
      const stats = { ...player.statistics };

      if (event.desc.includes("Asist")) stats.assists += 1;
      else if (event.desc.includes("Blok")) stats.blocks += 1;
      else if (event.desc === "Kişisel Faul" || event.desc === "Hücum Faul") {
        stats.foulsDrawn += 1;
        stats.foulsTotal += 1;
      } else if (event.desc === "Alınan Faul") stats.foulsTotal += 1;
      else if (event.desc.includes("Top Çalma")) stats.steals += 1;
      else if (event.desc.includes("Top Kaybı")) stats.turnovers += 1;
      else if (event.desc.includes("İki Sayı") || event.desc.includes("2 Sayı")) {
        stats.pointsTwoAttempted += 1;
        if (event.success) stats.pointsTwoMade += 1;
        stats.pointsTwoPercentage = (
          (stats.pointsTwoMade / stats.pointsTwoAttempted) *
          100
        ).toFixed(2);
        stats.points += event.success ? 2 : 0;
      } else if (event.desc.includes("Üç Sayı") || event.desc.includes("3 Sayı")) {
        stats.pointsThreeAttempted += 1;
        if (event.success) stats.pointsThreeMade += 1;
        stats.pointsThreePercentage = (
          (stats.pointsThreeMade / stats.pointsThreeAttempted) *
          100
        ).toFixed(2);
        stats.points += event.success ? 3 : 0;
      } else if (event.desc.includes("Serbest Atış")) {
        stats.freeThrowsAttempted += 1;
        if (event.success) stats.freeThrowsMade += 1;
        stats.freeThrowsPercentage = (
          (stats.freeThrowsMade / stats.freeThrowsAttempted) *
          100
        ).toFixed(2);
        stats.points += event.success ? 1 : 0;
      } else if (event.desc.includes("Ribaund")) {
        stats.rebounds += 1;
        if (event.desc.includes("Savunma")) stats.reboundsDefensive += 1;
        else if (event.desc.includes("Hücum")) stats.reboundsOffensive += 1;
      }

      updatedPlayers[playerIndex] = { ...player, statistics: stats };
    });

    return updatedPlayers;
  };

  const homeDataSource = useMemo(
    () =>
      compileStatsFromEvents(match.pbp, match.statistics.home.persons).map((player) => ({
        ...player,
        ...player.statistics,
        id: player.personId,
      })),
    [match]
  );

  const awayDataSource = useMemo(
    () =>
      compileStatsFromEvents(match.pbp, match.statistics.away.persons).map((player) => ({
        ...player,
        ...player.statistics,
        id: player.personId,
      })),
    [match]
  );

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
