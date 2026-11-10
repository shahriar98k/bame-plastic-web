# বামে প্লাস্টিক – web version

Every push to `main` updates the live game (GitHub Pages / Vercel) automatically.
Players who already have the page open get an "update" notice within ~5 minutes; the Android app loads this site, so it updates too.

## Turn on the shared leaderboard (one time, free)
1. Create a free project at https://supabase.com (any name, any region).
2. Open **SQL Editor → New query**, paste the whole of `supabase/setup.sql`, press **Run**.
3. Open **Project Settings → API** and copy **Project URL** and the **anon public** key.
4. Put them into `config.js`:
   `window.BP_CFG={SUPABASE_URL:'https://xxxx.supabase.co',SUPABASE_KEY:'eyJ...'};`
5. Commit. Done – daily / weekly / monthly top-20 now covers all players.

The anon key is meant to be public. Players can only call two functions (`submit_score`, `get_top`); they cannot read or edit the table.
Scores are checked for range (0 – 100,000,000) and limited to one submit per 20 s per device, but a determined cheater can still send fake scores.
