import React, {useMemo} from 'react';
import {Alert, Autocomplete, CircularProgress, createFilterOptions, TextField} from "@mui/material";
import {useCategories} from "../../hooks/useCategories";
import {useInfo} from "../../hooks/useInfo.ts";
import type {CategoryOption} from "../../types/category.types.ts";

const AUTOCOMPLETE_MATCHES_LIMIT = 70;

interface Props {
    value?: number;
    onChange?: (categoryId: number | null) => void;
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
    if (!value) return null;
    return autoCompleteOptions.find(option => option.id === value) || null;
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
          loading={true}
          value={selectedOption}
          onChange={(_, newValue: CategoryOption | null) => {
              onChange?.(newValue?.id || null);
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
                  helperText={`Suchen Sie nach einer Kategorie und wählen Sie sie. Es werden maximal ${AUTOCOMPLETE_MATCHES_LIMIT} Ergebnisse angezeigt.`}
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
