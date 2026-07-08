export type MarginNote = {
  /** paragraph index the note is anchored to */
  paragraph: number;
  /** short label displayed in the gutter */
  label: string;
  /** longer commentary shown when the note is opened */
  body: string;
  /** author-style tag: creative | technical | edit */
  kind?: "creative" | "technical" | "edit";
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  minutes: number;
  status?: "Drafting" | "Editing" | "Published";
  /** rendered as separate <p> blocks. Prefix "*" for italic epigraph paragraphs. */
  paragraphs: string[];
  notes?: MarginNote[];
};

// Body text sourced from The_Spectator_Rewritten_1.docx (Andre Reston).
// Kept close to the manuscript — do not paraphrase without the author.
export const chapters: Chapter[] = [
  {
    id: "ch-01",
    number: 1,
    title: "The Return",
    minutes: 9,
    status: "Editing",
    paragraphs: [
      "Purple-red flames consumed the battlefield. The air was thick with ash and the smell of burning flesh. Bodies in silver armor lay scattered across the ground, fingers still locked around swords they would never use again. A triangular banner had caught fire atop its broken pole, and the castle walls had given way into heaps of rubble and ruin.",
      "He alone remained to witness it.",
      "Cyrus knelt in the middle of the destruction and could not make himself move. Despair had reached into every part of him. His eyes would not leave the flames. It was as though his soul had already left and his body simply had not caught up yet.",
      "Part of him kept insisting this was a nightmare. That he would wake beneath a familiar ceiling, in a familiar bed, and none of it would have happened.",
      "But the heat on his face was real. The smell was real. The silence between the crackling of the fire was real.",
      "A man descended from the air above the ruined field.",
      "He wore a dark violet robe, its lower hem tattered and swaying in the heated wind. His hood was drawn, and a black mask covered the lower half of his face — painted across it, a silver grin stretched unnaturally wide. His skin, where it showed, was pale as something long dead. He moved as though gravity was a formality he had decided to humor, and when he reached the ground, he stopped directly in front of Cyrus.",
      "“Wonderful sight, isn't it?”",
      "Cyrus said nothing. He stared ahead as though the man were not there.",
      "“An abomination of existence, reduced to ashes,” the robed man continued, extending one arm as if presenting his work. “The foolish creations of humanity, erased at last. Someone was always going to do this eventually.”",
      "He paused.",
      "“The only way to end the chaos was to destroy everything.”",
      "Still, Cyrus did not speak.",
      "The man lowered his hood. Dark blue hair fell to his neck. His eyes were crimson, faintly luminous against the firelight.",
      "“You may call me a madman,” he said calmly. “But I have never been wrong.”",
      "A long silence passed between them.",
      "At last, Cyrus lifted his head. Tears threatened at the corners of his eyes, but what burned in them was not grief alone. It was rage, and something beneath rage that had no clean name.",
      "“I wouldn't call you a madman,” he said, his voice hoarse. “You're worse than that. You're a psychopath pretending to be a god.”",
      "The robed man was unmoved. “You're delusional if you think you can kill me. Not even the whole world could leave a scratch on my body.”",
      "“Then I'll do what the world couldn't.”",
      "Cyrus seized his sword and lunged.",
      "The robed man exhaled. An invisible force hurled Cyrus into the air. Before he could recover, the man raised one hand and froze him in place — effortlessly, the way a man might pin a moth to a board. Their eyes met for a moment. Then the robed man snapped his fingers.",
      "Blue flames engulfed Cyrus entirely. His scream tore across the empty battlefield.",
      "When the fire died, he dropped to the ground. His body was covered in burns. He gritted his teeth, forced himself to reach inward for whatever healing was left in him, and pushed himself forward again.",
      "The robed man pointed one finger toward the sky. Lightning answered. A bolt struck Cyrus directly, convulsing through every muscle, filling the air again with the smell of burned flesh.",
      "He charged again anyway.",
      "For one instant, it seemed possible. Then the world stopped. Everything held perfectly still. Cyrus felt it before he understood it — a wrongness, a suspension. His eyes widened. Hundreds of black crystalline spikes materialized in the air around him.",
      "*There is no way I can survive this.*",
      "They drove forward simultaneously. One after another, they punched through his flesh and pinned him against the steel wall behind him.",
      "Footsteps moved toward him through the silence. They stopped. “I told you,” the robed man said quietly. “You cannot defeat me.”",
      "“Just kill me already,” Cyrus whispered.",
      "“Cyrus.” The exhausted man lifted his gaze. “I'll give you a chance to change all of this. Prove me wrong. Change the inevitable.”",
      "A snap. And then everything turned white.",
      "“Will you witness the world's demise once more — O Spectator?”",
      "* * *",
      "Cyrus opened his eyes and gasped. He stared at a familiar ceiling. A soft blue blanket lay across his body. The mattress was beneath him, solid and real. His breathing came in uneven pulls.",
      "Wooden walls. The cabinet in the corner. The small window beside the bed. His room.",
      "*Wait. I can see.*",
      "Knock. Knock. “Cyruuuss!” He froze. He knew that voice. He had not heard it for a very long time.",
      "He crossed the room in three strides and opened the door. The moment he saw her, his vision blurred. She wore a simple brown shirt beneath a yellow-and-white striped apron. Her black hair fell just below her shoulders. Her eyes a pale greenish color.",
      "*It's really you. I can see you again. I thought I had lost you forever.*",
      "“A very bad dream,” he said. His voice broke somewhere in the middle of it. He pressed his face against her shoulder, and after a moment he stopped trying to hold himself together.",
      "“Well, you're awake now,” she said. “And your beautiful wife is right here beside you.”",
      "As they passed the wall, Cyrus glanced at the calendar. March, 1723. His steps slowed almost imperceptibly. *Three years ago. I have actually returned.*",
      "And if he remembered correctly — he felt his face grow warm. Today was the day Cassandra would tell him something that would change his life. She was pregnant.",
    ],
    notes: [
      {
        paragraph: 0,
        label: "Opening image",
        body: "The battlefield had to arrive before the character. If you meet Cyrus first, the world is exposition; if you meet the fire first, the world is grief.",
        kind: "creative",
      },
      {
        paragraph: 6,
        label: "The silver grin",
        body: "Originally a full mask. Reduced to just the painted grin so the reader keeps searching the eyes for tell.",
        kind: "edit",
      },
      {
        paragraph: 27,
        label: "Crystalline spikes",
        body: "Kept deliberately abstract — the magic system is revealed by consequence, not by rulebook. Chapter 9 clarifies.",
        kind: "technical",
      },
      {
        paragraph: 32,
        label: "‘O Spectator’",
        body: "Title drop. The novel's promise: to watch, again, knowing.",
        kind: "creative",
      },
    ],
  },
  {
    id: "ch-02",
    number: 2,
    title: "The Weight of What He Knows",
    minutes: 7,
    status: "Editing",
    paragraphs: [
      "*She was pregnant.*",
      "The thought circled him as he walked beside her toward the living room, neither fading nor resolving.",
      "*Should I pretend I don't know? Should I act surprised? Was it even supposed to happen today?*",
      "The living room was modest. A slightly worn cushion sat beside a low wooden table. The kitchen behind it was simple: stacked plates, utensils gathered in a cup, a fire stove with a pan sitting above it. Two servings already waited on the table — rice, soup, meat.",
      "*It has been a long time since I smelled something like this.*",
      "Warmth wrapped around his back without warning. Soft arms enclosed him from behind, a cheek pressing gently against his spine. Cassandra had her arms around him and was looking up with a quiet smile. “Do well at work today,” she said pleasantly.",
      "Without warning, she tightened her hold. The air left his lungs. Then a low voice arrived directly beside his ear, stripped of its pleasantness: “DON'T. OGLE. OTHER. WOMEN.”",
      "Despite being unable to breathe, Cyrus felt something loosen in his chest. *Definitely not a dream. Dreams don't cause physical pain.*",
      "He turned around carefully. “Our eleventh monthsary is next week,” he said. “I wouldn't ruin the future we planned together for some stranger.” The severity in her expression softened. Almost without realizing it, her hand drifted to rest against her stomach.",
      "The moment Cyrus saw it, he understood. He leaned slightly closer and spoke near her ear. “Besides — we'll have to take care of the little one you're carrying, soon.”",
      "He kissed her cheek. Then, before she could process a single word, he was at the door with a bright wave. “See you later!” The door shut behind him.",
      "Silence filled the house. Cassandra stood completely still. Color rose slowly into her face. *How did he know? I discovered it yesterday. I tried to hide it.* She grabbed both sides of her hair and groaned. “I'm such an idiot!”",
      "After a while, the frustration gave way to something smaller and warmer. She sighed, released her hair, and found that despite everything, she was smiling. “I really did marry a man who reads me too well.”",
      "The truth, of course, was simpler than that. It wasn't that Cyrus understood her perfectly. He simply already knew.",
    ],
    notes: [
      {
        paragraph: 6,
        label: "The all-caps line",
        body: "Only place in the chapter I let punctuation get loud. Cass gets one moment of theater; the rest of her love is quiet.",
        kind: "creative",
      },
      {
        paragraph: 13,
        label: "Structural note",
        body: "This is the whole chapter's thesis: he isn't clairvoyant, he's a returner. The reader needs to feel that difference before Chapter 3 shows him losing it.",
        kind: "technical",
      },
    ],
  },
  {
    id: "ch-03",
    number: 3,
    title: "Diary of the Demised",
    minutes: 10,
    status: "Editing",
    paragraphs: [
      "*I forgot.*",
      "Two words that burrowed into him and refused to move. He turned the problem over as he walked. Not amnesia — this wasn't pathological. He still knew he was from the future. That knowledge remained intact. But the details had begun to dissolve, quietly and without warning, as though his mind were shedding what it could no longer carry.",
      "*Three years forward is three years back. Neither leaves many marks on the body.*",
      "But the question persisted. If his memories were already fading, why had he remembered about Cassandra's pregnancy? Was it simply that the most important things went last? Or would it all dissolve eventually, piece by piece, until he was nothing more than a man moving forward again, blind to what was coming?",
      "He was still working through it when he reached his workplace — a three-story building with flat-painted black walls and quadrilateral windows sealed against the morning chill. He climbed the steps, turned the circular doorknob, and stepped inside.",
      "The room was filled with the rhythmic percussion of typewriters. Rows of figures sat bent over their machines, white paper threaded into the platens, fingers moving with the focused urgency of people whose thoughts had deadlines.",
      "A hand landed on his shoulder. “Yo, Cyrus.” Brian, mid-twenties, sharp jawline, holding a white cup from which curled the faint aroma of brewed tea. “Want some?” Cyrus reached for it. Brian immediately withdrew his hand and turned away with a faint smirk. “I'll go make one.” *I thought you were handing it to me.*",
      "Several minutes later, a voice cut across the floor. “Cyrus!” Mary — dark blue hair transitioning to silver at the tips, gathered into a ponytail. “Boss is looking for you.”",
      "At the top of the stairs, before a closed silver door, he knocked three times. A prompt male voice from inside: “Come in.” He reached for the knob and pushed. The door didn't move. He tried again. He tried once more. He pulled it instead. It swung open with a slow creak.",
      "*Pull, not push. Noted. I really have forgotten almost everything.*",
      "The office was modest but considered. Behind the rectangular desk sat a man in his thirties, leaning back in his chair. The nameplate on his desk read: Howard Deiter.",
      "Howard rose and moved to the bookshelf. He retrieved something from among the documents and brought it to Cyrus. A brown notebook. Its cover was worn, edged with age, slightly torn at the corners. In curving penmanship on the front were two words: *Bruce Hill*.",
      "“A diary?” Cyrus said, before he could stop himself. Howard withdrew a small stack of papers and brought those too. Each sheet held a black-and-white photograph with a brief description below it.",
      "[Prince Blake: 23 Years old. Works as a mail deliverer at DMAA. Single.] [Anderson Silver: 21 Years old. Masseuse. Single.] Then a name caught him. [May Hill: 22 Years old. Works at a dessert restaurant. Married.] He looked up at Howard. “That's Bruce's wife.”",
      "He set the papers aside and opened the diary to its first page. The writing began ordinarily — a photography trip to a yellow-leaf forest, two friends along for company, a wife who couldn't join.",
      "He turned to the next entry. The handwriting had changed. Looser, faster, as if the pen could barely keep pace with the mind behind it.",
      "[In my sleep I smelled burning and woke thinking it was daylight. What I saw instead has not left me since.] [Anderson had been impaled from below and was rotating in the grasp of flames, his legs already severed, being devoured by two men laughing like demons. Prince was hanging upside down from a cross, his head butchered.]",
      "[Cannibals. Monsters wearing human skin. I ran while they were still distracted. I reached the carriage and rode with sweat and tears on my face.]",
      "Cyrus's skin prickled. His stomach turned. He did not close the book.",
      "[JANUARY 13TH: I arrived home. Alone. Alone... My wife is here, but I am alone.] [January 14th: I told my wife what happened. She tried many things. None worked.] [January 15th: Those faces. I cannot escape them. I cannot escape. The one who should have died is me.]",
      "The page had been torn.",
    ],
    notes: [
      {
        paragraph: 0,
        label: "Two-word opening",
        body: "The whole novel's central fear compressed to two words. If the reader doesn't feel it here, the stakes never land.",
        kind: "creative",
      },
      {
        paragraph: 16,
        label: "Bracketed diary voice",
        body: "Brackets, not italics — Bruce is quoting himself through a diary; Cyrus's inner voice stays italic. Two textures, one page.",
        kind: "technical",
      },
    ],
  },
  {
    id: "ch-04",
    number: 4,
    title: "The Assignment",
    minutes: 6,
    status: "Drafting",
    paragraphs: [
      "He was already forming his refusal when Howard spoke again. “Five Diamonds.” Cyrus looked up. Howard held his gaze without blinking.",
      "“You can't see him if he doesn't want you to,” Howard added. “Which is exactly why I need you.”",
      "*Excerpt only — the rest of Chapter 4 is being revised. Come back after the next pass.*",
    ],
  },
  {
    id: "ch-05",
    number: 5,
    title: "Investigation",
    minutes: 8,
    status: "Drafting",
    paragraphs: [
      "Short black hair. Brown eyes. An ordinary face and an ordinary build. *My wife fell for this face?*",
      "Was that a vision of something to come? *This must be it.* He pushed the door open and stepped inside.",
      "*Excerpt only — the full chapter is being tightened.*",
    ],
  },
  {
    id: "ch-06",
    number: 6,
    title: "Divulge",
    minutes: 8,
    status: "Drafting",
    paragraphs: [
      "Cyrus stared at her across the small table. “My husband isn't dead.” “…Huh?”",
      "*And my boss assigned it to me only yesterday. What was he doing with it in between?*",
      "“Sir.” He looked up. May was watching him with quiet concern. “Are you alright?”",
      "*Excerpt only.*",
    ],
  },
  {
    id: "ch-07",
    number: 7,
    title: "Bar",
    minutes: 7,
    status: "Drafting",
    paragraphs: [
      "“Being kind is good. Just be careful who you're kind to.”",
      "“I'm sorry,” he said. “Now will you tell me why you're really here?”",
      "The bartender set Cyrus's drink down without ceremony. “A revolver,” he said flatly. The cold moved through Cyrus from the base of his neck to the tips of his fingers. *This is far too coincidental.*",
      "*Excerpt only.*",
    ],
  },
  {
    id: "ch-08",
    number: 8,
    title: "Dots Connected",
    minutes: 9,
    status: "Drafting",
    paragraphs: [
      "“Saw?” Cyrus asked. His voice was quieter than he intended. Howard looked at him directly. The stillness in his expression wasn't calm — it was the stillness of someone who had already decided how the sentence was going to end.",
      "He had the beginning of a theory, and he immediately started dismantling it.",
      "His hand tightened against his side. Then slowly, he unclenched it.",
      "*Excerpt only.*",
    ],
  },
  {
    id: "ch-09",
    number: 9,
    title: "Knowing Is Worse Than Not",
    minutes: 8,
    status: "Drafting",
    paragraphs: [
      "*If I turn around, I'll see it again.* He didn't want to turn around. Then a hand touched his shoulder.",
      "She smiled — the smile of someone who doesn't know the collision they've just caused. “May said she'd like to be our midwife. For free.” Silence.",
      "He exhaled slowly and quietly accepted the inevitable.",
      "*Excerpt only.*",
    ],
  },
  {
    id: "ch-10",
    number: 10,
    title: "The Night",
    minutes: 6,
    status: "Drafting",
    paragraphs: [
      "He reached out and ran his fingers gently through her hair, careful not to wake her.",
      "“Be careful,” she said. The words were quiet. Not a command. A request.",
      "*Excerpt only.*",
    ],
  },
  {
    id: "ch-24",
    number: 24,
    title: "The One Who Waited",
    minutes: 12,
    status: "Drafting",
    paragraphs: [
      "*This chapter is actively being written.*",
      "The city had learned to keep its lamps low after the second winter. Cyrus walked beneath them and counted the ones that still worked, the way another man might count coins.",
      "He had been told, once, that the price of returning was that you would never again mistake a stranger for someone you loved. He had understood the sentence at the time. He had not understood the weight of it until tonight.",
      "The door of the small house was open. It was never open at this hour. He stopped at the threshold and did not step inside.",
      "“I've been waiting,” said the voice from within. It was not Cassandra's voice. It was not Howard's, or May's, or Brian's. It was a voice he had heard only once before — in a burning field, three years and a lifetime ago.",
      "*— draft continues. Notes below are live commentary from the writing room; expect them to change day to day.*",
    ],
    notes: [
      {
        paragraph: 0,
        label: "Status",
        body: "As of this draft: opening beat is locked, the reveal in paragraph 4 is still on trial. If you're reading and it feels too early, tell me — that's the exact worry I have.",
        kind: "edit",
      },
      {
        paragraph: 1,
        label: "Lamps as clock",
        body: "Trying to establish time-passed without a paragraph of exposition. If the ‘counted lamps like coins’ image works, the whole first act condenses to one sentence.",
        kind: "creative",
      },
      {
        paragraph: 4,
        label: "The voice",
        body: "This is the return of Chapter 1's antagonist — but I want the reader to feel it in the vowels before they name him. If I have to say ‘the robed man’ here, the chapter has failed.",
        kind: "technical",
      },
    ],
  },
];

export const draftingChapter = chapters[chapters.length - 1];
export const chaptersById = Object.fromEntries(chapters.map((c) => [c.id, c]));