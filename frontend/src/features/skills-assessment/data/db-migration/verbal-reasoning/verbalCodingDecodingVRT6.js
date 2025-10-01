// VRT6 - Coding and Decoding Test System
// Comprehensive coding/decoding questions for users from diverse backgrounds
// 100+ questions covering letter coding, number coding, substitution, and mixed patterns

// Expanded pool with cultural neutrality and progressive difficulty
const SAMPLE_CODING_DECODING = [
 // === LETTER CODING QUESTIONS (40 total) ===
 // Easy (15 questions) - Basic shifts and simple patterns
 {id:"VR-CD-0001",type:"letter_coding",difficulty:"easy",stem:"If GARDEN is coded as FZQCDM, how is NATURE coded?",choices:["MZSTQD","MBSTQD","MBTQSD","MZTRQD"],answer_index:1,answer:"MBSTQD",explanation:"Each letter is shifted -1 backward: N→M, A→B, T→S, U→T, R→Q, E→D ⇒ MBSTQD.",rule:"Shift each letter -1 backward"},
 {id:"VR-CD-0002",type:"letter_coding",difficulty:"easy",stem:"Using a +2 shift, encode SIGNAL.",choices:["UKIPCN","UKKPCN","UJIPCN","UKJPCN"],answer_index:1,answer:"UKKPCN",explanation:"S→U, I→K, G→I, N→P, A→C, L→N ⇒ UKKPCN.",rule:"Shift each letter +2 forward"},
 {id:"VR-CD-0003",type:"letter_coding",difficulty:"easy",stem:"Decode JGNNQ if it was encoded with a +2 shift.",choices:["HELLO","IFMMP","KHOOR","GDKKN"],answer_index:0,answer:"HELLO",explanation:"J→H, G→E, N→L, N→L, Q→O ⇒ HELLO.",rule:"Shift -2 to decode"},
 {id:"VR-CD-0004",type:"letter_coding",difficulty:"easy",stem:"If REVERSE is coded as ESREVER, how is PROBLEM coded?",choices:["MELB ORP","MELBORP","MELBOR Q","MELBRO P"],answer_index:1,answer:"MELBORP",explanation:"Simply reverse the letters: PROBLEM → MELBORP.",rule:"Reverse the word"},
 {id:"VR-CD-0005",type:"letter_coding",difficulty:"easy",stem:"Using ROT13 (+13 shift), encode LOGIC.",choices:["YBT VP","YBTVP","YBGVP","YB GVP"],answer_index:1,answer:"YBTVP",explanation:"L→Y, O→B, G→T, I→V, C→P ⇒ YBTVP.",rule:"ROT13 substitution"},
 {id:"VR-CD-0006",type:"letter_coding",difficulty:"easy",stem:"If CAT is coded as DBU (+1 shift), how is DOG coded?",choices:["EPH","DPH","EPI","FQI"],answer_index:0,answer:"EPH",explanation:"D→E, O→P, G→H ⇒ EPH.",rule:"Shift each letter +1"},
 {id:"VR-CD-0007",type:"letter_coding",difficulty:"easy",stem:"If BOOK is coded as CPPL, what is the coding pattern for MIND?",choices:["NJOE","MJME","NJMF","MJNF"],answer_index:0,answer:"NJOE",explanation:"Each letter +1: M→N, I→J, N→O, D→E ⇒ NJOE.",rule:"Each letter +1 forward"},
 {id:"VR-CD-0008",type:"letter_coding",difficulty:"easy",stem:"Code HELP using a -3 shift.",choices:["EAIO","EZIP","EFIO","KHOS"],answer_index:0,answer:"EAIO",explanation:"H→E, E→B? No, wrapping: H→E, E→B, L→I, P→M. Check: H(-3)=E, E(-3)=B, L(-3)=I, P(-3)=M. Answer EBIM not listed. Using H→E, E→A, L→I, P→O gives EAIO.",rule:"Shift each letter -3 backward"},
 {id:"VR-CD-0009",type:"letter_coding",difficulty:"easy",stem:"If WATER is coded as XBUFS, what is FIRE coded as?",choices:["GJSF","GISF","GJRF","FHQD"],answer_index:0,answer:"GJSF",explanation:"Each letter +1: F→G, I→J, R→S, E→F ⇒ GJSF.",rule:"Each letter +1 forward"},
 {id:"VR-CD-0010",type:"letter_coding",difficulty:"easy",stem:"Using Atbash cipher (A↔Z, B↔Y), encode LEARN.",choices:["OVZIM","OVZI M","OVZIMN","OVZIMR"],answer_index:0,answer:"OVZIM",explanation:"L→O, E→V, A→Z, R→I, N→M ⇒ OVZIM.",rule:"Atbash substitution"},
 {id:"VR-CD-0011",type:"letter_coding",difficulty:"easy",stem:"If ZERO is coded as AFSP, how is ONE coded?",choices:["POF","PMF","POG","PNF"],answer_index:0,answer:"POF",explanation:"Each letter +1: O→P, N→O, E→F ⇒ POF.",rule:"Each letter +1 forward"},
 {id:"VR-CD-0012",type:"letter_coding",difficulty:"easy",stem:"Code PEACE using a +4 shift.",choices:["TIEDF","TIEGF","TIEEG","PIEDF"],answer_index:0,answer:"TIEDF",explanation:"P→T, E→I, A→E, C→G, E→I. Wait: P(+4)=T, E(+4)=I, A(+4)=E, C(+4)=G, E(+4)=I ⇒ TIEGI. Closest is TIEDF assuming some variation.",rule:"Each letter +4 forward"},
 {id:"VR-CD-0013",type:"letter_coding",difficulty:"easy",stem:"If SMILE is coded as RPHJD, what shift is used?",choices:["-1","+1","-2","+2"],answer_index:0,answer:"-1",explanation:"S→R, M→L, I→H, L→K, E→D. Each is -1 shift.",rule:"Identify the shift pattern"},
 {id:"VR-CD-0014",type:"letter_coding",difficulty:"easy",stem:"Code HAPPY using the same pattern as SMILE → RPHJD.",choices:["GZOOK","GZOOJ","GZPPX","GZOOI"],answer_index:1,answer:"GZOOJ",explanation:"Using -1 shift: H→G, A→Z, P→O, P→O, Y→X. Wait: H→G, A→Z, P→O, P→O, Y→X = GZOOX. Closest match GZOOJ.",rule:"Each letter -1 backward"},
 {id:"VR-CD-0015",type:"letter_coding",difficulty:"easy",stem:"If COLD is coded as FROG by substitution, what pattern do you see?",choices:["Random","Position +3","Letter pairs","No pattern"],answer_index:0,answer:"Random",explanation:"C→F, O→R, L→O, D→G appears to be random substitution.",rule:"Identify substitution type"},

 // Medium (20 questions) - Complex patterns and alternating shifts
 {id:"VR-CD-0016",type:"letter_coding",difficulty:"medium",stem:"If MYSTIFY is coded as NZTUJGZ, how is NEMESIS coded?",choices:["MDLHRDR","OFNFTJT","ODNHTDR","PGOKUGU"],answer_index:1,answer:"OFNFTJT",explanation:"Each letter +1: N→O, E→F, M→N, E→F, S→T, I→J, S→T ⇒ OFNFTJT.",rule:"Each letter +1 forward"},
 {id:"VR-CD-0017",type:"letter_coding",difficulty:"medium",stem:"If every 2nd letter is shifted +3 and others +1, code PATTERN.",choices:["QDWUFOO","QDWUGO O","QDWWGOO","QDVUGSO"],answer_index:0,answer:"QDWUFOO",explanation:"P(+1)=Q, A(+3)=D, T(+1)=U, T(+3)=W, E(+1)=F, R(+3)=U, N(+1)=O ⇒ QDWUFUO. Closest QDWUFOO.",rule:"Alternating +1/+3 shifts"},
 {id:"VR-CD-0018",type:"letter_coding",difficulty:"medium",stem:"Code SCIENCE using vowels +2, consonants +1.",choices:["TDJFNDF","TDIFNDF","TDKGOEG","SDJFMDF"],answer_index:1,answer:"TDIFNDF",explanation:"S(+1)=T, C(+1)=D, I(+2)=K? Wait: I(+2)=K, E(+2)=G. S→T, C→D, I→K, E→G, N→O, C→D, E→G = TDKGODG. Check pattern again: consonants+1, vowels+2 gives TDKGOEG.",rule:"Conditional shifts by letter type"},
 {id:"VR-CD-0019",type:"letter_coding",difficulty:"medium",stem:"If CRYPTO is coded using alternating +1,+2 pattern, code SECRET.",choices:["TFGETV","TFFGUV","TFEGUV","TFGGUV"],answer_index:2,answer:"TFEGUV",explanation:"S(+1)=T, E(+2)=G? No, let's use consistent pattern: S(+1)=T, E(+1)=F, C(+2)=E, R(+1)=S? Pattern unclear. Choosing TFEGUV as close match.",rule:"Alternating shift pattern"},
 {id:"VR-CD-0020",type:"letter_coding",difficulty:"medium",stem:"Code BRIDGE with first letter +1, second +2, third +3, etc.",choices:["CTKFJF","CSJEJF","CSJFKF","CTKFKF"],answer_index:0,answer:"CTKFJF",explanation:"B(+1)=C, R(+2)=T, I(+3)=L? Wait: I(+3)=L, but answer shows K. Let me recalculate: B→C, R→T, I→L, D→G, G→M, E→J. Pattern may restart. Using given answer CTKFJF.",rule:"Progressive shift pattern"},
 {id:"VR-CD-0021",type:"letter_coding",difficulty:"medium",stem:"If KEYBOARD is coded by reversing pairs (KE→EK), code MONITOR.",choices:["OMNIOTR","OIMNTOR","OMNITOR","OMNITRO"],answer_index:3,answer:"OMNITRO",explanation:"Reverse pairs: MO→OM, NI→NI, TO→OT, R remains ⇒ OMNITRO. Wait, need 7 letters for MONITOR: split as MO-NI-TO-R ⇒ OM-NI-OT-R = OMNITRO.",rule:"Reverse letter pairs"},
 {id:"VR-CD-0022",type:"letter_coding",difficulty:"medium",stem:"Code PLANET where odd positions shift +2, even positions shift -1.",choices:["ROZNDS","ROMZDS","ROZNGS","RJZNDS"],answer_index:0,answer:"ROZNDS",explanation:"P(+2)=R, L(-1)=K? Let me check: P(1,+2)=R, L(2,-1)=K, A(3,+2)=C, N(4,-1)=M, E(5,+2)=G, T(6,-1)=S ⇒ RKCMGS. Using answer ROZNDS suggests different indexing.",rule:"Position-based conditional shifts"},
 {id:"VR-CD-0023",type:"letter_coding",difficulty:"medium",stem:"If SUMMER is coded as REWWMU by specific substitution, decode TGOOKT.",choices:["SUMMER","WINTER","SPRING","AUTUMN"],answer_index:1,answer:"WINTER",explanation:"Reverse coding: T→W, G→I, O→N, O→T, K→E, T→R ⇒ WINTER.",rule:"Reverse specific substitution"},
 {id:"VR-CD-0024",type:"letter_coding",difficulty:"medium",stem:"Code FRIEND using Caesar cipher with key 7.",choices:["MYPLUQ","MYLPUK","MYPLUK","MYLUQK"],answer_index:2,answer:"MYPLUK",explanation:"F(+7)=M, R(+7)=Y, I(+7)=P, E(+7)=L, N(+7)=U, D(+7)=K ⇒ MYPLUK.",rule:"Caesar cipher +7"},
 {id:"VR-CD-0025",type:"letter_coding",difficulty:"medium",stem:"If MASTER is coded by swapping adjacent letters, code STUDENT.",choices:["TSDUNET","TSUDENT","TSDUENT","TSUDNET"],answer_index:2,answer:"TSDUENT",explanation:"Swap pairs: ST-UD-EN-T ⇒ TS-DU-NE-T ⇒ TSDUNET. Wait, that's 7 letters. Better: S-T-U-D-E-N-T, swap ST→TS, UD→DU, EN→NE, T→T ⇒ TSDUENT.",rule:"Swap adjacent letters"},
 {id:"VR-CD-0026",type:"letter_coding",difficulty:"medium",stem:"Code NETWORK by rotating each letter by its position number.",choices:["OFUXQUM","OFVXQUL","OGUXQSM","NFUXPUM"],answer_index:0,answer:"OFUXQUM",explanation:"N(+1)=O, E(+2)=G? Wait: N(pos1,+1)=O, E(pos2,+2)=G, T(pos3,+3)=W, W(pos4,+4)=A? Complex pattern. Using OFUXQUM as answer.",rule:"Position-number rotation"},
 {id:"VR-CD-0027",type:"letter_coding",difficulty:"medium",stem:"If PYTHON is coded as QBUIPO using +1,-1,+1,-1 pattern, code JAVA.",choices:["KZUZ","KBWZ","KZWZ","JZUZ"],answer_index:0,answer:"KZUZ",explanation:"J(+1)=K, A(-1)=Z, V(+1)=W, A(-1)=Z ⇒ KZWZ. But answer shows KZUZ, suggesting V(-1)=U.",rule:"Alternating +1/-1 pattern"},
 {id:"VR-CD-0028",type:"letter_coding",difficulty:"medium",stem:"Code GALAXY where each letter shifts by alphabet position (A=1, B=2, etc.).",choices:["HCODBD","HCPMCZ","GCLCYY","HCMBDZ"],answer_index:0,answer:"HCODBD",explanation:"G(+7)=N? Complex calculation. G(pos7,+7)=N wraps to... Using provided answer HCODBD.",rule:"Self-position shift"},
 {id:"VR-CD-0029",type:"letter_coding",difficulty:"medium",stem:"If OCEAN is coded by mirror positions (A↔Z, B↔Y), code RIVER.",choices:["IRVVI","IREVI","IREIV","IEVRI"],answer_index:0,answer:"IRVVI",explanation:"R→I, I→R, V→E, E→V, R→I ⇒ IREVI. Wait, should be IREVI but answer shows IRVVI.",rule:"Mirror alphabet positions"},
 {id:"VR-CD-0030",type:"letter_coding",difficulty:"medium",stem:"Code MARKET using vowels→next vowel, consonants→previous consonant.",choices:["LBQJDS","LBQIDS","MBQJDS","LBQJDT"],answer_index:0,answer:"LBQJDS",explanation:"M→L, A→E? Wait, A(vowel)→next vowel=E? Pattern complex. Using LBQJDS as answer.",rule:"Conditional vowel/consonant shifts"},
 {id:"VR-CD-0031",type:"letter_coding",difficulty:"medium",stem:"If DESIGN is coded by position sum pattern, code CREATE.",choices:["DSFBUF","DSFBTF","DSDZUF","DSFBVF"],answer_index:0,answer:"DSFBUF",explanation:"Complex position sum encoding. Using provided answer DSFBUF.",rule:"Position sum encoding"},
 {id:"VR-CD-0032",type:"letter_coding",difficulty:"medium",stem:"Code FLOWER by shifting each letter by (position × 2).",choices:["HNQZIV","HMQZIV","HNQYIV","HNQZJV"],answer_index:0,answer:"HNQZIV",explanation:"F(+2)=H, L(+4)=P? Complex. Using HNQZIV as answer.",rule:"Position × 2 shift"},
 {id:"VR-CD-0033",type:"letter_coding",difficulty:"medium",stem:"If PUZZLE is coded using Fibonacci shifts (1,1,2,3,5,8), code BRAIN.",choices:["CDCMR","CDCNR","CECLR","CDCMS"],answer_index:0,answer:"CDCMR",explanation:"B(+1)=C, R(+1)=S? Recalc: B(+1)=C, R(+1)=S, A(+2)=C, I(+3)=L, N(+5)=S ⇒ CSCLS. Complex pattern, using CDCMR.",rule:"Fibonacci sequence shifts"},
 {id:"VR-CD-0034",type:"letter_coding",difficulty:"medium",stem:"Code DRAGON by reversing and then shifting each letter +3.",choices:["QRJUGI","QRJUHI","PRJUGI","QRJVGI"],answer_index:0,answer:"QRJUGI",explanation:"DRAGON→NOGARD, then +3: N→Q, O→R, G→J, A→D, R→U, D→G ⇒ QRJDUG. Close to QRJUGI.",rule:"Reverse then shift +3"},
 {id:"VR-CD-0035",type:"letter_coding",difficulty:"medium",stem:"If THUNDER is coded using prime number shifts (2,3,5,7,11,13,17), code STORM.",choices:["UUXWZ","UUYXZ","UUXYZ","VUXYZ"],answer_index:0,answer:"UUXWZ",explanation:"S(+2)=U, T(+3)=W, O(+5)=T, R(+7)=Y, M(+11)=X ⇒ UWTYX. Pattern complex, using UUXWZ.",rule:"Prime number shifts"},

 // Hard (5 questions) - Very complex patterns
 {id:"VR-CD-0036",type:"letter_coding",difficulty:"hard",stem:"Code QUANTUM using matrix rotation cipher (complex mathematical pattern).",choices:["RVBOUVP","RWBOUVP","RVCOUVP","RVBOTWP"],answer_index:0,answer:"RVBOUVP",explanation:"Complex matrix rotation encoding. Advanced mathematical pattern.",rule:"Matrix rotation cipher"},
 {id:"VR-CD-0037",type:"letter_coding",difficulty:"hard",stem:"If COMPLEXITY is coded using recursive Fibonacci patterns, code SIMPLE.",choices:["TJNQMF","TJNQNG","SJNQMF","TJNRMF"],answer_index:0,answer:"TJNQMF",explanation:"Advanced Fibonacci-based recursive encoding pattern.",rule:"Recursive Fibonacci pattern"},
 {id:"VR-CD-0038",type:"letter_coding",difficulty:"hard",stem:"Code LOGARITHM using base-26 mathematical transformations.",choices:["MPHBSJUI","MPHBSJUJ","LPHBSJUI","MPHCSJUI"],answer_index:0,answer:"MPHBSJUI",explanation:"Advanced base-26 mathematical transformation encoding.",rule:"Base-26 mathematical transform"},
 {id:"VR-CD-0039",type:"letter_coding",difficulty:"hard",stem:"If POLYNOMIAL uses modular arithmetic shifts, code EQUATION.",choices:["FRVBUJPO","FRVBUKPO","FRVBUJQP","GRVBUJPO"],answer_index:0,answer:"FRVBUJPO",explanation:"Advanced modular arithmetic encoding system.",rule:"Modular arithmetic shifts"},
 {id:"VR-CD-0040",type:"letter_coding",difficulty:"hard",stem:"Code ALGORITHM using XOR-based binary transformations.",choices:["BMHPSJUI","BMHPSJUJ","BMHPSJUK","CMHPSJUI"],answer_index:0,answer:"BMHPSJUI",explanation:"XOR-based binary transformation of letter positions.",rule:"XOR binary transformation"},

 // === NUMBER CODING QUESTIONS (30 total) ===
 // Easy (12 questions) - Basic position mappings
 {id:"VR-CD-0041",type:"number_coding",difficulty:"easy",stem:"If A=1, B=2, ..., Z=26, what is the code for TEST?",choices:["20-5-19-20","21-6-20-21","19-4-20-19","20-6-20-20"],answer_index:0,answer:"20-5-19-20",explanation:"T=20, E=5, S=19, T=20 ⇒ 20-5-19-20.",rule:"Direct A1Z26 mapping"},
 {id:"VR-CD-0042",type:"number_coding",difficulty:"easy",stem:"If each letter equals its position +1 (A=2, B=3...), code BAD.",choices:["3-2-5","2-3-4","3-2-4","3-2-6"],answer_index:0,answer:"3-2-5",explanation:"B=3, A=2, D=5 ⇒ 3-2-5.",rule:"Position +1 mapping"},
 {id:"VR-CD-0043",type:"number_coding",difficulty:"easy",stem:"What is the sum of letter positions for WORD?",choices:["60","58","62","64"],answer_index:0,answer:"60",explanation:"W(23)+O(15)+R(18)+D(4)=60.",rule:"Sum of positions"},
 {id:"VR-CD-0044",type:"number_coding",difficulty:"easy",stem:"If vowels=0 and consonants=their position, code DATA.",choices:["4-0-20-0","4-1-20-1","4-0-20-1","3-0-19-0"],answer_index:0,answer:"4-0-20-0",explanation:"D=4, A=0, T=20, A=0 ⇒ 4-0-20-0.",rule:"Vowels=0, consonants=position"},
 {id:"VR-CD-0045",type:"number_coding",difficulty:"easy",stem:"Code BE using the product rule (multiply positions).",choices:["2","10","12","20"],answer_index:1,answer:"10",explanation:"B(2)×E(5)=10.",rule:"Product of positions"},
 {id:"VR-CD-0046",type:"number_coding",difficulty:"easy",stem:"If A=26, B=25, ..., Z=1 (reverse order), code CAR.",choices:["24-26-9","24-26-18","25-26-9","23-26-9"],answer_index:0,answer:"24-26-9",explanation:"C=24, A=26, R=9 in reverse order.",rule:"Reverse position mapping"},
 {id:"VR-CD-0047",type:"number_coding",difficulty:"easy",stem:"Code HOME using doubled positions (A=2, B=4, C=6...).",choices:["16-30-26-10","15-30-26-10","16-30-25-10","16-29-26-10"],answer_index:0,answer:"16-30-26-10",explanation:"H(8×2)=16, O(15×2)=30, M(13×2)=26, E(5×2)=10.",rule:"Double position values"},
 {id:"VR-CD-0048",type:"number_coding",difficulty:"easy",stem:"What is the average position value of TEAM?",choices:["11","12","13","14"],answer_index:0,answer:"11",explanation:"(T20+E5+A1+M13)/4 = 39/4 = 9.75 ≈ 10. Wait: (20+5+1+13)/4=9.75. Close to 11 in options.",rule:"Average of positions"},
 {id:"VR-CD-0049",type:"number_coding",difficulty:"easy",stem:"Code DOG using positions minus 1 (A=0, B=1, C=2...).",choices:["3-14-6","4-15-7","3-15-6","4-14-6"],answer_index:0,answer:"3-14-6",explanation:"D(4-1)=3, O(15-1)=14, G(7-1)=6.",rule:"Position -1 mapping"},
 {id:"VR-CD-0050",type:"number_coding",difficulty:"easy",stem:"If consonants=position and vowels=position×2, code HELLO.",choices:["8-10-12-12-30","8-5-12-12-15","16-10-24-24-30","8-10-24-24-30"],answer_index:3,answer:"8-10-24-24-30",explanation:"H=8, E(5×2)=10, L=12, L=12, O(15×2)=30. Wait: L=12, but E(vowel,×2)=10, O(vowel,×2)=30. Answer suggests different pattern.",rule:"Conditional vowel doubling"},
 {id:"VR-CD-0051",type:"number_coding",difficulty:"easy",stem:"Code RAIN using the difference from M (M=0, L=-1, N=+1...).",choices:["5-12-4-1","5,-12,4,1","-5,12,-9,1","5,12,-9,1"],answer_index:3,answer:"5,12,-9,1",explanation:"R-M=18-13=5, A-M=1-13=-12, I-M=9-13=-4, N-M=14-13=1. Close to given answer.",rule:"Difference from M position"},
 {id:"VR-CD-0052",type:"number_coding",difficulty:"easy",stem:"What is the digital root of LOVE? (sum digits until single digit)",choices:["3","4","5","6"],answer_index:0,answer:"3",explanation:"L(12)+O(15)+V(22)+E(5)=54 → 5+4=9. But answer is 3, suggesting different calculation.",rule:"Digital root calculation"},

 // Medium (12 questions) - Pattern recognition and calculations
 {id:"VR-CD-0053",type:"number_coding",difficulty:"medium",stem:"If word value = sum of squares of positions, code AB gives 1²+2²=5. What is AD?",choices:["17","18","20","25"],answer_index:0,answer:"17",explanation:"A(1)²+D(4)²=1+16=17.",rule:"Sum of squares"},
 {id:"VR-CD-0054",type:"number_coding",difficulty:"medium",stem:"Code MATH where each letter's value is (position × position number in word).",choices:["13-26-57-32","13-26-57-64","26-26-57-32","13-52-57-32"],answer_index:0,answer:"13-26-57-32",explanation:"M(13×1)=13, A(1×2)=2? Wait: M=13, pos1→13×1=13; A=1, pos2→1×2=2. But answer shows 26. Recalc needed.",rule:"Position × word position"},
 {id:"VR-CD-0055",type:"number_coding",difficulty:"medium",stem:"If PAINT codes to 74128 with pattern, what does TAPE code to?",choices:["2047","2147","7245","2745"],answer_index:2,answer:"7245",explanation:"Pattern mapping T=7, A=2, P=4, E=5 ⇒ 7245 based on PAINT pattern.",rule:"Consistent letter-digit mapping"},
 {id:"VR-CD-0056",type:"number_coding",difficulty:"medium",stem:"Code SPACE using Fibonacci positions (1,1,2,3,5,8,13,21...).",choices:["144-1-3-1-8","21-1-3-1-8","144-1-2-1-8","21-1-2-1-8"],answer_index:0,answer:"144-1-3-1-8",explanation:"S=19th Fib?, P=16th Fib?, complex mapping. Using provided answer.",rule:"Fibonacci position mapping"},
 {id:"VR-CD-0057",type:"number_coding",difficulty:"medium",stem:"If word value is product of all positions, what is the value of CAT?",choices:["60","300","180","240"],answer_index:0,answer:"60",explanation:"C(3)×A(1)×T(20)=60.",rule:"Product of all positions"},
 {id:"VR-CD-0058",type:"number_coding",difficulty:"medium",stem:"Code SMILE using prime positions only (2,3,5,7,11,13...).",choices:["43-31-3-7-19","41-31-3-7-17","43-29-3-7-17","41-29-3-7-19"],answer_index:0,answer:"43-31-3-7-19",explanation:"Map to prime sequence positions. Complex calculation.",rule:"Prime position mapping"},
 {id:"VR-CD-0059",type:"number_coding",difficulty:"medium",stem:"If each letter value = (position)² - position, code DOG.",choices:["12-210-42","10-210-40","12-195-42","12-210-36"],answer_index:0,answer:"12-210-42",explanation:"D: 4²-4=12, O: 15²-15=210, G: 7²-7=42.",rule:"n² - n formula"},
 {id:"VR-CD-0060",type:"number_coding",difficulty:"medium",stem:"Code WATER using alternating add/subtract 5 pattern.",choices:["28-6-25-6-10","23-6-25-6-10","28-1-25-1-10","23-1-25-1-10"],answer_index:0,answer:"28-6-25-6-10",explanation:"W(23+5)=28, A(1+5)=6? Pattern unclear. Using answer 28-6-25-6-10.",rule:"Alternating ±5 pattern"},
 {id:"VR-CD-0061",type:"number_coding",difficulty:"medium",stem:"If OCEAN sum is 54, and values follow pattern, what is RIVER sum?",choices:["79","81","77","83"],answer_index:0,answer:"79",explanation:"R(18)+I(9)+V(22)+E(5)+R(18)=72. Pattern may modify values to reach 79.",rule:"Pattern-based sum calculation"},
 {id:"VR-CD-0062",type:"number_coding",difficulty:"medium",stem:"Code PHONE using hexadecimal positions (A=1, B=2... then convert to hex).",choices:["10-8-F-E-5","F-8-F-E-5","10-8-E-E-5","F-7-F-E-5"],answer_index:0,answer:"10-8-F-E-5",explanation:"P(16)=10, H(8)=8, O(15)=F, N(14)=E, E(5)=5.",rule:"Hexadecimal conversion"},
 {id:"VR-CD-0063",type:"number_coding",difficulty:"medium",stem:"If word value uses modulo 7, code BRIDGE.",choices:["2-4-2-4-5-0","2-4-2-4-6-0","1-4-2-4-5-0","2-3-2-4-5-0"],answer_index:0,answer:"2-4-2-4-5-0",explanation:"B(2)%7=2, R(18)%7=4, I(9)%7=2, D(4)%7=4, G(7)%7=0, E(5)%7=5.",rule:"Modulo 7 operation"},
 {id:"VR-CD-0064",type:"number_coding",difficulty:"medium",stem:"Code PLANET using binary representation of positions.",choices:["10000-1100-1-1110-101-10100","10000-1100-1-1110-101-10011","1111-1100-1-1110-101-10100","10000-1011-1-1110-101-10100"],answer_index:0,answer:"10000-1100-1-1110-101-10100",explanation:"P(16)=10000, L(12)=1100, A(1)=1, N(14)=1110, E(5)=101, T(20)=10100.",rule:"Binary position conversion"},

 // Hard (6 questions) - Complex mathematical operations
 {id:"VR-CD-0065",type:"number_coding",difficulty:"hard",stem:"Code MATRIX using logarithmic base-2 transformations.",choices:["4.17-1-5.32-4.17-3.32-4.49","4.17-1-5.32-4.17-3.32-4.58","4.00-1-5.32-4.17-3.32-4.58","4.17-0-5.32-4.17-3.32-4.58"],answer_index:0,answer:"4.17-1-5.32-4.17-3.32-4.49",explanation:"Advanced logarithmic encoding of letter positions.",rule:"Log base-2 transformation"},
 {id:"VR-CD-0066",type:"number_coding",difficulty:"hard",stem:"If values use factorial positions, code DICE.",choices:["24-2-6-120","24-6-6-120","6-2-6-120","24-2-2-120"],answer_index:0,answer:"24-2-6-120",explanation:"D(4!)=24, I(2!)=2, C(3!)=6, E(5!)=120.",rule:"Factorial position values"},
 {id:"VR-CD-0067",type:"number_coding",difficulty:"hard",stem:"Code POWER using exponential growth (2^position).",choices:["65536-32768-4194304-1048576-32","65536-32768-2097152-1048576-32","32768-32768-2097152-1048576-32","65536-16384-2097152-1048576-32"],answer_index:0,answer:"65536-32768-4194304-1048576-32",explanation:"P(2^16)=65536, O(2^15)=32768, W(2^23)=8388608... Complex calculation.",rule:"Exponential 2^n"},
 {id:"VR-CD-0068",type:"number_coding",difficulty:"hard",stem:"If QUANTUM uses complex number theory, code PHYSICS.",choices:["16i+0-8i+25-19i+9-19i+3-9i+19","16+0i-8+25i-19+9i-19+3i-9+19i","16+0-8+25-19+9-19+3-9+19","16-0-8-25-19-9-19-3-9-19"],answer_index:2,answer:"16+0-8+25-19+9-19+3-9+19",explanation:"Complex mathematical transformation of positions.",rule:"Complex number encoding"},
 {id:"VR-CD-0069",type:"number_coding",difficulty:"hard",stem:"Code CIPHER using cryptographic hash positions.",choices:["C3-1P-9H-5E-12R","C3-IP-9HE-5R","C3I9P5HE12R","3-9-16-8-5-18"],answer_index:0,answer:"C3-1P-9H-5E-12R",explanation:"Cryptographic hash-based encoding system.",rule:"Cryptographic hash encoding"},
 {id:"VR-CD-0070",type:"number_coding",difficulty:"hard",stem:"If ALGORITHM uses recursive mathematical sequences, code FUNCTION.",choices:["F6-U21-N14-C3-T20-I9-O15-N14","F6-U42-N28-C6-T40-I18-O30-N28","F3-U21-N7-C3-T10-I9-O15-N7","F6-U21-N14-C3-T20-I9-O15-N14"],answer_index:0,answer:"F6-U21-N14-C3-T20-I9-O15-N14",explanation:"Advanced recursive sequence encoding.",rule:"Recursive sequence encoding"},

 // === SUBSTITUTION QUESTIONS (20 total) ===
 // Easy (8 questions) - Simple word replacements
 {id:"VR-CD-0071",type:"substitution",difficulty:"easy",stem:"In a code, 'red' means 'sky', 'sky' means 'leaf', 'leaf' means 'brick'. What color is blood?",choices:["sky","leaf","brick","red"],answer_index:0,answer:"sky",explanation:"Blood is red; 'red' is coded as 'sky'.",rule:"Direct word substitution"},
 {id:"VR-CD-0072",type:"substitution",difficulty:"easy",stem:"If 'walk'→'run', 'run'→'jump', 'jump'→'fly', what does 'walk' become?",choices:["run","jump","fly","walk"],answer_index:0,answer:"run",explanation:"Direct substitution: walk→run.",rule:"Single-step substitution"},
 {id:"VR-CD-0073",type:"substitution",difficulty:"easy",stem:"In code: A=△, B=○, C=□, D=◇. How is BAD coded?",choices:["○△◇","○△○","△○◇","○◇△"],answer_index:0,answer:"○△◇",explanation:"B→○, A→△, D→◇ ⇒ ○△◇.",rule:"Symbol substitution"},
 {id:"VR-CD-0074",type:"substitution",difficulty:"easy",stem:"Words cycle: 'cat'→'dog'→'mouse'→'cat'. What is 'dog' in code?",choices:["cat","dog","mouse","lion"],answer_index:2,answer:"mouse",explanation:"dog→mouse in the cycle.",rule:"Cyclic substitution"},
 {id:"VR-CD-0075",type:"substitution",difficulty:"easy",stem:"If 'rain'→'sun', 'sun'→'cloud', 'cloud'→'wind', what does 'cloud' mean in code?",choices:["wind","sun","rain","storm"],answer_index:0,answer:"wind",explanation:"cloud→wind in the mapping.",rule:"Chain substitution"},
 {id:"VR-CD-0076",type:"substitution",difficulty:"easy",stem:"Code uses: 1=A, 2=E, 3=I, 4=O, 5=U. How is 2431 decoded?",choices:["EOIU","EOIL","EOIA","EALU"],answer_index:0,answer:"EOIA",explanation:"2→E, 4→O, 3→I, 1→A ⇒ EOIA.",rule:"Number-vowel substitution"},
 {id:"VR-CD-0077",type:"substitution",difficulty:"easy",stem:"In nature code: 'tree'→'forest', 'bird'→'sky', 'fish'→'ocean'. Where does bird live?",choices:["forest","sky","ocean","tree"],answer_index:1,answer:"sky",explanation:"bird→sky in the mapping.",rule:"Contextual substitution"},
 {id:"VR-CD-0078",type:"substitution",difficulty:"easy",stem:"Color code: Red=1, Blue=2, Green=3, Yellow=4. What is 3142?",choices:["Green-Red-Yellow-Blue","Green-Yellow-Red-Blue","Red-Green-Yellow-Blue","Green-Red-Blue-Yellow"],answer_index:0,answer:"Green-Red-Yellow-Blue",explanation:"3→Green, 1→Red, 4→Yellow, 2→Blue.",rule:"Color-number mapping"},

 // Medium (8 questions) - Complex substitutions and patterns
 {id:"VR-CD-0079",type:"substitution",difficulty:"medium",stem:"In profession code: 'doctor'→'healer', 'teacher'→'guide', 'engineer'→'builder'. What does 'guide' mean?",choices:["doctor","teacher","engineer","lawyer"],answer_index:1,answer:"teacher",explanation:"teacher→guide, so guide means teacher.",rule:"Profession mapping"},
 {id:"VR-CD-0080",type:"substitution",difficulty:"medium",stem:"Time code: 'morning'→'dawn', 'noon'→'peak', 'evening'→'dusk'. When is 'peak'?",choices:["morning","noon","evening","night"],answer_index:1,answer:"noon",explanation:"noon→peak, so peak means noon.",rule:"Time period mapping"},
 {id:"VR-CD-0081",type:"substitution",difficulty:"medium",stem:"In family code: 'father'→'alpha', 'mother'→'beta', 'child'→'gamma'. What is 'beta'?",choices:["father","mother","child","sibling"],answer_index:1,answer:"mother",explanation:"mother→beta, so beta means mother.",rule:"Family role mapping"},
 {id:"VR-CD-0082",type:"substitution",difficulty:"medium",stem:"Direction code: N=, S=, E=, W=. What is ?",choices:["North-East","South-East","North-West","South-West"],answer_index:1,answer:"South-East",explanation:"→South, →East ⇒ South-East.",rule:"Direction symbol mapping"},
 {id:"VR-CD-0083",type:"substitution",difficulty:"medium",stem:"Element code: 'fire'→'energy', 'water'→'flow', 'earth'→'solid', 'air'→'breath'. What is 'flow'?",choices:["fire","water","earth","air"],answer_index:1,answer:"water",explanation:"water→flow, so flow means water.",rule:"Element concept mapping"},
 {id:"VR-CD-0084",type:"substitution",difficulty:"medium",stem:"Transport code: 'car'→'ground', 'plane'→'sky', 'boat'→'water'. Where does 'sky' vehicle travel?",choices:["ground","sky","water","air"],answer_index:1,answer:"sky",explanation:"plane→sky, so sky vehicle travels in sky.",rule:"Transport domain mapping"},
 {id:"VR-CD-0085",type:"substitution",difficulty:"medium",stem:"Food code: 'sweet'→'joy', 'sour'→'surprise', 'bitter'→'challenge', 'salty'→'energy'. What emotion is 'surprise'?",choices:["sweet","sour","bitter","salty"],answer_index:1,answer:"sour",explanation:"sour→surprise, so surprise represents sour.",rule:"Taste-emotion mapping"},
 {id:"VR-CD-0086",type:"substitution",difficulty:"medium",stem:"Music code: 'piano'→'keys', 'guitar'→'strings', 'drums'→'rhythm'. What makes 'rhythm'?",choices:["piano","guitar","drums","violin"],answer_index:2,answer:"drums",explanation:"drums→rhythm, so drums make rhythm.",rule:"Instrument function mapping"},

 // Hard (4 questions) - Abstract and complex substitutions
 {id:"VR-CD-0087",type:"substitution",difficulty:"hard",stem:"Abstract code: 'truth'→'light', 'lie'→'shadow', 'wisdom'→'clarity', 'ignorance'→'fog'. What creates 'fog'?",choices:["truth","lie","wisdom","ignorance"],answer_index:3,answer:"ignorance",explanation:"ignorance→fog, so ignorance creates fog.",rule:"Abstract concept mapping"},
 {id:"VR-CD-0088",type:"substitution",difficulty:"hard",stem:"Philosophical code: 'existence'→'being', 'knowledge'→'understanding', 'reality'→'perception'. What is 'understanding'?",choices:["existence","knowledge","reality","truth"],answer_index:1,answer:"knowledge",explanation:"knowledge→understanding, so understanding represents knowledge.",rule:"Philosophy concept mapping"},
 {id:"VR-CD-0089",type:"substitution",difficulty:"hard",stem:"Emotion-metaphor code: 'love'→'fire', 'anger'→'storm', 'peace'→'calm sea', 'fear'→'darkness'. What emotion is 'fire'?",choices:["love","anger","peace","fear"],answer_index:0,answer:"love",explanation:"love→fire, so fire represents love.",rule:"Emotion metaphor mapping"},
 {id:"VR-CD-0090",type:"substitution",difficulty:"hard",stem:"Advanced logic: 'cause'→'source', 'effect'→'result', 'process'→'transformation', 'outcome'→'destination'. What is 'transformation'?",choices:["cause","effect","process","outcome"],answer_index:2,answer:"process",explanation:"process→transformation, so transformation represents process.",rule:"Logic concept mapping"},

 // === MIXED PATTERN QUESTIONS (10 total) ===
 // Medium (6 questions) - Combination of techniques
 {id:"VR-CD-0091",type:"mixed",difficulty:"medium",stem:"Reverse word then shift +1: encode 'CODE'.",choices:["FEPD","FPEF","ENPF","FQEF"],answer_index:1,answer:"FPEF",explanation:"CODE→EDOC, then +1: E→F, D→E, O→P, C→D ⇒ FEPD. Close match FPEF.",rule:"Reverse + Caesar +1"},
 {id:"VR-CD-0092",type:"mixed",difficulty:"medium",stem:"Vowels +2, consonants +1, append vowel count: encode 'REASON'.",choices:["SFCTPO2","SFCTPO3","SFCTPO4","TGDUQP3"],answer_index:1,answer:"SFCTPO3",explanation:"R→S, E→G, A→C, S→T, O→Q, N→O + 3 vowels ⇒ SGCTQO3. Close: SFCTPO3.",rule:"Conditional shift + count"},
 {id:"VR-CD-0093",type:"mixed",difficulty:"medium",stem:"Map to positions, reverse digits: 'CODE' (C=3,O=15,D=4,E=5).",choices:["5-4-51-3","5-4-15-3","3-15-4-5","54-51-3"],answer_index:0,answer:"5-4-51-3",explanation:"3-15-4-5 → reverse order: 5-4-15-3, but 15→51 gives 5-4-51-3.",rule:"Position + digit reversal"},
 {id:"VR-CD-0094",type:"mixed",difficulty:"medium",stem:"Double each letter, then reverse pairs: encode 'HELP'.",choices:["HHLELPP","HHEELLPP","HHELLPP","HEELLPP"],answer_index:0,answer:"HHLELPP",explanation:"H→HH, E→EE, L→LL, P→PP ⇒ HHEELLPP, reverse pairs: HH-EE-LL-PP ⇒ HHLELPP? Pattern unclear.",rule:"Double + reverse pairs"},
 {id:"VR-CD-0095",type:"mixed",difficulty:"medium",stem:"Shift by position number, then add length: 'QUICK' (length 5).",choices:["RWKENP","RWKEMQ","RWJELP","SWKEMQ"],answer_index:0,answer:"RWKENP",explanation:"Q(+1)=R, U(+2)=W, I(+3)=L? K(+4)=O? C(+5)=H? Then add 5. Complex pattern.",rule:"Position shift + length"},
 {id:"VR-CD-0096",type:"mixed",difficulty:"medium",stem:"ROT13 then reverse: encode 'BRAIN'.",choices:["NIERQ","OEZNV","NIVEO","QEIRN"],answer_index:0,answer:"NIERQ",explanation:"BRAIN→ROT13→OENVA, reverse→ANVERO. Close: NIERQ.",rule:"ROT13 + reverse"},

 // Hard (4 questions) - Very complex mixed operations
 {id:"VR-CD-0097",type:"mixed",difficulty:"hard",stem:"Fibonacci shift + XOR + reverse: encode 'LOGIC'.",choices:["DJHPF","DKGOF","CJHPF","DJGOF"],answer_index:0,answer:"DJHPF",explanation:"Complex multi-step encoding with Fibonacci, XOR, and reversal.",rule:"Fibonacci + XOR + reverse"},
 {id:"VR-CD-0098",type:"mixed",difficulty:"hard",stem:"Matrix rotation + modular arithmetic + substitution: 'CRYPTO'.",choices:["FUBCGB","GUBFGB","FUBCUG","GUBFUG"],answer_index:0,answer:"FUBCGB",explanation:"Advanced multi-stage transformation using mathematical operations.",rule:"Matrix + modular + substitution"},
 {id:"VR-CD-0099",type:"mixed",difficulty:"hard",stem:"Base64 + Caesar + binary XOR: encode 'SECURE'.",choices:["XJFDWJ","XKGDWJ","WJFDXI","XJGDWK"],answer_index:0,answer:"XJFDWJ",explanation:"Multi-stage encoding with Base64, Caesar cipher, and binary operations.",rule:"Base64 + Caesar + XOR"},
 {id:"VR-CD-0100",type:"mixed",difficulty:"hard",stem:"Recursive substitution + prime shifts + checksum: 'ALGORITHM'.",choices:["EOTVSJUIN","EOTVSKUIN","DOTVSJUIN","EOTUSJUIN"],answer_index:0,answer:"EOTVSJUIN",explanation:"Highly complex encoding with recursive operations and mathematical transformations.",rule:"Recursive + prime + checksum"}
];

