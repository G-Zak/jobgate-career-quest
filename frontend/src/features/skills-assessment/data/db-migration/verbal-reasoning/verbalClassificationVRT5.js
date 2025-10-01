// VRT5 - Classification (Odd-One-Out) Test System
// Randomized classification questions built from a local pool

// Comprehensive pool of 90 classification questions across multiple domains
// Covers odd_word, odd_pair, odd_number, and odd_letters with varying difficulty levels
const SAMPLE_CLASSIFICATION = [
 // === ODD WORD QUESTIONS (30 total) ===
 // Easy (10 questions)
 {id:"VR-C-0001",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["curd","butter","oil","cheese","cream"],answer_index:2,answer:"oil",explanation:"Curd, butter, cheese, and cream are milk products; oil is plant-derived."},
 {id:"VR-C-0002",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["sparrow","pigeon","bat","eagle","hawk"],answer_index:2,answer:"bat",explanation:"Others are birds; bat is a mammal."},
 {id:"VR-C-0003",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["triangle","rectangle","circle","pentagon","hexagon"],answer_index:2,answer:"circle",explanation:"Circle is not a polygon."},
 {id:"VR-C-0004",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["Asia","Europe","Africa","Australia","Canada"],answer_index:4,answer:"Canada",explanation:"Canada is a country; the others are continents."},
 {id:"VR-C-0005",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["red","blue","loud","green","yellow"],answer_index:2,answer:"loud",explanation:"Red, blue, green, and yellow are colors; loud is a sound quality."},
 {id:"VR-C-0006",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["apple","banana","carrot","orange","grape"],answer_index:2,answer:"carrot",explanation:"Apple, banana, orange, and grape are fruits; carrot is a vegetable."},
 {id:"VR-C-0007",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["chair","table","lamp","bed","room"],answer_index:4,answer:"room",explanation:"Chair, table, lamp, and bed are furniture; room is a space."},
 {id:"VR-C-0008",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["car","bicycle","train","airplane","driver"],answer_index:4,answer:"driver",explanation:"Car, bicycle, train, and airplane are vehicles; driver is a person."},
 {id:"VR-C-0009",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["winter","spring","cold","summer","autumn"],answer_index:2,answer:"cold",explanation:"Winter, spring, summer, and autumn are seasons; cold is a temperature."},
 {id:"VR-C-0010",type:"odd_word",difficulty:"easy",stem:"Choose the word which is least like the others.",choices:["book","newspaper","magazine","television","journal"],answer_index:3,answer:"television",explanation:"Book, newspaper, magazine, and journal are printed media; television is electronic."},

 // Medium (15 questions)
 {id:"VR-C-0011",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["Python","Ruby","HTML","Java","Go"],answer_index:2,answer:"HTML",explanation:"HTML is a markup language; the rest are programming languages."},
 {id:"VR-C-0012",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["iron","copper","tin","sulfur","nickel"],answer_index:3,answer:"sulfur",explanation:"Sulfur is a non-metal; the rest are metals."},
 {id:"VR-C-0013",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["violin","cello","flute","viola","double bass"],answer_index:2,answer:"flute",explanation:"Flute is woodwind; others are strings."},
 {id:"VR-C-0014",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["democracy","monarchy","republic","oligarchy","freedom"],answer_index:4,answer:"freedom",explanation:"Democracy, monarchy, republic, and oligarchy are government types; freedom is a concept."},
 {id:"VR-C-0015",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["mitochondria","nucleus","chloroplast","ribosome","microscope"],answer_index:4,answer:"microscope",explanation:"Mitochondria, nucleus, chloroplast, and ribosome are cell organelles; microscope is an instrument."},
 {id:"VR-C-0016",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["renaissance","baroque","classical","romantic","symphony"],answer_index:4,answer:"symphony",explanation:"Renaissance, baroque, classical, and romantic are art periods; symphony is a musical form."},
 {id:"VR-C-0017",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["photosynthesis","respiration","digestion","circulation","oxygen"],answer_index:4,answer:"oxygen",explanation:"Photosynthesis, respiration, digestion, and circulation are biological processes; oxygen is a substance."},
 {id:"VR-C-0018",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["metaphor","simile","alliteration","onomatopoeia","paragraph"],answer_index:4,answer:"paragraph",explanation:"Metaphor, simile, alliteration, and onomatopoeia are literary devices; paragraph is text structure."},
 {id:"VR-C-0019",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["capitalism","socialism","communism","fascism","economy"],answer_index:4,answer:"economy",explanation:"Capitalism, socialism, communism, and fascism are economic/political systems; economy is the general concept."},
 {id:"VR-C-0020",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["velocity","acceleration","momentum","force","distance"],answer_index:4,answer:"distance",explanation:"Velocity, acceleration, momentum, and force are dynamic physics quantities; distance is static measurement."},
 {id:"VR-C-0021",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["DNA","RNA","protein","enzyme","chromosome"],answer_index:3,answer:"enzyme",explanation:"DNA, RNA, protein, and chromosome are structural biomolecules; enzyme is functional."},
 {id:"VR-C-0022",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["algorithm","variable","function","loop","computer"],answer_index:4,answer:"computer",explanation:"Algorithm, variable, function, and loop are programming concepts; computer is hardware."},
 {id:"VR-C-0023",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["latitude","longitude","altitude","meridian","compass"],answer_index:4,answer:"compass",explanation:"Latitude, longitude, altitude, and meridian are coordinate systems; compass is an instrument."},
 {id:"VR-C-0024",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["hypothesis","theory","law","experiment","conclusion"],answer_index:3,answer:"experiment",explanation:"Hypothesis, theory, law, and conclusion are scientific concepts; experiment is a method."},
 {id:"VR-C-0025",type:"odd_word",difficulty:"medium",stem:"Choose the word which is least like the others.",choices:["integer","rational","irrational","complex","equation"],answer_index:4,answer:"equation",explanation:"Integer, rational, irrational, and complex are number types; equation is a mathematical statement."},

 // Hard (5 questions)
 {id:"VR-C-0026",type:"odd_word",difficulty:"hard",stem:"Choose the word which is least like the others.",choices:["epistemology","ontology","aesthetics","ethics","methodology"],answer_index:4,answer:"methodology",explanation:"Epistemology, ontology, aesthetics, and ethics are branches of philosophy; methodology is a research approach."},
 {id:"VR-C-0027",type:"odd_word",difficulty:"hard",stem:"Choose the word which is least like the others.",choices:["hegemony","sovereignty","autonomy","independence","democracy"],answer_index:4,answer:"democracy",explanation:"Hegemony, sovereignty, autonomy, and independence relate to power/control; democracy is a system type."},
 {id:"VR-C-0028",type:"odd_word",difficulty:"hard",stem:"Choose the word which is least like the others.",choices:["phenotype","genotype","allele","chromosome","environment"],answer_index:4,answer:"environment",explanation:"Phenotype, genotype, allele, and chromosome are genetic terms; environment is external factor."},
 {id:"VR-C-0029",type:"odd_word",difficulty:"hard",stem:"Choose the word which is least like the others.",choices:["deduction","induction","abduction","syllogism","fallacy"],answer_index:4,answer:"fallacy",explanation:"Deduction, induction, abduction, and syllogism are reasoning methods; fallacy is flawed reasoning."},
 {id:"VR-C-0030",type:"odd_word",difficulty:"hard",stem:"Choose the word which is least like the others.",choices:["paradigm","heuristic","algorithm","theorem","axiom"],answer_index:1,answer:"paradigm",explanation:"Heuristic, algorithm, theorem, and axiom are specific logical constructs; paradigm is a broader framework."},

 // === ODD PAIR QUESTIONS (30 total) ===
 // Easy (10 questions)
 {id:"VR-C-0031",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["cow:calf","horse:foal","sheep:lamb","deer:fawn","dog:kennel"],answer_index:4,answer:"dog:kennel",explanation:"Others are animal:young; this is animal:dwelling."},
 {id:"VR-C-0032",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["happy:joyful","rapid:fast","ancient:old","expand:shrink","silent:quiet"],answer_index:3,answer:"expand:shrink",explanation:"Others are synonyms; this is an antonym pair."},
 {id:"VR-C-0033",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["bird:nest","bee:hive","spider:web","fish:aquarium","ant:hill"],answer_index:3,answer:"fish:aquarium",explanation:"Others are animal:natural home; aquarium is artificial."},
 {id:"VR-C-0034",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["pen:write","knife:cut","hammer:nail","scissors:cut","brush:paint"],answer_index:2,answer:"hammer:nail",explanation:"Others are tool:action; this is tool:object."},
 {id:"VR-C-0035",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["hot:cold","big:small","fast:slow","good:better","light:dark"],answer_index:3,answer:"good:better",explanation:"Others are antonym pairs; this is comparative form."},
 {id:"VR-C-0036",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["doctor:hospital","teacher:school","chef:restaurant","pilot:airplane","lawyer:court"],answer_index:3,answer:"pilot:airplane",explanation:"Others are profession:workplace; airplane is a vehicle, not workplace."},
 {id:"VR-C-0037",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["apple:fruit","rose:flower","oak:tree","carrot:vegetable","water:liquid"],answer_index:4,answer:"water:liquid",explanation:"Others are specific:category for living things; water:liquid is substance:state."},
 {id:"VR-C-0038",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["book:read","music:listen","movie:watch","food:eat","game:player"],answer_index:4,answer:"game:player",explanation:"Others are object:action; this is object:person."},
 {id:"VR-C-0039",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["sun:day","moon:night","star:sky","rain:cloud","snow:winter"],answer_index:3,answer:"rain:cloud",explanation:"Others are celestial object:time; this is weather:source."},
 {id:"VR-C-0040",type:"odd_pair",difficulty:"easy",stem:"Choose the pair which is least like the others.",choices:["key:lock","plug:socket","button:shirt","zipper:jacket","belt:waist"],answer_index:4,answer:"belt:waist",explanation:"Others are fastener:object; this is accessory:body part."},

 // Medium (15 questions)
 {id:"VR-C-0041",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["blacksmith:anvil","carpenter:saw","barber:scissors","goldsmith:ornament","sculptor:chisel"],answer_index:3,answer:"goldsmith:ornament",explanation:"Others are worker:tool; this is worker:product."},
 {id:"VR-C-0042",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["nurse:hospital","teacher:classroom","chef:kitchen","composer:symphony","cashier:store"],answer_index:3,answer:"composer:symphony",explanation:"Others are profession:workplace; this is creator:creation."},
 {id:"VR-C-0043",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["catalyst:reaction","fertilizer:growth","medicine:healing","poison:death","vaccine:prevention"],answer_index:3,answer:"poison:death",explanation:"Others cause positive effects; poison causes harm."},
 {id:"VR-C-0044",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["author:novel","director:film","composer:symphony","painter:portrait","actor:performance"],answer_index:4,answer:"actor:performance",explanation:"Others are creator:creation; actor performs but doesn't create the work."},
 {id:"VR-C-0045",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["thesis:antithesis","question:answer","problem:solution","cause:effect","theory:practice"],answer_index:4,answer:"theory:practice",explanation:"Others are opposing or complementary pairs; theory and practice can coexist."},
 {id:"VR-C-0046",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["democracy:vote","monarchy:crown","republic:constitution","dictatorship:oppression","oligarchy:elite"],answer_index:2,answer:"monarchy:crown",explanation:"Others are government:characteristic; crown is a symbol, not defining feature."},
 {id:"VR-C-0047",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["supply:demand","import:export","revenue:expense","profit:loss","buy:sell"],answer_index:0,answer:"supply:demand",explanation:"Others are direct opposites; supply and demand are complementary market forces."},
 {id:"VR-C-0048",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["mitosis:division","meiosis:reduction","photosynthesis:energy","respiration:oxygen","digestion:nutrients"],answer_index:3,answer:"respiration:oxygen",explanation:"Others are process:purpose; respiration uses oxygen rather than producing it."},
 {id:"VR-C-0049",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["velocity:speed","acceleration:change","momentum:motion","force:push","energy:capacity"],answer_index:3,answer:"force:push",explanation:"Others are physics term:general concept; push is specific type of force."},
 {id:"VR-C-0050",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["hypothesis:test","theory:explain","law:predict","model:represent","data:collect"],answer_index:4,answer:"data:collect",explanation:"Others are scientific concept:purpose; data is collected, not the other way around."},
 {id:"VR-C-0051",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["analogy:comparison","metaphor:similarity","simile:likeness","irony:contrast","symbol:representation"],answer_index:3,answer:"irony:contrast",explanation:"Others are literary device:function; irony often reveals unexpected similarity, not just contrast."},
 {id:"VR-C-0052",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["database:storage","algorithm:process","interface:interaction","protocol:communication","software:program"],answer_index:4,answer:"software:program",explanation:"Others are component:function; software and program are essentially the same thing."},
 {id:"VR-C-0053",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["latitude:north","longitude:east","altitude:up","depth:down","width:across"],answer_index:1,answer:"longitude:east",explanation:"Others indicate direction of measurement; longitude measures east-west, not just east."},
 {id:"VR-C-0054",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["conductor:orchestra","director:movie","editor:newspaper","curator:museum","manager:team"],answer_index:2,answer:"editor:newspaper",explanation:"Others are leader:group; editor works on content, not leading people."},
 {id:"VR-C-0055",type:"odd_pair",difficulty:"medium",stem:"Choose the pair which is least like the others.",choices:["stimulus:response","input:output","question:answer","challenge:solution","cause:effect"],answer_index:3,answer:"challenge:solution",explanation:"Others are automatic or direct relationships; challenge-solution requires problem-solving."},

 // Hard (5 questions)
 {id:"VR-C-0056",type:"odd_pair",difficulty:"hard",stem:"Choose the pair which is least like the others.",choices:["France:Paris","Japan:Tokyo","Australia:Sydney","Italy:Rome","Egypt:Cairo"],answer_index:2,answer:"Australia:Sydney",explanation:"Australia's capital is Canberra, not Sydney."},
 {id:"VR-C-0057",type:"odd_pair",difficulty:"hard",stem:"Choose the pair which is least like the others.",choices:["USA:dollar","UK:pound","Japan:yen","India:rupee","France:lira"],answer_index:4,answer:"France:lira",explanation:"France uses the euro; lira is outdated/incorrect."},
 {id:"VR-C-0058",type:"odd_pair",difficulty:"hard",stem:"Choose the pair which is least like the others.",choices:["epistemology:knowledge","ontology:being","aesthetics:beauty","ethics:morality","methodology:research"],answer_index:4,answer:"methodology:research",explanation:"Others are philosophy branches:subject matter; methodology is approach, not philosophical branch."},
 {id:"VR-C-0059",type:"odd_pair",difficulty:"hard",stem:"Choose the pair which is least like the others.",choices:["phenotype:observable","genotype:inherited","allele:variant","chromosome:structure","mutation:change"],answer_index:3,answer:"chromosome:structure",explanation:"Others are genetic concept:defining characteristic; chromosome is a structure containing genetic material."},
 {id:"VR-C-0060",type:"odd_pair",difficulty:"hard",stem:"Choose the pair which is least like the others.",choices:["deduction:specific","induction:general","abduction:probable","syllogism:logical","heuristic:practical"],answer_index:3,answer:"syllogism:logical",explanation:"Others are reasoning method:result type; syllogism is a form, not result characteristic."},

 // === ODD NUMBER QUESTIONS (20 total) ===
 // Easy (8 questions)
 {id:"VR-C-0061",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["11","17","21","23","29"],answer_index:2,answer:"21",explanation:"21 is composite; others are prime."},
 {id:"VR-C-0062",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["16","36","54","64","81"],answer_index:2,answer:"54",explanation:"54 is not a perfect square; others are."},
 {id:"VR-C-0063",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["2","4","6","9","8"],answer_index:3,answer:"9",explanation:"2,4,6,8 are even numbers; 9 is odd."},
 {id:"VR-C-0064",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["5","10","15","20","22"],answer_index:4,answer:"22",explanation:"5,10,15,20 are multiples of 5; 22 is not."},
 {id:"VR-C-0065",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["1","4","9","16","20"],answer_index:4,answer:"20",explanation:"1,4,9,16 are perfect squares; 20 is not."},
 {id:"VR-C-0066",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["3","6","9","12","14"],answer_index:4,answer:"14",explanation:"3,6,9,12 are multiples of 3; 14 is not."},
 {id:"VR-C-0067",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["100","121","144","169","180"],answer_index:4,answer:"180",explanation:"100,121,144,169 are perfect squares; 180 is not."},
 {id:"VR-C-0068",type:"odd_number",difficulty:"easy",stem:"Choose the number which is least like the others.",choices:["7","14","21","28","30"],answer_index:4,answer:"30",explanation:"7,14,21,28 are multiples of 7; 30 is not."},

 // Medium (8 questions)
 {id:"VR-C-0069",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["18","24","30","42","50"],answer_index:4,answer:"50",explanation:"50 is not divisible by 6; others are multiples of 6."},
 {id:"VR-C-0070",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["18","27","36","45","53"],answer_index:4,answer:"53",explanation:"18,27,36,45 have digit sum 9; 53 does not."},
 {id:"VR-C-0071",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["12","18","24","30","35"],answer_index:4,answer:"35",explanation:"12,18,24,30 are multiples of 6; 35 is not."},
 {id:"VR-C-0072",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["15","21","28","35","42"],answer_index:2,answer:"28",explanation:"15,21,35,42 are multiples of 7; 28 is multiple of 7 but also of 4."},
 {id:"VR-C-0073",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["32","48","64","80","90"],answer_index:4,answer:"90",explanation:"32,48,64,80 are multiples of 16; 90 is not."},
 {id:"VR-C-0074",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["11","22","33","44","50"],answer_index:4,answer:"50",explanation:"11,22,33,44 are multiples of 11; 50 is not."},
 {id:"VR-C-0075",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["25","49","64","81","100"],answer_index:2,answer:"64",explanation:"25,49,81,100 are squares of odd numbers; 64 is square of even number."},
 {id:"VR-C-0076",type:"odd_number",difficulty:"medium",stem:"Choose the number which is least like the others.",choices:["17","19","23","27","29"],answer_index:3,answer:"27",explanation:"17,19,23,29 are prime numbers; 27 is composite."},

 // Hard (4 questions)
 {id:"VR-C-0077",type:"odd_number",difficulty:"hard",stem:"Choose the number which is least like the others.",choices:["13","21","34","55","60"],answer_index:4,answer:"60",explanation:"60 is not a Fibonacci number; others are consecutive Fibonacci numbers."},
 {id:"VR-C-0078",type:"odd_number",difficulty:"hard",stem:"Choose the number which is least like the others.",choices:["8","27","64","125","72"],answer_index:4,answer:"72",explanation:"8,27,64,125 are perfect cubes; 72 is not."},
 {id:"VR-C-0079",type:"odd_number",difficulty:"hard",stem:"Choose the number which is least like the others.",choices:["2","3","5","7","9"],answer_index:4,answer:"9",explanation:"2,3,5,7 are prime numbers; 9 is composite."},
 {id:"VR-C-0080",type:"odd_number",difficulty:"hard",stem:"Choose the number which is least like the others.",choices:["6","28","496","8128","1000"],answer_index:4,answer:"1000",explanation:"6,28,496,8128 are perfect numbers; 1000 is not."},

 // === ODD LETTERS QUESTIONS (10 total) ===
 // Easy (4 questions)
 {id:"VR-C-0081",type:"odd_letters",difficulty:"easy",stem:"Choose the letter group which is least like the others.",choices:["AB","BC","CD","DE","DF"],answer_index:4,answer:"DF",explanation:"AB,BC,CD,DE are consecutive pairs; DF skips one letter."},
 {id:"VR-C-0082",type:"odd_letters",difficulty:"easy",stem:"Choose the letter group which is least like the others.",choices:["BB","CC","DD","EE","EF"],answer_index:4,answer:"EF",explanation:"BB,CC,DD,EE are doubled letters; EF is mixed."},
 {id:"VR-C-0083",type:"odd_letters",difficulty:"easy",stem:"Choose the letter group which is least like the others.",choices:["AC","BD","CE","DF","EH"],answer_index:4,answer:"EH",explanation:"AC,BD,CE,DF skip one letter; EH skips two letters."},
 {id:"VR-C-0084",type:"odd_letters",difficulty:"easy",stem:"Choose the letter group which is least like the others.",choices:["XY","YZ","AB","BC","DE"],answer_index:4,answer:"DE",explanation:"XY,YZ,AB,BC are consecutive pairs; DE skips C."},

 // Medium (4 questions)
 {id:"VR-C-0085",type:"odd_letters",difficulty:"medium",stem:"Choose the letter group which is least like the others.",choices:["AE","IO","OU","EA","BC"],answer_index:4,answer:"BC",explanation:"AE,IO,OU,EA are vowel pairs; BC is consonant pair."},
 {id:"VR-C-0086",type:"odd_letters",difficulty:"medium",stem:"Choose the letter group which is least like the others.",choices:["AC","EG","IK","MO","PQ"],answer_index:4,answer:"PQ",explanation:"AC,EG,IK,MO have a gap of one letter; PQ is consecutive."},
 {id:"VR-C-0087",type:"odd_letters",difficulty:"medium",stem:"Choose the letter group which is least like the others.",choices:["KLM","STU","PQR","WXY","ABD"],answer_index:4,answer:"ABD",explanation:"Others are consecutive triplets; ABD skips C."},
 {id:"VR-C-0088",type:"odd_letters",difficulty:"medium",stem:"Choose the letter group which is least like the others.",choices:["BDF","HJL","NPR","TVX","ACE"],answer_index:4,answer:"ACE",explanation:"BDF,HJL,NPR,TVX skip one letter with consonants; ACE has vowels."},

 // Hard (2 questions)
 {id:"VR-C-0089",type:"odd_letters",difficulty:"hard",stem:"Choose the letter group which is least like the others.",choices:["AZ","BY","CX","DT","EW"],answer_index:3,answer:"DT",explanation:"AZ,BY,CX,EW mirror to 27; D(4)+T(20)=24, not 27."},
 {id:"VR-C-0090",type:"odd_letters",difficulty:"hard",stem:"Choose the letter group which is least like the others.",choices:["ABCD","EFGH","IJKL","MNOP","QRTU"],answer_index:4,answer:"QRTU",explanation:"ABCD,EFGH,IJKL,MNOP are consecutive quartets; QRTU skips S."}
];

