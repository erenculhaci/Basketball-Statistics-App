"use client";
import { Field } from "@/app/components/field";
import { Stats } from "@/app/components/statstab";
import { Timeline } from "@/app/components/timeline";
import { eventOptions } from "@/app/utility/constants";
import { getPopulatedPlayers } from "@/app/data/player_data";
import { logEvent, toggleTimer, removeGame  } from "@/app/storage/matchSlicer";
import { calculateEventTime } from "@/app/utility/calcEventTimes";
import { calculateTeamPoints } from "@/app/utility/getTeamScores";
import { Button, Modal, Tabs, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useResizeObserver from "use-resize-observer";

export default function Match() {
  const { id } = useParams();
  const matches = useSelector((state) => state.matchSlicer.matches);
  const clocks = useSelector((state) => state.matchSlicer.clocks);
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState("");
  const [player, setPlayer] = useState(null);
  const [success, setSuccess] = useState(false);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const { ref, width = 1200, height = 750 } = useResizeObserver();
  const wrapperRef = useRef();
  const [periodSnapshot, setPeriodSnapshot] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const dispatch = useDispatch();

  const matchData = matches[id];

  const competitor1 = matchData.fixture.competitors[0];
  const competitor2 = matchData.fixture.competitors[1];
  const periodData = matchData.periodData;
  const teamScoreKeys = Object.keys(periodData.teamScores);

  const teamScoresFromPBP = calculateTeamPoints(matchData.pbp);

  const getHomePlayerOptions = () => {
    return matchData.statistics.home.persons;
  };

  const getAwayPlayerOptions = () => {
    return matchData.statistics.away.persons;
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Stats</span>, 
      children: <Stats match={matchData} />,
    },
    {
      key: "2",
      label: <span className="text-white">Field</span>,  
      children: <Field match={matchData} />,
    },
    {
      key: "3",
      label: <span className="text-white">Game Flow</span>,
      children: <Timeline match={matchData} />,
    },
  ];
  

  const rawPlayer = useMemo(() => {
    if (player == null) {
      return null;
    }
    return getPopulatedPlayers().find((item) => item.personId === player);
  }, [player]);

  const clockDataForMatch = clocks?.[matchData?.seasonId];
  const clockExists = clockDataForMatch != null;
  const time = calculateEventTime(clockDataForMatch?.time);

  return (
    <div className="pt-10 flex flex-col items-center w-[90%] mb-10 mx-auto">
      <Modal
        okButtonProps={{
          disabled:
            (step === 1 && (player == null || event == null || event == "")) ||
            (step == 0 && coordinates.x == 0 && coordinates.y == 0),
        }}
        onOk={() => {
          if (step === 0) {
            setStep(1);
          } else {
            const eventOption = eventOptions.find((item) => item.key === event);
            const newShot = {
              bib: "9",
              clock: snapshot,
              desc: eventOption.code,
              entityId: rawPlayer?.entityId,
              eventType: eventOption.key,
              name: "",
              periodId: periodSnapshot,
              personId: player,
              success: success,
              successString: "",
              scores: {
                [competitor1.entityId]: 0,
                [competitor2.entityId]: 0,
              },
              x: coordinates.x,
              y: coordinates.y,
            };
            dispatch(
              logEvent({
                matchId: matchData.seasonId,
                event: newShot,
              })
            );
            setPeriodSnapshot(time.p);
            setSnapshot(`PT${time.m}M ${time.s}S`);
            setCoordinates({
              x: 0,
              y: 0,
            });
            setStep(0);
            setPlayer(null);
          }
        }}
        cancelText="Geri"
        okText="İleri"
        width={"85%"}
        onCancel={() => {
          if (step === 1) {
            setStep(0);
          } else {
            setIsModalVisible(false);
          }
        }}
        open={isModalVisible}
        className="custom-dark-modal"
      >
        <Typography.Title level={3}>Input</Typography.Title>

        {step === 1 ? (
          <div className="flex flex-col items-center space-y-4">
            {}
            <div className="flex space-x-4 justify-center align-center">
              {eventOptions.map((item, index) => {
                if (
                  item.key === "freeThrowsMade" ||
                  item.key === "pointsTwoMade" ||
                  item.key === "pointsThreeMade"
                ) {
                  return (
                    <div
                      onClick={() => {
                        setEvent(item.key);
                      }}
                      className={`min-h-[32px] text-center cursor-pointer overflow-hidden min-w-[64px] border-2 rounded-lg border-neutral-800  flex justify-center ${
                        event === item.key ? "bg-blue-300" : "bg-neutral-0"
                      } `}
                      key={index}
                    >
                      <div
                        onClick={() => {
                          setSuccess(true);
                          setEvent(item.key);
                        }}
                        className={
                          event === item.key && success
                            ? "bg-green-500 p-2 min-w-[56px]"
                            : "bg-green-200 p-2 min-w-[56px]"
                        }
                      >
                        {item.code.split(" ")[0]}
                      </div>
                      <div
                        onClick={() => {
                          setSuccess(false);
                          setEvent(item.key);
                        }}
                        className={
                          event === item.key && !success
                            ? "bg-red-500 p-2 min-w-[56px]"
                            : "bg-red-200 p-2 min-w-[56px]"
                        }
                      >
                        {item.code.split(" ")[1]}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      onClick={() => {
                        setEvent(item.key);
                      }}
                      className={`min-h-[32px] text-center cursor-pointer min-w-[64px] p-2 border-2 rounded-lg border-neutral-800  flex justify-center ${
                        event === item.key ? "bg-blue-300" : "bg-neutral-0"
                      } `}
                      key={index}
                    >
                      {item.code}
                    </div>
                  );
                }
              })}
            </div>

            <div className="flex space-x-6">
              <div className="flex flex-col space-x-4 shrink-0 w-1/2 bg-neural-0 border-2 rounded-lg p-4">
                <p className="text-lg font-bold mb-3">{competitor1?.name}</p>
                <div className="flex flex-wrap items-center justify-center">
                  {getHomePlayerOptions()
                    .slice(0, 5)
                    .map((p, index) => (
                      <div
                        onClick={() => {
                          setPlayer(p.personId);
                        }}
                        key={index}
                        className={`w-[200px] h-[140px]  mr-4 mb-4 flex shrink-0 flex-col border-neutral-400 border-2 p-2 rounded-lg justify-center items-center ${
                          p.personId === player ? "bg-blue-300" : ""
                        }`}
                      >
                        <img alt="" src={p.personImage} className="w-[64px]" />
                        <p className="font-bold text-center mt-2">
                          {p.bib} - {p.personName}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col space-x-4 shrink-0 w-1/2  bg-neural-0 border-2 rounded-lg p-4">
                <p className="text-lg flex mb-3 font-bold">
                  {competitor2?.name}
                </p>
                <div className="flex flex-wrap items-center justify-center">
                  {getAwayPlayerOptions()
                    .slice(0, 5)
                    .map((p, index) => (
                      <div
                        onClick={() => {
                          setPlayer(p.personId);
                        }}
                        key={index}
                        className={`w-[200px] h-[140px] mr-4 mb-4 flex shrink-0 flex-col border-neutral-400 border-2 p-2 rounded-lg justify-center items-center ${
                          p.personId === player ? "bg-blue-300" : ""
                        }`}
                      >
                        <img alt="" src={p.personImage} className="w-[64px]" />
                        <p className="font-bold text-center mt-2">
                          {p.bib} - {p.personName}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={wrapperRef}
              onClick={(e) => {
                let bounds = wrapperRef.current.getBoundingClientRect();
                let x = e.clientX - bounds.left;
                let y = Math.abs(bounds.top - e.clientY);
                setCoordinates({
                  x: (x * 100) / width,
                  y: ((height - y) * 100) / height,
                });
                setStep(1);
              }}
              className="w-full h-full relative mb-10"
            >
              {}
              {[coordinates].map((shot, index) => {
                const scaledX = (shot.x / 100) * width;
                const scaledY = height - (shot.y / 100) * height;

                return (
                  <div
                    id="button"
                    style={{
                      top: scaledY,
                      left: scaledX,
                    }}
                    className={`absolute cursor-pointer w-[16px] h-[16px] rounded-full hover:scale-125 z-10 ${
                      shot.success ? "bg-green-400" : "bg-red-400"
                    } `}
                    key={index}
                  />
                );
              })}
              <img ref={ref} src={"/field.png"} alt="" />
            </div>
          </>
        )}
      </Modal>
      <div className="grid grid-cols-3 justify-between w-full">
  <div className="flex col-span-1 justify-center items-center space-x-3">
    <div className="text-3xl font-medium">{competitor1.name}</div>
    <img src={competitor1.logo} className="w-[64px]" alt="" />
  </div>
  <div className="flex col-span-1 justify-center flex-col items-center relative">
    {/* Burada Maç Detayları */}
    <div className="flex space-x-3">
      <Button
        onClick={() => {
          router.push("/"); // Maçlar ana sayfasına dönme butonu
        }}
        style={{ color: "white" }}
      >
        Matches
      </Button>
      {matchData.isCustom && clockExists && (
        <Button
          onClick={() => {
            setPeriodSnapshot(time.p);
            setSnapshot(`PT${time.m}M ${time.s}S`);
            setIsModalVisible(true);
          }}
          style={{ color: "white" }}
        >
          Input
        </Button>
      )}
      {matchData.isCustom && clockExists && (
        <Button
          onClick={() => {
            dispatch(toggleTimer(matchData.seasonId));
          }}
          style={{ color: "white" }}
        >
          Time {clockDataForMatch.running ? "Stop" : "Start"}
        </Button>
      )}
    </div>

    <div className="flex items-center space-x-10 mt-4">
      <div className="text-4xl font-medium">
        {teamScoresFromPBP[competitor1.entityId] ?? competitor1.score ?? 0}
      </div>
      <div className="text-4xl font-medium">-</div>
      <div className="text-4xl font-medium">
        {teamScoresFromPBP[competitor2.entityId] ?? competitor2.score ?? 0}
      </div>
    </div>
    {clockExists ? (
            <div className="text-md font-medium">
              {time.p}.periyot {time.m}:{time.s}
            </div>
          ) : (
            <div className="text-md font-medium">Bitti</div>
          )}

          {}
  </div>
  <div className="flex col-span-1 justify-center items-center space-x-3">
    <img src={competitor2.logo} className="w-[64px]" alt="" />
    <div className="text-3xl font-medium max-w-[350px] overflow-hidden">
      {competitor2.name}
    </div>
  </div>
</div>
      <div className="w-[90%]">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}