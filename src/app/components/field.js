import { Modal, Button, Typography } from "antd";
import { useState } from "react";
import useResizeObserver from "use-resize-observer";

const { Title, Text } = Typography;

export const Field = ({ match }) => {
  const { ref: resizeRef, width = 1200, height = 750 } = useResizeObserver();
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentShot, setCurrentShot] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  const shotData = match.shotChart.shots;
  const homePlayers = match.statistics.home.persons;
  const awayPlayers = match.statistics.away.persons;
  const combinedPlayers = [...homePlayers, ...awayPlayers];

  const getPlayerById = (playerId) =>
    combinedPlayers.find((player) => player.personId === playerId);

  const getTeamById = (teamId) =>
    match.fixture.competitors.find((team) => team.entityId === teamId);

  const openShotModal = (shot, player, team) => {
    setCurrentShot({ ...shot, desc: getShotDesc(shot.desc) });;
    setCurrentPlayer(player);
    setCurrentTeam(team);
    setModalVisible(true);
  };

  const translations = {
    "İki Sayı": "Two Pointer",
    "Üç Sayı": "Three Pointer",
    "Serbest Atış": "Free Throw",
    "İki Sayı Layup": "Two Pointer Layup",
    "Üç Sayı Jump Shot": "Three Pointer Jump Shot",
    "İki Sayı Jump Shot": "Two Pointer Jump Shot",
    "İki Sayı Driving Layup": "Two Pointer Driving Layup",
    "İki Sayı Smaç": "Two Pointer Dunk",
  };

  const getShotDesc = (description) => {
    return translations[description] || description;
  };
  

  const closeShotModal = () => setModalVisible(false);

  return (
    <>
      {/* Shot Modal */}
    <Modal
        visible={isModalVisible}
        onCancel={closeShotModal}
        className="custom-dark-modal"
        footer={null}
        title="Shot Details"
        centered
      >
        {currentShot && currentPlayer && currentTeam && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <img
              src={currentPlayer.personImage}
              alt={currentPlayer.personName}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                marginBottom: 20,
                objectFit: "cover",
              }}
            />
            <Title level={4}>{currentPlayer.personName}</Title>
            <Text strong>#{currentPlayer.bib}</Text>
            <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
              {currentTeam.name}
            </Text>

            <Text>{currentShot.desc}</Text>
            <div style={{ margin: "20px 0" }}>
              <Text
                type={currentShot.success ? "success" : "danger"}
                strong
                style={{ fontSize: 16 }}
              >
                {currentShot.success ? "Successful Shot" : "Missed Shot"}
              </Text>
            </div>
            {currentShot.details && (
              <Text type="secondary" style={{ display: "block" }}>
                {currentShot.details}
              </Text>
            )}
          </div>
        )}
      </Modal>


      {/* Field with Shots */}
      <div className="w-full h-full relative mb-10">
        {shotData.map((shot, idx) => {
          const adjustedX = (shot.x / 100) * width;
          const adjustedY = height - (shot.y / 100) * height;

          const player = getPlayerById(shot.personId);
          const team = getTeamById(shot.entityId);

          return (
            <div
              key={idx}
              style={{
                top: adjustedY,
                left: adjustedX,
              }}
              className={`absolute cursor-pointer w-4 h-4 rounded-full z-10 ${
                shot.success ? "bg-green-400" : "bg-red-400"
              } hover:scale-125`}
              onClick={() => openShotModal(shot, player, team)}
            />
          );
        })}
        <img ref={resizeRef} src="/field.png" alt="Field" style={{ width: "100%" }} />
      </div>
    </>
  );
};
