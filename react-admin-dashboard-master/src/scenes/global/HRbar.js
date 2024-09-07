import { useState , useEffect , useContext } from "react";
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
// import { AuthContext } from "../../components/AuthContext";//



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
  // const { authData } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [selectedAccount, setSelectedAccount] = useState(localStorage.getItem('hrId'))
  const [accounts, setAccounts] = useState([]);

  const [hrName,sethrName] = useState(localStorage.getItem('hrName'));
  const [accountName,setaccountName] = useState(localStorage.getItem('accountName'));
  const [hrId,sethrId] = useState(localStorage.getItem('hrId'));
  const [hrDetails, setHrDetails] = useState([]);
  const [mobileNumber , setMobileNumber] = useState();
  const [selectedHr, setSelectedHr] = useState('');
  const [nullFields, setNullFields] = useState([]);
    // const [hrName,sethrName] = useState(sessionStorage.getItem('hrName'));

const Nav = ()=>{
  Navigate("/createaccount")
}

useEffect(() => {
  const fetchNullFields = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-null-fields/${selectedAccount}`);
      const data = await response.json();

      if (response.ok) {
        setNullFields(data.nullFields);
      } else {
        console.error('Error fetching null fields:', data.error);
      }
    } catch (error) {
      console.error('Error fetching null fields:', error);
    }
  };

  fetchNullFields();
}, [selectedAccount]);


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
  // Fetch HR details from localStorage or make an API call
  const storedHrDetails = JSON.parse(localStorage.getItem('hrDetails'));
  if (storedHrDetails) {
    setHrDetails(storedHrDetails);
    if (storedHrDetails.length > 0) {
      // Set the first HR as the default selected HR
      setSelectedHr(storedHrDetails[0].hrId);
      setSelectedAccount(storedHrDetails[0].hrId);
      sethrName(storedHrDetails[0].hrName);
      setMobileNumber(storedHrDetails[0].hrNumber);
    }
  }
}, []);

const handleSelectChange = (event) => {
  const selectedHrId = event.target.value;

  // Find the selected HR from hrDetails based on hrId
  const selectedHr = hrDetails.find((hr) => hr.hrId === selectedHrId);

  if (selectedHr) {
    const { hrId, hrName,hrNumber } = selectedHr;

    console.log('Selected HR:', selectedHr);

    // Set the selected HR ID and HR Name
    setSelectedAccount(hrId);
    sethrName(hrName);
    setMobileNumber(hrNumber);

    // Navigate to the profile page
    Navigate('/profile');
  }
};



useEffect(() => {
  // Store the selectedAccount in localStorage whenever it changes
  localStorage.setItem('selectedAccount', selectedAccount);
  localStorage.setItem('mobileNumber' , mobileNumber);
}, [selectedAccount]);
// console.log(authData)

const Logout=()=>{
  
  const confirmed = window.confirm("Are you sure you want to logout?");
  if (confirmed) {
    // Clear the user's token or session data
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // or your method of storing tokens
    localStorage.removeItem('hrName'); 
    localStorage.removeItem('accountName');
    localStorage.removeItem('hrId'); 
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('selectedAccount'); 
    localStorage.removeItem('hrDetails');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('employeeNumber');
    
    
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
              

    <div style={{display:'flex' , justifyContent:'center'}}>
          {/* <label htmlFor="hr-dropdown">Select HR:</label> */}
          <select id="hr-dropdown" onChange={handleSelectChange}>
            <option value="" disabled selected>
              Choose an HR
            </option>
            {hrDetails.map((hr) => (
              <option key={hr.hrId} value={hr.hrId}>
                {/* {hr.hrName} -  */}
                {hr.accountName}
              </option>
            ))}
          </select>
        </div>

            </Box>

          )}

         

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            

            
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

              
              
              {!nullFields.includes('liveDataSelfFile') && <Item
                title="Live Data"
                to={`/enrollment/SelfLive?accountId=${selectedAccount}`}
                icon={<ImportContactsIcon />}
                selected={selected}
                setSelected={setSelected}
              />}

              
{!nullFields.includes('liveDataFloaterFile') && <Item
                title="Live Data"
                to={`/enrollment/FloaterLive?accountId=${selectedAccount}`}
                icon={<ImportContactsIcon />}
                selected={selected}
                setSelected={setSelected}
              />}
              
        
              <Item
                title="Request E-Card"
                to="/reqestECard"
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
                to={`/endorsement/rack-rates?accountId=${selectedAccount}`}
                icon={<RateReviewIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Calculated Premium"
                to="/enrollment/premium"
                icon={<AttachMoneyIcon />}
                selected={selected}
                setSelected={setSelected}
              />

              </SubMenu>

           

            

{!nullFields.includes('claimDumpSelfFile') && <Item
                title="Claim Dump"
                to={`/claim/Selfclaimdumb?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              />}
              
              {!nullFields.includes('claimDumpFloaterFile') && <Item
                title="Claim Dump"
                to={`/claim/Floaterclaimdumb?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
              /> }
              

           

            


{!nullFields.includes('claimSelfAnalysisFile') && <Item
                title="Claim Analysis"
                to={`/claim/Selfclaimanalysis?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
            />}
            
            {!nullFields.includes('claimFloaterAnalysisFile') && <Item
                title="Claim Analysis"
                to={`/claim/Floaterclaimanalysis?accountId=${selectedAccount}`}
                icon={<CreditCardIcon />}
                selected={selected}
                setSelected={setSelected}
            />}
            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default HRbar;
