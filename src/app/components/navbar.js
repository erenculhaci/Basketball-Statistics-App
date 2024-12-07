import { TeamOutlined, PlaySquareFilled } from "@ant-design/icons";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  {
    label: "Matches",
    key: "matches",
    icon: <PlaySquareFilled />,
    path: "/",
  },
  {
    label: "Teams",
    key: "teams",
    icon: <TeamOutlined />,
    path: "/team-management",
  },
];

export const Sidebar = () => {
  const [activeKey, setActiveKey] = useState("matches");
  const router = useRouter();

  const handleMenuClick = ({ key }) => {
    const selectedItem = menuItems.find((item) => item.key === key);
    if (selectedItem) {
      setActiveKey(key);
      router.push(selectedItem.path);
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const matchedItem = menuItems.find((item) => item.path === currentPath);
    if (matchedItem) {
      setActiveKey(matchedItem.key);
    }
  }, []);

  return (
    <Menu
      onClick={handleMenuClick}
      selectedKeys={[activeKey]}
      mode="horizontal"
      items={menuItems}
      theme="dark"
    />
  );
};