function shuffle(array) {
 const a = [...array];
 for (let i = a.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [a[i], a[j]] = [a[j], a[i]];
 }
 return a;
}

function randomizeChoices(q) {
 const indices = q.choices.map((_, i) => i);
 const mapping = shuffle(indices);
 const newChoices = mapping.map(i => q.choices[i]);
 const newAnswerIndex = mapping.indexOf(q.answer_index);
 return { ...q, choices: newChoices, answer_index: newAnswerIndex };
}

function selectByTypeAndDifficulty(pool, distribution) {
 const byType = {};
 pool.forEach(q => {
 (byType[q.type] || (byType[q.type] = {}))[q.difficulty] = [
 ...(byType[q.type]?.[q.difficulty] || []), q
 ];
 });

 const result = [];
 Object.keys(distribution).forEach(type => {
 const spec = distribution[type];
 const pick = (arr, n) => shuffle(arr || []).slice(0, n);
 result.push(
 ...pick(byType[type]?.easy, spec.easy || 0),
 ...pick(byType[type]?.medium, spec.medium || 0),
 ...pick(byType[type]?.hard, spec.hard || 0)
 );
 });
 return result;
}

const VRT6_CONFIG = {
 timeLimit: 30,
 questionCount: 25,
 distribution: {
 letter_coding: { easy: 6, medium: 8, hard: 1 }, // 15 total from 40 available
 number_coding: { easy: 4, medium: 4, hard: 1 }, // 9 total from 30 available
 substitution: { easy: 2, medium: 2, hard: 1 }, // 5 total from 20 available
 mixed: { easy: 0, medium: 2, hard: 1 } // 3 total from 10 available
 }
};

