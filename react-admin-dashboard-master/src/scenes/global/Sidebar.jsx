import { useState , useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import InsertPageBreakIcon from '@mui/icons-material/InsertPageBreak';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import DeleteForeverIcon  from '@mui/icons-material/DeleteForever';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import SpaIcon from '@mui/icons-material/Spa';
import RateReviewIcon from '@mui/icons-material/RateReview';
import profile from "../../images/profile.avif";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import styled from 'styled-components';
import './Slidebar.css';
import HRbar from "./HRbar";
import Adminbar from "./Adminbar";

const DropdownWrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: auto;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Option = styled.option``;

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const DropdownItem = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem onClick={() => setSelected(title)}>
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  // const [role, setRole] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(() => {
    // Retrieve from localStorage if available
    return localStorage.getItem('selectedAccount') || ''});
    const [accounts, setAccounts] = useState([]);

const Nav = ()=>{
  Navigate("/createaccount")
}




const role = localStorage.getItem('role');


useEffect(() => {
  const fetchAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  fetchAccounts();
}, []);



useEffect(() => {
  // Store the selectedAccount in localStorage whenever it changes
  localStorage.setItem('selectedAccount', selectedAccount);
}, [selectedAccount]);

const handleSelectChange = (e) => {
  const accountId = e.target.value;
  setSelectedAccount(accountId);
 
  Navigate("/dashboard")
};


  return (
    <div>
      {role === 'Admin' && <Adminbar />}
      {role === 'HR' && <HRbar />}
    </div>
      );
};

export default Sidebar;
