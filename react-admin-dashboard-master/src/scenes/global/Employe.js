import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import SpaIcon from '@mui/icons-material/Spa';
import "react-pro-sidebar/dist/css/styles.css";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import profile from "../../images/profile.avif";
import "./Slidebar.css";

const Employe = () => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [selectedAccount, setSelectedAccount] = useState(() => {
    return localStorage.getItem("selectedAccount") || "";
  });
  const [accounts, setAccounts] = useState([]);
  const [navigateToPolicyCoverage, setNavigateToPolicyCoverage] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/accounts");
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem("selectedAccount", selectedAccount);
      if (navigateToPolicyCoverage) {
        Navigate(`/policycoverage?accountId=${selectedAccount}`);
        setNavigateToPolicyCoverage(false); // Reset the flag
      }
    }
  }, [selectedAccount, navigateToPolicyCoverage, Navigate]);

  const handlePolicyCoverageClick = () => {
    const account = localStorage.getItem("selectedAccount");
    if (account) {
      Navigate(`/policycoverage?accountId=${account}`);
    } else {
      setNavigateToPolicyCoverage(true); // Set flag to trigger navigation after account is set
    }
  };

  const handleProfileClick = () => {
    Navigate("/profile");
  };

  const handleWellNess=()=>{
    Navigate("/wellness");
  }

  const Logout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.clear();
      sessionStorage.clear();
      Navigate("/");
    }
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme.palette.primary.main} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} style={{ width: "100px" }}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: "white",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  style={{ color: "white", fontWeight: "600" }}
                >
                  Employee
                </Typography>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  style={{ color: "white" }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={profile}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <button
                className="btn btn-danger mt-3"
                style={{
                  textAlign: "center",
                  margin: "auto",
                  display: "flex",
                }}
                onClick={Logout}
              >
                Logout
              </button>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <MenuItem
              icon={<PeopleOutlinedIcon />}
              onClick={handleProfileClick}
              style={{
                color: selected === "Profile" ? "#6870fa" : "white",
              }}
            >
              Profile
            </MenuItem>

            <MenuItem
              icon={<ContactsOutlinedIcon />}
              onClick={handlePolicyCoverageClick}
              style={{
                color: selected === "Policy Coverage" ? "#6870fa" : "white",
              }}
            >
              Policy Coverage
            </MenuItem>

            {/* <MenuItem
            icon={<SpaIcon />}
            onClick={handleWellNess}
            >
              Wellness
              </MenuItem> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Employe;
