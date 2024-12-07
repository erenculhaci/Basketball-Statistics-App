"use client";
import { useRouter } from "next/navigation";
import { Button, Input, Popconfirm, Card, Space, Modal, Select, Typography, message } from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addGame, initializeGame, removeGame } from "./storage/matchSlicer";
import { getPopulatedPlayers, players } from "./data/player_data";
import { getPopulatedTeams, teams } from "./data/team_data";
import { calculateTeamPoints } from "./utility/getTeamScores";
import { debounce } from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function Home() {
  const matchList = useSelector((state) => state.matchSlicer.matches);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [venue, setVenue] = useState("");
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [filteredMatches, setFilteredMatches] = useState(matchList);

  const handleDeleteMatch = (index) => {
    dispatch(removeGame(index));
    router.push("/");
    message.success("Match deleted successfully!");
  }

  const handleSearch = debounce((value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = matchList.filter(
      (match) =>
        match.fixture.venue.toLowerCase().includes(lowercasedValue) ||
        match.fixture.competitors.some((team) =>
          team.name.toLowerCase().includes(lowercasedValue)
        )
    );
    setFilteredMatches(filtered);
  }, 300); // Debounce input to avoid excessive rendering

  useEffect(() => {
    setFilteredMatches(matchList); // Update filtered matches if matchList changes
  }, [matchList]);

  const buildInitialMatchData = () => {
    const populatedTeams = getPopulatedTeams();
    const home = populatedTeams.find((item) => item.entityId == team1);
    const away = populatedTeams.find((item) => item.entityId == team2);

    const homePersons = getPopulatedPlayers().filter((item) => item.entityId === home.entityId);
    const awayPersons = getPopulatedPlayers().filter((item) => item.entityId === away.entityId);

    const matchData = {
      isCustom: true,
      fixture: {
        competitors: [home, away],
        venue,
        fixtureId: uuidv4(),
        startTimeLocal: new Date().toISOString(),
      },
      seasonId: uuidv4(),
      periodData: {
        periodLabels: { 1: "Ç1", 2: "Ç2", 3: "Ç3", 4: "Ç4", 11: "UZ1", 12: "UZ2", 13: "UZ3", 14: "UZ4", 15: "UZ5", 16: "UZ6" },
        teamScores: {
          [home.entityId]: [{ periodId: 1, score: 0 }, { periodId: 2, score: 0 }, { periodId: 3, score: 0 }, { periodId: 4, score: 0 }],
          [away.entityId]: [{ periodId: 1, score: 0 }, { periodId: 2, score: 0 }, { periodId: 3, score: 0 }, { periodId: 4, score: 0 }],
        },
      },
      statistics: { headers: [], entitiesLabels: [], boxScoreLabels: {}, home: { persons: homePersons }, away: { persons: awayPersons } },
      shotChart: { competitors: {}, persons: {}, shots: [] },
      pbp: { 1: { ended: true, events: [] }, 2: { ended: true, events: [] }, 3: { ended: true, events: [] }, 4: { ended: true, events: [] } },
    };
    return matchData;
  };

  const getTeamOptions = getPopulatedTeams().map((team) => ({ label: team.name, value: team.entityId }));

  return (
    <main className="flex flex-col items-center justify-center bg-gray-900 text-white min-h-screen p-6 space-y-8">
      {/* Modal for New Match */}
      <Modal
        okButtonProps={{
          disabled: team1 == null || team2 == null || team1 == team2,
        }}
        onOk={() => {
          const matchData = buildInitialMatchData();
          dispatch(initializeGame(matchData));
          dispatch(addGame(matchData));
          setIsModalOpen(false);
        }}
        okText="Continue"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        className="custom-dark-modal"
      >
        <Typography.Title level={2} className="text-center">
          Create New Match
        </Typography.Title>
        <div className="space-y-4">
          <Select
            size="large"
            value={team1?.entityId}
            placeholder="1. Team Select"
            className="w-full"
            options={getTeamOptions}
            onChange={(e) => setTeam1(e)}
            optionLabelProp="label"
          />
          <Select
            size="large"
            value={team2?.entityId}
            placeholder="2. Team Select"
            className="w-full"
            options={getTeamOptions}
            onChange={(e) => setTeam2(e)}
            optionLabelProp="label"
          />
          <Input
            size="large"
            className="w-full"
            placeholder="Location"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>
      </Modal>

      {/* Header */}
      <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              🏀
            </div>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">Match Center</h1>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="hidden md:flex flex-1 mx-8 custom-dark-modal">
            <Input
              placeholder="Search matches..."
              className="rounded-lg bg-gray-700 text-white px-4 py-2 shadow-inner placeholder-orange"
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>

          {/* Right Section: Buttons and Profile */}
          <div className="flex items-center space-x-4">
            <Button
              type="primary"
              className="transition transform hover:scale-105"
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: "#FF7F32",
                borderColor: "#FF7F32",
                fontWeight: "bold",
              }}
            >
              + New Match
            </Button>

          </div>
        </div>
      </header>

      {/* Match List */}
      <div className="w-full max-w-[90%] grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <TransitionGroup component={null}>
  {filteredMatches.map((match, index) => {
    const fixture = match.fixture;
    const date = new Date(fixture.startTimeLocal);
    const formattedDate = date.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

    const teamScoresFromPBP = calculateTeamPoints(match.pbp);
    const competitor1 = fixture.competitors[0];
    const competitor2 = fixture.competitors[1];

    const competitor1Score = teamScoresFromPBP[competitor1.entityId] ?? competitor1?.score ?? 0;
    const competitor2Score = teamScoresFromPBP[competitor2.entityId] ?? competitor2?.score ?? 0;

    return (
      <CSSTransition
        key={index}
        timeout={300}
        classNames="match"
      >
        <div
          onClick={(e) => {
            // Only navigate if the delete button was not clicked
            if (!e.target.closest('button')) {
              router.push(`/pages/match/${index}`);
            }
          }}
          className="relative bg-gray-800 hover:bg-gray-700 hover:cursor-pointer p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
        >
          <p className="text-center text-lg font-semibold">{fixture.venue}</p>
          <div className="flex justify-center items-center space-x-6">
            <div className="flex flex-col items-center">
              <img
                src={competitor1.logo}
                alt="Team Logo"
                className="w-16 h-16 rounded-full"
              />
              <p className="mt-2 text-lg font-semibold">{competitor1.name}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-bold text-2xl">{competitor1Score}</p>
              <p className="font-bold text-2xl">-</p>
              <p className="font-bold text-2xl">{competitor2Score}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="mt-2 text-lg font-semibold">{competitor2.name}</p>
              <img
                src={competitor2.logo}
                alt="Team Logo"
                className="w-16 h-16 rounded-full"
              />
            </div>
          </div>
          <p className="text-center text-lg font-semibold">{formattedDate}</p>
          <div className="w-full flex justify-center">
            <Popconfirm
              title="Are you sure you want to delete this match?"
              onConfirm={() => {
                handleDeleteMatch(index);
                router.push('/');
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                style={{
                  backgroundColor: "#ff4d4f",
                  borderColor: "#ff7875",
                  color: "white",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff6f6f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4f")}
                onClick={(e) => e.stopPropagation()} // Stop click event propagation to prevent redirection
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
      </CSSTransition>
    );
  })}
</TransitionGroup>
</div>

</main>
  );
}