function shuffle(array){
 const a=[...array];
 for(let i=a.length-1;i>0;i--){
 const j=Math.floor(Math.random()*(i+1));
 [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
}

function randomizeChoices(q){
 const indices = q.choices.map((_,i)=>i);
 const mapping = shuffle(indices);
 const newChoices = mapping.map(i=>q.choices[i]);
 const newAnswerIndex = mapping.indexOf(q.answer_index);
 return {...q, choices:newChoices, answer_index:newAnswerIndex};
}

function selectByTypeAndDifficulty(pool, distribution){
 const byType = {};
 pool.forEach(q=>{(byType[q.type]||(byType[q.type]={}))[q.difficulty] = [ ...(byType[q.type]?.[q.difficulty]||[]), q ];});
 const result=[];
 Object.keys(distribution).forEach(type=>{
 const spec = distribution[type];
 const pick = (arr,n)=>shuffle(arr||[]).slice(0,n);
 result.push(
 ...pick(byType[type]?.easy, spec.easy||0),
 ...pick(byType[type]?.medium, spec.medium||0),
 ...pick(byType[type]?.hard, spec.hard||0)
 );
 });
 return result;
}

const VRT5_CONFIG = {
 timeLimit: 25,
 questionCount: 25,
 distribution: {
 odd_word: { easy:4, medium:6, hard:2 }, // 12 total from 30 available
 odd_pair: { easy:3, medium:5, hard:2 }, // 10 total from 30 available
 odd_number: { easy:2, medium:2, hard:1 }, // 5 total from 20 available
 odd_letters:{ easy:1, medium:1, hard:1 } // 3 total from 10 available
 }
};

export function getRandomizedVRT5(){
 // Select according to distribution, then fill if short
 let selected = selectByTypeAndDifficulty(SAMPLE_CLASSIFICATION, VRT5_CONFIG.distribution);
 if (selected.length < VRT5_CONFIG.questionCount){
 const remaining = VRT5_CONFIG.questionCount - selected.length;
 const fillers = shuffle(SAMPLE_CLASSIFICATION.filter(q=>!selected.includes(q))).slice(0, remaining);
 selected = [...selected, ...fillers];
 }
 selected = shuffle(selected).slice(0, VRT5_CONFIG.questionCount).map((q,idx)=>{
 const rq = randomizeChoices(q);
 return {
 id: idx+1,
 question_text: rq.stem,
 options: rq.choices,
 correct_answer: rq.answer,
 explanation: rq.explanation,
 type: rq.type,
 difficulty: rq.difficulty,
 original_id: q.id
 };
 });

 return {
 id: 'VRT5',
 title: 'Verbal Reasoning Test 5 - Classification (Odd-One-Out)',
 description: 'Identify the item that does not belong in the group based on logical classification rules.',
 timeLimit: VRT5_CONFIG.timeLimit,
 totalQuestions: selected.length,
 sections: [
 {
 id: 5,
 title: 'Classification (Odd-One-Out)',
 description: 'Each question presents a set. Select the odd item that breaks the common rule.',
 passages: [
 {
 id: 'vrt5_classification',
 passage_title: 'Classification Challenge',
 passage_text: 'Choose the odd one out. Consider category, property, or pattern. One option is unambiguously different.',
 questions: selected
 }
 ]
 }
 ]
 };
}

export default getRandomizedVRT5;

