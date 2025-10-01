// VRT4 - Verbal Analogies Test System
// Advanced randomized analogy testing with anti-cheating mechanisms

// ==========================================
// ANALOGY DATASET PARSER
// ==========================================

// For now, we'll inline a representative sample of the dataset
// In production, you would load from the JSONL file
const SAMPLE_ANALOGIES = [
 {"id":"VR-A-0001","type":"completing_pair","stem":"Author : Book :: Composer : ____","choices":["Piano","Score","Concert","Orchestra","Studio"],"answer_index":1,"answer":"Score","relationship":"producer:product","difficulty":"easy","explanation":"An author produces a book. Similarly, a composer produces a musical score. The other options are venues or instruments, not outputs."},
 {"id":"VR-A-0002","type":"completing_pair","stem":"Doctor : Stethoscope :: Photographer : ____","choices":["Tripod","Camera","Darkroom","Gallery","Studio"],"answer_index":1,"answer":"Camera","relationship":"professional:tool","difficulty":"medium","explanation":"A doctor commonly uses a stethoscope; a photographer's essential tool is a camera. Tripod and studio are accessories or places rather than the core tool."},
 {"id":"VR-A-0003","type":"completing_pair","stem":"Seed : Sapling :: Egg : ____","choices":["Nest","Yolk","Shell","Chick","Feather"],"answer_index":3,"answer":"Chick","relationship":"stage:next_stage","difficulty":"hard","explanation":"A seed develops into a sapling; an egg develops into a chick. The other options are parts or containers, not the next life stage."},
 {"id":"VR-A-0028","type":"completing_pair","stem":"Chef : Knife :: Carpenter : ____","choices":["Saw","Hammer","Wrench","Paintbrush","Spatula"],"answer_index":1,"answer":"Hammer","relationship":"professional:tool","difficulty":"easy","explanation":"A chef's essential handheld tool is a knife; a carpenter's quintessential handheld tool is a hammer used for driving nails."},
 {"id":"VR-A-0029","type":"completing_pair","stem":"Volcano : Lava :: Cloud : ____","choices":["Wind","Rain","Vapor","Thunder","Snow"],"answer_index":1,"answer":"Rain","relationship":"source:product","difficulty":"medium","explanation":"A volcano emits lava; clouds produce rain (precipitation). Wind and thunder are phenomena associated with weather but not direct products of a cloud."},
 {"id":"VR-A-0046","type":"completing_pair","stem":"Baker : Bread :: Tailor : ____","choices":["Thread","Garment","Cloth","Needle","Fabric"],"answer_index":1,"answer":"Garment","relationship":"producer:product","difficulty":"easy","explanation":"A baker produces bread; a tailor produces garments. Thread, cloth, and fabric are materials or inputs, not the finished product."},
 {"id":"VR-A-0047","type":"completing_pair","stem":"Chrysalis : Butterfly :: Tadpole : ____","choices":["Spawn","Egg","Frog","Newt","Toad"],"answer_index":2,"answer":"Frog","relationship":"stage:next_stage","difficulty":"medium","explanation":"A chrysalis develops into a butterfly; a tadpole develops into a frog. The other options are different species or earlier stages."},
 {"id":"VR-A-0048","type":"completing_pair","stem":"Premise : Argument :: Axiom : ____","choices":["Hypothesis","Theorem","Corollary","Lemma","Postulate"],"answer_index":1,"answer":"Theorem","relationship":"foundation:derived_statement","difficulty":"hard","explanation":"Premises form the basis of an argument; axioms form the basis from which theorems are derived."},

 {"id":"VR-A-0004","type":"simple_analogy","stem":"Mild : Gentle :: Fierce : ____","choices":["Calm","Intense","Quiet","Soft","Meek"],"answer_index":1,"answer":"Intense","relationship":"synonym","difficulty":"easy","explanation":"'Mild' and 'gentle' are synonyms describing low strength. 'Fierce' aligns with 'intense' for high strength."},
 {"id":"VR-A-0005","type":"simple_analogy","stem":"Keystone : Arch :: Nucleus : ____","choices":["Atom","Cell","Tissue","Molecule","Organ"],"answer_index":1,"answer":"Cell","relationship":"central_component:structure","difficulty":"medium","explanation":"A keystone is the central supporting piece of an arch; the nucleus is the central controlling component of a cell."},
 {"id":"VR-A-0006","type":"simple_analogy","stem":"Paradox : Contradiction :: Axiom : ____","choices":["Hypothesis","Principle","Analogy","Dilemma","Myth"],"answer_index":1,"answer":"Principle","relationship":"definition_equivalence","difficulty":"hard","explanation":"A paradox involves an apparent contradiction; an axiom is a fundamental principle accepted as true."},
 {"id":"VR-A-0030","type":"simple_analogy","stem":"Transparent : Opaque :: Audible : ____","choices":["Silent","Loud","Clear","Echoing","Noisy"],"answer_index":0,"answer":"Silent","relationship":"antonym","difficulty":"easy","explanation":"Transparent is the opposite of opaque; likewise, silent is the opposite condition of audible."},
 {"id":"VR-A-0031","type":"simple_analogy","stem":"Prologue : Book :: Overture : ____","choices":["Symphony","Opera","Stage","Audience","Concert"],"answer_index":1,"answer":"Opera","relationship":"introduction:work","difficulty":"medium","explanation":"A prologue introduces a book; an overture introduces an opera (or musical work)."},
 {"id":"VR-A-0049","type":"simple_analogy","stem":"Hot : Cold :: Tall : ____","choices":["Thin","Narrow","Short","Small","Tiny"],"answer_index":2,"answer":"Short","relationship":"antonym","difficulty":"easy","explanation":"'Hot' is the antonym of 'cold'; 'tall' is the antonym of 'short'."},
 {"id":"VR-A-0050","type":"simple_analogy","stem":"Prolific : Productive :: Frugal : ____","choices":["Wasteful","Thrifty","Extravagant","Generous","Lavish"],"answer_index":1,"answer":"Thrifty","relationship":"synonym","difficulty":"medium","explanation":"'Prolific' is close in meaning to 'productive'; 'frugal' is close in meaning to 'thrifty'."},
 {"id":"VR-A-0051","type":"simple_analogy","stem":"Ameliorate : Improve :: Exacerbate : ____","choices":["Soothe","Hinder","Worsen","Reduce","Diminish"],"answer_index":2,"answer":"Worsen","relationship":"definition_equivalence","difficulty":"hard","explanation":"To ameliorate is to improve; to exacerbate is to make something worse."},

 {"id":"VR-A-0007","type":"choose_pair","stem":"Choose the pair most analogous to 'Painter : Easel'.","choices":["Baker : Oven","Author : Library","Student : Desk","Driver : Road","Doctor : Hospital"],"answer_index":0,"answer":"Baker : Oven","relationship":"worker:equipment","difficulty":"easy","explanation":"A painter uses an easel to support work; a baker uses an oven to produce baked goods."},
 {"id":"VR-A-0008","type":"choose_pair","stem":"Choose the pair most analogous to 'Artery : Blood'.","choices":["Pipeline : Oil","Sponge : Water","Oven : Heat","Lung : Air","Tank : Fuel"],"answer_index":0,"answer":"Pipeline : Oil","relationship":"conduit:content","difficulty":"medium","explanation":"An artery carries blood; a pipeline carries oil."},
 {"id":"VR-A-0009","type":"choose_pair","stem":"Choose the pair most analogous to 'Osmosis : Diffusion'.","choices":["Rectangle : Square","Proton : Particle","Metre : Distance","Therapy : Medicine","Storm : Weather"],"answer_index":1,"answer":"Proton : Particle","relationship":"subset:category","difficulty":"hard","explanation":"Osmosis is a specific type of diffusion; a proton is a specific type of particle."},
 {"id":"VR-A-0032","type":"choose_pair","stem":"Choose the pair most analogous to 'Container : Content'.","choices":["Reservoir : Water","Wheel : Car","Painter : Brush","Bee : Hive","Keyboard : Typist"],"answer_index":0,"answer":"Reservoir : Water","relationship":"container:content","difficulty":"easy","explanation":"A reservoir holds water, matching the container–content relationship."},
 {"id":"VR-A-0033","type":"choose_pair","stem":"Choose the pair most analogous to 'Skeleton : Body'.","choices":["Frame : House","Paint : Wall","Engine : Car","Skin : Organism","Root : Plant"],"answer_index":0,"answer":"Frame : House","relationship":"structural_support:object","difficulty":"hard","explanation":"A skeleton provides structural support for a body; a frame provides structural support for a house."},
 {"id":"VR-A-0052","type":"choose_pair","stem":"Choose the pair most analogous to 'Patient : Hospital'.","choices":["Guest : Hotel","Author : Publisher","Pilot : Cockpit","Judge : Law","Tenant : Rent"],"answer_index":0,"answer":"Guest : Hotel","relationship":"recipient:service_place","difficulty":"easy","explanation":"A patient receives care in a hospital; a guest receives lodging in a hotel."},
 {"id":"VR-A-0053","type":"choose_pair","stem":"Choose the pair most analogous to 'Compass : Direction'.","choices":["Calendar : Day","Odometer : Distance","Map : Territory","Clock : Alarm","Scale : Food"],"answer_index":1,"answer":"Odometer : Distance","relationship":"instrument:measure","difficulty":"medium","explanation":"A compass measures or indicates direction; an odometer measures distance."},
 {"id":"VR-A-0054","type":"choose_pair","stem":"Choose the pair most analogous to 'Antidote : Poison'.","choices":["Filter : Water","Neutralizer : Acid","Shade : Sunlight","Helmet : Impact","Fuse : Electricity"],"answer_index":1,"answer":"Neutralizer : Acid","relationship":"counteragent:hazard","difficulty":"hard","explanation":"An antidote counteracts a poison; a neutralizer counteracts acid."},

 {"id":"VR-A-0010","type":"double_analogy","stem":"Hand : Glove :: Foot : ____ ; Bird : Air :: Fish : ____","choices":["Shoe; Water","Sock; Ocean","Boot; Sand","Sandal; Lake","Shoe; Air"],"answer_index":0,"answer":"Shoe; Water","relationship":"covering:body_part AND mover:medium","difficulty":"easy","explanation":"A glove covers a hand; a shoe covers a foot. A bird moves through air; a fish moves through water."},
 {"id":"VR-A-0011","type":"double_analogy","stem":"Nurse : Hospital :: Teacher : ____ ; Oxygen : Respiration :: Fuel : ____","choices":["School; Combustion","Classroom; Oxidation","Campus; Fire","School; Fermentation","Lab; Ignition"],"answer_index":0,"answer":"School; Combustion","relationship":"profession:workplace AND input:process","difficulty":"medium","explanation":"A nurse works in a hospital; a teacher works in a school. Oxygen is an input to respiration; fuel is an input to combustion."},
 {"id":"VR-A-0012","type":"double_analogy","stem":"Premise : Conclusion :: Evidence : ____ ; Seed : Tree :: Idea : ____","choices":["Inference; Innovation","Proof; Project","Theory; Plan","Claim; Concept","Reason; Result"],"answer_index":0,"answer":"Inference; Innovation","relationship":"support:outcome AND origin:developed_form","difficulty":"hard","explanation":"Premises support conclusions; evidence supports inferences. A seed grows into a tree; an idea, when developed, yields innovation."},
 {"id":"VR-A-0034","type":"double_analogy","stem":"Bee : Honey :: Silkworm : ____ ; Oven : Bake :: Freezer : ____","choices":["Silk; Freeze","Cocoon; Cool","Thread; Chill","Fabric; Ice","Silk; Cold"],"answer_index":0,"answer":"Silk; Freeze","relationship":"producer:product AND appliance:process","difficulty":"easy","explanation":"Bees produce honey; silkworms produce silk. An oven bakes; a freezer freezes."},
 {"id":"VR-A-0035","type":"double_analogy","stem":"Cause : Effect :: Hypothesis : ____ ; North : South :: East : ____","choices":["Conclusion; West","Theory; Left","Result; Right","Inference; North","Prediction; South"],"answer_index":0,"answer":"Conclusion; West","relationship":"leads_to:outcome AND opposite:direction","difficulty":"medium","explanation":"A cause leads to an effect; a hypothesis leads to a conclusion. South is opposite of north; west is opposite of east."},
 {"id":"VR-A-0055","type":"double_analogy","stem":"Winter : Cold :: Summer : ____ ; Square : 4 :: Triangle : ____","choices":["Warm; 2","Hot; 3","Dry; 6","Humid; 5","Hot; 4"],"answer_index":1,"answer":"Hot; 3","relationship":"season:typical_condition AND shape:sides","difficulty":"easy","explanation":"Winter is typically cold; summer is typically hot. A square has 4 sides; a triangle has 3 sides."},
 {"id":"VR-A-0056","type":"double_analogy","stem":"Author : Chapter :: Film : ____ ; Root : Absorb :: Leaf : ____","choices":["Scene; Photosynthesize","Scene; Inflate","Screen; Breathe","Plot; Transpire","Reel; Nourish"],"answer_index":0,"answer":"Scene; Photosynthesize","relationship":"work:unit AND organ:function","difficulty":"medium","explanation":"A book contains chapters; a film contains scenes. Roots absorb water/nutrients; leaves perform photosynthesis."},
 {"id":"VR-A-0057","type":"double_analogy","stem":"Sine : Trigonometry :: Derivative : ____ ; Catalyst : Rate :: Enzyme : ____","choices":["Geometry; Metabolism","Calculus; Metabolism","Algebra; Digestion","Calculus; Fermentation","Statistics; Respiration"],"answer_index":1,"answer":"Calculus; Metabolism","relationship":"concept:branch AND facilitator:biological_process","difficulty":"hard","explanation":"Sine is a concept in trigonometry; the derivative is central to calculus. A catalyst affects reaction rate; enzymes catalyze metabolic reactions."},

 {"id":"VR-A-0013","type":"choose_similar","stem":"Choose the word most similar to 'Fragile'.","choices":["Delicate","Firm","Massive","Rigid","Durable"],"answer_index":0,"answer":"Delicate","relationship":"synonym","difficulty":"easy","explanation":"'Fragile' means easily broken; 'delicate' closely matches this meaning."},
 {"id":"VR-A-0014","type":"choose_similar","stem":"Choose the word most opposite to 'Sparse'.","choices":["Scarce","Rare","Scant","Dense","Few"],"answer_index":3,"answer":"Dense","relationship":"antonym","difficulty":"medium","explanation":"'Sparse' means thinly distributed; 'dense' is its antonym (tightly packed)."},
 {"id":"VR-A-0015","type":"choose_similar","stem":"Choose the word most similar to 'Obfuscate'.","choices":["Clarify","Illuminate","Reveal","Obscure","Explain"],"answer_index":3,"answer":"Obscure","relationship":"synonym","difficulty":"hard","explanation":"'Obfuscate' means to make something unclear; 'obscure' is the closest synonym."},
 {"id":"VR-A-0036","type":"choose_similar","stem":"Choose the word most similar to 'Brisk'.","choices":["Slow","Lethargic","Quick","Idle","Dull"],"answer_index":2,"answer":"Quick","relationship":"synonym","difficulty":"easy","explanation":"'Brisk' commonly means active or quick."},
 {"id":"VR-A-0037","type":"choose_similar","stem":"Choose the word most opposite to 'Intractable'.","choices":["Obstinate","Stubborn","Tractable","Rigid","Dogged"],"answer_index":2,"answer":"Tractable","relationship":"antonym","difficulty":"hard","explanation":"'Intractable' means hard to manage; 'tractable' is its direct antonym (easy to manage)."},
 {"id":"VR-A-0058","type":"choose_similar","stem":"Choose the word most similar to 'Rapid'.","choices":["Swift","Calm","Constant","Gradual","Idle"],"answer_index":0,"answer":"Swift","relationship":"synonym","difficulty":"easy","explanation":"'Rapid' and 'swift' both mean fast."},
 {"id":"VR-A-0059","type":"choose_similar","stem":"Choose the word most opposite to 'Mitigate'.","choices":["Soothe","Aggravate","Alleviate","Moderate","Mollify"],"answer_index":1,"answer":"Aggravate","relationship":"antonym","difficulty":"medium","explanation":"'Mitigate' means to make less severe; 'aggravate' means to make more severe."},
 {"id":"VR-A-0060","type":"choose_similar","stem":"Choose the word most similar to 'Intransigent'.","choices":["Compliant","Flexible","Uncompromising","Lenient","Pliable"],"answer_index":2,"answer":"Uncompromising","relationship":"synonym","difficulty":"hard","explanation":"'Intransigent' describes someone unwilling to change views; 'uncompromising' expresses the same idea."},

 {"id":"VR-A-0016","type":"detecting_analogy","stem":"Which option contains pairs sharing the same relationship?","choices":["Puppy:Dog, Kitten:Cat","Feather:Bird, Shell:Turtle","Desk:Chair, Floor:Ceiling","Rain:Cloud, River:Sea","Page:Book, Brick:House"],"answer_index":0,"answer":"Puppy:Dog, Kitten:Cat","relationship":"young:adult","difficulty":"easy","explanation":"Both 'Puppy:Dog' and 'Kitten:Cat' show a juvenile form to its adult."},
 {"id":"VR-A-0017","type":"detecting_analogy","stem":"Which option best mirrors a 'tool:what_it_measures' pattern?","choices":["Scale:Weight, Thermometer:Temperature","Knife:Sharpness, Hammer:Strength","Clock:Time, Calendar:Month","Lens:Light, Prism:Color","Battery:Charge, Cable:Power"],"answer_index":0,"answer":"Scale:Weight, Thermometer:Temperature","relationship":"instrument:measure","difficulty":"medium","explanation":"A scale measures weight and a thermometer measures temperature."},
 {"id":"VR-A-0018","type":"detecting_analogy","stem":"Select the option where both pairs show 'agent facilitating a process'.","choices":["Catalyst:Reaction, Enzyme:Metabolism","Tree:Photosynthesis, Wind:Pollination","Blood:Oxygen, Cloud:Rain","Fuel:Engine, Ink:Printer","Root:Soil, Leaf:Air"],"answer_index":0,"answer":"Catalyst:Reaction, Enzyme:Metabolism","relationship":"facilitator:process","difficulty":"hard","explanation":"A catalyst facilitates a chemical reaction; an enzyme facilitates metabolic reactions."},
 {"id":"VR-A-0038","type":"detecting_analogy","stem":"Which option contains pairs that both show 'part : whole'?","choices":["Petal:Flower, Page:Book","River:Ocean, Cloud:Sky","Oven:Kitchen, Engine:Car","Rain:Storm, Seed:Plant","Teacher:School, Doctor:Hospital"],"answer_index":0,"answer":"Petal:Flower, Page:Book","relationship":"part:whole","difficulty":"easy","explanation":"A petal is part of a flower; a page is part of a book."},
 {"id":"VR-A-0039","type":"detecting_analogy","stem":"Select the option where both pairs show 'tool : item it fastens/joins'.","choices":["Stapler:Staple, Needle:Thread","Glue:Paper, Tape:Box","Wrench:Bolt, Scissor:Paper","Lock:Key, Zipper:Cloth","Drill:Hole, Brush:Paint"],"answer_index":0,"answer":"Stapler:Staple, Needle:Thread","relationship":"tool:fastener","difficulty":"medium","explanation":"A stapler drives staples to fasten; a needle carries thread to join fabric."},
 {"id":"VR-A-0061","type":"detecting_analogy","stem":"Which option contains pairs sharing 'animal : home'?","choices":["Bee:Hive, Spider:Web","Leaf:Tree, Page:Book","Bird:Sky, Fish:River","Ant:Colony, Root:Soil","Dog:Bone, Cat:Milk"],"answer_index":0,"answer":"Bee:Hive, Spider:Web","relationship":"animal:habitat","difficulty":"easy","explanation":"Bees live in hives; spiders build webs as their dwelling."},
 {"id":"VR-A-0062","type":"detecting_analogy","stem":"Which option best mirrors 'cause : effect' in both pairs?","choices":["Fracture:Pain, Virus:Illness","Seed:Soil, Fire:Ash","Rain:Cloud, Car:Fuel","Sail:Wind, Wheel:Motion","Question:Answer, Problem:Equation"],"answer_index":0,"answer":"Fracture:Pain, Virus:Illness","relationship":"cause:effect","difficulty":"medium","explanation":"A fracture causes pain; a virus causes illness."},
 {"id":"VR-A-0063","type":"detecting_analogy","stem":"Select the option where both pairs show 'subset : category'.","choices":["Square:Rectangle, Whale:Mammal","Leaf:Plant, Grain:Cereal","Forest:Tree, Engine:Machine","Steel:Metal, Water:Liquid","Keyboard:Computer, Chapter:Book"],"answer_index":0,"answer":"Square:Rectangle, Whale:Mammal","relationship":"subset:category","difficulty":"hard","explanation":"A square is a type of rectangle; a whale is a type of mammal."},

 {"id":"VR-A-0019","type":"three_word","stem":"Morning : Afternoon : Evening :: Seed : Sprout : ____","choices":["Soil","Leaf","Plant","Root","Tree"],"answer_index":2,"answer":"Plant","relationship":"chronological_stages","difficulty":"easy","explanation":"Morning→Afternoon→Evening are sequential time stages; Seed→Sprout→Plant are sequential growth stages."},
 {"id":"VR-A-0020","type":"three_word","stem":"Copper : Bronze : Tin :: Hydrogen : Water : ____","choices":["Carbon","Oxygen","Nitrogen","Helium","Sodium"],"answer_index":1,"answer":"Oxygen","relationship":"components_form_compound","difficulty":"medium","explanation":"Bronze is made from copper and tin; water is made from hydrogen and oxygen."},
 {"id":"VR-A-0021","type":"three_word","stem":"Leaf : Tree : Forest :: Word : Sentence : ____","choices":["Alphabet","Grammar","Paragraph","Verse","Chapter"],"answer_index":2,"answer":"Paragraph","relationship":"part:whole:larger_whole","difficulty":"hard","explanation":"Leaf is part of a tree; many trees form a forest. Word is part of a sentence; sentences combine to form a paragraph."},
 {"id":"VR-A-0040","type":"three_word","stem":"Caterpillar : Chrysalis : ____","choices":["Larva","Moth","Butterfly","Cocoon","Egg"],"answer_index":2,"answer":"Butterfly","relationship":"life_cycle_stages","difficulty":"easy","explanation":"These are successive metamorphic stages: caterpillar → chrysalis → butterfly."},
 {"id":"VR-A-0041","type":"three_word","stem":"Letter : Word : Sentence :: Note : Chord : ____","choices":["Harmony","Scale","Melody","Tempo","Rhythm"],"answer_index":2,"answer":"Melody","relationship":"unit:group:larger_structure","difficulty":"medium","explanation":"Words combine into sentences; musical notes combine into chords and then into melodies."},
 {"id":"VR-A-0064","type":"three_word","stem":"Seed : Sapling : Tree :: Child : Teen : ____","choices":["Infant","Youth","Grownup","Adult","Parent"],"answer_index":3,"answer":"Adult","relationship":"chronological_stages","difficulty":"easy","explanation":"Seed→Sapling→Tree mirrors Child→Teen→Adult as sequential stages of growth/maturity."},
 {"id":"VR-A-0065","type":"three_word","stem":"Copper : Brass : Zinc :: Iron : Steel : ____","choices":["Nickel","Carbon","Chromium","Tin","Lead"],"answer_index":1,"answer":"Carbon","relationship":"components_form_alloy","difficulty":"medium","explanation":"Brass is made from copper and zinc; steel is made primarily from iron and carbon."},
 {"id":"VR-A-0066","type":"three_word","stem":"Point : Line : Plane :: Node : Edge : ____","choices":["Graph","Vertex","Grid","Network","Web"],"answer_index":0,"answer":"Graph","relationship":"unit:relation:structure","difficulty":"hard","explanation":"A point with another point defines a line; lines define a plane. In graph theory, nodes connected by edges define a graph."},

 {"id":"VR-A-0022","type":"number_analogy","stem":"2 : 4 :: 3 : ____","choices":["5","6","7","8","9"],"answer_index":1,"answer":"6","relationship":"multiply_by_2","difficulty":"easy","explanation":"The pattern is doubling: 2×2=4, 3×2=6."},
 {"id":"VR-A-0023","type":"number_analogy","stem":"8 : 64 :: 3 : ____","choices":["6","9","12","27","18"],"answer_index":1,"answer":"9","relationship":"square","difficulty":"medium","explanation":"64 is 8²; therefore 3²=9."},
 {"id":"VR-A-0024","type":"number_analogy","stem":"4 : 11 :: 6 : ____","choices":["17","25","31","35","41"],"answer_index":2,"answer":"31","relationship":"n²−5","difficulty":"hard","explanation":"11 = 4² − 5. Applying the same rule: 6² − 5 = 36 − 5 = 31."},
 {"id":"VR-A-0042","type":"number_analogy","stem":"5 : 25 :: 7 : ____","choices":["35","42","49","56","63"],"answer_index":2,"answer":"49","relationship":"square","difficulty":"easy","explanation":"25 is 5²; therefore the corresponding value for 7 is 7² = 49."},
 {"id":"VR-A-0043","type":"number_analogy","stem":"3 : 5 :: 7 : ____","choices":["9","10","11","12","13"],"answer_index":2,"answer":"11","relationship":"next_prime","difficulty":"hard","explanation":"5 is the next prime after 3; 11 is the next prime after 7."},
 {"id":"VR-A-0067","type":"number_analogy","stem":"10 : 5 :: 8 : ____","choices":["2","3","4","6","10"],"answer_index":2,"answer":"4","relationship":"divide_by_2","difficulty":"easy","explanation":"10÷2=5; applying the same rule gives 8÷2=4."},
 {"id":"VR-A-0068","type":"number_analogy","stem":"3 : 8 :: 5 : ____","choices":["20","22","23","24","26"],"answer_index":3,"answer":"24","relationship":"n²−1","difficulty":"medium","explanation":"8 = 3² − 1; applying the same rule to 5 gives 5² − 1 = 24."},
 {"id":"VR-A-0069","type":"number_analogy","stem":"7 : 50 :: 9 : ____","choices":["72","80","81","82","90"],"answer_index":3,"answer":"82","relationship":"n²+1","difficulty":"hard","explanation":"50 = 7² + 1; therefore 9² + 1 = 81 + 1 = 82."},

 {"id":"VR-A-0025","type":"alphabet_analogy","stem":"C : F :: M : ____","choices":["O","P","Q","R","S"],"answer_index":1,"answer":"P","relationship":"letter_shift(+3)","difficulty":"easy","explanation":"F is three letters after C; similarly, P is three letters after M."},
 {"id":"VR-A-0026","type":"alphabet_analogy","stem":"B : Y :: D : ____","choices":["U","V","W","X","Z"],"answer_index":2,"answer":"W","relationship":"opposite_positions_in_alphabet","difficulty":"medium","explanation":"B (2nd) pairs with Y (25th) as opposite ends; D (4th) pairs with W (23rd) similarly."},
 {"id":"VR-A-0027","type":"alphabet_analogy","stem":"ACE : BDF :: KMN : ____","choices":["LNO","KLM","NOP","JLM","KNO"],"answer_index":0,"answer":"LNO","relationship":"increment_each_letter(+1)","difficulty":"hard","explanation":"Each letter in the second term is one alphabet step after the first term's letters."},
 {"id":"VR-A-0044","type":"alphabet_analogy","stem":"G : T :: H : ____","choices":["P","Q","R","S","T"],"answer_index":3,"answer":"S","relationship":"mirror_positions","difficulty":"medium","explanation":"G (7th) mirrors to T (20th) because their positions sum to 27. H (8th) mirrors to S (19th) by the same rule."},
 {"id":"VR-A-0045","type":"alphabet_analogy","stem":"CAT : DBU :: PLAN : ____","choices":["QMBP","QMBO","RKCP","QLBO","PLBO"],"answer_index":1,"answer":"QMBO","relationship":"shift_each_letter(+1)","difficulty":"hard","explanation":"Each letter is advanced by one: C→D, A→B, T→U; thus P→Q, L→M, A→B, N→O."},
 {"id":"VR-A-0070","type":"alphabet_analogy","stem":"A : Z :: B : ____","choices":["V","W","X","Y","Z"],"answer_index":3,"answer":"Y","relationship":"mirror_positions","difficulty":"easy","explanation":"A (1st) mirrors to Z (26th) since their positions sum to 27; B (2nd) mirrors to Y (25th)."},
 {"id":"VR-A-0071","type":"alphabet_analogy","stem":"FOG : HQI :: PLAN : ____","choices":["QMBP","RNCP","QNCQ","PMBO","RNBQ"],"answer_index":1,"answer":"RNCP","relationship":"uniform_shift(+2)","difficulty":"medium","explanation":"Each letter advances by 2: F→H, O→Q, G→I; similarly, P→R, L→N, A→C, N→P."},
 {"id":"VR-A-0072","type":"alphabet_analogy","stem":"BALLET : BLALET :: LETTER : ____","choices":["LETTRE","LTETER","LETETR","LTERET","LRTETE"],"answer_index":1,"answer":"LTETER","relationship":"swap_positions(2,3)","difficulty":"hard","explanation":"'BALLET' with the 2nd and 3rd letters swapped becomes 'BLALET'. Swapping the 2nd and 3rd letters of 'LETTER' yields 'LTETER'."}
];

