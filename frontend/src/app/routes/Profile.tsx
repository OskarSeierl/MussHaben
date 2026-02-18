import React from 'react';
import {useNavigate} from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth} from '../../config/firebase.ts';
import {useAuth} from "../../hooks/useAuth.ts";
import {useInfo} from "../../hooks/useInfo.ts";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Stack,
    Paper,
    Chip
} from "@mui/material";
import {
    Email as EmailIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Fingerprint as FingerprintIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import packageJson from '../../../package.json';

const Profile: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {showError} = useInfo();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/welcome');
        } catch (error) {
            showError(`Abmelden fehlgeschlagen: ${error}.`);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h4" >Profil</Typography>

            <Card elevation={2}>
                <CardContent>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{mb: 3}}>
                        <Avatar
                            src={user.photoURL || undefined}
                            alt={user.displayName || 'User'}
                            sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid',
                                borderColor: 'primary.main',
                                boxShadow: 2
                            }}
                        >
                            {!user.photoURL && <AccountCircleIcon sx={{fontSize: 60}}/>}
                        </Avatar>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="h5" gutterBottom>
                                {user.displayName || 'Benutzer'}
                            </Typography>
                            <Chip
                                label="Aktiv"
                                color="success"
                                size="small"
                                sx={{fontWeight: 500}}
                            />
                        </Box>
                    </Stack>

                    <Divider sx={{my: 2}}/>

                    <Typography variant="h6">
                        Persönliche Informationen
                    </Typography>

                    <List>
                        {[
                            {
                                label: 'E-Mail',
                                value: user.email,
                                icon: EmailIcon,
                                show: !!user.email
                            },
                            {
                                label: 'Name',
                                value: user.displayName,
                                icon: PersonIcon,
                                show: !!user.displayName
                            },
                            {
                                label: 'Telefon',
                                value: user.phoneNumber,
                                icon: PhoneIcon,
                                show: !!user.phoneNumber
                            },
                            {
                                label: 'Benutzer-ID',
                                value: user.uid,
                                icon: FingerprintIcon,
                                show: true,
                                monospace: true
                            }
                        ].filter(item => item.show).map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <IconComponent color="action"/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="text.secondary">
                                                {item.label}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant={item.monospace ? "body2" : "body1"}
                                                color="text.primary"
                                                sx={item.monospace ? {fontFamily: 'monospace', fontSize: '0.85rem'} : {}}
                                            >
                                                {item.value}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </CardContent>
            </Card>

            {/* Actions Card */}
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" gutterBottom >
                        Aktionen
                    </Typography>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon/>}
                        onClick={handleLogout}
                        size="large"
                    >
                        Abmelden
                    </Button>
                </CardContent>
            </Card>

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    textAlign: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Willhaben Advanced Search Agent
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Version {packageJson.version}
                </Typography>
            </Paper>
        </Stack>
    );
};

export default Profile;

