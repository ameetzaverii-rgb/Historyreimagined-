/* ============================================================================
   Content for the interactive teaching modes:
   Local History · You Decide (branching) · Source Detective · Sort · Debate
   ========================================================================== */

/* ---- 1. HISTORY NEAR YOU — location-based snippets (India-focused) ---- */
const LOCAL_HISTORY = {
  'Punjab': { emoji: '🌾', snippets: [
    { t: 'The recruiting ground of empire', d: 'Punjab supplied a huge share of the British Indian Army — hundreds of thousands of Punjabi soldiers fought in both World Wars, in France, Mesopotamia and North Africa.' },
    { t: 'Jallianwala Bagh, Amritsar (1919)', d: 'Just after WW1, British troops fired on an unarmed crowd here. The massacre turned millions against British rule and reshaped the freedom struggle.' },
  ]},
  'Maharashtra': { emoji: '🏙️', snippets: [
    { t: 'Quit India began in Bombay (1942)', d: 'At Gowalia Tank in Mumbai, Gandhi gave the "Do or Die" call. The Quit India Movement launched here, even as WW2 raged.' },
    { t: 'The Royal Indian Navy Mutiny (1946)', d: 'Sailors in Bombay rose up after the war — a powerful sign that British control of India was slipping away.' },
  ]},
  'West Bengal': { emoji: '🐅', snippets: [
    { t: 'Subhas Chandra Bose’s homeland', d: 'Bose, who built the Indian National Army to fight British rule from outside, was from Bengal.' },
    { t: 'The Bengal Famine (1943)', d: 'Around three million people died in a famine worsened by wartime policies — one of the darkest costs of WW2 for India.' },
  ]},
  'Delhi': { emoji: '🏛️', snippets: [
    { t: 'The INA Trials at the Red Fort (1945–46)', d: 'Soldiers of Bose’s army were tried here. Public outrage at the trials became a rallying point for independence.' },
    { t: 'Capital of British India', d: 'New Delhi was the seat from which the war effort across India was directed.' },
  ]},
  'Tamil Nadu': { emoji: '🛕', snippets: [
    { t: 'Soldiers and the INA', d: 'Many Tamils served in the army and in Bose’s INA in Southeast Asia during WW2.' },
    { t: 'Madras and the war', d: 'Madras (Chennai) was even shelled briefly in WW1 — one of the few times the war touched Indian shores.' },
  ]},
  'Rajasthan': { emoji: '🏰', snippets: [
    { t: 'The princely regiments', d: 'Rajput and other regiments raised in Rajasthan fought with distinction in both World Wars.' },
  ]},
  'Gujarat': { emoji: '🧂', snippets: [
    { t: 'Gandhi’s Sabarmati & the Salt March', d: 'From Gujarat, Gandhi launched the 1930 Salt March — the model of non-violent resistance that ran alongside the war years.' },
  ]},
  'Uttar Pradesh': { emoji: '🕌', snippets: [
    { t: 'Heart of recruitment and revolt', d: 'UP sent many soldiers to the wars and was central to the national movement from 1857 onwards.' },
  ]},
  'Kerala': { emoji: '🌴', snippets: [
    { t: 'Soldiers and sailors', d: 'Malayalis served across the British forces; the war economy reshaped trade on the Malabar coast.' },
  ]},
  'Karnataka': { emoji: '🏞️', snippets: [
    { t: 'Mysore and the war effort', d: 'The princely state of Mysore contributed troops and industry to the war.' },
  ]},
  'Other / Outside India': { emoji: '🌍', snippets: [
    { t: 'A truly world war', d: 'Soldiers from over 30 nations and every inhabited continent fought. Wherever you are, this history reached your part of the world.' },
  ]},
};

