# FileSure CIN & LLPIN Validator

## CIN Structure
- Length: 21 characters
- Character 1: Listing status (L/U)
- Characters 2-6: Industry code
- Characters 7-8: State code
- Characters 9-12: Incorporation year
- Characters 13-15: Company classification
- Characters 16-21: Registration number

## LLPIN
- Expected structure from assignment: AAA-1234
- Need to verify exact validation rules

## Validation limitations
- Format validation does not confirm existence.
- Extracted information should not automatically be
  treated as verified MCA information.

  ## CIN Validation Rules

### Listing Status
- L = Listed
- U = Unlisted

### CIN segments
- Character 1: L or U
- Characters 2-6: 5 digits
- Characters 7-8: State code
- Characters 9-12: 4-digit year
- Characters 13-15: Company type
- Characters 16-21: 6-digit registration number

### Initial company type codes
- PTC = Private
- PLC = Public
- OPC = One Person Company
- NPL = Section 8
- GOI = Union Government
- SGC = State Government
- FLC = Foreign public
- FTC = Foreign private
- ULL = Unlimited public
- ULT = Unlimited private
- GAP = Guarantee & Association public
- GAT = Guarantee & Association private

### LLPIN
- 3 uppercase letters
- Hyphen
- 4 digits

### Important
- Structural validation does not prove registration.
- Unknown codes should produce informative errors.
- Batch processing must support large lists.