
-- ITERATE TO ENSURE MOST MANUFACTURERS ARE MAPPED

SELECT
    COUNT(*) FILTER (WHERE manufacturer_normalized = manufacturer_name) AS unmapped,
    COUNT(*) FILTER (WHERE manufacturer_normalized <> manufacturer_name) AS mapped,
    COUNT(*) AS total,
    ROUND(100.0 * COUNT(*) FILTER (WHERE manufacturer_normalized <> manufacturer_name) / COUNT(*), 1) AS pct_mapped
FROM silver_reports
WHERE manufacturer_is_junk = FALSE;

-- result 97% OK


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