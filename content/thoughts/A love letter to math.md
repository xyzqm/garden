---
description: Why do I like math?
tags:
  - me
draft: false
---
After having to justify "why CS" to so many colleges, I've begun to realize two things:
1. A math major might actually suit me better than CS...
2. and although I always say "math is beautiful", I actually don't know how I'd defend that viewpoint to someone who doesn't already feel the same.

So I spent some time thinking about why I love math so much and found one word to tie together all my reasons: **perfection.**

## On perfection

There's no such thing as the universally perfect essay because writing is inherently subjective; for the same reason, there's no perfect artworks, no perfect songs, and no perfect ideals either. In fact, there's not even a perfect model of physics: what laws we do have can only approximate our mysterious universe, and no matter how granular they get, there'll still always be some phenomenon left unexplained.

But math is different. In math, we establish sets of axioms that *everyone agrees on*, then derive results from there. In doing so, math cleanses itself of subjectivity—the bane of perfection. 
 
As an analogy, if everyone were to agree on a uniform writing style and a set of correct, ground truth opinions, the definition of "the perfect essay" would suddenly become much less blurry. Of course, I'm not advocating for this homogeneity—in fact, I believe that without its imperfections, art would grow rather boring. But since so much of our lives revolves around imperfections and disagreements, math offers a nice escape into a world where everyone can agree on words like correct, elegant, optimal, etc...

> [!note] A caveat: math isn't perfect either?
> One of the most important results in recent mathematics is [Godel's incompleteness theorem](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems), which can be interpreted as a proof of the imperfection of math. Additionally, disagreements between mathematicians over statements like the [axiom of choice](https://en.wikipedia.org/wiki/Axiom_of_choice) further complicate my picture of math as a world where "everyone agrees." Both these facts then beg the question: is math really imperfect, too?
>
 > My answer: math may still be imperfect, but in a perfect way. Isn't it even more beautiful that the machinery of math suffices to prove its own imperfection? And isn't disagreement about axioms also part of this beauty? It breeds variety, and the theorems that emerge from each branch don't conflict with one another in the way political parties do; instead, they operate more like parallel universes, neither more true than the other.

## “Math isn't grounded”

A common perspective on math, especially higher maths, is that it's too far removed from reality. "When will I ever use theorem X in real life?" I'm sure you've heard this question before—maybe even asked it yourself—and I have two answers:
1. **The pragmatist:** Most math you learn in school actually *is* highly practical. Calculus forms the backbone of physics and engineering; number theory has profound implications for cryptography; mathematical concepts that seem esoteric at first always seem to turn up in unexpected applications. 
2. **The dreamer:** Math may feel abstract, but we must remember that its abstractions are inextricably tied to and motivated by our physical reality. We defined $3 + 5 = 8$ because $3$ apples with $5$ apples make $8$ apples; we defined graph theory to abstract notions of travel between cities or relationships between people; we defined calculus because our world operates in continuous time steps rather than discrete ticks; the list goes on. From the dreamer's perspective, math provides a way to isolate interesting properties of our real world and play around with them in a perfect sandbox. 

Recently, I've been leaning toward the dreamer. I love how math allows us to analyze the beauty of certain real-world problems in isolation, ranging from [[Hall's marriage theorem|matchmaking]] to [[Voting|voting]] to [[Mathematical modeling#Flow|water flow]] and so much more. For more on this perspective, see [[Mathematical modeling]].

## Types of perfection

I find that mathematical results can feel "perfect" in a couple different ways.
### Simplicity

If I roll a fair, six-sided die, what value will I roll on average? A quick calculation yields $(1 + 2 + 3 + 4 + 5 + 6)/6 = 3.5$. What if I roll two dice and record their average sum? We could enumerate all $36$ possible cases to get $(2 + 3 + 3 + ... + 11 + 11 + 12)/36 = 7$, but notice what that also equals: $3.5 + 3.5$, exactly the sum of averages of each individual die! This relation is no coincidence: in general, if we roll $k$ fair six-sided dice, the average sum will always be $k dot 3.5$. 

We refer to this identity as *linearity of expectation*. If $X$ is a random variable (e.g. a random face of a die) and $EE[X]$ denotes its *expected value* or "average" $X$ (e.g. 3.5), linearity of expectation then states that for any two random variables $X$ and $Y$, $EE[X + Y] = EE[X] + EE[Y]$. 

The most beautiful but counterintuitive part of this identity is that it holds even when $X$ and $Y$ are dependent upon one another. For instance, consider the following problem:
> $10$ people randomly shuffle their hats among one another. On average, how many people will get their own hat back?

Linearity allows us to make a shockingly simple argument. Each person gets their own hat back with probability $1/10$, and we can sum this probability over all people to get an expectation of $10 dot 1/10 = 1$. Again, this result generalizes: no matter how many people we have shuffling their hats, the expected number of people that get their own hat back remains at exactly 1.

I think the non-obvious fact that $EE[X + Y] = EE[X] + EE[Y]$, even when $X$ and $Y$ depend on one another—and how this fact admits a one-line solution to a problem that appears so intimidating at first—exemplifies just how much of math's beauty lies in its unexpected simplicity. 

#### Other examples
- [Reservoir sampling](https://en.wikipedia.org/wiki/Reservoir_sampling)
- [Euler characteristic](https://en.wikipedia.org/wiki/Euler_characteristic)
### Exactness

Many math problems can be tackled from two directions: *lower bounds* that prove certain restrictions on solutions, and *upper bounds* that try to find optimal solutions. For instance, in the study of [[Voting|metric social choice]], $3$ was a well-known lower bound on the distortion[^1] of any voting system. However, the more difficult half of the problem stemmed from constructing a system that *exactly* achieved this lower bound. [Gkatzelis et. al](https://arxiv.org/abs/2004.07447) eventually solved the problem in 2020, and since their mechanism exactly matches the lower bound, it's essentially "exactly optimal."

There's something incredibly satisfying about proving that your result is exact and that there's literally no margin for improvement, and I like the fact that unlike real-world issues, math problems can have these definite resolutions. 
#### Other examples
- [Manhattan pairs](https://codeforces.com/problemset/problem/2122/C)

---

A common variant of lower vs upper bounds is *necessary* vs. *sufficient* conditions. For instance, consider the classic Euler circuit problem: 
> Can I draw a loop through a graph that traverses every edge exactly once?

It's not hard to see that if such a loop existed, the degree of each node[^2] must be even; this is a *necessary* condition. But is it *sufficient*? In other words:
> If every node of a graph has even degree, does it always have an Euler circuit?

As it turns out, yes! Thus, just like matching lower and upper bounds, proving the sufficiency of necessary conditions yields an exact characterization of valid solutions.
#### Other examples
- [[Hall's marriage theorem]]
- [[strong orientations|Robbin's theorem]]
- [Kuratowski's theorem](https://en.wikipedia.org/wiki/Kuratowski%27s_theorem)

### Other aspects

There's a few other facets of math I really like but can't explain as succinctly, so I've broken them into separate pages.

![[maths.base]]

[^1]: Higher distortion is worse.
[^2]: The degree of a node equals the number of adjacent edges.
