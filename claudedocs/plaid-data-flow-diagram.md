# Plaid Integration - Data Flow & Schema Relationships

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PLAID INTEGRATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   auth.users     │
│  (Supabase Auth) │
│                  │
│  • id (uuid)     │◄────────────────────────────┐
│  • email         │                              │
└──────────────────┘                              │
         │                                        │
         │ user_id                                │ user_id
         │                                        │
         ├────────────────────────────────────────┼──────────────────────┐
         │                                        │                      │
         ▼                                        ▼                      ▼
┌──────────────────┐                    ┌──────────────────┐   ┌──────────────────┐
│  plaid_items     │                    │    expenses      │   │  plaid_accounts  │
│  (Bank Links)    │                    │  (Your Data)     │   │ (Bank Accounts)  │
├──────────────────┤                    ├──────────────────┤   ├──────────────────┤
│ • id (uuid) PK   │                    │ • id (uuid) PK   │   │ • id (uuid) PK   │
│ • user_id (fk)   │                    │ • user_id (fk)   │   │ • user_id (fk)   │
│ • item_id ❶      │                    │ • description    │   │ • item_id (fk) ❶│
│ • access_token   │────┐               │ • amount         │   │ • account_id ❷   │
│ • institution    │    │               │ • category ❸     │   │ • name           │
│ • created_at     │    │               │ • date           │   │ • mask (****1234)│
│ • updated_at     │    │               │ • vendor         │   │ • type           │
└──────────────────┘    │               │ • room           │   │ • subtype        │
         │              │               │ • room_id (fk)   │   │ • created_at     │
         │ item_id      │               │ • receipt_url    │   └──────────────────┘
         │              │               │ • metadata       │            │
         │              │               │ • deleted_at     │            │
         ▼              │               │ • created_at     │            │
