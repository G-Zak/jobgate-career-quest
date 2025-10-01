// Verbal reasoning test data structure
export const getVerbalTestSections = () => {
 return {
 title: "Verbal Reasoning Tests",
 total_duration_minutes: 20,
 sections: [
 getVerbalSection1(),
 getVerbalSection2(),
 getVerbalSection3(),
 ]
 };
};

export const getVerbalSection1 = () => ({
 id: 1,
 title: "Verbal Reasoning Test 1",
 description: "Reading comprehension with True/False/Cannot Say questions",
 duration_minutes: 20,
 intro_image: "/src/assets/images/verbal/instructions/section_1_intro.png",
 intro_text: {
 title: "VERBAL REASONING TEST 1",
 instructions: [
 "Instructions",
 "",
 "This verbal reasoning test comprises 20 questions and you will have 20 minutes in which to correctly answer as many as you can.",
 "",
 "In each question you will be presented with a short comprehension passage followed by three or four questions. You will need to determine which answer is correct based on the information provided in the passages only.",
 "",
 "You will have to work quickly and accurately to perform well in this test. If you don't know the answer to a question, leave it and come back to it if you have time.",
 "",
 "You can submit your test at any time. If the time limit is up before you click submit the test will automatically be submitted with the answers you have selected. It is recommended to keep working until the time limit is up.",
 "",
 "Try to find a time and place where you will not be interrupted during the test. The test will start on the next page."
 ]
 },
 question_type: "verbal_reasoning",
 total_questions: 20,
 questions: [
 // Passage 1: Birds and Flight Evolution
 {
 id: 1,
 passage_title: "Birds and Flight Evolution",
 passage_text: `Although it was discovered in the 19th century that birds were closely related to dinosaurs, the current scientific consensus is that birds were, and always have been dinosaurs themselves. Fossil evidence demonstrates similarities between birds and other feathered dinosaurs, including hollow bones, nest building and similar brooding behaviours. Although the dinosaurian lineage of birds is largely undisputed, the evolution of powered flight in birds is still debated. Two theories of flight in birds are the "ground-up" theory, and the "trees-down" theory. Ground-up theorists suggest birds evolved powered flight from ground dwelling dinosaurs, and trees-down theorists suggest birds evolved from tree dwelling, gliding dinosaurs. Further research is required to conclusively verify the process in which birds evolved powered flight.`,
 questions: [
 {
 id: 1,
 question_text: `The "ground-up" and "trees-down" theories are the only theories explaining flight in birds.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `Although the "ground-up" and "trees-down" theories are stated to be theories of flight in birds, they are not stated to be the only two theories explaining flight in birds.`,
 order: 1,
 complexity_score: 2
 },
 {
 id: 2,
 question_text: `All dinosaurs had hollow bones.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that other feathered dinosaurs also had hollow bones, not that all dinosaurs (non-feathered) also had hollow bones.`,
 order: 2,
 complexity_score: 3
 },
 {
 id: 3,
 question_text: `There is no scientific consensus regarding how birds evolved powered flight.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that further research is required to conclusively verify the process in which birds evolved powered flight. Similarly, it is stated that, the evolution of powered flight in birds is still debated.`,
 order: 3,
 complexity_score: 2
 },
 {
 id: 4,
 question_text: `The dinosaurian origins of birds is widely rejected.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `It is stated that the dinosaurian origins of birds is "largely undisputed", and is therefore the antithesis of being widely rejected.`,
 order: 4,
 complexity_score: 2
 }
 ]
 },
 // Passage 2: Feral Cats
 {
 id: 2,
 passage_title: "Feral Cats and Biodiversity",
 passage_text: `A feral cat is a domestic cat that was raised in the wild, without having experienced significant human contact. Feral cats differ from stray cats, in that strays were previously pets which became nomadic. Unlike strays, feral cats initially show hostility towards humans, particularly upon first contact. Feral cats may become invasive to ecosystems, particularly on insular islands, resulting in a decline in biodiversity. Non-indigenous feral cats often have few natural predators, and prey on local species unaccustomed to defending against cats. Ground nesting birds, small native mammals and even amphibian species are often impacted by invasive populations of feral cats, and have led to extinctions of these species in some cases.`,
 questions: [
 {
 id: 5,
 question_text: `Both stray and feral cats exhibit hostility when first encountering humans.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states that "Unlike strays, feral cats initially show hostility towards humans". Since this distinguishes stray cats from feral cats, the correct answer is "False".`,
 order: 5,
 complexity_score: 2
 },
 {
 id: 6,
 question_text: `Biodiversity can be affected by feral cat populations.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that feral cats can become invasive, resulting in a decline in biodiversity.`,
 order: 6,
 complexity_score: 1
 },
 {
 id: 7,
 question_text: `Feral cats are rarely preyed upon.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `Although non-indigenous feral cats have few predators, it is not stated whether all feral cats have few predators. Similarly, having few predators does not necessarily imply they are rarely predated upon, as feral cats could be regularly preyed upon by a single predator.`,
 order: 7,
 complexity_score: 4
 },
 {
 id: 8,
 question_text: `Domestic cats can be raised in the wild.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `It is stated in the passage that feral cats are domestic cats, which have been raised in the wild. Since feral cats are given as an example, the correct answer is "True".`,
 order: 8,
 complexity_score: 1
 }
 ]
 },
 // Passage 3: The Glazier's Fallacy
 {
 id: 3,
 passage_title: "The Glazier's Fallacy",
 passage_text: `The parable of the broken window, also known as the glazier's fallacy, is a concept used to illustrate the fact that money spent due to destruction does not result in a benefit to society. It has been suggested that repairing broken windows may provide employment to tradespeople, which could positively impact the economy through job creation. However, had the window not been broken, the money spent repairing it could have contributed elsewhere to the economy. Similarly, if windows never broke, those tradespeople would be free to contribute towards the economy in other occupations. The glazier's fallacy highlights the fact that destruction of property impacts economic activity in unseen or ignored ways, which are frequently overshadowed by more obvious economic effects.`,
 questions: [
 {
 id: 9,
 question_text: `The destruction of property has no effect on the economy.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The glazier's fallacy highlights that destruction of property impacts economic activity in unseen or ignored ways, meaning the destruction of property does have an effect on the economy.`,
 order: 9,
 complexity_score: 3
 },
 {
 id: 10,
 question_text: `Society does not benefit from the cost of repairing destroyed property.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that society does not benefit from the money spent on repairing destroyed property, and holds this as fact.`,
 order: 10,
 complexity_score: 2
 },
 {
 id: 11,
 question_text: `The destruction of property negatively impacts the economy.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage does not state that the mere destruction of property negatively impacts the economy, only that the money spent repairing it does not benefit society, rather than the economy.`,
 order: 11,
 complexity_score: 4
 },
 {
 id: 12,
 question_text: `Repairing broken windows results in job creation.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that "It has been suggested that repairing broken windows may provide employment to tradespeople", however this is uncertain.`,
 order: 12,
 complexity_score: 3
 }
 ]
 },
 // Passage 4: The Paradox of Thrift
 {
 id: 4,
 passage_title: "The Paradox of Thrift",
 passage_text: `The paradox of thrift, as popularised by John Keynes, highlights the fact that excessive saving during times of economic recession negatively impacts the economy. When spending is reduced due to excessive saving, aggregate demand falls, resulting in lowered economic growth. This excessive saving results in reduced economic growth, which in turn encourages further excessive saving, causing a vicious cycle. Reduced economic growth results in reductions in salary, job security and interest on savings, negatively impacting both savers and the economy. However, it could be argued that savings held in savings accounts represent loanable capital, which banks could use to stimulate the economy via lending and investment.`,
 questions: [
 {
 id: 13,
 question_text: `Excessive saving has no impact on economic growth.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states that excessive saving lowers aggregate demand, resulting in lowered economic growth, which would impact economic growth.`,
 order: 13,
 complexity_score: 2
 },
 {
 id: 14,
 question_text: `Excessive saving has no impact on savers themselves.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `Excessive saving is stated to negatively impact both savers and the economy, therefore savers themselves must be impacted by excessive saving.`,
 order: 14,
 complexity_score: 2
 },
 {
 id: 15,
 question_text: `Saving money negatively impacts the economy.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that excessive saving, not regular saving, negatively impacts the economy. It is not stated what effect, if any, regular saving could have on the economy.`,
 order: 15,
 complexity_score: 3
 },
 {
 id: 16,
 question_text: `Excess saving has no effect on aggregate demand.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states that "When spending is reduced due to excessive saving, aggregate demand falls". Therefore, excessive saving must have an effect on aggregate demand.`,
 order: 16,
 complexity_score: 2
 }
 ]
 },
 // Passage 5: Moravec's Paradox
 {
 id: 5,
 passage_title: "Moravec's Paradox",
 passage_text: `The Moravec's paradox is the counter intuitive discovery by artificial intelligence researchers that advanced reasoning requires very little computational power, but basic sensory-motor skills are incredibly computationally complex. Activities considered complex by human standards, such as calculating statistics and playing chess are very easily accomplished by artificial intelligences. However, extremely basic activities, such as recognising faces or walking up a set of stairs requires vast computational resources, and can only be accomplished by the most advanced artificial intelligences. Although futurists predict a supersession of human workers by artificial intelligences, Moravec's paradox implies that advanced professions will be usurped first, not the simple or routine occupations, as commonly featured in science fiction.`,
 questions: [
 {
 id: 17,
 question_text: `Artificial intelligences perform advanced reasoning more effectively than humans.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `It is not stated whether artificial intelligences perform advanced reasoning more effectively than humans, only that advanced reasoning requires little computational power.`,
 order: 17,
 complexity_score: 3
 },
 {
 id: 18,
 question_text: `Playing chess is a complex activity among humans.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `It is stated that chess is an activity considered complex by human standards.`,
 order: 18,
 complexity_score: 1
 },
 {
 id: 19,
 question_text: `Simple artificial intelligences cannot recognise faces.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that only the most advanced artificial intelligences can recognise faces. If only the most advanced artificial intelligences are capable of this, simple artificial intelligences cannot.`,
 order: 19,
 complexity_score: 2
 },
 {
 id: 20,
 question_text: `Science fiction does not feature artificial intelligences.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states that artificial intelligences are commonly featured in science fiction.`,
 order: 20,
 complexity_score: 1
 }
 ]
 }
 ]
});

export const getVerbalSection2 = () => ({
 id: 2,
 title: "Verbal Reasoning Test 2",
 description: "Reading comprehension with True/False/Cannot Say questions",
 duration_minutes: 20,
 intro_image: "/src/assets/images/verbal/instructions/section_2_intro.png",
 intro_text: {
 title: "VERBAL REASONING TEST 2",
 instructions: [
 "Instructions",
 "",
 "This verbal reasoning test comprises 20 questions and you will have 20 minutes in which to correctly answer as many as you can.",
 "",
 "In each question you will be presented with a short comprehension passage followed by three or four questions. You will need to determine which answer is correct based on the information provided in the passages only.",
 "",
 "You will have to work quickly and accurately to perform well in this test. If you don't know the answer to a question, leave it and come back to it if you have time.",
 "",
 "You can submit your test at any time. If the time limit is up before you click submit the test will automatically be submitted with the answers you have selected. It is recommended to keep working until the time limit is up.",
 "",
 "Try to find a time and place where you will not be interrupted during the test. The test will start on the next page."
 ]
 },
 question_type: "verbal_reasoning",
 total_questions: 20,
 questions: [
 // Passage 1: Work-related Stress
 {
 id: 1,
 passage_title: "Work-related Stress",
 passage_text: `Work-related stress is one of the biggest causes of sick leave in the UK. If you've noticed you always seem to be rushing about, or miss meal breaks, take work home or don't have enough time for relaxation, seeing your family or for exercise, then you may well find yourself under stress, especially at work. There is often no single cause of work-related stress, but it can be caused by poor working conditions, long hours, relationship problems with colleagues, or lack of job security. Stress is often the result of a combination of these factors that builds up over time. Work-related stress can result in both physical problems such as headaches, muscular tension, back or neck pain, tiredness, digestive problems and sweating; or emotional problems, such as a lower sex drive, feelings of inadequacy, irritability and lack of concentration. According to recent surveys, one in six of the UK working population said their job is very stressful, and thirty percent of men said that the demands of their job interfere with their private lives.`,
 questions: [
 {
 id: 1,
 question_text: `Stress at work is often caused by relationship problems with your partner.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `This may well be true, but is not stated in the passage so we have to answer Cannot Say. The passage refers only to relationship problems with colleagues and does not say if relationship problems with a partner do or don't cause stress.`,
 order: 1,
 complexity_score: 3
 },
 {
 id: 2,
 question_text: `Work-related stress can result in tiredness and a lack of concentration.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The fifth sentence lists tiredness as one of the physical problems caused by stress, and lack of concentration is listed under emotional problems.`,
 order: 2,
 complexity_score: 2
 },
 {
 id: 3,
 question_text: `One in six working men say their job is very stressful.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `One in six "of the UK working population" said their job is very stressful in the study referred to in the passage. The passage does not tell us the ratio for men only, which may be higher, equal, or lower.`,
 order: 3,
 complexity_score: 4
 },
 {
 id: 4,
 question_text: `If you spend more time with your family, you will not suffer from stress.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that stress can be caused by not spending enough time with your family. However, the passage does not tell us explicitly that everyone who spends more time with their family will or will not suffer from stress.`,
 order: 4,
 complexity_score: 4
 }
 ]
 },
 // Passage 2: Photothermal Ablation
 {
 id: 2,
 passage_title: "Photothermal Ablation",
 passage_text: `For many years the hunt has been on to find an effective way to treat cancerous tumours using physical rather than chemical means. That hunt may now be over with the latest breakthrough made by Dr Jennifer West at Rice University in Houston, Texas. West has done tests on animals using a non-chemical procedure known as Photothermal Ablation. She injected millions of nanoparticles, which can absorb infrared light, into the animals' bloodstreams. These particles go straight to the tumours because, unlike healthy tissue, tumours have abnormal blood capillaries that will let them through. A few hours later an optical fibre is inserted into the tumour and a blast of infrared light is passed down the fibre, which heats the particles and effectively cooks the tumour.`,
 questions: [
 {
 id: 5,
 question_text: `Photothermal Ablation is the latest breakthrough in chemical treatment for cancer.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage tells us that Photothermal Ablation is a "non-chemical procedure" which could be used in the treatment of cancerous tumours.`,
 order: 5,
 complexity_score: 2
 },
 {
 id: 6,
 question_text: `Nanoparticles are objects whose dimensions are measured in nanometres, or billionths of a metre.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The dimensions of nanoparticles are not given in the passage so we have to answer Cannot Say. In fact this is true, but we have to base our answers on only the information contained within the passage, not what knowledge we may have picked up from outside this test.`,
 order: 6,
 complexity_score: 4
 },
 {
 id: 7,
 question_text: `Nanoparticles can absorb infrared light.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The fourth sentence says "nanoparticles, which can absorb infrared light…"`,
 order: 7,
 complexity_score: 1
 }
 ]
 },
 // Passage 3: U3b Networks
 {
 id: 3,
 passage_title: "U3b Networks",
 passage_text: `U3b Networks (U3b being short for the underprivileged three billion who lack internet access) is a company in Jersey set up by Greg Wyler, former owner of Rwanda's national telephone company. His company intends to provide cheap, high-speed internet access to remote areas in developing countries, which up to now has been the reserve of developed countries. Mr Wyler plans to charge $500 per megabit per month, compared with the $4,000 charged by existing companies. Mr Wyler has so far raised €40m from investors, but this seems like a risky investment, especially as billions were lost on similar projects in the past. So why are people investing in the hope of finding customers in the world's poorest regions? The reason is that previous projects were over-ambitious and set out to provide global coverage, whereas U3b's project is far more modest in its optimism and its services will be available only to a 100km wide corridor around the equator, which happens to cover most developing countries. It will initially use just five satellites circling 8,000km above the equator and further expansion will be determined by customer appetite.`,
 questions: [
 {
 id: 8,
 question_text: `Greg Wyler had a background in telecoms.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The first sentence tells us that Greg Wyler is a former owner of Rwanda's national telephone company, and has now set up U3b Networks.`,
 order: 8,
 complexity_score: 2
 },
 {
 id: 9,
 question_text: `The satellites for the project will cost €8m each.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `There is no information in the passage to tell us the cost of each satellite. We are told that the project will initially use five satellites and that the amount raised so far is €40m, but we don't have enough information to say for sure what each satellite will cost.`,
 order: 9,
 complexity_score: 3
 },
 {
 id: 10,
 question_text: `The majority of developing countries lie within 100km of the equator.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage tells us that the "services will be available only to a 100km wide corridor around the equator, which happens to cover most developing countries".`,
 order: 10,
 complexity_score: 2
 }
 ]
 },
 // Passage 4: Workplace Bullying
 {
 id: 4,
 passage_title: "Workplace Bullying",
 passage_text: `We have all heard about bullying in schools, but bullying in the workplace is a huge problem in the UK which results in nearly 19 million days of lost output per year and costs the country 6 billion pounds annually. Workplace bullying is the abuse of a position of power by one individual over another. Otherwise known as harassment, intimidation, aggression, coercive management and by other euphemisms, bullying in the workplace can take many forms involving gender, race or age. In a nutshell, workplace bullying means behaviour that is humiliating or offensive towards some individual. This kind of bullying ranges from violence to less obvious actions like deliberately ignoring a fellow worker`,
 questions: [
 {
 id: 11,
 question_text: `Bullying in the workplace hinders UK economic output.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The first sentence says that bullying in the workplace "results in nearly 19 million days of lost output per year and costs the country 6 billion pounds annually". This means that economic output of the UK is damaged and therefore it hinders UK economic output.`,
 order: 11,
 complexity_score: 2
 },
 {
 id: 12,
 question_text: `Another name for workplace bullying is coercive management.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that coercive management is a euphemism for bullying, i.e., a less direct expression to make it sound less severe.`,
 order: 12,
 complexity_score: 2
 },
 {
 id: 13,
 question_text: `Bullying in the workplace is sometimes caused by religious intolerance.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage does identify race as one form of victimization used in bullying but the passage does not tell us explicitly that this intolerance is a cause of bullying. It would be reasonable to guess that workplace bullying could be the outcome of religious or race intolerance, but we cannot be sure of this given just the information in the passage. Hence we must answer Cannot Say. Reinforcing this is the inexact comparison between race and religion.`,
 order: 13,
 complexity_score: 4
 },
 {
 id: 14,
 question_text: `Deliberately ignoring a colleague is a form of bullying.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The last sentence in the passage states that "deliberately ignoring a fellow worker" is a less obvious – but still existing - kind of workplace bullying.`,
 order: 14,
 complexity_score: 2
 }
 ]
 },
 // Passage 5: Phoenix Mars Lander
 {
 id: 5,
 passage_title: "Phoenix Mars Lander",
 passage_text: `Nobody knows what life forms may exist outside our own planet. The search for extra-terrestrial life in the universe took a step nearer to fruition with the discovery in June of what are believed to be traces of water on the surface of Mars. Life on our planet requires water and its presence on Mars may point towards the existence of past life on the planet. The Phoenix Mars Lander robot landed on the plains of Mars on May 25th 2008, searching for signs that the Martian environment might once have been habitable to life. When it dug a ditch in the planet's surface, photos revealed small patches of bright material. Four days later those patches had disappeared, causing scientists to speculate that they were water ice that had previously been buried and which vaporised when exposed to the air. Scientists insisted that if the patches had been salt, they wouldn't have disappeared and if they had been solid carbon dioxide, then they wouldn't have vaporised.`,
 questions: [
 {
 id: 15,
 question_text: `The Phoenix Mars Lander has provided proof that life once existed on Mars.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that scientists speculate that there were ice patches on Mars, which is needed for life. We are told about the Phoenix Mars Lander and its discovery but we are not told what the Phoenix Mars Lander has proved, disproved, or failed to prove. For illustration: this passage could be reporting on just one aspect of what Phoenix has discovered. So we cannot say if this is true or false without further information.`,
 order: 15,
 complexity_score: 4
 },
 {
 id: 16,
 question_text: `Life forms on Mars require water in order to survive.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that "Life on our planet requires water". The passage also says that we do not know about every single life form: "Nobody knows what life forms may exist outside our own planet". Given that the passage does not tell us whether all life on Mars (or any planet other than our own) does or does not require water, we cannot say whether or not this statement is true or false, therefore we have to answer Cannot Say.`,
 order: 16,
 complexity_score: 4
 },
 {
 id: 17,
 question_text: `Since the Phoenix Mars Lander cannot excavate it is limited to surface photography.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The fifth sentence says "When it dug a ditch in the planet's surface…" meaning that the Phoenix Mars Lander is capable of some sort of excavation.`,
 order: 17,
 complexity_score: 2
 }
 ]
 },
 // Passage 6: National Minimum Wage
 {
 id: 6,
 passage_title: "National Minimum Wage",
 passage_text: `Most workers in the UK over the age of 16 are legally entitled to a minimum rate of pay, called the national minimum wage. An independent body called the Low Pay Commission (LPC) each year reviews this rate and passes their recommendation to the government, who then set and enforce the rate. With few exceptions, the minimum wage is the same for all types of work and all kinds of business. The current amount for people over 22 years of age is £6.80 per hour. The rates for younger workers are less. However, the following groups are not entitled to receive the minimum wage: workers under school leaving age, the genuinely self-employed, some apprentices, au pairs, armed service personnel and voluntary workers. Also agricultural workers have a separate minimum rate of pay set by the Agricultural Wages Board.`,
 questions: [
 {
 id: 18,
 question_text: `The Low Pay Commission sets the rate of the national minimum wage.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The second sentence tells us that the Low Pay Commission "passes their recommendation to the government, who then set and enforce the rate". So we are told that the LPC give a recommendation but it is actually the government who set the rate.`,
 order: 18,
 complexity_score: 3
 },
 {
 id: 19,
 question_text: `The Agricultural Wages Board sets pay bands for different levels of agricultural workers`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The last sentence says that "agricultural workers have a separate minimum rate of pay set by the Agricultural Wages Board." So we are told that the AWG set a minimum rate but we are not told if they set rate bands for different levels of workers. Pay bands implies multiple levels of wage rates dependent on factors such as age or experience.`,
 order: 19,
 complexity_score: 4
 },
 {
 id: 20,
 question_text: `The lowest wage a 16 year old is entitled to is £6.80 an hour.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states that this is the rate for people over 22 years of age, and that "the rates for younger workers are less".`,
 order: 20,
 complexity_score: 2
 }
 ]
 }
 ]
});

export const getVerbalSection3 = () => ({
 id: 3,
 title: "Verbal Reasoning Test 3",
 description: "Reading comprehension with True/False/Cannot Say questions",
 duration_minutes: 20,
 intro_image: "/src/assets/images/verbal/instructions/section_3_intro.png",
 intro_text: {
 title: "VERBAL REASONING TEST 3",
 instructions: [
 "Instructions",
 "",
 "This verbal reasoning test comprises 20 questions and you will have 20 minutes in which to correctly answer as many as you can.",
 "",
 "In each question you will be presented with a short comprehension passage followed by three or four questions. You will need to determine which answer is correct based on the information provided in the passages only.",
 "",
 "You will have to work quickly and accurately to perform well in this test. If you don't know the answer to a question, leave it and come back to it if you have time.",
 "",
 "You can submit your test at any time. If the time limit is up before you click submit the test will automatically be submitted with the answers you have selected. It is recommended to keep working until the time limit is up.",
 "",
 "Try to find a time and place where you will not be interrupted during the test. The test will start on the next page."
 ]
 },
 question_type: "verbal_reasoning",
 total_questions: 20,
 questions: [
 // Passage 1: Team Management
 {
 id: 1,
 passage_title: "Team Management",
 passage_text: `A common difficulty faced by business managers is when the behaviour of a team-member conflicts with established desirable practice. How does a good leader handle such an issue? One effective angle is to lead by example: instead of waiting for a problem to develop, take a proactive approach in heading it off with reference to clearly laid out guidelines. If a problematic situation does develop, controlling it can be made simpler by invoking existing values from a mission statement which has been set out in advance. A good team will always put the needs of the organisation first. Taking such an approach gives the team a sense of personal involvement which encourages them to feel part of the organisation's mission, internalising the needs of the group rather than feeling a sense of externally imposed obligation. It provides team members with a greater sense of personal control, the sense that they have contributed individually, and by choice, to the well-being of their organisation. To achieve this, a manager must have a good understanding of the way individual people communicate – a flexible approach is essential, using real-life practical examples relevant to each team-member's particular experience.`,
 questions: [
 {
 id: 1,
 question_text: `Leading by example is an effective approach in dealing with problematic behaviour from employees.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `This statement is correct, as the passage says: "when the behaviour of a team-member conflicts with established desirable practice... one effective angle is to lead by example..."`,
 order: 1,
 complexity_score: 2
 },
 {
 id: 2,
 question_text: `A manager who understands how people communicate is able to take a flexible approach in dealing with problems.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `While the passage encourages both effective communication and a flexible approach ("a manager must have a good understanding of the way individual people communicate", "a flexible approach is essential") it does not explicitly state that individual communication leads to a flexible approach.`,
 order: 2,
 complexity_score: 4
 },
 {
 id: 3,
 question_text: `In a good team, the needs of the organisation are secondary to the needs of the individual.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `While the passage generally stresses the importance of understanding individual styles ("a manager must have a good understanding of the way individual people communicate", "... relevant to each team-member's particular experience.") it states explicitly that "A good team will always put the needs of the organisation first."`,
 order: 3,
 complexity_score: 3
 }
 ]
 },
 // Passage 2: PR Campaign
 {
 id: 2,
 passage_title: "PR Campaign",
 passage_text: `An effective PR campaign requires precise, clear communication between the client and PR officer. The client should disclose detailed information to the PR officer, including the company's history, goals, and current business plan. It is especially important to disclose any potentially problematic issues. The company should be prepared to dedicate the necessary time and resources of its senior management, as well as sufficient finances, to the campaign. The perfect PR message will be consistent, with each new approach reinforcing the key objectives of the company. If new developments do arise, the PR officer should be fully briefed as soon as possible. It is essential to keep to a clear schedule, leaving adequate time available for approval of copy. Seizing opportunities when they arise is key to the success of the campaign.`,
 questions: [
 {
 id: 4,
 question_text: `The best approach to PR is to be flexible, regularly changing the company's goals to keep the public interested.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `While accepting that changes in approach are sometimes necessary ("If new developments do arise...") the passage states that: "The perfect PR message will be consistent, with each new approach reinforcing the key objectives of the company."`,
 order: 4,
 complexity_score: 3
 },
 {
 id: 5,
 question_text: `Not disclosing a full company history to the PR officer will result in a failed campaign.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `While the passage states that disclosure of company history is important ("The client should disclose detailed information to the PR officer, including the company's history") it is not explicitly stated anywhere that failing to do this will directly and by itself result in the failure of the PR campaign. However, neither is it stated that failure will not result from no disclosure, so any definite answer to this question would rely on inferences which are not directly confirmed by the passage.`,
 order: 5,
 complexity_score: 4
 },
 {
 id: 6,
 question_text: `It is recommended to wait before taking advantage of any new opportunities, to make certain they would be of benefit to the campaign.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states: "Seizing opportunities when they arise is key to the success of the campaign."`,
 order: 6,
 complexity_score: 2
 }
 ]
 },
 // Passage 3: Entrepreneurial Spirit
 {
 id: 3,
 passage_title: "Entrepreneurial Spirit",
 passage_text: `The secret to success in business is entrepreneurial spirit at all levels of the company. Employees who are identified as entrepreneurs in their own right are more motivated – their own financial success becomes integrated with the company's. Those who are oriented towards personal entrepreneurship will work long hours to develop their own tried-and-tested business practices and strategies, contributing as willing partners to the achievements of the company as a whole. Orientation and value-formation training can induce this kind of thinking in new staff recruits, inculcating the notion of how quickly it is possible to achieve financial security through hard work and innovative business approaches, combined with the impression that to miss out on opportunities for such rapid economic and social advancement would be at best unwise and at worst catastrophic.`,
 questions: [
 {
 id: 7,
 question_text: `Employees instilled with the idea of personal entrepreneurship will be less willing to contribute to the success of the company as a whole.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states in fact that such employees will contribute "as willing partners to the achievements of the company."`,
 order: 7,
 complexity_score: 2
 },
 {
 id: 8,
 question_text: `New staff members can be indoctrinated with the virtues of entrepreneurship.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that "this kind of thinking" - which refers directly to the personal entrepreneurship approach discussed in the first paragraph – can be induced through "Orientation and value-formation training".`,
 order: 8,
 complexity_score: 3
 },
 {
 id: 9,
 question_text: `Employees encouraged to think of themselves as entrepreneurs work fewer hours than other staff members.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `While the passage states, "Those who are oriented towards personal entrepreneurship will work long hours", therefore implying that the answer to this question should be 'false', there is no explicit comparison with other staff in either direction, so no definite answer can be given.`,
 order: 9,
 complexity_score: 4
 }
 ]
 },
 // Passage 4: Employee-Boss Relationships
 {
 id: 4,
 passage_title: "Employee-Boss Relationships",
 passage_text: `For ambitious employees, a good relationship with their immediate boss is crucial. A bad relationship can lead to missed opportunities for promotion, and even damage professional reputations. A boss who possesses a thorough understanding of the company's future direction and ultimate goals is the person best equipped to help an employee achieve success. Communication is key. It is important to understand a boss's personal goals and priorities within the company, as well as their individual management approach. Clarifying instructions, anticipating needs, requesting feedback, and accepting criticism gracefully all help to build a solid working relationship. On the other hand, artificial flattery or excessive deference are tactics unlikely to impress if promotion is the goal – a good employee should demonstrate the potential to be an equally effective boss.`,
 questions: [
 {
 id: 10,
 question_text: `Employees must reject criticism to build a good working relationship with their boss.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage explicitly states the opposite, that "accepting criticism gracefully [helps to] build a solid working relationship."`,
 order: 10,
 complexity_score: 2
 },
 {
 id: 11,
 question_text: `A bad relationship with a boss can lead to missed opportunities, but does not risk an employee's reputation.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `The passage states, "A bad relationship [with an employer] can...damage professional reputations." The statement is therefore incorrect.`,
 order: 11,
 complexity_score: 2
 },
 {
 id: 12,
 question_text: `Flattering the boss can be an effective approach for an employee seeking promotion.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states "artificial flattery [is] unlikely to impress if promotion is the goal", but makes no comment about the effect of sincere flattery. So that tells us about artificial flattery and that it is unlikely to impress. Regarding flattery in general, the passage does not state that flattery can or cannot be an effective approach for seeking promotion, so we cannot say if this is true or false.`,
 order: 12,
 complexity_score: 4
 }
 ]
 },
 // Passage 5: Sales Knowledge
 {
 id: 5,
 passage_title: "Sales Knowledge",
 passage_text: `A good salesperson should always learn something about the company, and even the individuals, behind the product he or she is selling. Confidence in a product depends in part on confidence in the integrity, competence, and commitment of those who manufacture and distribute that product. Salespeople should therefore familiarise themselves with the principal personalities behind a company, gaining an understanding of its personnel structure and the functions, duties, and experience of key individuals within the business. It is also useful to know something of the history and development of the company, as well as being aware of its present reputation, and to be familiar with the company's particular practices and policies. As well as providing a more thorough knowledge of the product, this information can help to form the basis of an effective sales pitch.`,
 questions: [
 {
 id: 13,
 question_text: `Knowledge of a company's reputation is not useful for salespeople.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "False",
 explanation: `In direct contradiction to the statement above, the passage states, "It is also useful to know something of the history and development of the company, as well as being aware of its present reputation."`,
 order: 13,
 complexity_score: 2
 },
 {
 id: 14,
 question_text: `The personal traits and abilities of a company's personnel can influence the confidence people have in their product.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states, "Confidence in a product depends in part on confidence in the integrity, competence, and commitment [i.e., personal traits and abilities] of those who manufacture and distribute that product." The statement above is therefore correct.`,
 order: 14,
 complexity_score: 3
 },
 {
 id: 15,
 question_text: `It is helpful to have knowledge of the background, policies and reputation of a company when developing an effective sales pitch.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that "this information", i.e., the knowledge of company history and policies described earlier in the paragraph and referred to in the question, "can help to form the basis of an effective sales pitch."`,
 order: 15,
 complexity_score: 2
 }
 ]
 },
 // Passage 6: Business Ethics
 {
 id: 6,
 passage_title: "Business Ethics",
 passage_text: `Well-regulated, ethical practices should always be an area of primary concern for any business. In an environment where multinational conglomerates predominate, owners of small businesses may feel anonymous enough to become flexible about their code of ethics. However, the increasingly inescapable attention of the media allows an unprecedented number of individuals to access news and information with greater speed than ever before – unethical practices can become a matter of public knowledge overnight, with devastating consequences. Codes of ethical practice should apply not only to clients, but to employees, who are just as able to draw inappropriate behaviour on the part of their employers to the public's attention. In today's society, businesses of any size must be able to demonstrate transparency and accountability in their dealings with employees, clients, and the public alike.`,
 questions: [
 {
 id: 16,
 question_text: `Unethical practices are only a problem if the public becomes aware of them.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that "the increasingly inescapable attention of the media" means that "unethical practices can become a matter of public knowledge overnight, with devastating consequences." It does not however make any explicit reference to the consequences of unethical practices which do not come to the public attention.`,
 order: 16,
 complexity_score: 4
 },
 {
 id: 17,
 question_text: `Employees of a company should be subject to ethical codes of practice.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that, "Codes of ethical practice should apply not only to clients, but to employees".`,
 order: 17,
 complexity_score: 2
 },
 {
 id: 18,
 question_text: `More people than ever before have access to information about companies' ethical practices.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states that the media "allows an unprecedented number of individuals to access news and information" and explicitly confirms that this includes information about companies' ethical practices by adding "unethical practices can become a matter of public knowledge overnight".`,
 order: 18,
 complexity_score: 3
 }
 ]
 },
 // Passage 7: Business Advertising
 {
 id: 7,
 passage_title: "Business Advertising",
 passage_text: `Successful and cost-effective advertising is an important issue to consider when starting up a business. A comprehensive business plan should include details of advertising strategies, a helpful starting point for which is an analysis of the advertising currently being used by competitors in the same line of business. The rise of the internet has provided a variety of new opportunities for advertising, of which an innovative business should take full advantage. A well-designed website should ideally combine a professional appearance with user-friendly functionality, and be widely promoted to draw as much traffic as possible. This not only increases the visibility of a company, but assures potential clients that the company has a forward-thinking, enterprising outlook, and is willing to embrace as well as exploit the latest technological developments.`,
 questions: [
 {
 id: 19,
 question_text: `An analysis of competitors' advertisements is helpful in laying out advertising strategies for a new business`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "True",
 explanation: `The passage states, "a helpful starting point for [planning advertising strategies] is an analysis of the advertising currently being used by competitors". The statement is therefore correct.`,
 order: 19,
 complexity_score: 2
 },
 {
 id: 20,
 question_text: `A professional and user-friendly website will attract a lot of traffic.`,
 options: ["True", "False", "Cannot Say"],
 correct_answer: "Cannot Say",
 explanation: `The passage states that "A well-designed website" should "combine a professional appearance with user-friendly functionality", but adds that the site should be "widely promoted to draw as much traffic as possible." There is no explicit relationship, positive or negative, suggested to exist between the design of the website and the traffic it attracts.`,
 order: 20,
 complexity_score: 4
 }
 ]
 }
 ]
});

export const getTotalQuestions = (testData) => {
 return testData.sections.reduce((total, section) => {
 return total + section.questions.reduce((sectionTotal, passage) => {
 return sectionTotal + passage.questions.length;
 }, 0);
 }, 0);
};
