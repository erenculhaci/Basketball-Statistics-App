import { List, Tabs } from "antd";
import { getPopulatedPlayers, players } from "../data/player_data";
import { getPBPEvents, getTeamScoresFromPBPEvents } from "../utility/getTeamScores";

export const Timeline = ({ match }) => {
  const quarters = Object.keys(match.pbp);
  const allEvents = quarters.reduce((acc, quarter) => {
    return [...acc, ...match.pbp[quarter].events];
  }, []);

  const sortEventsDescending = (events) => {
    return [...events].sort((a, b) => (a.clock < b.clock ? 1 : -1));
  };

  const tabItems = quarters.map((quarter) => ({
    key: quarter,
    label: `Q${quarter}`,
    children: <EventList match={match} events={match.pbp[quarter].events} />,
  }));

  tabItems.push({
    key: "all",
    label: "All",
    children: <EventList match={match} events={allEvents} />,
  });

  return <Tabs defaultActiveKey="1" items={tabItems} className="custom-tabs" />;
};

const EventList = ({ match, events }) => {
  const competitorsMap = match.fixture.competitors.reduce((map, competitor, index) => {
    map[competitor.entityId] = { ...competitor, index };
    return map;
  }, {});

  return (
    <List
      size="large"
      bordered
      dataSource={events}
      renderItem={(event, index) => {
        const competitor = competitorsMap[event.entityId];
        const player = getPopulatedPlayers().find((p) => p.personId === event.personId);
        const cumulativeEvents = getPBPEvents(match.pbp).slice(0, index + 1);
        const teamScores = getTeamScoresFromPBPEvents(cumulativeEvents);

        const homeEntityId = match.fixture.competitors[0]?.entityId;
        const awayEntityId = match.fixture.competitors[1]?.entityId;
        const homeScore = teamScores[homeEntityId] ?? event.scores[homeEntityId];
        const awayScore = teamScores[awayEntityId] ?? event.scores[awayEntityId];

        return (
          <List.Item>
            <div className="w-full flex items-center justify-between">
              {/* Left Side: Competitor Info */}
              <div className={`${competitor?.index === 0 ? "text-white" : "opacity-0"}`}>
                <p className="font-medium text-lg mb-1">{event.desc}</p>
                {event.success != null && (
                  <p className="font-medium text-xs mb-3">{event.success ? "Successful" : "Unsuccessful"}</p>
                )}
                <div className="flex items-center">
                  <img className="w-[32px] h-[32px] rounded-full mr-2" src={competitor?.logo} alt="" />
                  <p>{player?.personName}</p>
                </div>
              </div>

              {/* Center: Scores and Clock */}
              <div className="flex items-center space-x-4 text-white">
                <p className="text-2xl">{homeScore}</p>
                <p>Remaining Time: {event.clock.slice(2)}</p>
                <p className="text-2xl">{awayScore}</p>
              </div>

              {/* Right Side: Opponent Info */}
              <div className={`${competitor?.index === 1 ? "flex flex-col items-end text-white" : "opacity-0"}`}>
                <p className="font-medium text-lg mb-1">{event.desc}</p>
                {event.success != null && (
                  <p className="font-medium text-xs mb-3">{event.success ? "Successful" : "Unsuccessful"}</p>
                )}
                <div className="flex items-center">
                  <img className="w-[32px] h-[32px] rounded-full mr-2" src={competitor?.logo} alt="" />
                  <p>{player?.personName}</p>
                </div>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};


