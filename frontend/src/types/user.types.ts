import type {User} from "firebase/auth";

export interface UserData {
    fcmToken: string;
    isPremium: boolean;
    queryCount: number;
}

export interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
}