// Load and categorize all analogy questions
const allAnalogies = SAMPLE_ANALOGIES;

// ==========================================
// QUESTION CATEGORIZATION BY TYPE AND DIFFICULTY
// ==========================================

// Group questions by type and difficulty
function categorizeQuestions(questions) {
 const categories = {};

 questions.forEach(question => {
 const type = question.type;
 const difficulty = question.difficulty;

 if (!categories[type]) {
 categories[type] = { easy: [], medium: [], hard: [] };
 }

 if (categories[type][difficulty]) {
 categories[type][difficulty].push(question);
 }
 });

 return categories;
}

const categorizedAnalogies = categorizeQuestions(allAnalogies);

// ==========================================
// VRT4 TEST CONFIGURATION
// ==========================================

const VRT4_CONFIG = {
 totalQuestions: 30,
 timeLimit: 25, // minutes
 difficultyDistribution: {
 easy: 12, // 40%
 medium: 12, // 40%
 hard: 6 // 20%
 },
 typeDistribution: [
 { type: 'completing_pair', count: 4, easy: 2, medium: 1, hard: 1 },
 { type: 'simple_analogy', count: 4, easy: 2, medium: 2, hard: 0 },
 { type: 'choose_pair', count: 4, easy: 1, medium: 2, hard: 1 },
 { type: 'double_analogy', count: 3, easy: 1, medium: 1, hard: 1 },
 { type: 'choose_similar', count: 3, easy: 1, medium: 1, hard: 1 },
 { type: 'detecting_analogy', count: 3, easy: 1, medium: 2, hard: 0 },
 { type: 'three_word', count: 3, easy: 1, medium: 1, hard: 1 },
 { type: 'number_analogy', count: 3, easy: 1, medium: 2, hard: 0 },
 { type: 'alphabet_analogy', count: 3, easy: 1, medium: 1, hard: 1 }
 ]
};

