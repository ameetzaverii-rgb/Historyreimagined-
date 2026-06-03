/* ============================================================================
   HistoryReimagined — Content Layer
   Module: "From Trenches to Tyranny — WW1, the Interwar Years & WW2"
   Aligned to NCERT Social Science, Grades 8–9–10.

   All historical content is grounded in the NCERT curriculum and reputable
   open educational resources. Images are drawn from Wikimedia Commons and
   degrade gracefully (see imgFallback in app.js) when a URL is unavailable.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. NCERT CURRICULUM ATLAS  (Grades 8 · 9 · 10)
   Official textbook PDF codes:
     Class 8 History "Our Pasts III"            -> hess3xx.pdf
     Class 9 History "...Contemporary World-I"  -> iess3xx.pdf
     Class 10 History "...Contemporary World-II"-> jess3xx.pdf
   The WW module anchors on Class 9 Ch.2 & Ch.3 and Class 10 Ch.1 & Ch.3.
   -------------------------------------------------------------------------- */
const NCERT = {
  pdfBase: 'https://ncert.nic.in/textbook/pdf/',
  portal: 'https://ncert.nic.in/textbook.php',
  grades: [
    {
      grade: 8,
      subject: 'History — Our Pasts III',
      code: 'hess3',
      blurb: 'Colonial India: how British rule reshaped trade, land, education and sparked the freedom struggle — the backdrop to the World Wars.',
      chapters: [
        { n: 1, t: 'How, When and Where', pdf: 'hess301.pdf' },
        { n: 2, t: 'From Trade to Territory', pdf: 'hess302.pdf' },
        { n: 3, t: 'Ruling the Countryside', pdf: 'hess303.pdf' },
        { n: 4, t: 'Tribals, Dikus and the Vision of a Golden Age', pdf: 'hess304.pdf' },
        { n: 5, t: 'When People Rebel — 1857 and After', pdf: 'hess305.pdf' },
        { n: 6, t: 'Civilising the "Native", Educating the Nation', pdf: 'hess306.pdf' },
        { n: 7, t: 'Women, Caste and Reform', pdf: 'hess307.pdf' },
        { n: 8, t: 'The Making of the National Movement: 1870s–1947', pdf: 'hess308.pdf', link: true },
      ],
    },
    {
      grade: 9,
      subject: 'History — India and the Contemporary World-I',
      code: 'iess3',
      blurb: 'The age of revolutions and dictatorships. This is the home of our module — the Russian Revolution and the rise of Nazism.',
      chapters: [
        { n: 1, t: 'The French Revolution', pdf: 'iess301.pdf' },
        { n: 2, t: 'Socialism in Europe and the Russian Revolution', pdf: 'iess302.pdf', link: true },
        { n: 3, t: 'Nazism and the Rise of Hitler', pdf: 'iess303.pdf', anchor: true },
        { n: 4, t: 'Forest Society and Colonialism', pdf: 'iess304.pdf' },
        { n: 5, t: 'Pastoralists in the Modern World', pdf: 'iess305.pdf' },
      ],
    },
    {
      grade: 10,
      subject: 'History — India and the Contemporary World-II',
      code: 'jess3',
      blurb: 'Nationalism, globalisation and industrialisation — how WW1 reshaped Europe and India’s freedom struggle.',
      chapters: [
        { n: 1, t: 'The Rise of Nationalism in Europe', pdf: 'jess301.pdf', link: true },
        { n: 2, t: 'Nationalism in India', pdf: 'jess302.pdf', link: true },
        { n: 3, t: 'The Making of a Global World', pdf: 'jess303.pdf', link: true },
        { n: 4, t: 'The Age of Industrialisation', pdf: 'jess304.pdf' },
        { n: 5, t: 'Print Culture and the Modern World', pdf: 'jess305.pdf' },
      ],
    },
  ],
};

/* --------------------------------------------------------------------------
   2. THE MODULE — meta + pedagogy (Gagné's 9 Events + Bloom's Taxonomy)
   -------------------------------------------------------------------------- */
