import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { CreateTrip } from "./pages/CreateTrip";
import { ItineraryBuilder } from "./pages/ItineraryBuilder";
import { BudgetAnalytics } from "./pages/BudgetAnalytics";
import { ActivitySearch } from "./pages/ActivitySearch";
import { PublicItinerary } from "./pages/PublicItinerary";
import { PackingChecklist } from "./pages/PackingChecklist";
import { UserProfile } from "./pages/UserProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "auth", Component: AuthPage },
      { path: "dashboard", Component: Dashboard },
      { path: "create-trip", Component: CreateTrip },
      { path: "itinerary/:id", Component: ItineraryBuilder },
      { path: "budget", Component: BudgetAnalytics },
      { path: "activities", Component: ActivitySearch },
      { path: "share/:id", Component: PublicItinerary },
      { path: "packing", Component: PackingChecklist },
      { path: "profile", Component: UserProfile },
    ],
  },
]);