/* ---- 2. YOU DECIDE — branching decision scenarios ---- */
const DECISIONS = [
  {
    id: 'versailles', icon: '✒️', title: 'The Peacemaker, 1919',
    setup: 'World War I is over. You are at the Versailles peace conference deciding how to treat a defeated Germany. The world is watching.',
    bloom: 'Evaluate',
    choices: [
      { label: 'Punish Germany harshly', outcome: 'You impose huge reparations and blame. <strong>This is close to what really happened.</strong> Many Germans feel humiliated; the resentment will be used by extremists like Hitler within 15 years. History warns: a peace built on humiliation can sow the next war.' },
      { label: 'Be generous and forgiving', outcome: 'You ask for little. Some leaders feel justice wasn’t done for the war’s destruction, and your own people are angry. But Germany may rebuild as a stable democracy. Historians still debate whether this could have prevented WW2.' },
      { label: 'Aim for a fair middle path', outcome: 'You seek accountability without humiliation — Woodrow Wilson’s hope. It’s the hardest path: every nation wants something different, and the final treaty ends up harsher than you intended. Real diplomacy is rarely clean.' },
    ],
  },
  {
    id: 'weimar', icon: '🗳️', title: 'The Voter, 1932', bloom: 'Analyse',
    setup: 'It is Germany, 1932. The Depression has destroyed jobs and savings. You are voting. Extremist parties promise to "make Germany great again."',
    choices: [
      { label: 'Vote for the extremist who promises strength', outcome: 'Millions made this choice out of fear and desperation — and it brought the Nazis to power. <strong>The lesson of NCERT Ch.3:</strong> democracies can be voted away when people stop believing in them.' },
      { label: 'Vote for a moderate democratic party', outcome: 'You defend democracy — but too few join you, and the moderate parties are divided. Your vote mattered, but history shows it took many more like you to hold the line.' },
      { label: 'Don’t vote — politics feels hopeless', outcome: 'Staying home is itself a choice. When good people withdrew, the extremists’ organised minority won. Apathy helped democracy fall.' },
    ],
  },
  {
    id: 'quitindia', icon: '🇮🇳', title: 'India, 1942', bloom: 'Evaluate',
    setup: 'WW2 is raging. Britain wants India’s help, but won’t promise freedom. Gandhi calls for "Quit India." You must decide your path.',
    choices: [
      { label: 'Join non-violent resistance (Gandhi)', outcome: 'You follow satyagraha. Thousands are jailed, but the moral pressure is immense. This path, combined with a war-weakened Britain, led to independence in 1947.' },
      { label: 'Fight British rule by force (Bose’s INA)', outcome: 'You join the Indian National Army. A very different choice — it showed Britain that even soldiers might turn. The freedom struggle was never a single, simple story.' },
      { label: 'Support the war first, freedom later', outcome: 'Some argued defeating fascism came first. 2.5 million Indians did serve. But many felt freedom delayed was freedom denied. There were no easy answers.' },
    ],
  },
];

/* ---- 3. SOURCE DETECTIVE — interactive images with hotspots ---- */
const SOURCES = [
  {
    id: 'dday', title: 'Into the Jaws of Death', kind: 'Photograph · D-Day, 1944',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/1280px-Into_the_Jaws_of_Death_23-0455M_edit.jpg',
    question: 'What can a single photograph tell us — and what can it hide?',
    hotspots: [
      { x: 30, y: 30, t: 'The open ramp', d: 'We see the soldiers from behind, stepping into danger. The photographer is *inside* the boat — this is a real, human point of view, not a posed studio shot.' },
      { x: 62, y: 55, t: 'The water', d: 'Many drowned under heavy gear before reaching shore. A photo freezes one instant and cannot show what happened seconds later — sources are partial.' },
      { x: 80, y: 22, t: 'The far beach', d: 'The objective. We can’t see the German defenders firing back — every source has a point of view and leaves things out.' },
    ],
    takeaway: 'Photographs are powerful evidence, but they show one angle, one moment. Historians ask: who took it, why, and what is outside the frame?',
  },
  {
    id: 'hyperinflation', title: 'A Mark Becomes Worthless', kind: 'Chart · Germany, 1923',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/German_Hyperinflation.svg/960px-German_Hyperinflation.svg.png',
    question: 'How can a graph explain why people turned to extremism?',
    hotspots: [
      { x: 20, y: 75, t: 'The early years', d: 'At first the line is almost flat — money still has value. Read a graph from left to right like a story.' },
      { x: 78, y: 20, t: 'The explosion', d: 'By late 1923 the value rockets off the scale — prices doubled in days. Savings vanished overnight.' },
      { x: 50, y: 45, t: 'The turning point', d: 'When numbers move this fast, ordinary life breaks down. Desperate people become open to anyone promising order.' },
    ],
    takeaway: 'A chart is a source too. This one helps explain *why* the Weimar Republic was so fragile — connecting economics to the rise of Nazism (NCERT Ch.3).',
  },
  {
    id: 'portrait', title: 'A Leader, Posed', kind: 'Official portrait',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg/800px-Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg',
    question: 'Why should we read an official portrait with suspicion?',
    hotspots: [
      { x: 50, y: 30, t: 'The pose', d: 'Official portraits are carefully staged to project strength and calm — they are propaganda, not neutral records.' },
      { x: 50, y: 70, t: 'The uniform', d: 'Symbols and uniforms are chosen to send a message. Ask what feeling the image is designed to create.' },
      { x: 20, y: 50, t: 'What’s removed', d: 'This image was retouched. Regimes controlled how leaders were shown — and hid everything that didn’t fit.' },
    ],
    takeaway: 'The Nazis were masters of image-making. Reading a portrait critically is the same skill you use on photos and videos online today.',
  },
];

