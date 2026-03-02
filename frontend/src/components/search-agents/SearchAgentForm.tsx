import React, {useState} from 'react';
import {
    Box,
    Button,
    Card,
    Checkbox,
    FormControl, FormControlLabel, FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Stack,
    TextField, Typography
} from "@mui/material";
import CategorySelector, {MAX_CATEGORY_SELECTION} from "./CategorySelector.tsx";
import {type NewQueryData} from "../../types/query.types.ts";
import {type SearchQuery, State} from "../../../../functions/src/shared/shared.types.ts";
import {Link} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth.ts";

interface Props {
    buttonText: string;
    defaultData?: SearchQuery;
    onSubmit: (data: NewQueryData) => void;
}

export const SearchAgentForm: React.FC<Props> = ({buttonText, defaultData, onSubmit}: Props) => {
    const {userData} = useAuth();

    const [formData, setFormData] = useState<NewQueryData>(defaultData || {
        name: "",
        categories: [],
        keyword: "",
        state: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        specificRequest: false
    });

    const handleCategoryChange = (categories: number[]) => {
        setFormData(prev => ({
            ...prev,
            categories
        }));
    };

    const handleStateChange = (event: SelectChangeEvent<State>) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            state: value
        }));
    };

    const handleInputChange = <K extends keyof NewQueryData>(
        field: K,
        format: (value: string) => NewQueryData[K]
    ) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        const formDataCopy: NewQueryData = {...formData};
        if (value.length === 0) {
            formDataCopy[field] = undefined as NewQueryData[K];
        } else {
            formDataCopy[field] = format(value);
        }
        setFormData(formDataCopy);
    };

    const handleSpecificRequestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setFormData(prev => ({
            ...prev,
            specificRequest: checked
        }));
    }

    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
        onSubmit(formData);
    };

    const isFormValid = formData.categories.length > 0
        && formData.categories.length <= MAX_CATEGORY_SELECTION
        && (formData.minPrice || 0) >= 0
        && (formData.minPrice || 0) <= (formData.maxPrice || Number.MAX_SAFE_INTEGER);

    return (
        <Card elevation={2} sx={{p: 3}}>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        label="Name"
                        placeholder="z.B. Traumtisch, Elektronik Schnäppchen..."
                        value={formData.name}
                        onChange={handleInputChange('name', (val) => val)}
                        fullWidth
                        inputProps={{maxLength: 32}}
                    />
                    <CategorySelector
                        value={formData.categories}
                        onChange={handleCategoryChange}
                    />
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                        <TextField
                            label="Suchbegriff"
                            placeholder="z.B. iPhone, Wohnung, Auto..."
                            value={formData.keyword}
                            onChange={handleInputChange('keyword', (val) => val)}
                            helperText="Optional: Geben Sie einen Suchbegriff ein"
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel id="select-state-input-label">Bundesland</InputLabel>
                            <Select
                                labelId="select-state-input-label"
                                value={formData.state ?? ''}
                                label="Bundesland"
                                onChange={handleStateChange}
                                variant="outlined"
                            >
                                <MenuItem value={State.WIEN}>Wien</MenuItem>
                                <MenuItem value={State.NIEDEROESTERREICH}>Niederösterreich</MenuItem>
                                <MenuItem value={State.OBEROESTERREICH}>Oberösterreich</MenuItem>
                                <MenuItem value={State.BURGENLAND}>Burgenland</MenuItem>
                                <MenuItem value={State.STEIERMARK}>Steiermark</MenuItem>
                                <MenuItem value={State.VORARLBERG}>Vorarlberg</MenuItem>
                                <MenuItem value={State.TIROL}>Tirol</MenuItem>
                                <MenuItem value={State.KAERNTEN}>Kärnten</MenuItem>
                                <MenuItem value={State.SALZBURG}>Salzburg</MenuItem>
                            </Select>
                            <FormHelperText>Optional</FormHelperText>
                        </FormControl>
                    </Stack>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                        <TextField
                            label="Mindestpreis"
                            type="number"
                            placeholder="z.B. 100"
                            value={formData.minPrice ?? ''}
                            onChange={handleInputChange('minPrice', (val) => Number(val))}
                            fullWidth
                            slotProps={{
                                htmlInput: {min: 0}
                            }}
                            helperText="Optional"
                        />

                        <TextField
                            label="Höchstpreis"
                            type="number"
                            placeholder="z.B. 1000"
                            value={formData.maxPrice ?? ''}
                            onChange={handleInputChange('maxPrice', (val) => Number(val))}
                            fullWidth
                            slotProps={{
                                htmlInput: {min: 0}
                            }}
                            helperText="Optional"
                        />
                    </Stack>

                    <FormControlLabel
                        value="end"
                        control={
                            <Checkbox checked={formData.specificRequest} onChange={handleSpecificRequestChange} />
                        }
                        label={<Typography>Spezifische Abfrage verwenden (siehe <Link to="/help">Hilfe</Link>)</Typography>}
                        labelPlacement="end"
                        disabled={!userData?.isPremium}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!isFormValid}
                        fullWidth
                    >
                        {buttonText}
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
};
