S


ELECT
    COUNT(*) FILTER (WHERE manufacturer_normalized = manufacturer_name) AS unmapped,
    COUNT(*) FILTER (WHERE manufacturer_normalized <> manufacturer_name) AS mapped,
    COUNT(*) AS total
FROM silver_reports
WHERE manufacturer_is_junk = FALSE;

-- result 76 % 
-- | unmapped | mapped | total |
-- | -------- | ------ | ----- |
-- | 4718     | 15256  | 19974 |



-- Display the top 50 manufacturer names that are not mapped to a normalized name. This is useful for identifying which manufacturers need to be added to the mapping table.
SELECT
    manufacturer_name,
    COUNT(*) AS rows
FROM silver_reports
WHERE manufacturer_is_junk = FALSE
  AND manufacturer_normalized = manufacturer_name
GROUP BY manufacturer_name
ORDER BY rows DESC
LIMIT 50;