/* ---- 4. SORT CHALLENGES — order & bucket ---- */
const SORTS = [
  {
    id: 'order1', type: 'order', icon: '📅', title: 'Put history in order',
    prompt: 'Drag these turning points into the order they happened (earliest at top).',
    items: [
      { t: 'Assassination at Sarajevo', year: 1914 },
      { t: 'Treaty of Versailles', year: 1919 },
      { t: 'The Great Depression begins', year: 1929 },
      { t: 'Hitler becomes Chancellor', year: 1933 },
      { t: 'World War II begins', year: 1939 },
      { t: 'India wins independence', year: 1947 },
    ],
  },
  {
    id: 'bucket1', type: 'bucket', icon: '⚔️', title: 'Allies or Axis?',
    prompt: 'Sort each country into the side it fought on in World War II.',
    buckets: ['Allies', 'Axis'],
    items: [
      { t: 'Britain', b: 'Allies' }, { t: 'Germany', b: 'Axis' }, { t: 'USA', b: 'Allies' },
      { t: 'Italy', b: 'Axis' }, { t: 'Soviet Union', b: 'Allies' }, { t: 'Japan', b: 'Axis' },
    ],
  },
  {
    id: 'cause1', type: 'bucket', icon: '🔗', title: 'Cause or Consequence?',
    prompt: 'Was each one a CAUSE of WW2, or a CONSEQUENCE of it?',
    buckets: ['Cause', 'Consequence'],
    items: [
      { t: 'The harsh Treaty of Versailles', b: 'Cause' },
      { t: 'The Great Depression', b: 'Cause' },
      { t: 'The founding of the United Nations', b: 'Consequence' },
      { t: 'India’s independence in 1947', b: 'Consequence' },
      { t: 'The rise of Hitler', b: 'Cause' },
      { t: 'The Universal Declaration of Human Rights', b: 'Consequence' },
    ],
  },
];

/* ---- 5. DEBATE ARENA — topics (stored on Neon via the wall, two sides) ---- */
const DEBATES = [
  { id: 'versailles', q: 'Was the Treaty of Versailles fair?', for: 'Yes, it was fair', against: 'No, it was too harsh',
    ctx: 'Germany was forced to accept blame and pay crushing reparations. Justice for a brutal war — or the seed of the next one?' },
  { id: 'nonviolence', q: 'Was non-violence the best path to India’s freedom?', for: 'Yes, satyagraha', against: 'No, force was needed',
    ctx: 'Gandhi chose non-violence; Bose built an army. Both wanted freedom. Which approach do you think mattered more?' },
  { id: 'memory', q: 'Should we still study these wars in school today?', for: 'Yes, we must remember', against: 'No, it’s the past',
    ctx: '"Those who cannot remember the past are condemned to repeat it." Do these 100-year-old events still matter to your life?' },
];
