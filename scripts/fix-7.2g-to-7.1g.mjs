import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixVersion() {
  console.log("Updating patches table...");
  const { data: pData, error: pError } = await supabase
    .from('patches')
    .update({ version: '7.1g' })
    .eq('version', '7.2g');
  
  if (pError) console.error("Error updating patches:", pError);
  else console.log("Patches updated successfully!");

  console.log("Updating patch_meta table...");
  const { data: mData, error: mError } = await supabase
    .from('patch_meta')
    .update({ version: '7.1g' })
    .eq('version', '7.2g');

  if (mError) console.error("Error updating patch_meta:", mError);
  else console.log("Patch meta updated successfully!");
}

fixVersion();