// ==========================================
// RANDOMIZATION FUNCTIONS
// ==========================================

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
 const shuffled = [...array];
 for (let i = shuffled.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
 }
 return shuffled;
}

// Select random questions from a pool
function selectRandomQuestions(pool, count) {
 if (pool.length < count) {
 console.warn(`Insufficient questions in pool. Requested: ${count}, Available: ${pool.length}`);
 return shuffleArray(pool);
 }

 const shuffled = shuffleArray(pool);
 return shuffled.slice(0, count);
}

// Generate randomized VRT4 test
function generateRandomizedVRT4() {
 const selectedQuestions = [];
 let questionId = 1;

 // Process each question type according to distribution
 VRT4_CONFIG.typeDistribution.forEach(typeConfig => {
 const typeQuestions = categorizedAnalogies[typeConfig.type];

 if (!typeQuestions) {
 console.warn(`No questions found for type: ${typeConfig.type}`);
 return;
 }

 // Select questions by difficulty for this type
 const difficulties = ['easy', 'medium', 'hard'];
 difficulties.forEach(difficulty => {
 const needed = typeConfig[difficulty] || 0;
 if (needed > 0) {
 const pool = typeQuestions[difficulty] || [];
 const selected = selectRandomQuestions(pool, needed);

 // Convert to our internal format and assign sequential IDs
 selected.forEach(question => {
 selectedQuestions.push({
 id: questionId++,
 question_text: question.stem,
 options: question.choices,
 correct_answer: question.answer,
 explanation: question.explanation,
 type: question.type,
 difficulty: question.difficulty,
 relationship: question.relationship,
 original_id: question.id
 });
 });
 }
 });
 });

 // Final shuffle to mix question types
 return shuffleArray(selectedQuestions);
}

