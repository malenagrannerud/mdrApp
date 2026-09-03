"""
models.py

Data models for the bronze layer. BronzeRow validates row SHAPE only
(types present or absent) — content rules (e.g. rejecting "UNKNOWN"
as a manufacturer) belong to Silver, not Bronze.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class BronzeRow(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    report_key: Optional[str] = None
    product_code_raw: Optional[str] = None
    brand_name_raw: Optional[str] = None
    generic_name_raw: Optional[str] = None
    manufacturer_raw: Optional[str] = None
    source_file: str = Field(alias="_source_file")