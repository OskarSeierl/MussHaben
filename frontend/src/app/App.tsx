import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {ProtectedRoute} from '../components/guards/ProtectedRoute.tsx';
import Welcome from './routes/Welcome.tsx';
import Home from './routes/Home.tsx';
import {AuthProvider} from "../context/AuthProvider.tsx";
import {InfoProvider} from "../context/InfoProvider.tsx";
import {MainLayout} from "../components/layouts/MainLayout.tsx";
import {SmallCenterLayout} from "../components/layouts/SmallCenterLayout.tsx";
import Profile from './routes/Profile.tsx';
import {NotificationRoute} from "../components/middleware/NotificationRoute.tsx";
import SearchAgents from "./routes/SearchAgents.tsx";
import NewSearchAgent from "./routes/NewSearchAgent.tsx";
import EditSearchAgent from "./routes/EditSearchAgent.tsx";
import SearchAgent from "./routes/SearchAgent.tsx";
import {QueryIdExists} from "../components/guards/QueryIdExists.tsx";
import {UserQueriesProvider} from "../context/UserQueriesProvider.tsx";
import {CategoriesProvider} from "../context/CategoriesProvider.tsx";
import Help from "./routes/Help.tsx";

function App() {
    return (
        <Router>
            <InfoProvider>
                <AuthProvider>
                    <Routes>
                        <Route element={<SmallCenterLayout/>}>
                            <Route path="/welcome" element={<Welcome/>}/>
                        </Route>
                        <Route element={<MainLayout/>}>
                            <Route element={<ProtectedRoute/>}>
                                <Route element={<NotificationRoute/>}>
                                    <Route element={<UserQueriesProvider/>}>
                                        <Route element={<CategoriesProvider/>}>
                                            <Route path="/" element={<Home/>}/>
                                            <Route path="/search-agents">
                                                <Route path="" element={<SearchAgents/>}/>
                                                <Route path="new" element={<NewSearchAgent/>}/>
                                                <Route element={<QueryIdExists/>}>
                                                    <Route path=":searchAgentId">
                                                        <Route path="" element={<SearchAgent/>}/>
                                                        <Route path="edit" element={<EditSearchAgent/>}/>
                                                    </Route>
                                                </Route>
                                            </Route>
                                        </Route>
                                    </Route>
                                    <Route path="/help" element={<Help/>}/>
                                    <Route path="/profile" element={<Profile/>}/>
                                </Route>
                            </Route>
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </AuthProvider>
            </InfoProvider>
        </Router>
    );
}

export default App;
