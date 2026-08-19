import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/NotFound";
import Modules from "@/pages/Modules";
import About from "@/pages/About";
import Partners from "@/pages/Partners";
import { Redirect, Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CaseStudies from "@/pages/CaseStudies";
import NewsEvents from "@/pages/NewsEvents";
import Team from "@/pages/Team";
import Careers from "@/pages/Careers";
import Blog from "@/pages/Blog";
import ContactUs from "@/pages/ContactUs";
import Faq from "@/pages/Faq";
import CaseStudySutures from "@/pages/CaseStudySutures";
import CaseStudyBidhannagar from "@/pages/CaseStudyBidhannagar";
import CaseStudyKauvery from "@/pages/CaseStudyKauvery";
import CaseStudyStateInsurance from "@/pages/CaseStudyStateInsurance";
import CaseStudyOckham from "@/pages/CaseStudyOckham";
import CaseStudyKSBC from "@/pages/CaseStudyKSBC";
import CaseStudyMetro from "@/pages/CaseStudyMetro";
import PackageSetup from "@/pages/PackageSetup";

const APP_BASE_PATH =
  import.meta.env.VITE_APP_BASE_PATH || "/axi-global/AxiPortal";

function AppRouter() {
  return (
    <WouterRouter base={APP_BASE_PATH}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/modules"} component={Modules} />
        <Route path={"/packages/setup"} component={PackageSetup} />
        <Route path={"/packages"}>
          <Redirect to={"/packages/setup"} />
        </Route>
        <Route path={"/about"} component={About} />
        <Route path={"/about-us"} component={About} />
        <Route path={"/partners"} component={Partners} />
        <Route path={"/case-studies"} component={CaseStudies} />
        <Route
          path={"/case-studies/axpert-healthcare-manufacturing"}
          component={CaseStudySutures}
        />
        <Route
          path={"/case-studies/bidhannagar-commissionerate"}
          component={CaseStudyBidhannagar}
        />
        <Route
          path={"/case-studies/kauvery-group-of-hospitals"}
          component={CaseStudyKauvery}
        />
        <Route
          path={"/case-studies/state-insurance-provident-fund"}
          component={CaseStudyStateInsurance}
        />
        <Route
          path={"/case-studies/axpert_ockham-oncology"}
          component={CaseStudyOckham}
        />
        <Route
          path={"/case-studies/karnataka-state-beverages"}
          component={CaseStudyKSBC}
        />
        <Route
          path={"/case-studies/axpert-metro-rail"}
          component={CaseStudyMetro}
        />
        <Route path={"/news-events"} component={NewsEvents} />
        <Route path={"/team"} component={Team} />
        <Route path={"/careers"} component={Careers} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/contact-us"} component={ContactUs} />
        <Route path={"/faq"} component={Faq} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

import { AuthModalProvider } from "./contexts/AuthContext";
import AuthModal from "./components/AuthModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthModalProvider>
              <Toaster />
              <AppRouter />
              <AuthModal />
            </AuthModalProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
