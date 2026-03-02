import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpIcon from '@mui/icons-material/Help';
import type {Page} from "../types/pages.types.ts";

export const pages: Page[] = [
    { name: 'Start', route: "/", icon: FavoriteIcon },
    { name: "Hilfe", route: "/help", icon: HelpIcon },
];