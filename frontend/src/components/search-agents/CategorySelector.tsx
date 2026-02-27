import React, {useMemo} from 'react';
import {Alert, Autocomplete, Box, CircularProgress, createFilterOptions, TextField} from "@mui/material";
import {useCategories} from "../../hooks/useCategories";
import {useInfo} from "../../hooks/useInfo.ts";
import type {CategoryOption} from "../../types/category.types.ts";

const AUTOCOMPLETE_MATCHES_LIMIT = 70;
export const MAX_CATEGORY_SELECTION = 3;

interface Props {
    value: number[];
    onChange: (categoryIds: number[]) => void;
}

const CategorySelector: React.FC<Props> = ({ value, onChange }) => {
  const { categories, loading, error } = useCategories();

  const {showError} = useInfo();

  const autoCompleteOptions = useMemo(() => {
    return categories.map(category => ({
        label: category.name,
        id: category.id
    }));
  }, [categories]);

  const selectedOption = useMemo(() => {
    if (!value || value.length === 0) return [];
    return autoCompleteOptions.filter(option => value.includes(option.id));
  }, [value, autoCompleteOptions]);

  if (error) {
    showError(`Fehler beim Laden der Kategorien: ${error.message}`);
    return (
      <Alert severity="error">
        Fehler beim Laden der Kategorien: {error.message}
      </Alert>
    );
  }

  return (
      <Autocomplete
          multiple={true}
          loading={loading}
          value={selectedOption}
          onChange={(_, newValue: CategoryOption[]) => {
              // Limit selection to MAX_CATEGORY_SELECTION
              if (newValue.length > MAX_CATEGORY_SELECTION) {
                  return; // Don't allow selection beyond the limit
              }
              const categoryIds = newValue.map(option => option.id);
              onChange?.(categoryIds);
          }}
          filterOptions={createFilterOptions({
              ignoreCase: true,
              ignoreAccents: true,
              limit: AUTOCOMPLETE_MATCHES_LIMIT
          })}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label="Kategorie"
                  helperText={<>
                      Suchen Sie nach einer Kategorie und wählen Sie sie.
                      Es werden maximal {AUTOCOMPLETE_MATCHES_LIMIT} Ergebnisse angezeigt.
                      <Box
                          component="span"
                          sx={{color: value.length >= MAX_CATEGORY_SELECTION ? "error.main" : undefined}}
                      >
                          (Ausgewählt: {value.length}/{MAX_CATEGORY_SELECTION})
                      </Box>
                  </>}
                  slotProps={{
                      input: {
                          ...params.InputProps,
                          endAdornment: (
                              <React.Fragment>
                                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                              </React.Fragment>
                          ),
                      },
                  }}
              />
          )}
          groupBy={(option) => option.label.split("/")[0]} // Group by top-level category
          options={autoCompleteOptions}
      />
  );
};

export default CategorySelector;
