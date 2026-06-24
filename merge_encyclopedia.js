const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');

const glossary = JSON.parse(fs.readFileSync(path.join(dataDir, 'encyclopedia_glossary.json'), 'utf8'));
const lanes = JSON.parse(fs.readFileSync(path.join(dataDir, 'encyclopedia_lanes.json'), 'utf8'));
const tactics = JSON.parse(fs.readFileSync(path.join(dataDir, 'encyclopedia_tactics.json'), 'utf8'));
const objectives = JSON.parse(fs.readFileSync(path.join(dataDir, 'encyclopedia_objectives.json'), 'utf8'));

// Handle potential variations in subagent JSON structure
const glossaryData = Array.isArray(glossary) ? glossary : (glossary.glossary || glossary.terms || []);
const lanesData = lanes.mechanics || lanes.lanes || lanes.data || [];
const tacticsData = tactics.tactics || tactics.data || [];
const objectivesData = objectives.objectives || objectives.data || [];

const finalData = {
  glossary: glossaryData,
  lanes: lanesData,
  tactics: tacticsData,
  objectives: objectivesData
};

fs.writeFileSync(path.join(dataDir, 'encyclopedia.json'), JSON.stringify(finalData, null, 2));
console.log('Successfully merged encyclopedia.json');