const MODULE = {
  title: 'From Trenches to Tyranny',
  subtitle: 'WW1, the Interwar Years & the Rise of Nazism',
  hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/WW2_Photographer_in_Battle_of_the_Bulge.jpg/1280px-WW2_Photographer_in_Battle_of_the_Bulge.jpg',
  anchor: 'NCERT Class 9 · Ch. 2 & 3   ·   Class 10 · Ch. 1 & 3',
  essentialQuestion: 'How does a society move from a world war to peace — and then stumble into an even greater catastrophe?',
  // Gagné's Nine Events of Instruction, mapped to features in this app.
  gagne: [
    { n: 1, t: 'Gain Attention', d: 'A single rifle shot in Sarajevo opens the Story Mode cold-open.', where: 'story' },
    { n: 2, t: 'Inform Objectives', d: 'The learning path below states exactly what you will be able to do.', where: 'home' },
    { n: 3, t: 'Recall Prior Knowledge', d: 'Curriculum Atlas links back to the French & Russian Revolutions you already studied.', where: 'atlas' },
    { n: 4, t: 'Present Content', d: 'Story Mode, Timeline, Personalities and Wars present the material as narrative.', where: 'story' },
    { n: 5, t: 'Provide Guidance', d: 'The AI Mentor and tooltip glossary scaffold tricky terms.', where: 'tutor' },
    { n: 6, t: 'Elicit Performance', d: 'Bloom’s Activity Ladder asks you to do history, not just read it.', where: 'activities' },
    { n: 7, t: 'Provide Feedback', d: 'The gamified Quiz gives instant, explained feedback.', where: 'quiz' },
    { n: 8, t: 'Assess Performance', d: 'XP, ranks and badges track mastery as you progress.', where: 'rank' },
    { n: 9, t: 'Enhance Retention', d: 'Build a Walkthrough Portfolio and teach a friend in the Collaboration wall.', where: 'portfolio' },
  ],
  // Bloom's revised taxonomy — used to tag quiz items and activities.
  bloom: [
    { level: 1, t: 'Remember',  color: '#1A6035', verb: 'recall key dates, people and terms' },
    { level: 2, t: 'Understand',color: '#1A4878', verb: 'explain causes and consequences in your own words' },
    { level: 3, t: 'Apply',     color: '#0E7C86', verb: 'use a concept to read a new source or map' },
    { level: 4, t: 'Analyse',   color: '#9A7228', verb: 'compare propaganda, weigh competing causes' },
    { level: 5, t: 'Evaluate',  color: '#B5651D', verb: 'judge decisions — was Versailles fair?' },
    { level: 6, t: 'Create',    color: '#B02416', verb: 'compose your own walkthrough and teach it' },
  ],
  objectives: [
    'Trace the chain of causes from 1914 to 1945 and explain why "the war to end all wars" did not.',
    'Explain how the Treaty of Versailles and the Great Depression created the conditions for Nazism (NCERT Cl.9 Ch.3).',
    'Analyse how propaganda, youth indoctrination and racism built the Nazi state.',
    'Connect these global events to India’s freedom struggle and the world order of 1945.',
  ],
};

/* --------------------------------------------------------------------------
   3. INTERACTIVE TIMELINE  (1914 – 1947)
   type: war | politics | india | turning  — used for filtering & colour.
   -------------------------------------------------------------------------- */
