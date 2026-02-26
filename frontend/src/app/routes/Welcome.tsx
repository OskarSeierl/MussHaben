import React, {useState} from 'react';
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {auth, db} from '../../config/firebase.ts';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Typography} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import {useInfo} from '../../hooks/useInfo.ts';
import {doc, setDoc} from "firebase/firestore";

const Welcome: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {showError, showSuccess} = useInfo();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const credentials = await signInWithPopup(auth, provider);
            await setDoc(doc(db, 'users', credentials.user.uid), {queryCount: 0, isPremium: false});
            showSuccess("Anmeldung erfolgreich.")
            navigate('/');
        } catch (err) {
            const error = err as { code?: string; message?: string };
            showError(error.message || 'Anmeldung mit Google fehlgeschlagen. Bitte versuchen Sie es erneut.');
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5">Willkommen!</Typography>
            <Typography>Bei dem schnellsten Such-Agenten in Österreich.</Typography>
            <Button
                onClick={handleGoogleLogin}
                loading={loading}
                variant="contained"
                startIcon={<GoogleIcon/>}
                sx={{mt: 3}}
            >
                Mit Google fortfahren
            </Button>
        </Box>
    );
};

export default Welcome;

