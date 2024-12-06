"use client";
import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { getPopulatedTeams } from "../../../data/team_data";
import { getPopulatedPlayers } from "../../../data/player_data";
import { Form, Button, Modal, Input, Popconfirm, message, Table, Card, Typography, Space } from "antd";

const { Title, Text } = Typography;

const TeamInfoPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [players, setPlayers] = useState([]);
  const { entityId } = useParams();

  const team = useMemo(() => {
    return getPopulatedTeams().find((team) => team.entityId === entityId);
  }, [entityId]);

useEffect(() => {
  if (team) {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const teamPlayers = storedPlayers.filter((player) => player.entityId === team.entityId);

    if (teamPlayers.length > 0) {
      setPlayers(teamPlayers);
    } else {
      const allPlayers = getPopulatedPlayers();
      const initialTeamPlayers = allPlayers.filter((player) => player.entityId === team.entityId);
      setPlayers(initialTeamPlayers);

      // Initialize localStorage if not present
      localStorage.setItem("players", JSON.stringify(allPlayers));
    }
  }
}, [team]);

const updatePlayers = (newPlayers) => {
  setPlayers(newPlayers);

  const allPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const updatedPlayers = [
    ...allPlayers.filter((player) => player.entityId !== team.entityId), 
    ...newPlayers
  ];

  localStorage.setItem("players", JSON.stringify(updatedPlayers));
};


  const handleAddPlayer = () => {
    form
      .validateFields()
      .then((values) => {
        const newPlayer = {
          personId: uuidv4(),
          personName: values.personName,
          bib: values.bib,
          entityId: team.entityId,
          personImage:
            "https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg",
        };
        updatePlayers([...players, newPlayer]);
        form.resetFields();
        setModalVisible(false);
        message.success("Player added successfully!");
      })
      .catch((err) => console.error("Validation error:", err));
  };

  const handleDeletePlayer = (playerId) => {
    const updatedPlayers = players.filter((player) => player.personId !== playerId);
    updatePlayers(updatedPlayers);
    message.success("Player deleted successfully!");
  };

  const columns = [
    {
      title: "#",
      dataIndex: "bib",
      key: "bib",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Photo",
      dataIndex: "personImage",
      key: "personImage",
      align: "center",
      render: (image) => (
        <img
          src={image}
          alt="Player"
          style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "personName",
      key: "personName",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this player?"
          onConfirm={() => handleDeletePlayer(record.personId)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (!team) {
    return (
      <div style={{ height: "94vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography.Text type="danger">Team not found</Typography.Text>
      </div>
    );
  }

  return (
    <div className="dark-theme" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Card bordered={false}         
      style={{
          marginBottom: "2rem",
          background: "#112240",
          color: "#E0E5E9",
          borderRadius: "8px",
        }}>
        <Space direction="vertical" size="small" style={{ textAlign: "center", width: "100%" }}>
          <img
            src={team.logo}
            alt={`${team.name} Logo`}
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: "1rem" }}
          />
          <Title level={2}  style={{ margin: 0, color: "#E0E5E9" }}>{team.name}</Title>
        </Space>
      </Card>

      <Card bordered={false} 
      style={{ 
          marginBottom: "1rem",          
          background: "#112240",
          color: "#E0E5E9",
          borderRadius: "8px"
        }}>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Title level={4}  style={{ margin: 0, color: "#E0E5E9" }}>Players</Title>
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Add Player
          </Button>
        </div>
        <Table
          dataSource={players}
          columns={columns}
          rowKey="personId"
          pagination={false}
          className= "custom-dark-table"
          style={{
            borderRadius: "8px",
          }}
        />
      </Card>

      <Modal
        title="Add New Player"
        visible={isModalVisible}
        onOk={handleAddPlayer}
        onCancel={() => setModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
        className="custom-dark-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="personName"
            label="Player Name"
            rules={[{ required: true, message: "Please enter the player's name!" }]}
          >
            <Input placeholder="Enter player's name" />
          </Form.Item>
          <Form.Item
            name="bib"
            label="Player Number"
            rules={[{ required: true, message: "Please enter the player's number!" }]}
          >
            <Input placeholder="Enter player's number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamInfoPage;
