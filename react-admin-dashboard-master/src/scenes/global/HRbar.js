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

const HRbar = () => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [selectedAccount, setSelectedAccount] = useState(sessionStorage.getItem('hrId'))
  const [accounts, setAccounts] = useState([]);

  const [hrName,sethrName] = useState(sessionStorage.getItem('hrName'));
  const [accountName,setaccountName] = useState(sessionStorage.getItem('accountName'));
  const [hrId,sethrId] = useState(sessionStorage.getItem('hrId'));
    // const [hrName,sethrName] = useState(sessionStorage.getItem('hrName'));

const Nav = ()=>{
  Navigate("/createaccount")
}



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

const Logout=()=>{
  
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    // Clear the user's token or session data
    localStorage.removeItem('token'); // or your method of storing tokens
    // Navigate to the login or home page after logout
    sessionStorage.clear();
    Navigate("/"); // or wherever you want to redirect after logout
  }
  
  
}




  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
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
      <ProSidebar collapsed={isCollapsed} style={{width:'100px'}}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
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
                <Typography variant="h3" style={{color:'white' , fontWeight:'600'}}>
                  HR 
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} style={{color:"white"}}>
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

                <button className="btn btn-danger mt-3" style={{textAlign:'center' ,margin:'auto' , display:'flex'}} onClick={Logout}>Logout</button>

              <Box textAlign="center">
                <Typography
                  variant="h2"
                  style={{color:"white"}}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  
                 {hrName}
                 
                </Typography>
              </Box>
              {/* <Button style={{backgroundColor:'red' , color:'White', fontWeight:'600' , marginLeft:'45px'}} className="mt-3" onClick={Nav}>Create Account</Button> */}
              {/* <DropdownWrapper style={{ width: '70%', display: 'flex', margin: '0px', alignItems: 'center', gap: '5px', padding: '5px' , marginLeft:'45px' , background:'' }} className="mt-3">
        
        <Select
          id="account-select"
          value={selectedAccount}
          onChange={handleSelectChange}
        >
          <Option value="">--Select an Account--</Option>
          {accounts.map((account) => (
            <Option key={account._id} value={account._id}>
              {account.accountName}
            </Option>
          ))}
        </Select>
      </DropdownWrapper> */}

    <div style={{color:'white' , textAlign:'center' , fontSize:'17px'}} className="mt-3">

    {accountName}

    </div>
            </Box>

          )}

         

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Item
              title="Create Account"
              to="/createaccount"
              icon={<FolderSharedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            
            <Item
              title="Profile"
              to="/profile"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />



            <Item
              title="Policy Coverage"
              to={`/policycoverage?accountId=${selectedAccount}`}
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Enrollments with Dropdown */}
            <SubMenu
              title="Enrollments"
              icon={<InsertPageBreakIcon />}
            >

          <SubMenu
                title="Live Data"
                to={`/enrollment/live`}
                icon={<ImportContactsIcon />}
                selected={selected}
                setSelected={setSelected}
              >
              
              <Item
                title="Self With Parents"
                to={`/enrollment/SelfLive?accountId=${selectedAccount}`}
                icon={<ImportContactsIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            <Item
                title="Floater With Parents"
                to={`/enrollment/FloaterLive?accountId=${selectedAccount}`}
                icon={<ImportContactsIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              </SubMenu>
              
              <SubMenu
                title="Deleted Data"
                to="/enrollment/deleted"
                icon={<DeleteForeverIcon />}
                selected={selected}
                setSelected={setSelected}
              >

                <Item title="Self With Parents"
                to={`enrollment/deleted/self?accountId=${selectedAccount}`}
                icon={< ControlPointIcon />}
                selected={selected}
                setSelected={setSelected}
                />
                <Item title="Floater With Parents"
                to={`enrollment/deleted/floater?accountId=${selectedAccount}`}
                icon={< ControlPointIcon />}
                selected={selected}
                setSelected={setSelected}
                />

                </SubMenu>
              
              <Item
                title="Calculated Premium"
                to="/enrollment/premium"
                icon={<AttachMoneyIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              
              <Item
                title="E-Card"
                to="/profile"
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <SubMenu
                title="Endorsement"
                to="/enrollment/endorsement"
                icon={<BeenhereIcon />}
                selected={selected}
                setSelected={setSelected}
              >

              <Item
                title="Addition"
                to={`/Addition?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Deletion"
                to={`/Deletion?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="CD Statement"
                to={`/CDStatement?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Rack-Rates"
                to="/enrollement/rack-rates"
                icon={<RateReviewIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              </SubMenu>

           

            <SubMenu
              title="Claim Dump"
              icon={<MiscellaneousServicesIcon />}
            >

              <Item
                title="Self With Parents"
                to={`/claim/Selfclaimdumb?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Floater With Parents"
                to={`/claim/Floaterclaimdumb?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />

            </SubMenu>

            <SubMenu
              title="Claim Analysis"
              icon={<MiscellaneousServicesIcon />}
            >

            <Item
                title="Self With Parents"
                to={`/claim/Selfclaimanalysis?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
            />

            <Item
                title="Floater With Parents"
                to={`/claim/Floaterclaimanalysis?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
            />

            </SubMenu>

            

            {/* <Item
              title="Downloads"
              to="/downloads"
              icon={<SimCardDownloadIcon />}
              selected={selected}
              setSelected={setSelected}
            />  */}

            <Item
              title="Wellness"
              to="/wellness"
              icon={<SpaIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            {/* <Typography
              variant="h6"
              style={{color:"white" , fontSize:'17px', fontWeight:600}}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default HRbar;
