---
description: My experience as the first-ever intern at Probook.
tags:
  - me
---

In the last two weeks, I had the pleasure of interning at [Probook](https://probook.ai/) as a member of their Engineering team (and I later discovered I was the first *ever* intern at Probook, which was quite cool). Here's a rough chronology of my experience and a reflection on all the incredible things I learned, fun I had, and friends I made.

## 8.3

On Monday, I flew in to New York around 11 PM with my friend Yibo, founding engineer #1 at Probook and the person who actually referred me for this internship. 

| ![[Pasted image 20260815144605.jpeg\|200]] | ![[Pasted image 20260815144620.jpeg\|200]] |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![[Pasted image 20260815144625.jpeg\|200]]  | ![[Pasted image 20260815144627.jpeg\|200]] |

Upon arriving in Manhattan, I had two immediate reactions:
1. Why does it smell so bad?
2. Why are there so many restaurants still open?

Just a minute in, I had noticed both a really bad thing and a really good thing...quite fitting for a city of such extremes like NYC. Thankfully, the latter helped us dodge the former as we went into a restaurant called Chubby Skewers, which replaced the terrible streetside smell with the savory scent of self-cooked skewers.

![[Pasted image 20260815145442.jpeg|360]]

After eating, we walked around for a bit and discussed the internship as well as just general thoughts on AI, and I got back to my hotel room around 1 AM.

## 8.4

Tuesday was my first day of work, and I showed up at the Empire State Building around 9:30AM. I spent my morning getting to know the rest of the Engineering team, and Yibo and Alex also onboarded me to the project I'd be working on.
![[Pasted image 20260815150236.jpeg|381]]
*In the office.*

After lunch I was tempted to jump straight into coding (or rather, Claude Code), but Yibo gave me two valuable tips:
1. With LLM code generation, implementation effort becomes negligible. Therefore, you can put more time into gathering context and really mapping out exactly what you want to build before launching several half-baked programs that you're going to have to correct later anyway.
2. Claude Code out-of-the-box is far less powerful than it could be, so Yibo recommended I spend some time optimizing my Claude setup before using it. I began with simple hacks like adding a status bar to show model/usage stats, but over the course of the week I began to develop my own workflows and skills that I felt worked best for me, like using a Fable orchestrator with Opus subagents, or having Claude construct HTML dashboards that made it easier to keep track of all the experiments I ran.

Nonetheless, I still didn't fully take this advice to heart on my first day and ended up hastily spinning up 5 or 6 experiments in parallel without specifying any kind of organizational structure. As a result, files created by one experiment were modified/corrupted by another's, and it grew difficult for me to keep track of the parameters and results for each. While coding by hand forces you to really understand every tedious implementation detail, agentic coding has the opposite problem where, if you go too fast, you might end up feeling like you don't know what's going on at all. 

> When dealing with agents, it's important to find a good middle ground between free reins and micro-management.

Something else I learned that I hadn't realized earlier was the fact that for LLMs, the time it takes to encode a 1000-token prompt is comparable to the time it takes to decode a *single* subsequent token, because all 1000 prompt tokens can be encoded in parallel, while the response tokens must be decoded one by one. Therefore, consider a problem that you're currently solving by feeding a prompt into an LLM. Even if this prompt is astronomically large, optimizing answer extraction to require just one fewer decode will still provide substantial gains to latency.

At the end of the day, I also played some mahjong with Lewis, Michael and Forest.

## 8.5

I continued my work from the previous day but around 5-6 PM, I finally decided my code had gotten too messy and needed a reorganization. I spent thirty minutes drafting up a spec for a new organizational structure (placing each experiment in its own folder according to a specific format that requires key components like a `README.md`, scaffolding scripts, etc.), as well as a dashboard that could use this unified structure to consolidate information from all the experiments into a single, visually intuitive webpage. I also set up a `/experiment` skill that ensured future experiments would all follow the specified format. This setup helped increase the transparency between me and my Claude agents, which helped me finally feel in control of my own ideas.

## 8.6 + 8.7

After experimenting a while with linear probing, I began looking into fine-tuning instead and was quickly blown away by just how well it worked. The performance of a fine-tuned Gemma 4B was comparable to a zero-shot 27B model, and moreover fine-tuning is super easy as long as you have good data; plus, you can shorten your prompt as well because fixed criteria get baked into the LoRa weights. Perhaps the craziest finding of all is that if you want to extract multiple properties of a single passage at once, you can do so with a *single set of fine-tuned weights* AND *without decoding any tokens at all*, at the same performance of a chorus of models fine-tuned to each individual model.

At the end of the day, I played some Cambio with Yibo, Michael, and Carl. Michael left after a few rounds but we kept playing and tracking score. Carl was having a really bad day and ended up getting nearly 200 points before he finally won a round—we started around 9:30 and said we would play until Carl won a game...we left at 11:30.

## 8.8

My first weekend in NYC! I slept nice and late, got a good ramen lunch at Tonchin, then headed to [Activate Games](https://playactivate.com/union-square), which was way more fun than I expected. Our favorite room was definitely the laser room, and we actually failed level 4 an embarrassing number of times. Afterward, we got some dinner from Chubby Tan then headed to [Beat the Bomb](https://www.beatthebomb.com/locations/brooklyn). I must say I was expecting an actual escape room, but it ended up feeling like an unsuccessful combination of escape room games and Activate, and the slime bomb also felt rather gimmicky. It was still pretty fun especially with our group (Toby, Carl, Yibo, Alex and I), but I don't think it deserves 4.9 stars.

Afterward, we headed to Toby's apartment lounge to hang out and ended up playing another 2-3 hours of Cambio—by the time I got back to my hotel it was almost 4. I'll also leave the story behind this image as an exercise for the reader:
![[Pasted image 20260815165524.jpeg|353]]

## 8.9

I got hotpot with Yibo, Alex, and JW before Yibo left for Boston, and I spent the rest of the day hanging out with Alex and JW. We went to two escape rooms, Houdini's Workshop and High Speed (subway themed). The first one was alright but didn't feel that much better than rooms I'd been to before; the second one, though, had really cool theming, and its first room was a really cool reconstruction of a subway car.

![[Pasted image 20260815165925.jpeg|311]]

*The first room of High Speed.*

We got dinner at an alright Japanese restaurant, then I headed home comparatively early (around 11PM or so).

## The rest

I spent most of my last week refining my fine-tuning work and expanding coverage to all required variables. We also got a ping-pong table during that time, so I played quite a few games with Carl and Ryan (and won almost all of them!) We also played basketball Wednesday night in Carl's apartment gym, which was really fun. On the last Friday, we still had ~$400 left on the intern card, so we decided to splurge on a 6-man lunch at [Omakase 33](https://omakase33.com/). 

![[Pasted image 20260817135700.jpeg]]

*Company all-hands!*

![[Pasted image 20260817135718.jpeg]]

*Final dinner with eng team :(*

## In review...

On Saturday, I met up with a friend from SIP for breakfast then took an Uber Shuttle to JFK...and so concluded this short but incredible chapter of my life. If I had to summarize what I learned:
1. Agentic coding is super flexible, and it's more than worthwhile to spend the time developing the system that best suits you rather than just running with whatever comes out-of-the-box.
2. Yibo shared with me the interesting idea that although agents have long overtaken human SWEs in implementation ability/skill, humans still possess superior context/memory management (for now)—that is, we're good at forgetting unimportant things despite recency, and at remembering important things even from the distant past. Therefore, human SWEs have the most value as top-level orchestrators who can use their larger context windows to guide high-level judgements, while entrusting the rest to agents.
3. LLMs have so much untapped potential, and (assuming sufficient compute resources) you're only bottlenecked by how much you're willing to try.
