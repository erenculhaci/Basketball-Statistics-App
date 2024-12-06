"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Input, Form, Popconfirm, message, Table, Card, Typography, Space } from "antd";
import { v4 as uuidv4 } from "uuid";
import { getPopulatedTeams, teams as initialTeams } from "../data/team_data";
import { debounce } from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const { Title, Text } = Typography;

const TeamPage = () => {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [teams, setTeams] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    } else {
      setTeams(initialTeams);
      localStorage.setItem("teams", JSON.stringify(initialTeams));
    }
  }, []);

  useEffect(() => {
    setFilteredTeams(teams); // Update filtered teams if teams list changes
  }, [teams]);

  const handleSearch = debounce((value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(lowercasedValue)
    );
    setFilteredTeams(filtered);
  }, 300);

  const updateTeams = (newTeams) => {
    setTeams(newTeams);
    localStorage.setItem("teams", JSON.stringify(newTeams));
  };

  const handleAddTeam = () => {
    form
      .validateFields()
      .then((values) => {
        const newTeam = {
          entityId: uuidv4(),
          name: values.teamName,
          logo: "https://slc2021.s3.ap-south-1.amazonaws.com/images/default-team-logo.png",
        };
        updateTeams([...teams, newTeam]);
        form.resetFields();
        setModalVisible(false);
        message.success("Team added successfully!");
      })
      .catch((err) => console.error("Validation error:", err));
  };

  const handleDeleteTeam = (teamId) => {
    const updatedTeams = teams.filter((team) => team.entityId !== teamId);
    updateTeams(updatedTeams);
    message.success("Team deleted successfully!");
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-8 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              🏀
            </div>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">Team Management</h1>
          </div>

          <div className="custom-dark-modal flex-1 mx-8">
            <Input
              placeholder="Search teams..."
              className="rounded-lg bg-gray-700 text-white px-4 py-2 shadow-inner placeholder-orange"
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              type="primary"
              className="transition transform hover:scale-105"
              onClick={() => setModalVisible(true)}
              style={{
                backgroundColor: "#FF7F32",
                borderColor: "#FF7F32",
                fontWeight: "bold",
              }}
            >
              + Team
            </Button>
          </div>
        </div>
      </header>

      {/* Team Cards */}
      <div className="w-full max-w-[90%] grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <TransitionGroup component={null}>
          {filteredTeams.map((team) => (
            <CSSTransition
              key={team.entityId}
              timeout={300}
              classNames="match"
            >
              <div
              onClick={(e) => {
                // Only navigate if the delete button was not clicked
                if (!e.target.closest('button')) {
                  router.push(`/pages/teams/${team.entityId}`);
                }
              }}
                className="relative bg-gray-800 hover:bg-gray-700 hover:cursor-pointer p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4"
              >
                <img
                  src={team.logo}
                  alt="Team Logo"
                  className="w-16 h-16 rounded-full"
                />
                <p className="text-lg font-semibold text-center">{team.name}</p>
                <div className="w-full flex justify-center">
                  <Popconfirm
                    title="Are you sure you want to delete this team?"
                    onConfirm={() => {
                      handleDeleteTeam(team.entityId)
                      router.push('/team-management');
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      {/* Add Team Modal */}
      <Modal
        title="Add New Team"
        visible={isModalVisible}
        onOk={handleAddTeam}
        onCancel={() => setModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
        className="custom-dark-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="teamName"
            label="Team Name"
            rules={[{ required: true, message: "Please enter the team name!" }]}
          >
            <Input placeholder="Enter team name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamPage;
