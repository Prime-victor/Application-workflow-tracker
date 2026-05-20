import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { ApplicationFormPage } from "./pages/ApplicationFormPage";
import { ApplicationListPage } from "./pages/ApplicationListPage";
import { ReviewerDecisionPage } from "./pages/ReviewerDecisionPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<ApplicationListPage />} />
        <Route path="/applications/new" element={<ApplicationFormPage />} />
        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="/applications/:id/edit" element={<ApplicationFormPage />} />
        <Route
          path="/applications/:id/decision"
          element={<ReviewerDecisionPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
