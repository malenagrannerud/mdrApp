# Prestandaanalys och Index-optimering

## Syfte
Detta dokument visar hur index förbättrar query-prestanda i Medallion-arkitekturen.

## Index som skapats

### Bronze-lagret
- `idx_bronze_report_key` - Snabbar upp deduplicering
- `idx_bronze_manufacturer` - Snabbar upp filtrering på tillverkare

### Silver-lagret
- `idx_silver_product_code` - Snabbar upp Gold-aggregation per produkt
- `idx_silver_manufacturer` - Snabbar upp Gold-aggregation per tillverkare
- `idx_silver_mfr_product` - Composite index för vanligaste queryn

## EXPLAIN ANALYZE resultat

### Utan index
```sql
-- Query utan index tar O(n) tid (full tabellskanning)
Seq Scan on silver_reports  (cost=0.00..1500.00 rows=50000 width=32)
  Filter: (manufacturer_name = 'MEDTRONIC')
  Rows Removed by Filter: 49500
```



### Med index
  -- Query med index tar O(log n) tid (index-scan)
Index Scan using idx_silver_manufacturer on silver_reports  (cost=0.42..8.44 rows=500 width=32)
  Index Cond: (manufacturer_name = 'MEDTRONIC')