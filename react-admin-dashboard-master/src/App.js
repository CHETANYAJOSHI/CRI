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

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // List of paths where you want to hide the sidebar
  const noSidebarPaths = ["/"];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!noSidebarPaths.includes(location.pathname) && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!noSidebarPaths.includes(location.pathname) && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/selectAccount" element={<SelectAccount />} />
              <Route path="/claim/claimanalysis" element={<ClaimAnalysis />} />
              <Route path="/claim/claimdumb" element={<ClaimDumb />} />
              <Route path="/downloads" element={<Downloads/>} />
              <Route path="/enrollment/live" element={<EnrollmentLive />} />
              <Route path="/enrollement/rack-rates" element={<RackRates />} />
              <Route path="/enrollment/premium" element={<Premium />} />
              <Route path="/enrollment/endorsement" element={<Endorsement />} />
              <Route path="/enrollment/deleted/self" element={<DeletedData />} />
              <Route path="/enrollment/deleted/floater" element={<FloaterDeleted />} />
              <Route path="/" element={<Login />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Team />} />
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
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
