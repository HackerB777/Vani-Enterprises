# 🔧 Supabase MCP Server Setup Guide

**Status**: Ready for setup  
**Scope**: Project-level integration  
**Project Reference**: lqqcofrczinmacwbzdgd

---

## ✅ What is MCP?

**MCP** = Model Context Protocol

This allows Claude to directly interact with your Supabase database through an authenticated connection, enabling:
- ✅ Real-time database queries
- ✅ Schema introspection
- ✅ Data manipulation
- ✅ Direct database insights
- ✅ Automated migrations

---

## 📋 Setup Steps

### **Step 1: Add MCP Server** (2 min)

Run this command in your terminal (NOT in IDE):

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=lqqcofrczinmacwbzdgd"
```

**What this does:**
- Adds Supabase MCP server to your project config
- Uses HTTP transport protocol
- Scoped to this project only
- Links to your Supabase project: `lqqcofrczinmacwbzdgd`

**Expected output:**
```
✓ MCP server added: supabase
✓ Project scope: ./claude/agents/mcp.json
```

---

### **Step 2: Authenticate** (3 min)

Run in a regular terminal:

```bash
claude /mcp
```

**What to do:**
1. Select the `supabase` server from the list
2. Click or type "Authenticate"
3. Follow the browser flow
4. Grant permissions to Claude
5. Return to terminal (will confirm)

**Expected output:**
```
✓ Authenticated with Supabase
✓ Project: lqqcofrczinmacwbzdgd
✓ Ready for operations
```

---

### **Step 3: Install Agent Skills** (Optional but Recommended) (2 min)

```bash
npx skills add supabase/agent-skills
```

**What this does:**
- Adds pre-made skills for Supabase operations
- Enables more efficient queries
- Provides best practices
- Speeds up database operations

---

## 🎯 After Setup

Once MCP is configured and authenticated, Claude can:

### **Database Operations**
```
✓ List all tables and schemas
✓ Run SELECT queries directly
✓ View table structures
✓ Check row counts
✓ Inspect data types
```

### **Schema Management**
```
✓ Review migration status
✓ Check table relationships
✓ View indexes and constraints
✓ Inspect RLS policies
```

### **Data Inspection**
```
✓ Preview table contents
✓ Check specific records
✓ Verify data integrity
✓ Count rows by status
```

---

## 💡 Benefits

### **For Development**
- ✅ Direct database access from Claude
- ✅ No need to log into Supabase dashboard
- ✅ Real-time database queries
- ✅ Faster debugging

### **For Deployment**
- ✅ Verify migrations ran successfully
- ✅ Check data was seeded correctly
- ✅ Validate production data
- ✅ Monitor database health

### **For Debugging**
- ✅ Query production data safely (read-only by default)
- ✅ Check table structures
- ✅ Verify constraints and relationships
- ✅ Inspect recent changes

---

## 🔐 Security Notes

✅ **Authenticated**: Uses your Supabase API key  
✅ **Scoped**: Project-level only  
✅ **Secure Transport**: HTTPS connection  
✅ **Permissions**: Configurable access levels  

---

## 📁 Configuration File

After setup, you'll have:

**`./claude/agents/mcp.json`**
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=lqqcofrczinmacwbzdgd",
      "transport": "http",
      "scope": "project"
    }
  }
}
```

---

## 🧪 Testing the Setup

Once authenticated, you can ask Claude things like:

```
"How many products are in the database?"
↓
Claude queries: SELECT COUNT(*) FROM products
Result: 22 products

"Show me all orders from today"
↓
Claude queries: SELECT * FROM orders WHERE DATE(createdAt) = TODAY()

"What's the schema for the products table?"
↓
Claude inspects table structure and shows columns/types

"Run the database migrations"
↓
Claude can execute migrations if permissions allow
```

---

## 🚀 Next Steps

### **Immediate (Today)**
1. ✅ Run `claude mcp add ...` command
2. ✅ Authenticate via `claude /mcp`
3. ✅ (Optional) Install agent skills

### **Verify Setup Works**
```
Ask Claude: "How many products are in my Supabase database?"

Expected response:
"Your database has 22 products across 8 categories."
```

### **Use in Development**
Now Claude can:
- Directly query your database
- Verify migrations work
- Check data integrity
- Debug production issues

---

## 🆘 Troubleshooting

### **"MCP server not found"**
1. Make sure you ran the `claude mcp add` command
2. Check the exact project reference: `lqqcofrczinmacwbzdgd`
3. Verify you're in the project directory

### **"Authentication failed"**
1. Run `claude /mcp` in a regular terminal (not IDE)
2. Select the supabase server
3. Complete the browser authentication flow
4. Check your Supabase API keys are valid

### **"Permission denied"**
1. Check your Supabase API key has correct permissions
2. Verify role settings in Supabase
3. Try authenticating again with admin account

### **"Unable to connect"**
1. Check internet connection
2. Verify Supabase project is active
3. Check project reference is correct: `lqqcofrczinmacwbzdgd`

---

## 📚 MCP Documentation

For more details:
- [Supabase MCP Server](https://mcp.supabase.com)
- [Claude MCP Documentation](https://modelcontextprotocol.io)
- [Agent Skills](https://skills.anthropic.com)

---

## ✅ Configuration Summary

| Item | Value | Status |
|------|-------|--------|
| MCP Server | Supabase | Ready |
| Transport | HTTP | Secure |
| Project Ref | lqqcofrczinmacwbzdgd | Set |
| Scope | Project | Local |
| Authentication | Required | Next step |
| Agent Skills | Optional | Ready |

---

## 🎯 Benefits After Setup

✅ Ask Claude to query your database directly  
✅ Verify migrations completed successfully  
✅ Check data integrity in production  
✅ Debug issues with real data  
✅ Get instant database insights  
✅ No need to open Supabase dashboard  

---

## 🚀 Ready to Enhance Your Workflow!

Once MCP is set up, your development process becomes:
1. Code locally
2. Ask Claude about database state
3. Run migrations
4. Verify with Claude
5. Deploy confidently

**Let's set it up!** 🔧
