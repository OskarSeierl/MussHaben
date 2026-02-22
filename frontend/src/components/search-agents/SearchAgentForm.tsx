import React, {useState} from 'react';
import {Box, Button, Card, Stack, TextField} from "@mui/material";
import CategorySelector from "./CategorySelector.tsx";
import type {NewQueryData, SavedSearchQuery} from "../../types/query.types.ts";

interface Props {
    buttonText: string;
    defaultData?: SavedSearchQuery;
    onSubmit: (data: NewQueryData) => void;
}

export const SearchAgentForm: React.FC<Props> = ({buttonText, defaultData, onSubmit}: Props) => {
    const [formData, setFormData] = useState<NewQueryData>(defaultData || {
        category: 0,
        keyword: '',
        minPrice: undefined,
        maxPrice: undefined,
    });

    const handleCategoryChange = (categoryId: number | null) => {
        setFormData(prev => ({
            ...prev,
            category: categoryId || 0
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
        if(value.length === 0) {
            formDataCopy[field] = undefined as NewQueryData[K];
        } else {
            formDataCopy[field] = format(value);
        }
        setFormData(formDataCopy);
    };

    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
        onSubmit(formData);
    };

    const isFormValid = formData.category > 0
        && (formData.minPrice || 0) >= 0
        && (formData.minPrice || 0) <= (formData.maxPrice || Number.MAX_SAFE_INTEGER);

    return (
        <Card elevation={2} sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <CategorySelector
                        value={formData.category}
                        onChange={handleCategoryChange}
                    />
                    <TextField
                        label="Suchbegriff"
                        placeholder="z.B. iPhone, Wohnung, Auto..."
                        value={formData.keyword}
                        onChange={handleInputChange('keyword', (val) => val)}
                        fullWidth
                        helperText="Optional: Geben Sie einen Suchbegriff ein"
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Mindestpreis"
                            type="number"
                            placeholder="z.B. 100"
                            value={formData.minPrice ?? ''}
                            onChange={handleInputChange('minPrice', (val) => Number(val))}
                            fullWidth
                            slotProps={{
                                htmlInput: { min: 0 }
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
                                htmlInput: { min: 0 }
                            }}
                            helperText="Optional"
                        />
                    </Stack>

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