// ==========================================
// VRT4 TEST STRUCTURE
// ==========================================

export function getRandomizedVRT4() {
 const questions = generateRandomizedVRT4();

 return {
 id: "VRT4",
 title: "Verbal Reasoning Test 4 - Analogies",
 description: "Advanced verbal analogies testing logical relationships, patterns, and reasoning skills",
 timeLimit: VRT4_CONFIG.timeLimit,
 totalQuestions: questions.length,
 sections: [
 {
 id: 4,
 title: "Verbal Analogies",
 description: "Identify relationships between words, concepts, and patterns. Each question tests your ability to recognize logical connections and apply them consistently.",
 passages: [
 {
 id: "vrt4_analogies",
 passage_title: "Verbal Analogies Challenge",
 passage_text: "This test contains various types of analogy questions designed to assess your verbal reasoning abilities. Read each question carefully and select the best answer that maintains the same relationship or pattern.",
 questions: questions
 }
 ]
 }
 ],
 instructions: {
 overview: "Complete 30 analogy questions in 25 minutes",
 types: [
 "Completing Pair: Find the missing word to complete the analogy",
 "Simple Analogy: Identify words with similar relationships",
 "Choose Pair: Select the pair with the most similar relationship",
 "Double Analogy: Solve two related analogies simultaneously",
 "Similar Word: Find synonyms or antonyms",
 "Detecting Analogy: Identify shared relationships between pairs",
 "Three Word: Complete three-term analogical sequences",
 "Number Analogy: Recognize numerical patterns and relationships",
 "Alphabet Analogy: Solve letter-based pattern analogies"
 ],
 tips: [
 "Identify the relationship in the given pair first",
 "Look for the same type of relationship in your answer",
 "Consider multiple meanings of words if stuck",
 "Eliminate obviously incorrect options",
 "Don't overthink - often the most direct relationship is correct"
 ]
 },
 statistics: {
 totalQuestionsInPool: Object.values(categorizedAnalogies).reduce((total, typeQuestions) => {
 return total + Object.values(typeQuestions).reduce((typeTotal, difficultyQuestions) => {
 return typeTotal + difficultyQuestions.length;
 }, 0);
 }, 0),
 difficultyBreakdown: {
 easy: questions.filter(q => q.difficulty === 'easy').length,
 medium: questions.filter(q => q.difficulty === 'medium').length,
 hard: questions.filter(q => q.difficulty === 'hard').length
 },
 typeBreakdown: VRT4_CONFIG.typeDistribution.reduce((breakdown, typeConfig) => {
 breakdown[typeConfig.type] = questions.filter(q => q.type === typeConfig.type).length;
 return breakdown;
 }, {})
 }
 };
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Get statistics about the analogy dataset
export function getAnalogiesDatasetStats() {
 const stats = {
 totalQuestions: allAnalogies.length,
 byType: {},
 byDifficulty: { easy: 0, medium: 0, hard: 0 },
 byTypeAndDifficulty: {}
 };

 allAnalogies.forEach(question => {
 // Count by type
 stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;

 // Count by difficulty
 stats.byDifficulty[question.difficulty]++;

 // Count by type and difficulty
 const key = `${question.type}_${question.difficulty}`;
 stats.byTypeAndDifficulty[key] = (stats.byTypeAndDifficulty[key] || 0) + 1;
 });

 return stats;
}

// Get a preview of available question types
export function getAvailableQuestionTypes() {
 return Object.keys(categorizedAnalogies).map(type => ({
 type,
 description: getTypeDescription(type),
 totalQuestions: Object.values(categorizedAnalogies[type]).reduce((sum, arr) => sum + arr.length, 0),
 difficultyBreakdown: {
 easy: categorizedAnalogies[type].easy?.length || 0,
 medium: categorizedAnalogies[type].medium?.length || 0,
 hard: categorizedAnalogies[type].hard?.length || 0
 }
 }));
}

// Get human-readable descriptions for question types
function getTypeDescription(type) {
 const descriptions = {
 'completing_pair': 'Complete the analogy with the missing word',
 'simple_analogy': 'Identify words with similar relationships',
 'choose_pair': 'Choose the pair with the most analogous relationship',
 'double_analogy': 'Solve two related analogies simultaneously',
 'choose_similar': 'Find synonyms, antonyms, or similar words',
 'detecting_analogy': 'Detect which pairs share the same relationship',
 'three_word': 'Complete three-term analogical sequences',
 'number_analogy': 'Recognize numerical patterns and relationships',
 'alphabet_analogy': 'Solve letter-based and alphabetical patterns'
 };

 return descriptions[type] || 'Unknown question type';
}

// ==========================================
// EXPORT FOR INTEGRATION
// ==========================================

export const vrt4AnalogiesPool = {
 getRandomizedTest: getRandomizedVRT4,
 getDatasetStats: getAnalogiesDatasetStats,
 getQuestionTypes: getAvailableQuestionTypes,
 config: VRT4_CONFIG
};

export default getRandomizedVRT4;
