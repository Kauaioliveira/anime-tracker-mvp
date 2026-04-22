import Autocomplete from '@mui/material/Autocomplete'
import {
  Box,
  Button,
  InputAdornment,
  SvgIcon,
  TextField,
  type SvgIconProps,
} from '@mui/material'
import type { SearchMode } from '../../types/searchMode.ts'

type SearchBarProps = {
  mode: SearchMode
  onModeChange: (mode: SearchMode) => void
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

type ModeOption = {
  id: SearchMode
  label: string
}

const MODE_OPTIONS: ModeOption[] = [
  { id: 'title', label: 'Title' },
  { id: 'studio', label: 'Studio' },
  { id: 'year', label: 'Year' },
]

function SearchBarIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="small" viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </SvgIcon>
  )
}

export default function SearchBar({
  mode,
  onModeChange,
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  const placeholder =
    mode === 'title'
      ? 'Search by title…'
      : mode === 'studio'
        ? 'Studio name (e.g. MAPPA, Bones)…'
        : 'Release year (e.g. 2023)…'

  const inputType = mode === 'year' ? 'number' : 'search'

  const modeOption =
    MODE_OPTIONS.find((o) => o.id === mode) ?? MODE_OPTIONS[0]!

  return (
    <Box
      component="form"
      role="search"
      aria-label="Search anime"
      className="mx-auto mb-8 box-border w-full max-w-xl"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <Box className="flex w-full flex-row flex-wrap items-center gap-2">
        <Autocomplete<ModeOption, false, true, false>
          disableClearable
          disablePortal
          options={MODE_OPTIONS}
          value={modeOption}
          onChange={(_, newValue) => {
            if (newValue) onModeChange(newValue.id)
          }}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          getOptionLabel={(option) => option.label}
          size="small"
          className="w-full shrink-0 sm:w-auto sm:min-w-[180px]"
          renderInput={(params) => (
            <TextField {...params} label="Search by" />
          )}
        />

        <TextField
          size="small"
          variant="outlined"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={inputType}
          autoComplete="off"
          slotProps={{
            htmlInput: {
              min: mode === 'year' ? 1917 : undefined,
              max: mode === 'year' ? new Date().getFullYear() + 2 : undefined,
              'aria-label': placeholder,
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchBarIcon
                    sx={{ color: 'action.active', opacity: 0.65 }}
                  />
                </InputAdornment>
              ),
            },
          }}
          className="min-w-0 w-full flex-[1_1_12rem] sm:w-auto"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="medium"
          className="w-full shrink-0 py-2 sm:w-auto"
        >
          Go
        </Button>
      </Box>
    </Box>
  )
}
