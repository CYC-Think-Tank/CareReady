export type LessonSection = {
  heading: string;
  body: string;
  bullets?: string[];
  note?: string;
};

export type KnowledgeCheck = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  eyebrow: string;
  minutes: number;
  intro: string;
  sections: LessonSection[];
  knowledgeCheck?: KnowledgeCheck;
};

export type CourseModule = {
  id: string;
  number: number;
  category: string;
  title: string;
  summary: string;
  minutes: number;
  accent: "mint" | "citrus" | "coral" | "blue";
  lessons: Lesson[];
};

export const courseModules: CourseModule[] = [
  {
    id: "skin-changes",
    number: 1,
    category: "Skin health",
    title: "Notice changes early",
    summary:
      "Build a consistent observation routine and recognize changes that should be documented and reported.",
    minutes: 22,
    accent: "mint",
    lessons: [
      {
        id: "observe",
        title: "Look, listen, compare",
        eyebrow: "Observation practice",
        minutes: 12,
        intro:
          "Personal support workers and other care team members are often the first to notice a change. Your role is to observe, document, and report—not diagnose.",
        sections: [
          {
            heading: "Use the same routine each time",
            body:
              "During care activities that are within your role, notice whether the skin looks or feels different from the person’s usual condition. Ask about comfort and compare with previous observations when appropriate.",
            bullets: [
              "New redness or a colour change that does not resolve",
              "Bruising, dryness, cracking, swelling, warmth, or broken skin",
              "A new spot, blister, tear, rash-like area, or drainage",
              "Pain, itching, tenderness, numbness, or a change in sensation",
            ],
            note:
              "Placeholder content: the final list and escalation timeframes must be reviewed against the learner’s organization and approved Ontario guidance.",
          },
          {
            heading: "Describe what you see",
            body:
              "Use neutral, observable language. Record the location, approximate size, colour, condition of the surrounding skin, reported discomfort, and when the change was first noticed. Follow workplace rules for photographs and documentation.",
          },
          {
            heading: "Escalate uncertainty",
            body:
              "A small spot can have many meanings. Do not label it. Report a new, worsening, painful, draining, or otherwise concerning change through the organization’s approved pathway.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 10,
        intro:
          "Apply the observe–document–report approach to a short workplace scenario.",
        sections: [
          {
            heading: "Scenario",
            body:
              "During routine care, you notice a new dark spot on a resident’s heel. The resident says it is tender. The spot was not mentioned in yesterday’s notes.",
          },
        ],
        knowledgeCheck: {
          prompt: "What is the best next step within a support worker’s role?",
          options: [
            "Diagnose the spot and apply a treatment",
            "Observe and document the change, then report it through the approved pathway",
            "Wait several days to see whether it disappears",
          ],
          correctIndex: 1,
          explanation:
            "Correct. Describe the observable change and the resident’s report, document it according to policy, and promptly notify the appropriate care team member.",
        },
      },
    ],
  },
  {
    id: "skin-protection",
    number: 2,
    category: "Skin health",
    title: "Protect fragile skin",
    summary:
      "Reduce avoidable friction, moisture, and pressure risks while working within the plan of care.",
    minutes: 20,
    accent: "citrus",
    lessons: [
      {
        id: "prevent",
        title: "Everyday protection",
        eyebrow: "Prevention habits",
        minutes: 12,
        intro:
          "Prevention is a team activity. Small, consistent actions during personal care, transfers, and repositioning can help protect fragile skin.",
        sections: [
          {
            heading: "Follow the individual plan",
            body:
              "Use the person’s current plan of care and your organization’s protocol. Confirm required equipment, repositioning instructions, moisture management, and who to contact when the plan is unclear.",
            bullets: [
              "Use approved transfer techniques and equipment to reduce dragging",
              "Keep skin clean and dry using approved products",
              "Check that clothing, tubing, footwear, and bedding are not causing pressure",
              "Support hydration and nutrition only within the documented plan of care",
            ],
          },
          {
            heading: "Avoid independent treatment decisions",
            body:
              "Do not introduce creams, dressings, cushions, or repositioning schedules unless they are authorized in the plan of care or by the appropriate regulated professional.",
            note:
              "Placeholder content: prevention steps must be replaced with organization-approved procedures before formal delivery.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 8,
        intro: "Choose the response that keeps prevention aligned with the plan of care.",
        sections: [
          {
            heading: "Scenario",
            body:
              "A resident’s transfer feels more difficult today and their skin is rubbing against the sling edge.",
          },
        ],
        knowledgeCheck: {
          prompt: "What should you do?",
          options: [
            "Continue quickly so the transfer is over sooner",
            "Stop when safe, protect the resident, and seek help according to protocol",
            "Change the resident’s transfer plan yourself",
          ],
          correctIndex: 1,
          explanation:
            "Correct. Pause when safe, keep the resident supported, and follow the approved escalation process rather than improvising a new transfer plan.",
        },
      },
    ],
  },
  {
    id: "spots-escalation",
    number: 3,
    category: "Skin health",
    title: "Report concerning spots",
    summary:
      "Practise objective descriptions and know when a skin change needs faster escalation.",
    minutes: 18,
    accent: "coral",
    lessons: [
      {
        id: "describe",
        title: "Describe without diagnosing",
        eyebrow: "Communication skill",
        minutes: 10,
        intro:
          "The phrase “small spot” is not specific enough for safe handover. A structured description helps the right team member assess the change.",
        sections: [
          {
            heading: "Build a useful report",
            body:
              "State what changed, where it is, when it was noticed, what the person reports, and whether there are other observable signs.",
            bullets: [
              "Location and approximate size using an approved measuring method",
              "Colour, border, surface, drainage, warmth, swelling, or broken skin",
              "Pain, tenderness, itching, or other reported symptoms",
              "Whether the change is new, worsening, or different from the usual condition",
            ],
          },
          {
            heading: "Use the escalation pathway",
            body:
              "Follow the organization’s urgent and non-urgent pathways. If the person appears acutely unwell or there is immediate danger, use the emergency process for that setting.",
            note:
              "Placeholder content: specific red flags and timing must be supplied by a qualified clinical reviewer.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 8,
        intro: "Identify the handover that gives the care team actionable information.",
        sections: [
          {
            heading: "Scenario",
            body: "You need to report a new area you noticed during morning care.",
          },
        ],
        knowledgeCheck: {
          prompt: "Which report is most useful?",
          options: [
            "There is a weird spot",
            "The resident probably has an infection",
            "At 8:15 a.m. I noticed a new tender red area on the right heel; the skin is intact",
          ],
          correctIndex: 2,
          explanation:
            "Correct. This report uses observable details, includes timing and location, and avoids making a diagnosis.",
        },
      },
    ],
  },
  {
    id: "fall-risk",
    number: 4,
    category: "Fall prevention",
    title: "Spot changing fall risks",
    summary:
      "Notice person, task, and environment changes that may increase fall risk today.",
    minutes: 24,
    accent: "blue",
    lessons: [
      {
        id: "scan",
        title: "Pause before the task",
        eyebrow: "Risk scan",
        minutes: 14,
        intro:
          "Fall risk can change from one shift to the next. A brief check before mobility and personal care tasks helps you notice when the usual plan may no longer fit.",
        sections: [
          {
            heading: "Person, task, environment",
            body:
              "Look for changes in alertness, strength, balance, pain, footwear, continence urgency, and confidence. Check the task, equipment, lighting, clutter, wet surfaces, and access to the call system.",
            bullets: [
              "Ask how the person feels before standing or walking",
              "Confirm mobility aids and transfer equipment are available and positioned correctly",
              "Keep frequently used items within safe reach according to the plan",
              "Report a change rather than pushing through the usual routine",
            ],
          },
          {
            heading: "Respond to change",
            body:
              "If the person is newly dizzy, weak, confused, in pain, or unable to complete their usual mobility task, keep them safe and contact the appropriate team member before continuing.",
            note:
              "Placeholder content: organizations must insert their approved fall-risk screening and transfer procedures.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 10,
        intro: "Use the pause-and-check habit before mobility.",
        sections: [
          {
            heading: "Scenario",
            body:
              "A client who normally walks with one-person assistance says they feel dizzy when they sit up.",
          },
        ],
        knowledgeCheck: {
          prompt: "What is the safest response?",
          options: [
            "Encourage them to walk because movement may help",
            "Keep them safely supported and report the change before proceeding",
            "Leave them sitting alone while you find their shoes",
          ],
          correctIndex: 1,
          explanation:
            "Correct. A new symptom changes the situation. Keep the person safe and follow the care setting’s escalation process.",
        },
      },
    ],
  },
  {
    id: "after-a-fall",
    number: 5,
    category: "Fall response",
    title: "Respond after a fall",
    summary:
      "Use a calm, role-appropriate response while activating the organization’s post-fall protocol.",
    minutes: 18,
    accent: "coral",
    lessons: [
      {
        id: "respond",
        title: "Protect, call, observe",
        eyebrow: "Immediate response",
        minutes: 10,
        intro:
          "After a fall, the priority is immediate safety and timely assessment through the organization’s approved response process.",
        sections: [
          {
            heading: "Stay within your role",
            body:
              "Stay with the person when safe, call for the required assistance, provide reassurance, and observe for obvious hazards or changes. Do not move or lift the person until the appropriate assessment and protocol steps are completed, except when remaining in place creates an immediate danger.",
            bullets: [
              "Activate the site-specific urgent response process",
              "Report what you witnessed or found without guessing",
              "Preserve privacy and keep the area safe",
              "Complete required documentation and post-fall actions",
            ],
            note:
              "Placeholder content: emergency response and moving/lifting instructions require formal clinical and organizational approval.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 8,
        intro: "Choose the response that prioritizes safety and assessment.",
        sections: [
          {
            heading: "Scenario",
            body: "You find a resident sitting on the floor beside their bed.",
          },
        ],
        knowledgeCheck: {
          prompt: "What should happen first?",
          options: [
            "Lift them back to bed immediately",
            "Stay with them, call for help, and follow the post-fall protocol",
            "Ask them to stand up on their own",
          ],
          correctIndex: 1,
          explanation:
            "Correct. Keep the person safe, summon the appropriate help, and follow the approved post-fall assessment and response pathway.",
        },
      },
    ],
  },
  {
    id: "protocols",
    number: 6,
    category: "Safe practice",
    title: "Keep protocols current",
    summary:
      "Know where protocols live, check the current version, and record your review.",
    minutes: 16,
    accent: "citrus",
    lessons: [
      {
        id: "review",
        title: "The protocol check habit",
        eyebrow: "Workplace routine",
        minutes: 9,
        intro:
          "Training supports practice, but the current organizational protocol is the source for site-specific steps, roles, equipment, and escalation contacts.",
        sections: [
          {
            heading: "Check four things",
            body:
              "Confirm you can locate the protocol, identify its effective or review date, understand what applies to your role, and know where to ask questions.",
            bullets: [
              "Where is the official version stored?",
              "When was it last reviewed or updated?",
              "Which steps and documentation apply to my role?",
              "Who confirms an unclear or conflicting instruction?",
            ],
          },
          {
            heading: "Use reminders deliberately",
            body:
              "A reminder does not confirm competence by itself. Use it as a prompt to open the current protocol, review changes, ask questions, and record acknowledgement where required.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 7,
        intro: "Decide what to do when training and local practice appear different.",
        sections: [
          {
            heading: "Scenario",
            body:
              "A colleague describes a fall-response step that differs from what you remember in this course.",
          },
        ],
        knowledgeCheck: {
          prompt: "What is the best response?",
          options: [
            "Use whichever step is faster",
            "Check the current approved protocol and ask the designated lead to clarify",
            "Assume the online course is always more current",
          ],
          correctIndex: 1,
          explanation:
            "Correct. Confirm the current controlled protocol and escalate uncertainty to the person responsible for clinical or operational guidance.",
        },
      },
    ],
  },
  {
    id: "documentation",
    number: 7,
    category: "Communication",
    title: "Document and hand over",
    summary:
      "Share timely, factual information so the next care team member can act confidently.",
    minutes: 20,
    accent: "mint",
    lessons: [
      {
        id: "communicate",
        title: "Make the next action clear",
        eyebrow: "Team communication",
        minutes: 12,
        intro:
          "Good documentation connects an observation to a timely team response. Use the approved record and communication method for your setting.",
        sections: [
          {
            heading: "Keep it factual and complete",
            body:
              "Record what you observed, what the person said, what action you took, who you notified, and the time. Avoid assumptions, labels, blame, and copied-forward details that you did not verify.",
            bullets: [
              "Use the person’s own words when relevant",
              "Include dates and times according to policy",
              "Document the response or instructions you received",
              "Protect privacy and use only approved communication channels",
            ],
          },
          {
            heading: "Close the loop",
            body:
              "If your role requires follow-up, confirm that the handover reached the appropriate person and that any assigned next step is understood. Escalate if the concern is not addressed within the required timeframe.",
            note:
              "Placeholder content: documentation standards must be aligned with the organization’s policies and Ontario legal requirements.",
          },
        ],
      },
      {
        id: "check",
        title: "Knowledge check",
        eyebrow: "1 question",
        minutes: 8,
        intro: "Choose the note that records observable facts and actions.",
        sections: [
          {
            heading: "Scenario",
            body: "You reported a new skin concern to the designated nurse at 10:20 a.m.",
          },
        ],
        knowledgeCheck: {
          prompt: "Which entry is most appropriate?",
          options: [
            "Resident looks bad today",
            "10:15 a.m.: resident reported tenderness at left heel; new red area observed; designated nurse notified at 10:20 a.m.",
            "Resident has a pressure injury",
          ],
          correctIndex: 1,
          explanation:
            "Correct. The entry is timed, factual, specific, and records both the resident’s report and the notification action.",
        },
      },
    ],
  },
];

export const totalLessons = courseModules.reduce(
  (total, module) => total + module.lessons.length,
  0,
);

export const totalMinutes = courseModules.reduce(
  (total, module) => total + module.minutes,
  0,
);

export function getModule(moduleId: string) {
  return courseModules.find((module) => module.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string) {
  return getModule(moduleId)?.lessons.find((lesson) => lesson.id === lessonId);
}

export function getNextLesson(moduleId: string, lessonId: string) {
  const flatLessons = courseModules.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  );
  const index = flatLessons.findIndex(
    (item) => item.module.id === moduleId && item.lesson.id === lessonId,
  );

  return index >= 0 ? flatLessons[index + 1] : undefined;
}