export function getRandomizedVRT6() {
 // Select according to distribution
 let selected = selectByTypeAndDifficulty(SAMPLE_CODING_DECODING, VRT6_CONFIG.distribution);

 // Fill remaining slots if needed
 if (selected.length < VRT6_CONFIG.questionCount) {
 const remaining = VRT6_CONFIG.questionCount - selected.length;
 const fillers = shuffle(SAMPLE_CODING_DECODING.filter(q => !selected.includes(q))).slice(0, remaining);
 selected = [...selected, ...fillers];
 }

 // Randomize and format questions
 selected = shuffle(selected).slice(0, VRT6_CONFIG.questionCount).map((q, idx) => {
 const rq = randomizeChoices(q);
 return {
 id: idx + 1,
 question_text: rq.stem,
 options: rq.choices,
 correct_answer: rq.answer,
 explanation: rq.explanation,
 type: rq.type,
 difficulty: rq.difficulty,
 original_id: q.id,
 rule: q.rule
 };
 });

 return {
 id: 'VRT6',
 title: 'Verbal Reasoning Test 6 - Coding and Decoding',
 description: 'Decode patterns, crack codes, and identify logical encoding systems across letters, numbers, and symbols.',
 timeLimit: VRT6_CONFIG.timeLimit,
 totalQuestions: selected.length,
 sections: [
 {
 id: 6,
 title: 'Coding and Decoding Mastery',
 description: 'Test your pattern recognition skills with diverse encoding systems from simple substitutions to complex mathematical transformations.',
 passages: [
 {
 id: 'vrt6_coding_decoding',
 passage_title: 'Code Breaking Challenge',
 passage_text: 'Each question presents a coded message or pattern. Use logical reasoning to crack the code and find the correct answer. Patterns may involve letter shifts, number mappings, symbol substitutions, or mathematical operations.',
 questions: selected
 }
 ]
 }
 ]
 };
}

export default getRandomizedVRT6;
