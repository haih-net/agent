# Scenario 001: Company Knowledge Accumulation

## Goal

Comprehensive scenario for loading company information and its analysis. Testing the complete KB cycle: from raw data to queries.

## Context

The system receives information about Renault company from different sources over different periods. Need to:
1. Load the data
2. Link them together
3. Make queries for analysis

## Data to Load

### Concepts
- **renault** (type: organization) — Renault company
- **leader** (type: position) — market leader position

### Labels for renault
- "Renault" (primary, fr)
- "Renault SA" (primary, en)
- "Regie Nationale" (alias, fr)

### Facts
1. Renault — market leader (2012-2015), confidence: 0.9, status: verified
2. Renault — market leader (2016-2020), confidence: 0.85, status: verified
3. Renault market share — 25% (2020), confidence: 0.7, status: tentative

## Queries for Testing

### 1. All company facts
Get all facts where subject = renault, sorted by validFrom.

### 2. Active facts as of date
Get facts valid on 2018-01-01 (validFrom <= date <= validTo).

### 3. Facts by confidence level
Get facts with confidence >= 0.8.

### 4. Concept with all relationships
Get concept renault with all Labels and Facts.

## Expected Result

- 2 concepts created (renault, leader)
- 3 labels for renault
- 3 facts with correct relationships
- Queries return correct data