┌──────────────────┐    │               │ • updated_at     │            │
│ plaid_sync_state │    │               │                  │            │
│  (Sync Cursor)   │    │               │ NEW FIELDS:      │            │
├──────────────────┤    │               ├──────────────────┤            │
│ • item_id PK ❶   │    │               │ • plaid_tx_id ❹  │◄───────────┤
│ • user_id (fk)   │    │               │ • needs_review   │            │
│ • cursor         │    │               │ • auto_imported  │            │
│ • last_synced_at │    │               └──────────────────┘            │
└──────────────────┘    │                        ▲                      │
                        │                        │                      │
                        │                        │ Creates              │
                        │ Syncs from             │ (via Edge Function)  │
                        │                        │                      │
                        ▼                        │                      │
              ┌──────────────────┐               │                      │
              │plaid_transactions│───────────────┘                      │
              │      _raw        │                                      │
              │ (Landing Table)  │                                      │
              ├──────────────────┤                                      │
              │ • id (uuid) PK   │                                      │
              │ • user_id (fk)   │                                      │
              │ • item_id ❶      │                                      │
              │ • account_id ❷   │◄─────────────────────────────────────┘
              │ • transaction_id │❹ (Plaid's unique ID)
              │ • amount         │
              │ • iso_date       │
              │ • name           │
              │ • merchant_name  │
              │ • categories[]   │❺ (Plaid categories)
              │ • pending        │
              │ • json_raw       │
              │ • created_at     │
              └──────────────────┘

Legend:
❶ item_id: Plaid's identifier for a bank connection (one per institution per user)
❷ account_id: Plaid's identifier for individual accounts (checking, savings, credit)
❸ category: Your expense categories (renovation, maintenance, appliances, services, utilities)
❹ plaid_transaction_id: Links expense to original Plaid transaction
❺ categories[]: Plaid's category array (e.g., ["FOOD_AND_DRINK", "RESTAURANTS"])
```

---

## Data Flow: Bank Connection & Transaction Sync

### Step 1: User Connects Bank Account (One-Time Setup)

```
USER ACTION                    FRONTEND                    EDGE FUNCTION           PLAID API           DATABASE
     │                             │                            │                      │                  │
     ├─ Click "Connect Bank" ─────>│                            │                      │                  │
     │                             │                            │                      │                  │
     │                             ├─ createLinkToken() ───────>│                      │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ POST /link/token ──>│                  │
     │                             │                            │    /create           │                  │
     │                             │                            │                      │                  │
     │                             │                            │<─ link_token ────────┤                  │
     │                             │                            │                      │                  │
     │                             │<─ { link_token } ──────────┤                      │                  │
     │                             │                            │                      │                  │
     │                             ├─ usePlaidLink.open() ──────┐                      │                  │
     │                             │                            │                      │                  │
     │<─ Plaid Link Modal ─────────┤                            │                      │                  │
     │   (Select Bank)             │                            │                      │                  │
     │                             │                            │                      │                  │
     ├─ Select Institution ────────>│                            │                      │                  │
     ├─ Enter Credentials ─────────>│───────── (Plaid handles auth) ─────────────────>│                  │
     │                             │                            │                      │                  │
     │<─ Success!                  │<─ public_token ────────────┤                      │                  │
     │                             │                            │                      │                  │
     │                             ├─ exchangePublicToken(      │                      │                  │
     │                             │    public_token) ──────────>│                      │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ POST /item/        │                  │
     │                             │                            │    public_token/     │                  │
     │                             │                            │    exchange ────────>│                  │
     │                             │                            │                      │                  │
     │                             │                            │<─ access_token ──────┤                  │
     │                             │                            │   item_id            │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ INSERT INTO ────────────────────────────>│
     │                             │                            │   plaid_items                            │
     │                             │                            │   (item_id,                              │
     │                             │                            │    access_token,                         │
     │                             │                            │    user_id,                              │
     │                             │                            │    institution)                          │
     │                             │                            │                      │                  │
     │                             │                            ├─ POST /accounts/get─>│                  │
     │                             │                            │                      │                  │
     │                             │                            │<─ accounts[] ────────┤                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ INSERT INTO ────────────────────────────>│
     │                             │                            │   plaid_accounts                         │
     │                             │                            │   (account_id,                           │
     │                             │                            │    item_id,                              │
     │                             │                            │    name, mask)                           │
     │                             │                            │                      │                  │
     │                             │<─ { item_id } ─────────────┤                      │                  │
     │                             │                            │                      │                  │
     │<─ "Bank Connected!" ────────┤                            │                      │                  │
```

---

### Step 2: Initial Transaction Sync (Happens Immediately After Connection)

```
USER ACTION                    FRONTEND                    EDGE FUNCTION           PLAID API           DATABASE
     │                             │                            │                      │                  │
     ├─ Auto-triggered ────────────>│                            │                      │                  │
     │   (or manual "Sync")        │                            │                      │                  │
     │                             │                            │                      │                  │
     │                             ├─ syncTransactions(         │                      │                  │
     │                             │    item_id) ───────────────>│                      │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ GET FROM ───────────────────────────────>│
     │                             │                            │   plaid_items                            │
     │                             │                            │   WHERE item_id                          │
     │                             │                            │                      │                  │
     │                             │                            │<─ access_token ──────────────────────────┤
     │                             │                            │                      │                  │
     │                             │                            ├─ GET FROM ───────────────────────────────>│
     │                             │                            │   plaid_sync_state                       │
     │                             │                            │   WHERE item_id                          │
     │                             │                            │                      │                  │
     │                             │                            │<─ cursor (or null) ───────────────────────┤
     │                             │                            │                      │                  │
     │                             │                            ├─ POST /transactions/│                  │
     │                             │                            │    sync ─────────────>│                  │
     │                             │                            │    { access_token,   │                  │
     │                             │                            │      cursor }        │                  │
     │                             │                            │                      │                  │
     │                             │                            │<─ {                  │                  │
     │                             │                            │     added: [...],    │                  │
     │                             │                            │     modified: [...], │                  │
     │                             │                            │     removed: [...],  │                  │
     │                             │                            │     next_cursor      │                  │
     │                             │                            │   } ─────────────────┤                  │
     │                             │                            │                      │                  │
     │                             │                 ┌──────────┴──────────┐           │                  │
     │                             │                 │ FOR EACH TRANSACTION│           │                  │
     │                             │                 │   IN added[]        │           │                  │
     │                             │                 └──────────┬──────────┘           │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ Map Plaid category │                  │
     │                             │                            │   to expense category│                  │
     │                             │                            │   (see mapping table)│                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ Check for duplicate│<─────────────────>│
     │                             │                            │   (same tx_id exists │   Query expenses │
     │                             │                            │    in expenses?)     │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ INSERT INTO ────────────────────────────>│
     │                             │                            │   plaid_transactions_│                  │
     │                             │                            │   raw                │                  │
     │                             │                            │   (transaction_id,   │                  │
     │                             │                            │    amount, date,     │                  │
     │                             │                            │    name, categories) │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ INSERT INTO ────────────────────────────>│
     │                             │                            │   expenses           │                  │
     │                             │                            │   (description,      │                  │
     │                             │                            │    amount,           │                  │
     │                             │                            │    category,         │                  │
     │                             │                            │    date,             │                  │
     │                             │                            │    vendor,           │                  │
     │                             │                            │    plaid_tx_id,      │                  │
     │                             │                            │    needs_review=TRUE,│                  │
     │                             │                            │    auto_imported=TRUE│                  │
     │                             │                            │   )                  │                  │
     │                             │                 ┌──────────┴──────────┐           │                  │
     │                             │                 │   END FOR EACH      │           │                  │
     │                             │                 └──────────┬──────────┘           │                  │
     │                             │                            │                      │                  │
     │                             │                            ├─ UPDATE ─────────────────────────────────>│
     │                             │                            │   plaid_sync_state   │                  │
     │                             │                            │   SET cursor =       │                  │
     │                             │                            │       next_cursor,   │                  │
     │                             │                            │       last_synced_at │                  │
     │                             │                            │       = now()        │                  │
     │                             │                            │                      │                  │
     │                             │<─ { imported: 45 } ────────┤                      │                  │
     │                             │                            │                      │                  │
     │<─ "Imported 45 transactions"┤                            │                      │                  │
     │   Show Review Modal ────────┤                            │                      │                  │
```

---

### Step 3: Transaction Review & Confirmation (User Interaction)

```
USER ACTION                    FRONTEND                    DATABASE
     │                             │                           │
     │                             ├─ SELECT * FROM ──────────>│
     │                             │   expenses                │
     │                             │   WHERE user_id = ...     │
     │                             │   AND needs_review = TRUE │
     │                             │                           │
     │                             │<─ [...transactions] ──────┤
     │                             │                           │
     │<─ Review Modal ─────────────┤                           │
     │   Shows 45 transactions     │                           │
     │                             │                           │
     │   Transaction 1:            │                           │
     │   ┌─────────────────────┐   │                           │
     │   │ Amazon.com          │   │                           │
     │   │ $42.15              │   │                           │
     │   │ Category: utilities │   │                           │
     │   │                     │   │                           │
     │   │ [Confirm] [Edit]   │   │                           │
     │   │ [Delete]            │   │                           │
     │   └─────────────────────┘   │                           │
     │                             │                           │
     ├─ Click "Confirm" ───────────>│                           │
     │                             │                           │
     │                             ├─ UPDATE expenses ─────────>│
     │                             │   SET needs_review = FALSE│
     │                             │   WHERE id = ...          │
     │                             │                           │
     │<─ Next transaction ──────────┤                           │
     │                             │                           │
     ├─ Click "Edit" ──────────────>│                           │
     │                             │                           │
     │<─ Edit form ─────────────────┤                           │
     │   • Category dropdown       │                           │
     │   • Description field       │                           │
     │   • Amount field            │                           │
     │                             │                           │
     ├─ Update fields ─────────────>│                           │
     ├─ Click "Save" ──────────────>│                           │
     │                             │                           │
     │                             ├─ UPDATE expenses ─────────>│
     │                             │   SET description = ...,  │
     │                             │       category = ...,     │
     │                             │       amount = ...,       │
     │                             │       needs_review = FALSE│
     │                             │   WHERE id = ...          │
     │                             │                           │
     ├─ Click "Delete" ────────────>│                           │
     │   (if duplicate)            │                           │
     │                             │                           │
     │                             ├─ UPDATE expenses ─────────>│
     │                             │   SET deleted_at = now()  │
     │                             │   WHERE id = ...          │
     │                             │                           │
     │<─ "All transactions reviewed"┤                           │
     │   Close modal ───────────────┤                           │
```

---

## Category Mapping Table

Maps Plaid's category system to your expense categories:

| Plaid Category (categories[0])              | Your Category  | Confidence |
|---------------------------------------------|----------------|------------|
| `HOME_IMPROVEMENT`                          | renovation     | High       |
| `GENERAL_MERCHANDISE_HARDWARE_STORE`        | renovation     | High       |
| `GENERAL_SERVICES_PLUMBING`                 | services       | High       |
| `GENERAL_SERVICES_ELECTRICIAN`              | services       | High       |
| `GENERAL_SERVICES_HVAC`                     | services       | High       |
| `HOME_APPLIANCES`                           | appliances     | High       |
| `GENERAL_MERCHANDISE_APPLIANCES`            | appliances     | High       |
| `UTILITIES_GAS`                             | utilities      | High       |
| `UTILITIES_ELECTRIC`                        | utilities      | High       |
| `UTILITIES_WATER`                           | utilities      | High       |
| `UTILITIES_INTERNET`                        | utilities      | High       |
| `GENERAL_SERVICES_OTHER_GENERAL_SERVICES`   | services       | Medium     |
| `SHOPS_HARDWARE_STORES` (category[1])       | renovation     | Medium     |
| `SERVICE_GENERAL_CONTRACTORS` (category[1]) | renovation     | Medium     |
| **Default (unmapped)**                      | maintenance    | Low        |

**Logic**:
1. Check `categories[0]` (primary category)
2. If unmapped, check `categories[1]` (secondary category)
3. If still unmapped, check `merchant_name` for keywords:
   - "Home Depot", "Lowe's", "Menards" → renovation
   - "HVAC", "Plumber", "Electrician" → services
4. Default to `maintenance` with `needs_review = TRUE` (low confidence)

---

## Duplicate Detection Algorithm

Prevents the same transaction from being imported twice:

```javascript
async function isDuplicate(plaidTransaction, userId) {
  // 1. Check exact match by plaid_transaction_id
  const exactMatch = await supabase
    .from('expenses')
    .select('id')
    .eq('user_id', userId)
    .eq('plaid_transaction_id', plaidTransaction.transaction_id)
    .maybeSingle();

  if (exactMatch) return true;

  // 2. Fuzzy match: same amount + date within ±2 days + similar description
  const dateFrom = new Date(plaidTransaction.date);
  dateFrom.setDate(dateFrom.getDate() - 2);
  const dateTo = new Date(plaidTransaction.date);
  dateTo.setDate(dateTo.getDate() + 2);

  const fuzzyMatch = await supabase
    .from('expenses')
    .select('id, description')
    .eq('user_id', userId)
    .eq('amount', Math.abs(plaidTransaction.amount))
    .gte('date', dateFrom.toISOString())
    .lte('date', dateTo.toISOString());

  if (fuzzyMatch.data?.length > 0) {
    // Check description similarity (basic Levenshtein or keyword overlap)
    const similarity = calculateSimilarity(
      plaidTransaction.name,
      fuzzyMatch.data[0].description
    );

    if (similarity > 0.7) return true;
  }

  return false;
}
```

---

## Security & Access Control

### RLS Policies (Already in Place)
All tables enforce Row Level Security filtering by `user_id`:
- ✅ `plaid_items` - users can only see their own bank connections
- ✅ `plaid_accounts` - users can only see their own accounts
- ✅ `plaid_transactions_raw` - users can only see their own transactions
- ✅ `expenses` - users can only see their own expenses

### Access Token Protection
- ✅ `access_token` stored in `plaid_items` table (database-side only)
- ❌ NEVER exposed to frontend/client code
- ✅ Only accessible via Edge Functions with service role key
- ✅ Edge Functions validate user JWT before accessing

### Data Privacy
- User bank credentials NEVER touch your servers (Plaid handles authentication)
- Plaid uses bank-level encryption (256-bit AES, TLS 1.2+)
- Access tokens can be revoked instantly via Plaid dashboard
- Transactions are read-only (no ability to initiate transfers)

---

## Performance Considerations

### Indexes for Fast Queries
Already planned in migration:
```sql
-- Fast lookup: Find expense by Plaid transaction
CREATE INDEX idx_expenses_plaid_tx ON expenses(plaid_transaction_id)
WHERE plaid_transaction_id IS NOT NULL;

-- Fast lookup: Get all transactions needing review for user
CREATE INDEX idx_expenses_needs_review ON expenses(user_id, needs_review)
WHERE needs_review = true;

-- Fast lookup: Get all auto-imported expenses
CREATE INDEX idx_expenses_auto_imported ON expenses(user_id, auto_imported)
WHERE auto_imported = true;
```

### Expected Query Performance
| Query Type                          | Expected Time | Notes                        |
|-------------------------------------|---------------|------------------------------|
| Fetch transactions needing review   | <50ms         | Indexed by user_id + flag    |
| Duplicate detection                 | <100ms        | Indexed by amount + date     |
| Sync 100 transactions               | <10s          | Bulk insert with batching    |
| Load expense list with Plaid info   | <100ms        | Indexed queries              |

---

## Next Steps

Now that the schema is confirmed and data flow is documented:

1. **Create Database Migration** - Add Plaid fields to expenses table
2. **Build Edge Functions** - Implement backend Plaid API integration
3. **Update Frontend** - Add transaction review modal
4. **Test End-to-End** - Use Plaid Sandbox to validate flow

**Ready to proceed?** Which phase would you like to start with?
