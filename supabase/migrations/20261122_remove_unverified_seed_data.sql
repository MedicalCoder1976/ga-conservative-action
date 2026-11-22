-- Remove unverified synthetic and fallback records.
DELETE FROM public.election_results;
DELETE FROM public.demographics;
DELETE FROM public.exit_polls;
DELETE FROM public.county_drift;
