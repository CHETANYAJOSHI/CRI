
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "../src/components/LoginPage/Login";
import EnrollmentLive from "./scenes/invoices/EnvrollmentLive/EnrollmentLive";
import DeletedData from "./scenes/invoices/DeletedData/DeletedData";
import Endorsement from "./scenes/invoices/Endorsement/Endorsement";
import Premium from "./scenes/invoices/Premium/Premium";
import ClaimDumb from "./scenes/Claim/ClaimDumb/ClaimDumb";
import ClaimAnalysis from "./scenes/Claim/ClaimAnalysis/ClaimAnalysis";
import Downloads from "./components/Downloads/Downloads";
import Wellness from "./components/Wellness/Wellness";
import FloaterDeleted from "./scenes/invoices/DeletedData/FloaterDeleted";
import RackRates from "./scenes/Rackrates/RackRates";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import SelectAccount from "./components/SelectAccount/SelectAccount";
import FloaterLive from "./scenes/invoices/FloaterLive/FloaterLive";
import FloaterClaimDump from "./scenes/Claim/ClaimDumb/FloaterClaimDump";
import FloaterClaimAnalysis from "./scenes/Claim/ClaimAnalysis/FloaterClaimAnalysis";
import CDstatement from "./scenes/invoices/Endorsement/CDstatement";
import SelfPolicy from "./scenes/contacts/SelfPolicy";
import FolaterPolicy from "./scenes/contacts/FolaterPolicy";
import Addition from "./scenes/Endorsement/Addition";
import Deletion from "./scenes/Endorsement/Deletion";
import PrivateRoute from "./components/PrivateRoute";
import SelfFloaterCreate from "./components/CreateAccount/SelfFloaterCreate";
import { AuthProvider } from "./components/AuthContext";
import Profile from "./scenes/team/Profile";
import RequestECard from "./components/RequestECard/RequestECard";
import BulkRequest from "./components/RequestECard/BulkRequest";
import EmployeeRequest from "./components/RequestECard/EmployeeRequest";
import NotificationPage from "./components/Notification/NotificationPage";
import DefaultAccount from "./components/CreateAccount/DefaultAccount";
import Request from "./components/Notification/Request";
import FloaterInactiveData from "./scenes/invoices/FloaterLive/FloaterInactiveData";
import CalimIntimation from "./components/ClaimIntimation";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const URL = process.env.REACT_APP_URL;
  // List of paths where you want to hide the sidebar
  const noSidebarPaths = ["/"];

  console.log(URL);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!noSidebarPaths.includes(location.pathname) && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!noSidebarPaths.includes(location.pathname) && <Topbar setIsSidebar={setIsSidebar} />}
            <AuthProvider>
            <Routes>
            {/* <Route
                path="/SelfFloaterCreate"
                element={
                  <PrivateRoute>
                    <SelfFloaterCreate />
                  </PrivateRoute>
                }/> */}

              {/* <Route
                path="/createaccount"
                element={
                  <PrivateRoute>
                    <CreateAccount />
                  </PrivateRoute>
                }/> */}
               <Route path="/claimIntimation" element={<CalimIntimation />} />
              <Route path="/CreateAccount" element={<PrivateRoute>
                  <DefaultAccount />
                  </PrivateRoute>} />
              <Route path="/notification" element={<Request />} />
              <Route path="/bulkRequest" element={<BulkRequest />} />
              <Route path="/EmployeeRequest" element={<EmployeeRequest />} />
              <Route path="/reqestECard" element={<RequestECard />} />
              <Route path="/selectAccount" element={<SelectAccount />} />
              <Route path="/policycoverage/selfPolicy" element={<SelfPolicy />} />
              <Route path="/policycoverage/floaterPolicy" element={<FolaterPolicy />} />
              <Route path="/claim/Selfclaimanalysis" element={<ClaimAnalysis />} />
              <Route path="/claim/Floaterclaimanalysis" element={<FloaterClaimAnalysis />} />
              <Route path="/claim/Selfclaimdumb" element={<ClaimDumb />} />
              <Route path="/claim/Floaterclaimdumb" element={<FloaterClaimDump />} />
              <Route path="/CDStatement" element={<CDstatement />} />
              <Route path="/downloads" element={<Downloads/>} />
              <Route path="/enrollment/SelfLive" element={<EnrollmentLive />} />
              <Route path="/enrollment/FloaterLive" element={<FloaterLive />} />
              <Route path="/enrollment/InactiveFloaterData" element={<FloaterInactiveData/>} />
              <Route path="/endorsement/rack-rates" element={<RackRates />} />
              <Route path="/enrollment/premium" element={<Premium />} />
              <Route path="/enrollment/endorsement" element={<Endorsement />} />
              <Route path="/enrollment/deleted/self" element={<DeletedData />} />
              <Route path="/enrollment/deleted/floater" element={<FloaterDeleted />} />
              <Route path="/" element={<Login />} />
              <Route path="/Addition" element={<Addition />} />
              <Route path="/Deletion" element={<Deletion />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/dashboard"  element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }/>
              <Route path="/profile" element={<Profile />} />
              <Route path="/policycoverage" element={<Contacts />} />
              <Route path="/enrollment" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
            </AuthProvider>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
