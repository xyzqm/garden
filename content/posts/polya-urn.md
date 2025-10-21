---
title: The Pólya urn
tags:
  - combinatorics
  - probability
---

The model is as follows ([Wikipedia](https://en.wikipedia.org/wiki/P%C3%B3lya_urn_model)): you have $n$ groups, each of which starts initially with 1 person. Every second, a new person joins a random group, where their probability of joining a given group is directly proportional to that group's size. For instance, if $n = 2$ and the groups currently have sizes $2$ and $1$ respectively, a new person will join the first group with probability $2/3$ and the second with probability $1/3$. Essentially, all the people are sheep and tend to follow the crowd. Now, the problem is the following: after $t$ seconds, what is the distribution of possible group sizes (i.e. what's the chance the $i$th group contains $a_i$ members)?

> [!note]- Solution
> It turns out that all possible group sizes are equally likely!
> 
> To see why, consider reframing the problem in the following way: there are initially $n$ people _in a line_ and $1$ divider between each of them, for $n - 1$ total. Then, every second, each new person randomly inserts themselves in front of a person already in line. Do you see how this model is equivalent?


