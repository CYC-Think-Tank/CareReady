-- Admin-authored course modules.
-- Moves module content out of src/content/course.ts and into the database so
-- admins can add and edit modules from /admin. The static file remains the
-- fallback when Supabase is unavailable.

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Learners may update their own profile row, so without this they could set
-- is_admin on themselves. A column-level revoke cannot override a table-level
-- grant, so the table-wide UPDATE is dropped and re-granted per column.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, profession, updated_at) on public.profiles to authenticated;

-- Security definer so module policies can read the flag without depending on
-- the row level security rules that protect public.profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.modules (
  id text primary key,
  number integer not null,
  category text not null default '',
  title text not null,
  summary text not null default '',
  minutes integer not null default 0,
  accent text not null default 'mint'
    check (accent in ('mint', 'citrus', 'coral', 'blue')),
  published boolean not null default true,
  -- { id, title, eyebrow, minutes, intro, sections: [{ heading, body, bullets, note }] }
  information jsonb not null default '{}'::jsonb,
  -- { id, title, eyebrow, minutes, intro, scenario, prompt, options, correctIndex, explanation }
  knowledge_check jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists modules_number_idx on public.modules(number);

alter table public.modules enable row level security;

-- Everyone (including signed-out visitors) may read published modules.
drop policy if exists "Anyone can view published modules" on public.modules;
create policy "Anyone can view published modules"
  on public.modules for select to anon, authenticated
  using (published);

-- Admins may read drafts and make any change.
drop policy if exists "Admins can view every module" on public.modules;
create policy "Admins can view every module"
  on public.modules for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can create modules" on public.modules;
create policy "Admins can create modules"
  on public.modules for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update modules" on public.modules;
create policy "Admins can update modules"
  on public.modules for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete modules" on public.modules;
create policy "Admins can delete modules"
  on public.modules for delete to authenticated
  using (public.is_admin());

create or replace function public.touch_modules_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at
  before update on public.modules
  for each row execute procedure public.touch_modules_updated_at();

-- Seeded from the original src/content/course.ts content so no lesson URL changes.
insert into public.modules
  (id, number, category, title, summary, minutes, accent, published, information, knowledge_check)
values
  ('skin-changes', 1, 'Skin health', 'Notice changes early', 'Build a consistent observation routine and recognize changes that should be documented and reported.', 22, 'mint', true, '{"id":"observe","title":"Look, listen, compare","eyebrow":"Observation practice","minutes":12,"intro":"Personal support workers and other care team members are often the first to notice a change. Your role is to observe, document, and report—not diagnose.","sections":[{"heading":"Use the same routine each time","body":"During care activities that are within your role, notice whether the skin looks or feels different from the person’s usual condition. Ask about comfort and compare with previous observations when appropriate.","bullets":["New redness or a colour change that does not resolve","Bruising, dryness, cracking, swelling, warmth, or broken skin","A new spot, blister, tear, rash-like area, or drainage","Pain, itching, tenderness, numbness, or a change in sensation"],"note":"Placeholder content: the final list and escalation timeframes must be reviewed against the learner’s organization and approved Ontario guidance."},{"heading":"Describe what you see","body":"Use neutral, observable language. Record the location, approximate size, colour, condition of the surrounding skin, reported discomfort, and when the change was first noticed. Follow workplace rules for photographs and documentation.","bullets":[],"note":""},{"heading":"Escalate uncertainty","body":"A small spot can have many meanings. Do not label it. Report a new, worsening, painful, draining, or otherwise concerning change through the organization’s approved pathway.","bullets":[],"note":""}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":10,"intro":"Apply the observe–document–report approach to a short workplace scenario.","scenario":"During routine care, you notice a new dark spot on a resident’s heel. The resident says it is tender. The spot was not mentioned in yesterday’s notes.","prompt":"What is the best next step within a support worker’s role?","options":["Diagnose the spot and apply a treatment","Observe and document the change, then report it through the approved pathway","Wait several days to see whether it disappears"],"correctIndex":1,"explanation":"Correct. Describe the observable change and the resident’s report, document it according to policy, and promptly notify the appropriate care team member."}'::jsonb),
  ('skin-protection', 2, 'Skin health', 'Protect fragile skin', 'Reduce avoidable friction, moisture, and pressure risks while working within the plan of care.', 20, 'citrus', true, '{"id":"prevent","title":"Everyday protection","eyebrow":"Prevention habits","minutes":12,"intro":"Prevention is a team activity. Small, consistent actions during personal care, transfers, and repositioning can help protect fragile skin.","sections":[{"heading":"Follow the individual plan","body":"Use the person’s current plan of care and your organization’s protocol. Confirm required equipment, repositioning instructions, moisture management, and who to contact when the plan is unclear.","bullets":["Use approved transfer techniques and equipment to reduce dragging","Keep skin clean and dry using approved products","Check that clothing, tubing, footwear, and bedding are not causing pressure","Support hydration and nutrition only within the documented plan of care"],"note":""},{"heading":"Avoid independent treatment decisions","body":"Do not introduce creams, dressings, cushions, or repositioning schedules unless they are authorized in the plan of care or by the appropriate regulated professional.","bullets":[],"note":"Placeholder content: prevention steps must be replaced with organization-approved procedures before formal delivery."}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":8,"intro":"Choose the response that keeps prevention aligned with the plan of care.","scenario":"A resident’s transfer feels more difficult today and their skin is rubbing against the sling edge.","prompt":"What should you do?","options":["Continue quickly so the transfer is over sooner","Stop when safe, protect the resident, and seek help according to protocol","Change the resident’s transfer plan yourself"],"correctIndex":1,"explanation":"Correct. Pause when safe, keep the resident supported, and follow the approved escalation process rather than improvising a new transfer plan."}'::jsonb),
  ('spots-escalation', 3, 'Skin health', 'Report concerning spots', 'Practise objective descriptions and know when a skin change needs faster escalation.', 18, 'coral', true, '{"id":"describe","title":"Describe without diagnosing","eyebrow":"Communication skill","minutes":10,"intro":"The phrase “small spot” is not specific enough for safe handover. A structured description helps the right team member assess the change.","sections":[{"heading":"Build a useful report","body":"State what changed, where it is, when it was noticed, what the person reports, and whether there are other observable signs.","bullets":["Location and approximate size using an approved measuring method","Colour, border, surface, drainage, warmth, swelling, or broken skin","Pain, tenderness, itching, or other reported symptoms","Whether the change is new, worsening, or different from the usual condition"],"note":""},{"heading":"Use the escalation pathway","body":"Follow the organization’s urgent and non-urgent pathways. If the person appears acutely unwell or there is immediate danger, use the emergency process for that setting.","bullets":[],"note":"Placeholder content: specific red flags and timing must be supplied by a qualified clinical reviewer."}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":8,"intro":"Identify the handover that gives the care team actionable information.","scenario":"You need to report a new area you noticed during morning care.","prompt":"Which report is most useful?","options":["There is a weird spot","The resident probably has an infection","At 8:15 a.m. I noticed a new tender red area on the right heel; the skin is intact"],"correctIndex":2,"explanation":"Correct. This report uses observable details, includes timing and location, and avoids making a diagnosis."}'::jsonb),
  ('fall-risk', 4, 'Fall prevention', 'Spot changing fall risks', 'Notice person, task, and environment changes that may increase fall risk today.', 24, 'blue', true, '{"id":"scan","title":"Pause before the task","eyebrow":"Risk scan","minutes":14,"intro":"Fall risk can change from one shift to the next. A brief check before mobility and personal care tasks helps you notice when the usual plan may no longer fit.","sections":[{"heading":"Person, task, environment","body":"Look for changes in alertness, strength, balance, pain, footwear, continence urgency, and confidence. Check the task, equipment, lighting, clutter, wet surfaces, and access to the call system.","bullets":["Ask how the person feels before standing or walking","Confirm mobility aids and transfer equipment are available and positioned correctly","Keep frequently used items within safe reach according to the plan","Report a change rather than pushing through the usual routine"],"note":""},{"heading":"Respond to change","body":"If the person is newly dizzy, weak, confused, in pain, or unable to complete their usual mobility task, keep them safe and contact the appropriate team member before continuing.","bullets":[],"note":"Placeholder content: organizations must insert their approved fall-risk screening and transfer procedures."}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":10,"intro":"Use the pause-and-check habit before mobility.","scenario":"A client who normally walks with one-person assistance says they feel dizzy when they sit up.","prompt":"What is the safest response?","options":["Encourage them to walk because movement may help","Keep them safely supported and report the change before proceeding","Leave them sitting alone while you find their shoes"],"correctIndex":1,"explanation":"Correct. A new symptom changes the situation. Keep the person safe and follow the care setting’s escalation process."}'::jsonb),
  ('after-a-fall', 5, 'Fall response', 'Respond after a fall', 'Use a calm, role-appropriate response while activating the organization’s post-fall protocol.', 18, 'coral', true, '{"id":"respond","title":"Protect, call, observe","eyebrow":"Immediate response","minutes":10,"intro":"After a fall, the priority is immediate safety and timely assessment through the organization’s approved response process.","sections":[{"heading":"Stay within your role","body":"Stay with the person when safe, call for the required assistance, provide reassurance, and observe for obvious hazards or changes. Do not move or lift the person until the appropriate assessment and protocol steps are completed, except when remaining in place creates an immediate danger.","bullets":["Activate the site-specific urgent response process","Report what you witnessed or found without guessing","Preserve privacy and keep the area safe","Complete required documentation and post-fall actions"],"note":"Placeholder content: emergency response and moving/lifting instructions require formal clinical and organizational approval."}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":8,"intro":"Choose the response that prioritizes safety and assessment.","scenario":"You find a resident sitting on the floor beside their bed.","prompt":"What should happen first?","options":["Lift them back to bed immediately","Stay with them, call for help, and follow the post-fall protocol","Ask them to stand up on their own"],"correctIndex":1,"explanation":"Correct. Keep the person safe, summon the appropriate help, and follow the approved post-fall assessment and response pathway."}'::jsonb),
  ('protocols', 6, 'Safe practice', 'Keep protocols current', 'Know where protocols live, check the current version, and record your review.', 16, 'citrus', true, '{"id":"review","title":"The protocol check habit","eyebrow":"Workplace routine","minutes":9,"intro":"Training supports practice, but the current organizational protocol is the source for site-specific steps, roles, equipment, and escalation contacts.","sections":[{"heading":"Check four things","body":"Confirm you can locate the protocol, identify its effective or review date, understand what applies to your role, and know where to ask questions.","bullets":["Where is the official version stored?","When was it last reviewed or updated?","Which steps and documentation apply to my role?","Who confirms an unclear or conflicting instruction?"],"note":""},{"heading":"Use reminders deliberately","body":"A reminder does not confirm competence by itself. Use it as a prompt to open the current protocol, review changes, ask questions, and record acknowledgement where required.","bullets":[],"note":""}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":7,"intro":"Decide what to do when training and local practice appear different.","scenario":"A colleague describes a fall-response step that differs from what you remember in this course.","prompt":"What is the best response?","options":["Use whichever step is faster","Check the current approved protocol and ask the designated lead to clarify","Assume the online course is always more current"],"correctIndex":1,"explanation":"Correct. Confirm the current controlled protocol and escalate uncertainty to the person responsible for clinical or operational guidance."}'::jsonb),
  ('documentation', 7, 'Communication', 'Document and hand over', 'Share timely, factual information so the next care team member can act confidently.', 20, 'mint', true, '{"id":"communicate","title":"Make the next action clear","eyebrow":"Team communication","minutes":12,"intro":"Good documentation connects an observation to a timely team response. Use the approved record and communication method for your setting.","sections":[{"heading":"Keep it factual and complete","body":"Record what you observed, what the person said, what action you took, who you notified, and the time. Avoid assumptions, labels, blame, and copied-forward details that you did not verify.","bullets":["Use the person’s own words when relevant","Include dates and times according to policy","Document the response or instructions you received","Protect privacy and use only approved communication channels"],"note":""},{"heading":"Close the loop","body":"If your role requires follow-up, confirm that the handover reached the appropriate person and that any assigned next step is understood. Escalate if the concern is not addressed within the required timeframe.","bullets":[],"note":"Placeholder content: documentation standards must be aligned with the organization’s policies and Ontario legal requirements."}]}'::jsonb, '{"id":"check","title":"Knowledge check","eyebrow":"1 question","minutes":8,"intro":"Choose the note that records observable facts and actions.","scenario":"You reported a new skin concern to the designated nurse at 10:20 a.m.","prompt":"Which entry is most appropriate?","options":["Resident looks bad today","10:15 a.m.: resident reported tenderness at left heel; new red area observed; designated nurse notified at 10:20 a.m.","Resident has a pressure injury"],"correctIndex":1,"explanation":"Correct. The entry is timed, factual, specific, and records both the resident’s report and the notification action."}'::jsonb)
on conflict (id) do nothing;
