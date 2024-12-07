import { List, Tabs } from "antd";
import { getPopulatedPlayers, players } from "../data/player_data";
import { fetchAllEvents, computeTeamScoresFromEvents } from "../utility/getTeamScores";

export const Timeline = ({ match }) => {
  const gameQuarters = Object.keys(match.pbp);
  const allGameEvents = gameQuarters.reduce((acc, quarter) => {
    return [...acc, ...match.pbp[quarter].events];
  }, []);

  const translations = {
    "İki Sayı": "Two Pointer",
    "Üç Sayı": "Three Pointer",
    "Serbest Atış": "Free Throw",
    "İki Sayı Layup": "Two Pointer Layup",
    "Üç Sayı Jump Shot": "Three Pointer Jump Shot",
    "İki Sayı Jump Shot": "Two Pointer Jump Shot",
    "İki Sayı Driving Layup": "Two Pointer Driving Layup",
    "İki Sayı Smaç": "Two Pointer Dunk",
    "Ribaund": "Rebound",
    "Blok": "Block",
    "Top Çalma": "Steal",
    "Faul": "Foul",
    "Hücum Ribaundu": "Offensive Rebound",
    "Savunma Ribaundu": "Defensive Rebound",
  };

  const getDesc = (description) => {
    return translations[description] || description;
  };

  const sortEventsByClock = (events) => {
    return [...events].sort((a, b) => (a.clock < b.clock ? 1 : -1));
  };

  const tabelements = gameQuarters.map((quarter) => ({
    key: quarter,
    label: `Q${quarter}`,
    children: <EventList match={match} events={match.pbp[quarter].events} getDesc={getDesc} />,
  }));

  tabelements.push({
    key: "all",
    label: "All",
    children: <EventList match={match} events={allGameEvents} getDesc={getDesc} />,
  });

  return <Tabs defaultActiveKey="1" items={tabelements} className="custom-tabs" />;
};

const EventList = ({ match, events, getDesc }) => {
  const teamMap = match.fixture.competitors.reduce((map, associatedTeam, index) => {
    map[associatedTeam.entityId] = { ...associatedTeam, index };
    return map;
  }, {});

  return (
    <List
      size="large"
      bordered
      dataSource={events}
      renderItem={(eventDetail, index) => {
        const associatedTeam = teamMap[eventDetail.entityId];
        const associatedPlayer = getPopulatedPlayers().find((p) => p.personId === eventDetail.personId);
        const cumulativeEvents = fetchAllEvents(match.pbp).slice(0, index + 1);
        const teamScores = computeTeamScoresFromEvents(cumulativeEvents);

        const homeEntityId = match.fixture.competitors[0]?.entityId;
        const awayEntityId = match.fixture.competitors[1]?.entityId;
        const homeScore = teamScores[homeEntityId] ?? eventDetail.scores[homeEntityId];
        const awayScore = teamScores[awayEntityId] ?? eventDetail.scores[awayEntityId];

        return (
        <List.Item>
          <div className="w-full flex items-center justify-between">
            {/* Left Side: Competitor Info */}
            <div className={`${associatedTeam?.index === 0 ? "text-white" : "opacity-0"}`}>
              <p className="font-medium text-lg mb-1">{getDesc(eventDetail.desc)}</p>
              {eventDetail.success != null && !["Ribaund", "Blok", "Top Çalma", "Faul"].some((type) => eventDetail.desc.includes(type)) && (
                <p className="font-medium text-xs mb-3">
                  {eventDetail.success ? "Successful" : "Unsuccessful"}
                </p>
              )}
              <div className="flex items-center">
                <img className="w-[32px] h-[32px] rounded-full mr-2" src={associatedTeam?.logo} alt="" />
                <p>{associatedPlayer?.personName}</p>
              </div>
            </div>

            {/* Center: Scores and Clock */}
            <div className="flex items-center space-x-4 text-white">
              <p className="text-2xl">{homeScore}</p>
              <p>Remaining Time: {eventDetail.clock.slice(2)}</p>
              <p className="text-2xl">{awayScore}</p>
            </div>

            {/* Right Side: Opponent Info */}
            <div className={`${associatedTeam?.index === 1 ? "flex flex-col items-end text-white" : "opacity-0"}`}>
              <p className="font-medium text-lg mb-1">{getDesc(eventDetail.desc)}</p>
              {eventDetail.success != null && !["Ribaund", "Blok", "Top Çalma", "Faul"].some((type) => eventDetail.desc.includes(type)) && (
                <p className="font-medium text-xs mb-3">
                  {eventDetail.success ? "Successful" : "Unsuccessful"}
                </p>
              )}
              <div className="flex items-center">
                <img className="w-[32px] h-[32px] rounded-full mr-2" src={associatedTeam?.logo} alt="" />
                <p>{associatedPlayer?.personName}</p>
              </div>
            </div>
          </div>
        </List.Item>
        );
      }}
    />
  );
};


