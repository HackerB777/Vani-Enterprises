# ⚡ MCP Quick Start - Copy & Paste Commands

**Status**: Ready to execute  
**Project**: lqqcofrczinmacwbzdgd  
**Date**: 2026-07-03

---

## 🎯 Three Commands to Run

### **Command 1: Add MCP Server** (Copy & Paste)

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=lqqcofrczinmacwbzdgd"
```

**What it does:**
- Adds Supabase MCP server to your project
- Enables direct database access from Claude
- Scopes it to this project only

**Expected result:**
```
✓ MCP server added: supabase
✓ Configuration saved to ./claude/agents/mcp.json
```

---

### **Command 2: Authenticate** (Copy & Paste)

```bash
claude /mcp
```

**What to do:**
1. Select `supabase` from the menu
2. Click "Authenticate"
3. Complete the browser flow
4. Return to terminal

**Expected result:**
```
✓ Authenticated with Supabase
✓ Project: lqqcofrczinmacwbzdgd
✓ MCP server ready for use
```

---

### **Command 3: Install Agent Skills** (Optional but Recommended)

```bash
npx skills add supabase/agent-skills
```

**What it does:**
- Adds pre-made Supabase operation skills
- Improves Claude's database query efficiency
- Provides best practices guidance

**Expected result:**
```
✓ Agent skills installed
✓ Supabase operations ready
```

---

## 📋 Step-by-Step Instructions

### **In Terminal:**

1. **Navigate to project directory**
   ```bash
   cd "d:\vani enterpise"
   ```

2. **Run Command 1** (Add MCP Server)
   ```bash
   claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=lqqcofrczinmacwbzdgd"
   ```
   ⏱️ Takes: 5 seconds

3. **Run Command 2** (Authenticate)
   ```bash
   claude /mcp
   ```
   - Select `supabase`
   - Click "Authenticate"
   - Complete browser flow
   ⏱️ Takes: 2-3 minutes

4. **Run Command 3** (Optional - Install Skills)
   ```bash
   npx skills add supabase/agent-skills
   ```
   ⏱️ Takes: 30-60 seconds

---

## ✅ After Setup - Test It Works

Ask Claude:
```
"How many products are in my Supabase database?"
```

**Expected response:**
```
Your Supabase database contains 22 products across 8 categories.
```

If you see this, MCP is working! ✓

---

## 🔍 Verify Configuration

After setup, check that this file was created:

**`./claude/agents/mcp.json`**

Should contain:
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

## 🚀 What You Can Do After Setup

Once MCP is authenticated:

✅ **Query your database directly**
```
"Show me all products in the electronics category"
Claude executes: SELECT * FROM products WHERE category = 'electronics'
```

✅ **Check data integrity**
```
"Verify that we have 22 products in the database"
Claude counts and confirms
```

✅ **Inspect schema**
```
"What columns does the orders table have?"
Claude shows the full schema
```

✅ **Debug data issues**
```
"Are there any orders without a tracking ID?"
Claude checks and reports
```

---

## 📊 Before & After

### **Before MCP Setup**
- Need to log into Supabase dashboard
- Use SQL Editor manually
- Wait for results
- Can't ask Claude directly

### **After MCP Setup**
- Ask Claude directly in IDE
- Claude runs queries automatically
- Get instant results
- Faster development workflow

---

## ⏱️ Total Setup Time

| Step | Time |
|------|------|
| Command 1 (Add server) | 5 sec |
| Command 2 (Authenticate) | 2-3 min |
| Command 3 (Skills) | 30-60 sec |
| **Total** | **~4 minutes** |

---

## 🎯 Benefits

✅ **Speed**: Direct database queries  
✅ **Convenience**: No dashboard needed  
✅ **Accuracy**: Real-time data checks  
✅ **Debugging**: Instant issue diagnosis  
✅ **Integration**: Works within Claude  

---

## 🆘 If Something Goes Wrong

### **"claude: command not found"**
- Make sure you have Claude CLI installed
- Run `claude --version` to verify
- Install if needed

### **"Authentication failed"**
- Run `claude /mcp` in a fresh terminal
- Select supabase carefully
- Complete the full browser flow

### **"MCP server not found"**
- Verify project reference: `lqqcofrczinmacwbzdgd`
- Check `./claude/agents/mcp.json` exists
- Re-run command 1 if needed

---

## ✅ Checklist

- [ ] Opened terminal
- [ ] Navigated to project directory
- [ ] Ran Command 1 (Add MCP server)
- [ ] Ran Command 2 (Authenticate)
- [ ] (Optional) Ran Command 3 (Agent skills)
- [ ] Verified `mcp.json` file created
- [ ] Tested with database query
- [ ] Success! ✓

---

## 🎉 Ready to Go!

Once you've run these 2-3 commands (takes ~4 minutes), you'll have:

✅ Direct Supabase access from Claude  
✅ Ability to query database instantly  
✅ Real-time data verification  
✅ Enhanced development workflow  

**That's it! You're done with MCP setup.** 🚀

---

**Next Steps:**
1. Run the 3 commands above
2. Test with a database query
3. Continue with deployment setup

**Documentation**: See `SUPABASE_SETUP_GUIDE.md` and `VERCEL_ENV_SETUP.md` for next phases.
