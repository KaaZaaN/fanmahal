export const QUESTIONS_REGISTRY: Record<string, {
  id: string;
  title: string;
  category: string;
  multiplier: number;
  options: { id: string; text: string }[];
  resolved: boolean;
}> = {
  q1: {
    id: 'q1',
    title: 'Who will be evicted in Week 4 Elimination?',
    category: 'Eviction',
    multiplier: 3.5,
    options: [
      { id: 'opt1_1', text: 'Karan Veer Mehra' },
      { id: 'opt1_2', text: 'Nyrraa Banerjee' },
      { id: 'opt1_3', text: 'Muskan Bamne' },
      { id: 'opt1_4', text: 'No Eviction This Week (Double Saved)' },
    ],
    resolved: false,
  },
  q2: {
    id: 'q2',
    title: 'Which two contestants will enter into a major fight in the kitchen area first?',
    category: 'Fights & Drama',
    multiplier: 2.5,
    options: [
      { id: 'opt2_1', text: 'Rajat Dalal vs Vivian Dsena' },
      { id: 'opt2_2', text: 'Chahat Pandey vs Avinash Mishra' },
      { id: 'opt2_3', text: 'Esha Singh vs Alice Kaushik' },
      { id: 'opt2_4', text: 'No Kitchen Fights (Peaceful Breakfast)' },
    ],
    resolved: false,
  },
  q3: {
    id: 'q3',
    title: 'Who will win the "Rajneeti" Captaincy Task and become the new House Captain?',
    category: 'Captaincy',
    multiplier: 3.0,
    options: [
      { id: 'opt3_1', text: 'Avinash Mishra' },
      { id: 'opt3_2', text: 'Arfeen Khan' },
      { id: 'opt3_3', text: 'Shilpa Shirodkar' },
      { id: 'opt3_4', text: 'Task Aborted / No New Captain Announced' },
    ],
    resolved: false,
  },
  q4: {
    id: 'q4',
    title: 'Will Salman Khan give a "Red Card" or strict warning to any contestant during Weekend Ka Vaar?',
    category: 'Weekend Ka Vaar',
    multiplier: 1.8,
    options: [
      { id: 'opt4_1', text: 'Yes, strict warning or yellow card given to Rajat' },
      { id: 'opt4_2', text: 'Yes, direct eviction / red card warning' },
      { id: 'opt4_3', text: 'No warning or cards issued (Normal grilling)' },
    ],
    resolved: false,
  },
  q5: {
    id: 'q5',
    title: 'Which contestant will shed tears during the ration allocation negotiations?',
    category: 'Tasks',
    multiplier: 2.2,
    options: [
      { id: 'opt5_1', text: 'Chahat Pandey' },
      { id: 'opt5_2', text: 'Sara Arfeen Khan' },
      { id: 'opt5_3', text: 'Shrutika Arjun' },
      { id: 'opt5_4', text: 'Nobody Cries During Ration Task' },
    ],
    resolved: false,
  },
  q6: {
    id: 'q6',
    title: 'Which Wildcard entry will receive maximum votes from housemates for immunity?',
    category: 'Tasks',
    multiplier: 4.0,
    options: [
      { id: 'opt6_1', text: 'Digvijay Rathee' },
      { id: 'opt6_2', text: 'Kashish Kapoor' },
      { id: 'opt6_3', text: 'Aditi Mistry' },
      { id: 'opt6_4', text: 'Equal tie vote for all Wildcards' },
    ],
    resolved: false,
  },
};