const TIMELINE = [
  { y: 1914, m: 'Jun', t: 'The Spark at Sarajevo', type: 'turning', d: 'Archduke Franz Ferdinand of Austria-Hungary is assassinated by Gavrilo Princip. Within weeks, Europe’s alliance system drags the continent into war.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sarajevo_assassination_Vladimir_Gacinovic.jpg/640px-Sarajevo_assassination_Vladimir_Gacinovic.jpg' },
  { y: 1914, m: 'Aug', t: 'World War I Begins', type: 'war', d: 'The Central Powers (Germany, Austria-Hungary) face the Allies (Britain, France, Russia). The "war to end all wars" begins.' },
  { y: 1916, m: 'Jul', t: 'The Somme & Verdun', type: 'war', d: 'Industrial slaughter in the trenches. Over a million casualties at the Somme alone. Modern weapons meet 19th-century tactics.' },
  { y: 1917, m: 'Nov', t: 'The Russian Revolution', type: 'turning', d: 'Lenin’s Bolsheviks seize power. Russia exits the war. The world’s first socialist state is born. (NCERT Cl.9 Ch.2)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/19191107-lenin_second_anniversary_october_revolution_moscow.jpg/640px-19191107-lenin_second_anniversary_october_revolution_moscow.jpg' },
  { y: 1918, m: 'Nov', t: 'Armistice — WW1 Ends', type: 'war', d: 'Germany surrenders. ~17 million are dead. Four empires have collapsed. The map of Europe is redrawn.' },
  { y: 1919, m: 'Jun', t: 'Treaty of Versailles', type: 'politics', d: 'Germany is forced to accept guilt, lose territory and pay crushing reparations. Many Germans call it the "Diktat". The seeds of the next war are sown.' },
  { y: 1919, m: 'Apr', t: 'Jallianwala Bagh', type: 'india', d: 'British troops fire on unarmed Indians in Amritsar. The massacre transforms India’s freedom struggle. (NCERT Cl.10 Ch.2)' },
  { y: 1923, m: '—', t: 'Hyperinflation', type: 'politics', d: 'The German mark collapses. A loaf of bread costs billions. Savings are wiped out. The Weimar Republic teeters. (NCERT Cl.9 Ch.3)' },
  { y: 1929, m: 'Oct', t: 'The Great Depression', type: 'turning', d: 'Wall Street crashes. Global trade collapses. By 1932, one in three German workers is jobless — fertile ground for extremism.' },
  { y: 1933, m: 'Jan', t: 'Hitler Becomes Chancellor', type: 'turning', d: 'The Nazi Party turns democracy against itself. Within months, civil rights are suspended and a one-party state is built. (NCERT Cl.9 Ch.3)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg/480px-Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg' },
  { y: 1935, m: '—', t: 'The Nuremberg Laws', type: 'politics', d: 'Racist laws strip German Jews of citizenship. The Nazi "racial state" is codified in law.' },
  { y: 1939, m: 'Sep', t: 'World War II Begins', type: 'war', d: 'Germany invades Poland. Britain and France declare war. The deadliest conflict in history begins.' },
  { y: 1941, m: 'Jun', t: 'Operation Barbarossa', type: 'war', d: 'Germany invades the USSR — the largest invasion in history. The Eastern Front becomes the war’s bloodiest theatre.' },
  { y: 1941, m: 'Dec', t: 'Pearl Harbor', type: 'turning', d: 'Japan attacks the US fleet. America enters the war. The conflict is now truly global.' },
  { y: 1942, m: 'Aug', t: 'Quit India Movement', type: 'india', d: 'Gandhi demands an end to British rule. "Do or Die." Even as 2.5 million Indians serve in the war, India demands freedom. (NCERT Cl.10 Ch.2)' },
  { y: 1943, m: 'Feb', t: 'Stalingrad', type: 'war', d: 'The Soviet Union destroys Germany’s 6th Army. The turning point of the war in Europe.' },
  { y: 1944, m: 'Jun', t: 'D-Day', type: 'war', d: 'The largest seaborne invasion in history opens the Western Front in France.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/640px-Into_the_Jaws_of_Death_23-0455M_edit.jpg' },
  { y: 1945, m: 'May', t: 'The Holocaust Revealed', type: 'turning', d: 'As Allies liberate the camps, the full horror of the genocide of six million Jews and millions of others is exposed to the world.' },
  { y: 1945, m: 'Aug', t: 'WW2 Ends', type: 'war', d: 'Atomic bombs fall on Hiroshima and Nagasaki. Japan surrenders. 70–85 million are dead worldwide.' },
  { y: 1945, m: 'Oct', t: 'The United Nations', type: 'politics', d: 'Out of the ashes, 51 nations found the UN to prevent another world war — a direct consequence of the conflict.' },
  { y: 1947, m: 'Aug', t: 'India Wins Independence', type: 'india', d: 'A war-weakened Britain withdraws. India is free — two years after the war it helped win. Your history and world history are one. (NCERT Cl.8 Ch.8)', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Jawaharlal_Nehru_-_1947.jpg/480px-Jawaharlal_Nehru_-_1947.jpg' },
];

/* --------------------------------------------------------------------------
   4. PERSONALITIES  (side: allied | axis | india | revolution | victim)
   -------------------------------------------------------------------------- */
const PEOPLE = [
  { id: 'princip', name: 'Gavrilo Princip', years: '1894–1918', role: 'The Assassin', side: 'revolution', country: 'Bosnia',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Gavrilo_Princip_cell.jpg/480px-Gavrilo_Princip_cell.jpg',
    blurb: 'A 19-year-old Bosnian-Serb nationalist whose single act lit the fuse of WW1.',
    facts: ['Shot Archduke Franz Ferdinand in Sarajevo, 28 June 1914.', 'Too young for the death penalty; died of tuberculosis in prison.', 'His act triggered the alliance system that pulled in all of Europe.'],
    matters: 'Shows how one event can detonate decades of built-up tension — imperialism, nationalism and rival alliances.' },
  { id: 'wilson', name: 'Woodrow Wilson', years: '1856–1924', role: 'US President · Peacemaker', side: 'allied', country: 'USA',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/President_Woodrow_Wilson_portrait_December_2_1912.jpg/480px-President_Woodrow_Wilson_portrait_December_2_1912.jpg',
    blurb: 'Brought the USA into WW1 and proposed the "Fourteen Points" for a just peace.',
    facts: ['His Fourteen Points called for self-determination and open diplomacy.', 'Championed the League of Nations — which the US Senate then refused to join.', 'Won the Nobel Peace Prize in 1919.'],
    matters: 'His idealism shaped the peace — but a weakened League could not stop the next war.' },
  { id: 'lenin', name: 'Vladimir Lenin', years: '1870–1924', role: 'Bolshevik Leader', side: 'revolution', country: 'Russia',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Vladimir_Lenin.jpg/480px-Vladimir_Lenin.jpg',
    blurb: 'Led the 1917 October Revolution and founded the Soviet state. (NCERT Cl.9 Ch.2)',
    facts: ['Promised "Peace, Land and Bread" to a war-weary Russia.', 'Pulled Russia out of WW1 in 1918.', 'Built the world’s first communist state.'],
    matters: 'The Russian Revolution terrified Europe’s elites — a fear Hitler later exploited to gain support.' },
  { id: 'gandhi', name: 'Mahatma Gandhi', years: '1869–1948', role: 'Leader of India’s Freedom Struggle', side: 'india', country: 'India',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/480px-Mahatma-Gandhi%2C_studio%2C_1931.jpg',
    blurb: 'Led non-violent resistance to British rule even as the World Wars raged. (NCERT Cl.10 Ch.2)',
    facts: ['Launched the Quit India Movement in 1942: "Do or Die."', 'Insisted freedom be won without violence — satyagraha.', 'India’s war contribution + his movement broke British power.'],
    matters: 'Connects world history to your history: WW2 exhausted Britain and accelerated Indian independence in 1947.' },
  { id: 'bose', name: 'Subhas Chandra Bose', years: '1897–1945', role: 'Leader, Indian National Army', side: 'india', country: 'India',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Subhas_Chandra_Bose_NRB.jpg/480px-Subhas_Chandra_Bose_NRB.jpg',
    blurb: 'Took a different path — allied with the Axis to fight British rule from outside.',
    facts: ['Formed the Azad Hind Fauj (Indian National Army).', '"Give me blood and I will give you freedom."', 'Shows the freedom struggle was not a single, simple story.'],
    matters: 'Reveals the hard choices colonised peoples faced when the imperial powers went to war.' },
  { id: 'hitler', name: 'Adolf Hitler', years: '1889–1945', role: 'Dictator of Nazi Germany', side: 'axis', country: 'Germany',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg/480px-Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg',
    blurb: 'Turned a wounded democracy into a genocidal dictatorship. (NCERT Cl.9 Ch.3)',
    facts: ['Used the Depression and Versailles resentment to seize power in 1933.', 'Built a "racial state" and ordered the Holocaust.', 'His invasion of Poland began WW2; he died in Berlin in 1945.'],
    matters: 'A central warning of the module: how democracies can be destroyed from within when people stop defending them.' },
  { id: 'mussolini', name: 'Benito Mussolini', years: '1883–1945', role: 'Fascist Dictator of Italy', side: 'axis', country: 'Italy',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Mussolini_biografia.jpg/480px-Mussolini_biografia.jpg',
    blurb: 'Invented fascism and was Hitler’s model and ally.',
    facts: ['Coined "fascism" and the cult of the all-powerful leader.', 'Promised to restore the glory of the Roman Empire.', 'Allied Italy with Germany and Japan in the Axis.'],
    matters: 'Fascism was a Europe-wide movement, not a German accident — that makes its warning universal.' },
  { id: 'churchill', name: 'Winston Churchill', years: '1874–1965', role: 'British Prime Minister', side: 'allied', country: 'Britain',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/BritishGovernment-Churchill.jpg/480px-BritishGovernment-Churchill.jpg',
    blurb: 'Rallied Britain through its darkest hour against Nazi Germany.',
    facts: ['"We shall fight on the beaches… we shall never surrender."', 'Led Britain through the Blitz and the Battle of Britain.', 'A complex figure — a war hero whose views on India remain controversial.'],
    matters: 'Leadership and words can hold a society together under existential threat.' },
  { id: 'fdr', name: 'Franklin D. Roosevelt', years: '1882–1945', role: 'US President', side: 'allied', country: 'USA',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/FDR_1944_Color_Portrait.tif/lossy-page1-480px-FDR_1944_Color_Portrait.tif.jpg',
    blurb: 'Led the USA out of the Depression and into the Allied war effort.',
    facts: ['His "New Deal" fought the Great Depression at home.', 'Made the US the "Arsenal of Democracy".', 'Helped design the United Nations he did not live to see.'],
    matters: 'A democratic answer to the Depression — the opposite path to the one Germany took.' },
  { id: 'stalin', name: 'Joseph Stalin', years: '1878–1953', role: 'Leader of the USSR', side: 'allied', country: 'USSR',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/CroppedStalin1943.jpg/480px-CroppedStalin1943.jpg',
    blurb: 'Soviet dictator whose Red Army broke the back of the German war machine.',
    facts: ['The USSR suffered ~27 million deaths — more than any nation.', 'Stalingrad (1943) turned the war in Europe.', 'A ruthless ruler whose own regime killed millions.'],
    matters: 'History is rarely a clean fight of good vs evil — the Allies included a brutal dictator.' },
  { id: 'annefrank', name: 'Anne Frank', years: '1929–1945', role: 'Diarist · Witness', side: 'victim', country: 'Germany / Netherlands',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Anne_Frank_passport_photo%2C_May_1942.jpg/480px-Anne_Frank_passport_photo%2C_May_1942.jpg',
    blurb: 'A teenager whose diary gave a human face to the six million murdered.',
    facts: ['Hid with her family in Amsterdam for two years.', 'Her diary is read in classrooms across the world.', 'Died in Bergen-Belsen, weeks before liberation, aged 15.'],
    matters: 'Behind every statistic is a person your own age. History is human, not just dates.' },
];

/* --------------------------------------------------------------------------
   5. WARS & CONFLICTS  (with map pins)
   -------------------------------------------------------------------------- */
const WARS = [
  {
    id: 'ww1', name: 'World War I', years: '1914–1918', tag: 'The Great War',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cheshire_Regiment_trench_Somme_1916.jpg/960px-Cheshire_Regiment_trench_Somme_1916.jpg',
    summary: 'A war of empires and alliances fought largely in trenches. New industrial weapons — machine guns, gas, tanks — produced casualties on a scale never seen before.',
    causes: ['Militarism — an arms race between the great powers', 'Alliances — two rival blocs ready to spring', 'Imperialism — competition for colonies and resources', 'Nationalism — pride and rivalry that made war feel glorious'],
    stats: [['Duration', '4 years'], ['Deaths', '~17 million'], ['Empires fallen', '4'], ['Indian soldiers', '1.3 million']],
    outcome: 'Germany and Austria-Hungary were defeated; the Treaty of Versailles imposed a harsh peace that left deep resentment.',
  },
  {
    id: 'ww2', name: 'World War II', years: '1939–1945', tag: 'The Deadliest Conflict',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/1280px-Into_the_Jaws_of_Death_23-0455M_edit.jpg',
    summary: 'A truly global war between the Allies and the Axis. It included the Holocaust, the only wartime use of atomic weapons, and the deaths of more civilians than soldiers.',
    causes: ['The harsh Treaty of Versailles & German resentment', 'The Great Depression and mass unemployment', 'The rise of fascism and Hitler’s expansionism', 'The failure of the League of Nations to keep peace'],
    stats: [['Duration', '6 years'], ['Deaths', '70–85 million'], ['Nations', '30+'], ['Indian soldiers', '2.5 million']],
    outcome: 'Allied victory; the Holocaust exposed; the United Nations founded; empires crumbled and India moved towards independence.',
  },
];

// Map pins for the WW1 → WW2 theatre (positioned on a Europe schematic, % coords)
// Each has a THEN (history) and a NOW (live Google Map + the place today).
const MAP_PINS = [
  { id: 'sarajevo', x: 56, y: 62, side: 'spark', t: 'Sarajevo', tag: 'WW1 · 1914', flag: '🇧🇦',
    tx: 'Where the assassination of Archduke Franz Ferdinand sparked WW1.', fa: 'One bullet here pulled all of Europe into war within six weeks.',
    place: 'Sarajevo, Bosnia and Herzegovina',
    today: 'Today Sarajevo is the lively capital of Bosnia and Herzegovina — a meeting point of cultures where Ottoman mosques, Catholic and Orthodox churches and a synagogue stand within minutes of each other. Its old bazaar, Baščaršija, buzzes with coffee houses, and the city hosted the 1984 Winter Olympics.' },
  { id: 'versailles', x: 30, y: 47, side: 'politics', t: 'Versailles', tag: 'Peace · 1919', flag: '🇫🇷',
    tx: 'The palace where Germany was forced to sign the treaty ending WW1.', fa: 'Germans called it the "Diktat" — a dictated peace, not a negotiated one.',
    place: 'Palace of Versailles, France',
    today: 'The Palace of Versailles near Paris is now a UNESCO World Heritage Site and one of the world’s most visited museums, famous for its dazzling Hall of Mirrors — the very room where the treaty was signed — and its vast formal gardens.' },
  { id: 'berlin', x: 50, y: 38, side: 'axis', t: 'Berlin', tag: 'Nazi Capital', flag: '🇩🇪',
    tx: 'Heart of Nazi Germany — where Hitler took power in 1933 and died in 1945.', fa: 'A democracy was dismantled here in months — legally, from within.',
    place: 'Brandenburg Gate, Berlin, Germany',
    today: 'Berlin is the creative, open capital of a democratic, reunified Germany — a world capital of art, music and nightlife. The Brandenburg Gate and preserved fragments of the Berlin Wall remind visitors how a divided city became a symbol of freedom.' },
  { id: 'stalingrad', x: 82, y: 42, side: 'allied', t: 'Stalingrad', tag: 'WW2 · 1943', flag: '🇷🇺',
    tx: 'The Soviet Union destroyed the German 6th Army here — the war’s turning point.', fa: 'Often called the single bloodiest battle in human history.',
    place: 'The Motherland Calls, Volgograd, Russia',
    today: 'Stalingrad is now called Volgograd. Towering over the city is "The Motherland Calls", one of the tallest statues on Earth, honouring those who died. The riverside city is a major industrial hub on the Volga.' },
  { id: 'normandy', x: 26, y: 42, side: 'allied', t: 'Normandy', tag: 'D-Day · 1944', flag: '🇫🇷',
    tx: 'The largest seaborne invasion in history opened the Western Front.', fa: '156,000 troops crossed the Channel in a single day.',
    place: 'Normandy American Cemetery, Colleville-sur-Mer, France',
    today: 'The Normandy coast in France is a place of remembrance — cemeteries, museums and the preserved beaches (Omaha, Utah, Juno). The wider region is also famous for its apple orchards, cider, Camembert cheese and pretty seaside towns.' },
  { id: 'auschwitz', x: 58, y: 40, side: 'victim', t: 'Auschwitz', tag: 'Holocaust', flag: '🇵🇱',
    tx: 'The largest Nazi death camp, in German-occupied Poland.', fa: 'Over 1.1 million people were murdered here — most of them Jewish.',
    place: 'Auschwitz-Birkenau Memorial and Museum, Oświęcim, Poland',
    today: 'The site is preserved as the Auschwitz-Birkenau Memorial and Museum near the Polish town of Oświęcim. People from across the world visit so that the world never forgets — a solemn promise of "never again".' },
];

/* --------------------------------------------------------------------------
   6. STORY MODE — 7 scenes, narrative arc with interstitial facts
   extra types: fact | pull | tl (timeline) | did (did-you-know interstitial)
   -------------------------------------------------------------------------- */
const STORY = [
  { ch: 'Scene 1 · The Spark', ti: 'Sarajevo, 28 June 1914', su: 'One shot. One street corner. A world about to end.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Sarajevo_assassination_Vladimir_Gacinovic.jpg/960px-Sarajevo_assassination_Vladimir_Gacinovic.jpg',
    cr: 'Wikimedia Commons — Sarajevo, 1914', lead: true, bloom: 'Remember',
    body: 'A wrong turn. A car reversing on a narrow street. And there, by chance, stood a nineteen-year-old named <span class="hl" data-term="Gavrilo Princip" data-def="A Bosnian-Serb nationalist who assassinated Archduke Franz Ferdinand, heir to Austria-Hungary, on 28 June 1914.">Gavrilo Princip</span>. He fired twice. Within six weeks, the alliances that had been quietly arming for decades pulled the whole of Europe into the <strong>Great War</strong>. This is how it began — not with a grand decision, but with a chain of pride, fear and rival empires that had been waiting for a spark.',
    extra: { type: 'fact', label: 'Why a single shot caused a world war', text: 'Europe in 1914 was a web of secret alliances. When Austria-Hungary attacked Serbia, Russia defended Serbia, Germany backed Austria, France backed Russia, and Britain joined too. The "MAIN" causes — Militarism, Alliances, Imperialism, Nationalism — turned a local murder into a global catastrophe.' } },

  { ch: 'Scene 2 · The Trenches', ti: 'The War Nobody Could Win', su: 'Modern machines. Old tactics. A generation in the mud.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cheshire_Regiment_trench_Somme_1916.jpg/1280px-Cheshire_Regiment_trench_Somme_1916.jpg',
    cr: 'Imperial War Museum — Cheshire Regiment, Somme 1916', bloom: 'Understand',
    body: 'Soldiers dug <span class="hl" data-term="Trench Warfare" data-def="A style of fighting from deep ditches. It produced a deadly stalemate where neither side could advance without enormous loss of life.">trenches</span> from the sea to the mountains and could not move. Machine guns and artillery made attack almost suicidal. At the Somme in 1916, over a million men became casualties for a few miles of mud. Among them were <strong>over a million Indians</strong> who served the British Empire far from home — a fact rarely told in the West.',
    extra: { type: 'pull', text: '"I died in hell — they called it Passchendaele."', author: 'Siegfried Sassoon, soldier-poet of WW1' } },

  { ch: 'Scene 3 · The Reckoning', ti: 'Versailles, 1919', su: 'The guns fall silent. The resentment begins.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/William_Orpen_%E2%80%93_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles_1919%2C_Ausschnitt.jpg/1280px-William_Orpen_%E2%80%93_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles_1919%2C_Ausschnitt.jpg',
    cr: 'William Orpen — The Signing of Peace at Versailles, 1919', bloom: 'Evaluate',
    body: 'When the war ended, the winners met at <span class="hl" data-term="Treaty of Versailles" data-def="The 1919 peace treaty that forced Germany to accept blame for the war, lose land and pay huge reparations. Many Germans saw it as a humiliation.">Versailles</span>. Germany was forced to accept full blame, surrender territory, and pay reparations it could never afford. US President <strong>Woodrow Wilson</strong> dreamed of a "just peace" and a League of Nations — but the treaty was harsh, and Germans called it the <em>Diktat</em>: a peace dictated to them. <strong>Ask yourself:</strong> was this justice, or the seed of the next war?',
    extra: { type: 'did', text: 'The Treaty of Versailles forced Germany to pay reparations equal to roughly £6.6 billion — a debt it only finished paying off in 2010, ninety-one years later.' } },

  { ch: 'Scene 4 · The Weimar Years', ti: 'A Democracy Under Siege', su: 'Hunger, hyperinflation and a republic that could not breathe.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/German_Hyperinflation.svg/960px-German_Hyperinflation.svg.png',
    cr: 'Wikimedia — German hyperinflation, 1923', bloom: 'Analyse',
    body: 'After the war, Germany became a fragile democracy: the <span class="hl" data-term="Weimar Republic" data-def="Germany’s democratic government from 1919–1933. It was blamed for the defeat and the Versailles treaty, and battered by economic crises.">Weimar Republic</span>. In 1923, money became worthless — people burned banknotes for heat and carried wages in wheelbarrows. Then in 1929, the <strong>Great Depression</strong> struck. By 1932, one in three German workers had no job. Desperate, frightened people began to listen to anyone who promised to make Germany strong again. (NCERT Class 9, Chapter 3)',
    extra: { type: 'tl', items: [
      { d: '1919', t: 'The democratic <strong>Weimar Republic</strong> is born — and immediately blamed for the defeat.' },
      { d: '1923', t: '<strong>Hyperinflation</strong>: a loaf of bread costs 200 billion marks.' },
      { d: '1929', t: 'The <strong>Great Depression</strong> wipes out jobs and savings.' },
      { d: '1932', t: 'Unemployment hits <strong>6 million</strong>. The Nazis become the largest party.' },
    ] } },

  { ch: 'Scene 5 · The Rise', ti: 'How a Democracy Was Destroyed', su: 'Not by tanks — but by propaganda, fear and the ballot box.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg/800px-Bundesarchiv_Bild_183-S33882%2C_Adolf_Hitler_retouched.jpg',
    cr: 'Bundesarchiv — Adolf Hitler', bloom: 'Analyse',
    body: '<span class="hl" data-term="Adolf Hitler" data-def="Dictator of Germany 1933–1945. He turned a democracy into a genocidal one-party state and started WW2.">Adolf Hitler</span> did not seize power in a coup — he was <em>appointed</em> Chancellor in January 1933. Then, step by legal step, he dismantled democracy: banning rival parties, controlling the press, and using <span class="hl" data-term="Propaganda" data-def="Information — often misleading — designed to shape how people think and feel. The Nazis were masters of it, using radio, film, posters and mass rallies.">propaganda</span> to flood every cinema, radio and classroom with one message. Children were enrolled in the Hitler Youth; teachers who disagreed were dismissed. A modern, educated nation was turned into a dictatorship in months.',
    extra: { type: 'fact', label: 'The machinery of belief (NCERT Cl.9 Ch.3)', text: 'The Nazis never used the words "kill" or "murder" in public. Mass killing was hidden behind terms like "special treatment" and "final solution". Language itself became a weapon — which is why historians teach you to read sources critically.' } },

  { ch: 'Scene 6 · The Abyss', ti: 'War and the Holocaust', su: 'The world at war again — and a crime without precedent.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Anne_Frank_passport_photo%2C_May_1942.jpg/640px-Anne_Frank_passport_photo%2C_May_1942.jpg',
    cr: 'Anne Frank, passport photo, 1942', bloom: 'Understand',
    body: 'In 1939 Hitler invaded Poland and the <strong>Second World War</strong> began. Behind the front lines, the Nazi state carried out the <span class="hl" data-term="The Holocaust" data-def="The systematic, state-organised murder of six million Jewish people, along with Roma, disabled people, and others the Nazis deemed ‘unworthy’.">Holocaust</span> — the deliberate murder of six million Jewish men, women and children, and millions of others. One of them was a girl your age named <strong>Anne Frank</strong>, who hid in an attic in Amsterdam and kept a diary. She did not survive. Her words did.',
    extra: { type: 'pull', text: '"In spite of everything, I still believe that people are really good at heart."', author: 'Anne Frank, The Diary of a Young Girl' } },

  { ch: 'Scene 7 · The Dawn', ti: '1945 — and What It Means for You', su: 'From the ashes: a new world order, and a free India.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Jawaharlal_Nehru_-_1947.jpg/640px-Jawaharlal_Nehru_-_1947.jpg',
    cr: 'Jawaharlal Nehru, 1947', bloom: 'Create',
    body: 'In 1945 the war ended and the world counted its dead: <strong>70 to 85 million</strong> people. Out of the ruins, 51 nations founded the <span class="hl" data-term="United Nations" data-def="An organisation of nations created in 1945 to prevent another world war through dialogue and cooperation.">United Nations</span>. And a Britain exhausted by war could no longer hold its empire. <strong>Over 2.5 million Indians had served</strong> — the largest volunteer army in history. Just two years later, in 1947, India was free. The world you live in — the UN, your independence, your rights — was forged in these years. <em>This is your history. Now go and tell it.</em>',
    extra: { type: 'did', text: 'The phrase "human rights" entered everyday language because of this era. The 1948 Universal Declaration of Human Rights was a direct response to the Holocaust — a promise of "never again".' } },
];

/* --------------------------------------------------------------------------
   7. INTERSTITIAL "DID YOU KNOW" FACTS (shown between scenes & on home)
   -------------------------------------------------------------------------- */
const FACTS = [
  'Over 1.3 million Indian soldiers served in WW1 and 2.5 million in WW2 — the largest volunteer armies in history.',
  'WW1 was called "the war to end all wars". It ended 21 years before the next one began.',
  'During the 1923 hyperinflation, German children played with bricks of worthless banknotes — it was cheaper than buying toys.',
  'The word "genocide" did not exist until 1944 — it was invented to describe the Holocaust.',
  'Radar, jet engines, computers and antibiotics were all pushed forward by WW2 research.',
  'The United Nations and the Universal Declaration of Human Rights were both born directly out of this war.',
  'Stalingrad (1942–43) is often called the bloodiest battle in human history.',
  'Anne Frank’s diary has been translated into more than 70 languages.',
];

/* --------------------------------------------------------------------------
   8. QUIZ — Bloom-tagged, gamified
   -------------------------------------------------------------------------- */
const QUIZ = [
  { bloom: 'Remember', q: 'Whose assassination in Sarajevo in 1914 triggered World War I?', o: ['Adolf Hitler', 'Archduke Franz Ferdinand', 'Woodrow Wilson', 'Vladimir Lenin'], c: 1,
    fb: '<strong>Correct.</strong> Archduke Franz Ferdinand, heir to Austria-Hungary, was shot by Gavrilo Princip — the spark that lit Europe’s alliance system.' },
  { bloom: 'Understand', q: 'Why did many Germans bitterly resent the Treaty of Versailles?', o: ['It gave Germany new colonies', 'It forced Germany to accept blame and pay huge reparations', 'It made Germany a democracy', 'It united Germany and Austria'], c: 1,
    fb: '<strong>Right.</strong> Germany was forced to accept guilt and pay crushing reparations. Many called it the "Diktat" — a humiliation that Hitler later exploited.' },
  { bloom: 'Analyse', q: 'According to NCERT, what conditions helped the Nazis rise to power?', o: ['A strong economy and stable government', 'The Great Depression and resentment over Versailles', 'A foreign invasion of Germany', 'The success of the League of Nations'], c: 1,
    fb: '<strong>Exactly.</strong> Mass unemployment from the Depression plus the wound of Versailles made desperate people open to extreme promises.' },
  { bloom: 'Analyse', q: 'How did Hitler mainly turn Germany into a dictatorship?', o: ['Through a sudden military coup', 'By winning a foreign war first', 'Step-by-step, using legal powers, propaganda and fear', 'By a vote of every German citizen'], c: 2,
    fb: '<strong>Correct.</strong> He was appointed Chancellor, then dismantled democracy legally — banning parties, controlling media and flooding society with propaganda.' },
  { bloom: 'Understand', q: 'What was the Holocaust?', o: ['A major battle of WW2', 'A peace treaty', 'The state-organised murder of six million Jews and millions of others', 'A German economic plan'], c: 2,
    fb: '<strong>Yes.</strong> The Holocaust was the systematic genocide carried out by the Nazi state — the central human tragedy of the era.' },
  { bloom: 'Evaluate', q: 'How does WW2 connect to India’s independence in 1947?', o: ['It has no connection', 'The war weakened Britain, accelerating India’s freedom', 'India invaded Britain', 'Britain rewarded India with a colony'], c: 1,
    fb: '<strong>Well judged.</strong> 2.5 million Indians served, and a war-exhausted Britain could no longer hold its empire — India was free just two years later.' },
];

/* --------------------------------------------------------------------------
   9. MEDIA LIBRARY — Open Educational Resources + YouTube
   YouTube IDs verified against the CrashCourse channel.
   -------------------------------------------------------------------------- */
const MEDIA = {
  videos: [
    { id: '_XPZQ0LAlR4', t: 'Archdukes, Cynicism & World War I', src: 'CrashCourse World History #36', tag: 'WW1' },
    { id: 'Q78COTwT7nE', t: 'World War II', src: 'CrashCourse World History #38', tag: 'WW2' },
    { id: 'KGlmlSTn-eM', t: 'The Roads to World War I', src: 'CrashCourse European History #32', tag: 'Causes' },
    { id: 'Hs_JMydrxZM', t: 'World War II — European Theatre', src: 'CrashCourse European History #38', tag: 'WW2' },
  ],
  oer: [
    { t: 'NCERT — Nazism and the Rise of Hitler', src: 'Official Class 9 Chapter 3 (PDF)', tag: 'Textbook', url: 'https://ncert.nic.in/textbook/pdf/iess303.pdf' },
    { t: 'NCERT — Socialism in Europe & the Russian Revolution', src: 'Official Class 9 Chapter 2 (PDF)', tag: 'Textbook', url: 'https://ncert.nic.in/textbook/pdf/iess302.pdf' },
    { t: 'Khan Academy — What Caused the First World War?', src: 'World History Project (free)', tag: 'Article', url: 'https://www.khanacademy.org/humanities/whp-1750/xcabef9ed3fc7da7b:unit-6-world-war-i' },
    { t: 'OER Commons — MAIN Causes of World War I', src: 'Open lesson & activities', tag: 'Lesson', url: 'https://oercommons.org/courseware/lesson/64967/overview' },
    { t: 'Anne Frank House — Her Story', src: 'Museum learning resources', tag: 'Primary', url: 'https://www.annefrank.org/en/anne-frank/' },
    { t: 'Wikimedia Commons — WW1/WW2 Image Archive', src: 'Free historical photographs & maps', tag: 'Images', url: 'https://commons.wikimedia.org/wiki/Category:World_War_II' },
  ],
};

/* --------------------------------------------------------------------------
   10. BLOOM'S ACTIVITY LADDER — tasks that feed the Walkthrough Portfolio
   Each task, when "added", drops a starter card into the student's folder.
   -------------------------------------------------------------------------- */
const ACTIVITIES = [
  { bloom: 'Remember', icon: '\u{1F9E0}', t: 'Build a fact card', d: 'Add three key dates from the timeline to your portfolio as a flashcard.', starter: 'Three dates I must remember:\n1. 1914 — \n2. 1919 — \n3. 1933 — ' },
  { bloom: 'Understand', icon: '\u{1F4AC}', t: 'Explain it simply', d: 'In your own words, explain to a 10-year-old why WW1 led to WW2.', starter: 'In my own words, WW1 led to WW2 because…' },
  { bloom: 'Apply', icon: '\u{1F5FA}️', t: 'Read the map', d: 'Pick one map location and explain why it mattered.', starter: 'The place I chose is ______ . It mattered because…' },
  { bloom: 'Analyse', icon: '\u{1F50D}', t: 'Decode propaganda', d: 'List two techniques the Nazis used to control how people thought.', starter: 'Two propaganda techniques and how they worked:\n1.\n2.' },
  { bloom: 'Evaluate', icon: '⚖️', t: 'Judge Versailles', d: 'Argue: was the Treaty of Versailles fair? Take a side and defend it.', starter: 'I believe the Treaty of Versailles was (fair / unfair) because…' },
  { bloom: 'Create', icon: '✍️', t: 'Write the next chapter', d: 'Compose a short diary entry as someone living through one scene.', starter: 'Diary entry — I am ______ , and today…' },
];

// Demo collaboration wall seed (so the social space never feels empty).
const CLASS_WALL_SEED = [
  { name: 'Aarav', avatar: '\u{1F9D1}‍\u{1F3EB}', text: 'Wild that Germany only finished paying WW1 reparations in 2010! Added it to my folder.', tag: 'Did You Know', t: '2h' },
  { name: 'Meera', avatar: '\u{1F469}‍\u{1F4BB}', text: 'I think Versailles was too harsh — it basically guaranteed round 2. Anyone disagree?', tag: 'Evaluate', t: '5h' },
  { name: 'Kabir', avatar: '\u{1F9D1}', text: 'The Anne Frank scene got me. She was literally our age. 💔', tag: 'Reflection', t: '1d' },
];

/* ---- Contextual media woven INTO reader chapters (by chapter index) ---- */
const CHAPTER_MEDIA = {
  0: { video: 'KGlmlSTn-eM', vlabel: 'Watch: How the world stumbled into WW1 (CrashCourse)' },
  1: { video: '_XPZQ0LAlR4', vlabel: 'Watch: World War I explained (CrashCourse #36)',
       gallery: [{ src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Australian_infantry_small_box_respirators_Ypres_1917.jpg/1024px-Australian_infantry_small_box_respirators_Ypres_1917.jpg', cap: 'Soldiers in gas masks, Ypres 1917 — the grim reality of the trenches.' }] },
  2: { gallery: [{ src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/President_Woodrow_Wilson_portrait_December_2_1912.jpg/480px-President_Woodrow_Wilson_portrait_December_2_1912.jpg', cap: 'US President Woodrow Wilson hoped for a “just peace” and a League of Nations.' }] },
  4: { gallery: [{ src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bundesarchiv_Bild_183-1982-1130-502%2C_N%C3%BCrnberg%2C_Reichsparteitag%2C_Lichtdom.jpg/800px-Bundesarchiv_Bild_183-1982-1130-502%2C_N%C3%BCrnberg%2C_Reichsparteitag%2C_Lichtdom.jpg', cap: 'A vast Nazi rally at Nuremberg — propaganda turned politics into spectacle.' }] },
  5: { video: 'Q78COTwT7nE', vlabel: 'Watch: World War II explained (CrashCourse #38)' },
  6: { gallery: [{ src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg/480px-Mahatma-Gandhi%2C_studio%2C_1931.jpg', cap: 'Mahatma Gandhi — India’s freedom came just two years after the war.' }] },
};
