import { Modal, Button, Typography } from "antd";
import { useState } from "react";
import useResizeObserver from "use-resize-observer";

const { Title, Text } = Typography;

export const Field = ({ match }) => {
  const { ref, width = 1200, height = 750 } = useResizeObserver();
  const [isModalOpenShot, setIsModalOpenShot] = useState(false);
  const [selectedShot, setSelectedShot] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const shots = match.shotChart.shots;
  const homePersons = match.statistics.home.persons;
  const awayPersons = match.statistics.away.persons;
  const allPersons = [...homePersons, ...awayPersons];

  const findPersonByPersonId = (personId) =>
    allPersons.find((person) => person.personId === personId);

  const findTeamByEntityId = (entityId) =>
    match.fixture.competitors.find((team) => team.entityId === entityId);

  const showShotModal = (shot, player, team) => {
    setSelectedShot(shot);
    setSelectedPlayer(player);
    setSelectedTeam(team);
    setIsModalOpenShot(true);
  };

  const handleCloseShotModal = () => setIsModalOpenShot(false);

  return (
    <>
      {/* Shot Modal */}
      <Modal
        visible={isModalOpenShot}
        onCancel={handleCloseShotModal}
        className="custom-dark-modal"
        footer={null}
        title="Shot Details"
        
        centered
      >
        {selectedShot && selectedPlayer && selectedTeam && (
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedPlayer.personImage}
              alt={selectedPlayer.personName}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                marginBottom: 20,
                objectFit: "cover",
              }}
            />
            <Title level={4}>{selectedPlayer.personName}</Title>
            <Text strong>#{selectedPlayer.bib}</Text>
            <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
              {selectedTeam.name}
            </Text>

            <Text>{selectedShot.desc}</Text>
            <div style={{ margin: "20px 0" }}>
              <Text
                type={selectedShot.success ? "success" : "danger"}
                strong
                style={{ fontSize: 16 }}
              >
                {selectedShot.success ? "Successful Shot" : "Missed Shot"}
              </Text>
            </div>
            {selectedShot.details && (
              <Text type="secondary" style={{ display: "block" }}>
                {selectedShot.details}
              </Text>
            )}
          </div>
        )}
      </Modal>

      {/* Field with Shots */}
      <div className="w-full h-full relative mb-10">
        {shots.map((shot, index) => {
          const scaledX = (shot.x / 100) * width;
          const scaledY = height - (shot.y / 100) * height;

          const player = findPersonByPersonId(shot.personId);
          const team = findTeamByEntityId(shot.entityId);

          return (
            <div
              key={index}
              style={{
                top: scaledY,
                left: scaledX,
              }}
              className={`absolute cursor-pointer w-4 h-4 rounded-full z-10 ${
                shot.success ? "bg-green-400" : "bg-red-400"
              } hover:scale-125`}
              onClick={() => showShotModal(shot, player, team)}
            />
          );
        })}
        <img ref={ref} src="/field.png" alt="Field" style={{ width: "100%" }} />
      </div>
    </>
  );
};
