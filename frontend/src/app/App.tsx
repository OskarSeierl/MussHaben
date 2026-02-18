import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {ProtectedRoute} from '../components/guards/ProtectedRoute.tsx';
import Login from './routes/Login.tsx';
import Home from './routes/Home.tsx';
import {AuthProvider} from "../context/AuthProvider.tsx";
import {MainLayout} from "../components/layouts/MainLayout.tsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route element={<MainLayout/>}>
                        <Route element={<ProtectedRoute/>}>
                            <Route path="/" element={<Home/>}/>
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
